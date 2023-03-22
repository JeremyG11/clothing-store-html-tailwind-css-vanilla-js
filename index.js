document.addEventListener("DOMContentLoaded", () => {
  const cart_item_state = JSON.parse(localStorage.getItem("state"));
  // Define the initial state
  const initialState = {
    cart: localStorage.getItem("state") === null ? [] : cart_item_state.cart,
    items: [],
  };

  // Define the reducer function
  const reducer = (state = initialState, action) => {
    switch (action.type) {
      case "ADD_TO_CART":
        return {
          ...state,
          cart: [...state.cart, action.payload],
        };
      case "SET_ITEMS":
        return {
          ...state,
          items:action.payload,
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
  const setProducts = (items) => {
    return {
      type: "SET_ITEMS",
      payload: items,
    };
  };

  const getData = async () => {
    const response = await fetch("http://localhost:4422/items/");
    const items = await response.json();
    store.dispatch(setProducts(items))
    const container = document.getElementById("item-card");

    const productTemplates = items.map(
      (item) => `
              <div class="mt-4">
                <div
                  class="relative cursor-pointer group bg-[#e7e7e7] p-5 h-[250px]"
                >
                  <img
                    src="${item.images.data[0].url}"
                    class="object-fill min-w-full max-h-full"
                  />
                  <a
                    href="product.html?id=${item.id}"
                    class="group-hover:flex hover:bg-gray-400 transition-all hidden justify-center items-center p-1 rounded-full absolute right-4 top-2"
                  >
                    <i class="bx bx-show text-2xl transition-all"></i>
                  </a>
                </div>
                <div class="p-2 items-center justify-center">
                  <p class="text-center text-[14px] font-normal text-[#555]">
                    ${item.name}
                  </p>
                  <div class="py-2 flex items-center justify-center">
                    <i class="bx bxs-star text-[#000] text-xl"></i>
                    <i class="bx bxs-star text-[#000] text-xl"></i>
                    <i class="bx bxs-star text-[#000] text-xl"></i>
                    <i class="bx bxs-star text-[#000] text-xl"></i>
                    <i class="bx bxs-star-half text-[#000] text-xl"></i>
                  </div>
                  <p class="text-center text-[14px] font-bold text-[#555]">
                    ETB ${item.price}
                  </p>
                </div>
              </div>
        `
    );

    container.innerHTML = productTemplates.join("");
  };
  getData();
  const cartCounter = document.getElementById("cart-items");
  
  if (cartCounter) {
    cartCounter.textContent = store.getState()["cart"].length;
  }

  store.subscribe(() => {
    localStorage.setItem("state", JSON.stringify(store.getState()));
    const cartCounter = document.getElementById("cart-items");
    if (cartCounter) {
      cartCounter.textContent = store.getState().cart.length;
    }
  });
});
