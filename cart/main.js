
const productTable = document.querySelector(".shopping-cart__table")
let products = [{}]

const populateProductTable = () => {
    products = JSON.parse(localStorage.getItem("shoppingcart"))

    let tableHTML = `
        <tr class="shopping-cart__headers">
          <td>Product</td>
          <td>Price</td>
          <td>Quantity</td>
          <td>Subtotal</td>
        </tr>`
    
    const productsResult = products.reduce((acc, product) => {
        acc.productsHTML += createProductRow(product)
        acc.totalPrice += ((product.amount) * (product.price))

        return acc
    }, {productsHTML: "", totalPrice: 0});
    tableHTML += productsResult.productsHTML
    const totalPrice = productsResult.totalPrice

    tableHTML += `
        <tr class="shopping-cart__total-row">
          <td>Total:</td>
          <td>$${totalPrice}</td>
        </tr>`

    productTable.innerHTML = tableHTML;


}

const createProductRow = (product) => {
    let productHTML = `
        <tr class="shopping-cart__table-row">
          <td class="shopping-cart__product-cell">
            <img
              class="shopping-cart__product-images"
              src="https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg"
              alt="Produktbild"
              width="100px"
              height="auto"
            />
            <span>${product.name}</span>
          </td>
          <td>$${product.price}</td>
          <td>
            <input type="number" class="shopping-cart__amount-cell" value="${product.amount}"/>
          </td>
          <td>$${(product.price * product.amount).toFixed(2)}</td>
        </tr>
    `
    return productHTML
}

populateProductTable();