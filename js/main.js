//https://fakestoreapi.com/products

 let products = [];
let currentCategory = "All";
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const fetchProducts = async () => {
    try {
        products = await(await fetch("https://fakestoreapi.com/products"
        )).json();
    }
    catch (error) 
    {
        console.error(error);
    }
}

const displayProducts = (category) => {
  let productHTML = "";

  if (category === "All"){
    productHTML = products.map(item => (productCardComponent(item))).join("");
  }else {
    productHTML = products.filter(item => item.category == category).map(item => (productCardComponent(item))).join("");
  }
  
  document.querySelector(".product-list").innerHTML = productHTML


}

const productCardComponent = (product) => `
            <article class="product-list__item">
          <img
            class="product-list__item__image"
            src="${product.image}"
            alt="${product.title} photo"
          />
          <h3 class="product-list__item__title">${product.title}</h3>
          <div class="product-list__item__footer">
            <button class="product-list__item__button" data-id="${product.id}">Köp</button>
            <span class="product-list__item__price">$${product.price}</span>
          </div>
        </article>
`;


const searchProducts = (query) => {
  const filteredProducts = products.filter(product => 
    product.title.toLowerCase().includes(query.toLowerCase())
  );

  let productHTML = filteredProducts.map(item => productCardComponent(item)).join("");
  document.querySelector(".product-list").innerHTML = productHTML;

  if (filteredProducts.length === 0) {
    document.querySelector(".product-list").innerHTML = `<p>No products found for "${query}"</p>`;
  }
};

const searchBar = document.querySelector(".search__bar");
searchBar.addEventListener("input", (e) => {
  const query = e.target.value.trim();
  if (query === "") {
    displayProducts(currentCategory);
  } else {
    searchProducts(query);
  }
});


const createCategoryButtons = () => {
  const btnContainer = document.querySelector(".btn-container");

  const newArray = products.reduce((accumulator, product) => {

   if (!accumulator.includes(product.category)) {
    accumulator.push(product.category); 
   }
   return (accumulator);
  },[]);

  const btnHTML = newArray.map(category => categoryComponent(category)).join("");
  btnContainer.innerHTML = btnHTML;
  const buttons = document.querySelectorAll(".btn-category");
  buttons.forEach(button => button.addEventListener('click', e => {
    displayProducts(e.target.dataset.category);
    currentCategory = e.target.dataset.category;
  }));

}


const categoryComponent = (category) => `
 <label for="${category}" class="btn-category">
 ${category}
 <input type="radio" class="radio__btn" name="radio-btn" id="${category}" data-category="${category}"></input>
 </label>
`

const sortProducts = (order) => {
  switch (order) {
    case "Price Ascending":
      products.sort((a, b) => a.price - b.price);
      break;
    case "Price Descending":
      products.sort((a, b) => b.price - a.price);
      break;
    case "Rating":
      products.sort((a,b) => b.rating.rate - a.rating.rate)
      break;
    case "Alphabetically":
      products.sort((a,b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()))
      break;
  }

  displayProducts(currentCategory); 
}

document.getElementById("sort").addEventListener("change", (e) => {
  sortProducts(e.target.value);
});

const updateCartCount = () => {
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  document.querySelector(".cart-count").innerText = cartCount; 
}

const addToCart = (productId) => {
  const productInCart = cart.find(item => item.id === productId);
  if (productInCart) {
      productInCart.quantity += 1; 
  } else {
      const product = products.find(item => item.id === productId);
      cart.push({ ...product, quantity: 1 }); 
  }
  localStorage.setItem("cart", JSON.stringify(cart)); 
  updateCartCount(); 
}

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("product-list__item__button")) {
      const productId = parseInt(e.target.dataset.id);
      addToCart(productId);
  }
});

function displayProductModal() {
  
  const modalBackground = document.querySelector(".product-modal__background");
  const productList = document.querySelector(".product-list");

  productList.addEventListener('click', (e) => {

    const productItem = e.target.closest(".product-list__item");
    if (!productItem) return;

    const productIndex = Array.from(productList.children).indexOf(
      productItem
    );
    const product = products[productIndex];

    modalBackground.style.visibility = "visible";
    modalBackground.style.opacity = "1";

    modalBackground.innerHTML = `
        <article class="product-modal__container">
          <img src="${product.image}" alt="${product.title}">
          <h3 class="product-modal__title">${product.title}</h3>
          <p class="product-modal__description">${product.description}</p>
          <div class="product-modal__rating">
            <p><b>Rate:</b>${product.rating.rate}</p>
            <p><b>Count:</b>${product.rating.count}</p>
          </div>
          <div class="product-list__item__footer">
            <button class="product-modal__item__button">Köp</button>
            <span class="product-modal__item__price">$${product.price}</span>
          </div>
          <button class="product-modal__exit__button">Exit</button>
        </article>
    `;

    const exitButton = modalBackground.querySelector(".product-modal__exit__button");

    exitButton.addEventListener("click", () => {
      modalBackground.style.visibility = "hidden";
      modalBackground.style.opacity = "0";
    });

  });

};

await fetchProducts();
displayProducts("All");
createCategoryButtons();
updateCartCount();
displayProductModal();
