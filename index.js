const listBox = document.querySelector("#list-box");
const addItemButton = document.querySelector("#btn_add-item");
const updateItemButton = document.querySelector("#btn_update-item");
const itemTitle = document.querySelector("#form_item-title");
const itemQuantity = document.querySelector("#form_item-quantity");
const itemTitleError = document.querySelector("#title_error-text");
const itemQuantityError = document.querySelector("#quantity_error-text");
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
  itemTitle.setAttribute("value", "");
  itemQuantity.setAttribute("value", "");
};

// Adds outline and error message incase of invalid title
const addTitleError = function () {
  itemTitle.classList.add("error-outline");
  itemTitleError.innerHTML = "Whoa there, an item's gotta have a name!";
};

// Removes outline and error message from title input
const removeTitleError = function () {
  itemTitle.classList.remove("error-outline");
  itemTitleError.innerHTML = "";
};

// Adds outline and error message incase of invalid quantity
const addQuantityError = function () {
  itemQuantity.classList.add("error-outline");
  itemQuantityError.innerHTML = "Please add a valid quantity!";
};

// Removes outline and error message from quantity input
const removeQuantityError = function () {
  itemQuantity.classList.remove("error-outline");
  itemQuantityError.innerHTML = "";
};

// Checks if inputs are valid
const validateForm = function ({ title, quantity }) {
  let errors = 0;
  if (!title) {
    addTitleError();
    errors++;
  }
  if (!quantity || quantity < 0) {
    addQuantityError();
    errors++;
  }
  return errors == 0;
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

// Sets up the Edit mode
const beginEdit = function (item) {
  // Removes form errors and replaces Add button with Update button
  removeTitleError(), removeQuantityError();
  formTitle.innerHTML = "Edit Item";
  addItemButton.classList.add("hidden");
  updateItemButton.classList.remove("hidden");

  // Sets inputs to the values of target element
  currentEditItem = item;
  itemTitle.value = item.querySelector(".item-title").innerHTML;
  itemQuantity.value = item.querySelector(".item-quantity").innerHTML.substr(1);
  itemTitle.setAttribute("value", itemTitle.value);
  itemQuantity.setAttribute("value", itemQuantity.value);
};

// Updates the selected item
const updateItem = function () {
  const title = itemTitle.value.trim();
  const quantity = parseFloat(itemQuantity.value);
  if (!validateForm({ title, quantity })) {
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
    removeQuantityError(), removeTitleError();
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
  if (!validateForm({ title, quantity })) {
    return;
  }

  let present = false;

  data.forEach((item, index) => {
    if (title.toLowerCase() === item.title.toLowerCase()) {
      data[index].quantity += quantity;
      const quantities = document.querySelectorAll(".item-quantity");
      quantities[index].innerHTML = "x" + data[index].quantity;
      present = true;
      return;
    }
  });

  if (!present) {
    addListeners(createItemNode({ title, quantity }));
    data.push({ title, quantity });
  }

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
addItemButton.addEventListener("click", addItem);
updateItemButton.addEventListener("click", updateItem);

// Adding listeners to remove outlines and error messages during input
itemTitle.addEventListener("keyup", removeTitleError);
itemQuantity.addEventListener("keyup", removeQuantityError);

// Adding listener for enter keypress
document.addEventListener("keyup", (event) => {
  if (event.key == "Enter") {
    if (currentEditItem) {
      updateItem();
    } else {
      addItem();
    }
  }
});

document.querySelector("#toggle-theme").addEventListener("click", () => {
  document.documentElement.classList.toggle("light-mode");
  document.querySelectorAll(".theme-resistant").forEach((ele) => {
    ele.classList.toggle("light-mode");
  });
});

const inputs = document.querySelectorAll("input");

inputs.forEach((input) => {
  input.addEventListener("keyup", (e) => {
    input.setAttribute("value", e.target.value);
  });
});
