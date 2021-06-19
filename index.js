const listBox = document.querySelector("#list-box");
const addItemButton = document.querySelector("#btn_add-item");
const updateItemButton = document.querySelector("#btn_update-item");
const itemTitle = document.querySelector("#form_item-title");
const itemQuantity = document.querySelector("#form_item-quantity");
const formTitle = document.querySelector("#form-title");

// Target item while editing
let currentEditItem = null;

// Fetchind data form localStorage
let data = JSON.parse(localStorage.getItem("data"));
if (!data) {
  data = [];
}

// Called when data is altered
const updateLocalStorage = function () {
  localStorage.setItem("data", JSON.stringify(data));
};

// Clears the input form
const clearForm = function () {
  itemTitle.value = "";
  itemQuantity.value = "";
};

// Finds the index of the item to be deleted/edited
const findIndex = function (item) {
  let index = 0;
  while ((item = item.previousSibling) != null) {
    index++;
  }
  return index;
};

// Replaces Update button with Add button
const setAddMode = function () {
  formTitle.innerHTML = "Add Item";
  addItemButton.classList.remove("hidden");
  updateItemButton.classList.add("hidden");
};

// Replaces Add button with Update button
const setEditMode = function () {
  formTitle.innerHTML = "Edit Item";
  addItemButton.classList.add("hidden");
  updateItemButton.classList.remove("hidden");
};

// Sets up the Edit mode
const beginEdit = function (item) {
  setEditMode();
  currentEditItem = item;
  itemTitle.value = item.querySelector(".item-title").innerHTML;
  itemQuantity.value = item.querySelector(".item-quantity").innerHTML.substr(1);
};

// Updates the selected item
const updateItem = function () {
  const title = itemTitle.value.trim();
  const quantity = parseFloat(itemQuantity.value);
  if (!title) {
    alert("Please enter the title!");
    return;
  }
  if (!quantity) {
    alert("Please enter the quantity!");
    return;
  }

  data[findIndex(currentEditItem)] = { title, quantity };
  currentEditItem.querySelector(".item-title").innerHTML = title;
  currentEditItem.querySelector(".item-quantity").innerHTML = "x" + quantity;

  updateLocalStorage();
  clearForm();
  setAddMode();
  currentEditItem = null;
};

// Deletes the selected item
const deleteItem = function (item) {
  data.splice(findIndex(item), 1);
  listBox.removeChild(item);

  if (currentEditItem == item) {
    setAddMode();
    clearForm();
  }
  updateLocalStorage(data);
};

// Creates HTML for a list item
const createItemNode = function ({ title, quantity }) {
  listItem = document.createElement("li");
  listItem.classList.add("list-item");
  listItem.innerHTML = `
      <div class="item-details">
      <div class="item-title">${title}</div>
      <div class="item-quantity">x${quantity}</div>
      </div>
      <button class="btn_edit-item">Edit</button>
      <button class="btn_delete-item">Delete</button>
    `;
  listBox.append(listItem);
  return listItem;
};

// Adds event listeners to a list item
const addListeners = function (item) {
  item
    .querySelector(".btn_delete-item")
    .addEventListener("click", () => deleteItem(item));
  item
    .querySelector(".btn_edit-item")
    .addEventListener("click", () => beginEdit(item));
};

// Adds the selected item
const addItem = function () {
  const title = itemTitle.value.trim();
  const quantity = parseFloat(itemQuantity.value);
  // if (!title) {
  //   alert("Please enter the title!");
  //   return;
  // }
  // if (!quantity || quantity < 0) {
  //   alert("Please enter a valid quantity!");
  //   return;
  // }
  addListeners(createItemNode({ title, quantity }));
  data.push({ title, quantity });
  updateLocalStorage(data);
  clearForm();
};

// Renders the list with data from localStorage
const renderList = function () {
  data.forEach((item) => {
    addListeners(createItemNode(item));
  });
};

renderList();

// Adding listeners to add and update buttons
addItemButton.addEventListener("click", () => {
  addItem();
});

updateItemButton.addEventListener("click", () => {
  updateItem();
});

// Adding listener for enter keypress
document.addEventListener("keyup", (event) => {
  if (event.keyCode == 13) {
    if (currentEditItem) {
      updateItem();
    } else {
      addItem();
    }
  }
});
