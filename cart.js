// document.addEventListener("DOMContentLoaded", () => {

// Define the initial state
const cart_item_state = JSON.parse(localStorage.getItem("state"));

const initialState = {
  cart: localStorage.getItem("state") === null ? [] : cart_item_state.cart,
  products: [],
};

// Define the reducer function
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "REMOVE_FROM_CART":
      return {
        ...state,
        cart: state.cart.filter((item) => item.id !== action.payload),
      };
    case "INCREMENT_QUANTITY":
      returnedItem = state.cart.find((item) => item.id === action.payload);

      if (returnedItem) {
        returnedItem.quantity++;
        return { ...state, cart: [...state.cart] };
      }
    case "DECREMENT_QUANTITY":
      returnedItem = state.cart.find((item) => item.id === action.payload);

      if (returnedItem.quantity > 1) {
        returnedItem.quantity--;
        return { ...state, cart: [...state.cart] };
      }

    default:
      return state;
  }
};

// Create the store
const store = Redux.createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
// Define the actions
const removeFromCart = (id) => {
  return {
    type: "REMOVE_FROM_CART",
    payload: id,
  };
};

const incrementQty = (product) => {
  return {
    type: "INCREMENT_QUANTITY",
    payload: product,
  };
};

const decrementQty = (product) => {
  return {
    type: "DECREMENT_QUANTITY",
    payload: product,
  };
};

//  Helper methods
const getSubPrice = (quantity, price) => {
  const subprice = quantity * price;
  return subprice;
};

const cartHTML = document.getElementById("cart-element");
const subtotalHTML = document.getElementById("subtotal-element");
const cummulativeHTML = document.getElementById("cummulative")

const itemRenderer = () => {
  cartHTML.innerHTML = "";
  store.getState().cart.forEach((item) => {
    cartHTML.innerHTML += `
        <div class="flex justify-between">
          <div class="p-2 flex justify-center items-center">
            <div class="flex  item flex-nowrap">
              <img
                src="${item.images.data[0].url}"
                alt=""
                class="mr-5 w-[80px] h-[80px] bg-[#ececec]"
              />
            </div>
            <div class="flex flex-col justify-center">
                <p class="font-medium text-gray-500">${item.name}</p>
                <p class="text-xs font-medium text-gray-500">ETB ${
                  item.price
                }</p>
            </div>
          </div>
          <div class="p-2 flex justify-center items-center">
            <div id="quantity-table" class=" flex">
              <p
                id="quantity"
                class="w-8 h-8 mr-5 text-xs flex items-center justify-center border rounded-sm font-bold "
              >
                ${item.quantity}
              </p>
              <div class="w-14 flex items-center justify-between">
                <div onclick="incrementHandler(${
                  item.id
                })" class="cursor-pointer w-6 h-6 flex items-center justify-center rounded-full border">
                  <i class="bx bx-plus"></i>
                </div>
                <div onclick="derementHandler(${
                  item.id
                })" class="cursor-pointer w-6 h-6 flex items-center justify-center rounded-full border">
                  <i class="bx bx-minus"></i>
                </div>
              </div>
            </div>
          </div>
          <div class="p-2 flex justify-center items-center mr-20">
            <div class="flex justify-center items-center">
              <p id="subprice" class="font-medium text-sm"> ${
                (parseFloat(item.price) * item.quantity).toLocaleString('en-US', {style: 'currency', currency: 'ETB'})
              } </p>
              <div onclick="removeItemHandler(${
                item.id
              })" class=" cursor-pointer hover:text-black transition-all flex ml-10 justify-end items-center">
                <i class='bx bxs-trash'></i>
              </div>
            </div>
          </div
        </div>
      `;
  });
};

itemRenderer();

const subtotalRenderer = () => {
  let cumulative = 0;
  let totalPrice = 0;
  store.getState().cart.forEach((item) => {
    totalPrice += item.price * item.quantity;
    cumulative = totalPrice - totalPrice*0.10

    subtotalHTML.innerHTML =`${totalPrice.toLocaleString('en-US', {style: 'currency', currency: 'ETB'})}`
    cummulativeHTML.innerHTML = `${cumulative.toLocaleString('en-US', {style: 'currency', currency: 'ETB'})}`
  });
};
subtotalRenderer();


const removeItemHandler = (id) => {
  store.dispatch(removeFromCart(id));
  update();
};

const incrementHandler = (id) => {
  store.dispatch(incrementQty(id));
  update();
};
const derementHandler = (id) => {
  store.dispatch(decrementQty(id));
  update();
};

const cartCounter = document.getElementById("cart-items");
if (cartCounter) {
  cartCounter.textContent = store.getState()["cart"].length;
}

store.subscribe(() => {
  localStorage.setItem("state", JSON.stringify(store.getState()));
  cartCounter.textContent = store.getState()["cart"].length;
});

const update = () => {
  itemRenderer();
  subtotalRenderer();
};
