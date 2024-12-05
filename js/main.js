//https://fakestoreapi.com/products

const fetchProducts = async () => {
    try {
        const response = await(await fetch("https://fakestoreapi.com/products"
        )).json();
        
        const productHTML = response.map(item => (productCardComponent(item))).join("");

        document.querySelector(".product-list").innerHTML = productHTML
    
    }
    catch (error) 
    {
        console.error(error);
    }
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
            <button class="product-list__item__button">Köp</button>
            <span class="product-list__item__price">$${product.price}</span>
          </div>
        </article>
`

fetchProducts();