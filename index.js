const listBox = document.querySelector("#list-box");
const addItemButton = document.querySelector("#btn_add-item");
const updateItemButton = document.querySelector("#btn_update-item");
const itemTitle = document.querySelector("#form_item-title");
const itemQuantity = document.querySelector("#form_item-quantity");

let currentEditItem = null;
let data = JSON.parse(localStorage.getItem("data"));
if (!data) {
  data = [];
}

const updateLocalStorage = function () {
  localStorage.setItem("data", JSON.stringify(data));
};

const clearForm = function () {
  itemTitle.value = "";
  itemQuantity.value = "";
};

const findIndex = function (item) {
  let index = 0;
  while ((item = item.previousSibling) != null) {
    index++;
  }
  return index;
};

const setAddButton = function () {
  addItemButton.classList.remove("hidden");
  updateItemButton.classList.add("hidden");
};

const setEditButton = function () {
  addItemButton.classList.add("hidden");
  updateItemButton.classList.remove("hidden");
};

const beginEdit = function (item) {
  setEditButton();
  currentEditItem = item;
  itemTitle.value = item.querySelector(".item-title").innerHTML;
  itemQuantity.value = item.querySelector(".item-quantity").innerHTML.substr(1);
};

const updateItem = function () {
  const title = itemTitle.value.trim();
  const quantity = parseInt(itemQuantity.value);
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
  setAddButton();
  currentEditItem = null;
};

const deleteItem = function (item) {
  data.splice(findIndex(item), 1);
  listBox.removeChild(item);

  if (currentEditItem == item) {
    setAddButton();
    clearForm();
  }
  updateLocalStorage(data);
};

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

const addListeners = function (item) {
  item
    .querySelector(".btn_delete-item")
    .addEventListener("click", () => deleteItem(item));
  item
    .querySelector(".btn_edit-item")
    .addEventListener("click", () => beginEdit(item));
};

const addItem = function () {
  const title = itemTitle.value.trim();
  const quantity = parseInt(itemQuantity.value);
  if (!title) {
    alert("Please enter the title!");
    return;
  }
  if (!quantity || quantity < 0) {
    alert("Please enter a valid quantity!");
    return;
  }
  addListeners(createItemNode({ title, quantity }));
  data.push({ title, quantity });
  updateLocalStorage(data);
  clearForm();
};

const renderList = function () {
  data.forEach((item) => {
    addListeners(createItemNode(item));
  });
};

renderList();

addItemButton.addEventListener("click", () => {
  addItem();
});

updateItemButton.addEventListener("click", () => {
  updateItem();
});

document.addEventListener("keyup", (event) => {
  if (event.keyCode == 13) {
    if (currentEditItem) {
      updateItem();
    } else {
      addItem();
    }
  }
});
