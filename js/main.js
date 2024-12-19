//https://fakestoreapi.com/products

let products = [];
let currentCategory = "All";
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const fetchProducts = async () => {
  const loadingIcon = document.createElement("img");
  loadingIcon.classList.add("loading-icon");
  loadingIcon.classList.add("spinny-spin");
  loadingIcon.setAttribute("src", "./img/loading-icon.svg");
  document.querySelector(".products").appendChild(loadingIcon);
  try {
    products = await (await fetch("https://fakestoreapi.com/products")).json();
  } catch (error) {
    console.error(error);
  }
};

const displayProducts = (category) => {
  let productHTML = "";

  if (category === "All") {
    productHTML = products.map((item) => productCardComponent(item)).join("");
  } else {
    productHTML = products
      .filter((item) => item.category == category)
      .map((item) => productCardComponent(item))
      .join("");
  }

  document.querySelector(".products").innerHTML = productHTML;
};

const productCardComponent = (product) => `
        <article class="product-card" data-product="${product.title}">
            <div class="product-card__image-container">
              <img
                class="product-card__image"
                src="${product.image}"
                alt="${product.title}  photo"
              />
            </div>
            <div class="product-card__content">
              <p class="product-card__title">
              ${product.title.trim().length > 32 ? `${product.title.substring(0, 32).trim()}...` : product.title.trim()}
              </p>
              <p class="product-card__price">$${product.price}</p>
            </div>
            <button class="product-card__button" data-id="${product.id}">Add to cart</button>
          </article>
`;

const searchProducts = (query) => {
  const filteredProducts = products.filter((product) => product.title.toLowerCase().includes(query.toLowerCase()));

  let productHTML = filteredProducts.map((item) => productCardComponent(item)).join("");
  document.querySelector(".products").innerHTML = productHTML;

  if (filteredProducts.length === 0) {
    document.querySelector(".products").innerHTML = `<p>No products found for "${query}"</p>`;
  }
};

const searchBar = document.querySelector(".header__search");
searchBar.addEventListener("input", (e) => {
  const query = e.target.value.trim();
  if (query === "") {
    displayProducts(currentCategory);
  } else {
    searchProducts(query);
  }
});

const createCategoryButtons = () => {
  const btnContainer = document.querySelector(".filter-form");

  const newArray = products.reduce((accumulator, product) => {
    if (!accumulator.includes(product.category)) {
      accumulator.push(product.category);
    }
    return accumulator;
  }, []);
  let btnHTML = `
    <label for="all">
            <input id="all" class="category-button" type="radio" name="filter" data-category="All" checked />
            <span>All</span>
          </label>
          `;
  btnHTML += newArray.map((category) => categoryComponent(category)).join("");
  btnContainer.innerHTML = btnHTML;
  const buttons = document.querySelectorAll(".category-button");
  buttons.forEach((button) =>
    button.addEventListener("click", (e) => {
      displayProducts(e.target.dataset.category);
      currentCategory = e.target.dataset.category;
    })
  );
};

const categoryComponent = (category) => `

           <label for="${category}">
            <input  id="${category}" type="radio" class="category-button" name="filter" data-category="${category}"/>
            <span>  ${category} </span>
          </label>
`;

const sortProducts = (order) => {
  switch (order) {
    case "price-asc":
      products.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      products.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      products.sort((a, b) => b.rating.rate - a.rating.rate);
      break;
    case "name":
      products.sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()));
      break;
  }

  displayProducts(currentCategory);
};

document.getElementById("sort").addEventListener("change", (e) => {
  sortProducts(e.target.selectedOptions[0].dataset.sorttype);
});

const updateCartCount = () => {
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  document.querySelector(".cart-count").innerText = cartCount;
};

const addToCart = (productId) => {
  const productInCart = cart.find((item) => item.id === productId);


  if (productInCart) {
    productInCart.quantity += 1;
    gtag('event', 'add_to_cart', {
      'event_name': 'add_cart',
      'value': productInCart.title,
    });
  } else {
    const product = products.find((item) => item.id === productId);
    cart.push({ ...product, quantity: 1 });
     gtag('event', 'add_to_cart', {
      'event_name': 'add_cart',
      'value': product.title,
    });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
};

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("product-card__button")) {
    const productId = parseInt(e.target.dataset.id);
    addToCart(productId);

  }
});

function displayProductModal() {
  const modalBackground = document.querySelector(".product-modal__background");
  const productList = document.querySelector(".products");
  productList.addEventListener("click", (e) => {
    const productItem = e.target.closest(".product-card");
    if (!productItem) return;

    const productListItemButton = e.target.closest(".product-card__button");
    if (productListItemButton) return;

    const product = products.find((product) => product.title == productItem.dataset.product);



    gtag('event', 'modal_opening', {
      'event_category': 'interactions on products',
      'event_label': 'opening of product modal',
      'value': product.title,
      'debugView': true
    });
    
    modalBackground.style.visibility = "visible";
    modalBackground.style.opacity = "1";
    

    modalBackground.innerHTML = `
        <article class="product-modal__container">
        <div class="product-modal__button__section">
          <button class="product-modal__exit__button">X</button>
        </div>
          <img src="${product.image}" alt="${product.title}">
          <h3 class="product-modal__title"><b>${product.title}</b></h3>
          <p class="product-modal__description">${product.description}</p>
          <p class="product-modal__rating"><b>Products left: </b>${product.rating.count}</p>
          <div class="product-modal__footer">
            <button class="product-card__button" data-id="${product.id}">Add to cart</button>
            <span class="product-modal__item__price"><b>$${product.price}</b></span>
          </div>
        </article>
    `;

    /* const buyButton = modalBackground.querySelector(".product-modal__item__button");

    const updateCartCount = () => {
      const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
      document.querySelector(".cart-count").innerText = cartCount;
    };

    const addToCart = (productId) => {
      const productInCart = cart.find((item) => item.id === productId);
      if (productInCart) {
        productInCart.quantity += 1;
      } else {
        const product = products.find((item) => item.id === productId);
        cart.push({ ...product, quantity: 1 });
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartCount();
    };

    buyButton.addEventListener("click", (e) => {
      const productId = parseInt(e.target.dataset.id);
      addToCart(productId);
    }); */

    const exitButton = modalBackground.querySelector(".product-modal__exit__button");

    exitButton.addEventListener("click", () => {
      modalBackground.style.visibility = "hidden";
      modalBackground.style.opacity = "0";
    });
  });
}

await fetchProducts();
displayProducts("All");
createCategoryButtons();
updateCartCount();
displayProductModal();
