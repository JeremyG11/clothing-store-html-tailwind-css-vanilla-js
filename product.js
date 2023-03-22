const navigate = (path) => {
  window.location.href = path;
};
document.addEventListener("DOMContentLoaded", () => {
  const cart_item_state = JSON.parse(localStorage.getItem("state"));
  // Define the initial state

  const initialState = {
    cart: localStorage.getItem("state") === null ? [] : cart_item_state.cart,
    items: localStorage.getItem("state") === null ? [] : cart_item_state.items,
  };

  // Define the reducer function
  const reducer = (state = initialState, action) => {
    switch (action.type) {
      case "ADD_TO_CART":
        const itemToAdd = action.payload;
        const existingItem = state.cart.find(
          (item) => item.id === itemToAdd.id
        );

        if (existingItem) {
          return { 
            ...state, 
            cart: [...state.cart] 
          };
        } else {
          return {
            ...state,
            cart: [...state.cart, { ...itemToAdd, quantity: 1 }],
          };
        }
      case "REMOVE_FROM_CART":
        return {
          ...state,
          cart: state.cart.filter((item) => item.id !== action.payload.id),
        };
      case "SET_PRODUCTS":
        return {
          ...state,
          products: action.payload,
        };
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
  const addToCart = (product) => {
    return {
      type: "ADD_TO_CART",
      payload: product,
    };
  };

  //   fetch item
  const getItem = async () => {
    const params = new URLSearchParams(window.location.search);
    const itemId = params.get("id");

    try {
      const response = await fetch(`http://localhost:4422/items/${itemId}`);
      const item = await response.json();

      const title = document.querySelector("#item-title");
      const price = document.querySelector("#item-price");
      const description = document.querySelector("#item-description");
      const available = document.querySelector("#item-available");

      const image1 = document.querySelector("#img1");
      const image2 = document.querySelector("#img2");
      const image3 = document.querySelector("#img3");
      const image4 = document.querySelector("#img4");

      title.textContent = item.name;
      price.textContent = item.price;
      description.textContent = item.description;

      image1.setAttribute("src", item.images.data[0].url);
      image2.setAttribute("src", item.images.data[1].url);
      image3.setAttribute("src", item.images.data[2].url);
      image4.setAttribute("src", item.images.data[3].url);

      const addButton = document.getElementById("add-to-cart");
      addButton.addEventListener("click", () => {
        const item = store
          .getState()
          ["items"].filter((item) => item.id === parseInt(itemId));
        store.dispatch(addToCart(item[0]));
      });
    } catch (error) {
      console.error(error);
    }
  };
  getItem();


  const cartCounter = document.getElementById("cart-items");
  if (cartCounter) {
    cartCounter.textContent = store.getState()["cart"].length;
  }

  //  Listening to the state changes
  store.subscribe(() => {
    localStorage.setItem("state", JSON.stringify(store.getState()));
    cartCounter.textContent = store.getState().cart.length;
  });
});
