const listBox = document.querySelector("#list-box");
const addItemButton = document.querySelector("#btn_add-item");
const updateItemButton = document.querySelector("#btn_update-item");
const itemTitle = document.querySelector("#form_item-title");
const itemQuantity = document.querySelector("#form_item-quantity");

let currentEditItem = null;

const fetchData = function () {
  // const data = [
  //   {
  //     title: "Toilet Paper",
  //     quantity: 10,
  //   },
  //   {
  //     title: "Orange Juice",
  //     quantity: 5,
  //   },
  //   {
  //     title: "Towel",
  //     quantity: 1,
  //   },
  // ];
  const data = JSON.parse(localStorage.getItem("data"));
  return data ? data : [];
};

let data = fetchData();
console.log(data);

const updateLocalStorage = function () {
  localStorage.setItem("data", JSON.stringify(data));
};

const clearForm = function () {
  itemTitle.value = "";
  itemQuantity.value = "";
};

const editItem = function (item) {
  addItemButton.classList.add("hidden");
  updateItemButton.classList.remove("hidden");
  currentEditItem = item;
  itemTitle.value = item.querySelector(".item-title").innerHTML;
  itemQuantity.value = item.querySelector(".item-quantity").innerHTML.substr(1);
};

const updateItem = function () {
  addItemButton.classList.remove("hidden");
  updateItemButton.classList.add("hidden");
  const title = itemTitle.value;
  const quantity = parseInt(itemQuantity.value);
  data = data.map((item) => {
    if (item.title == currentEditItem.querySelector(".item-title").innerHTML) {
      item.title = title;
      item.quantity = quantity;
    }
    return item;
  });
  currentEditItem.querySelector(".item-title").innerHTML = title;
  currentEditItem.querySelector(".item-quantity").innerHTML = "x" + quantity;
  updateLocalStorage();
  clearForm();
  currentEditItem = null;
};

const deleteItem = function (item) {
  title = item.querySelector(".item-title").innerText;
  listBox.removeChild(item);
  data = data.filter((item) => {
    return item.title != title;
  });
  if (currentEditItem == item) clearForm();
  updateLocalStorage(data);
};

const addListItemUtil = function ({ title, quantity }) {
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

const addItem = function () {
  const title = itemTitle.value;
  const quantity = parseInt(itemQuantity.value);
  const newItem = addListItemUtil({ title, quantity });
  newItem
    .querySelector(".btn_delete-item")
    .addEventListener("click", () => deleteItem(newItem));
  newItem
    .querySelector(".btn_edit-item")
    .addEventListener("click", () => editItem(newItem));
  data.push({ title, quantity });
  updateLocalStorage(data);
  clearForm();
};

const renderList = function () {
  if (!data) return;
  data.forEach((item) => {
    addListItemUtil(item);
  });
};

renderList();

addItemButton.addEventListener("click", () => {
  addItem();
});

updateItemButton.addEventListener("click", () => {
  updateItem();
});

const editButtons = document.querySelectorAll(".btn_edit-item");
const deleteButtons = document.querySelectorAll(".btn_delete-item");
deleteButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    deleteItem(btn.parentNode);
  });
});
editButtons.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    editItem(btn.parentNode, index);
  });
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
