
const productTable = document.querySelector(".shopping-cart__table")
let products = [{}]

const populateProductTable = () => {
    products = JSON.parse(localStorage.getItem("cart"))

    let tableHTML = tableHeaderHTML()
    if(products == null || products.length == 0) {
      tableHTML += emptyShoppingcartHTML()
    }
    else {


    const productsResult = products.reduce((acc, product) => {
        acc.productsHTML += createProductRow(product)
        acc.totalPrice += ((product.quantity) * (product.price))

        return acc
    }, {productsHTML: "", totalPrice: 0});


    tableHTML += productsResult.productsHTML
    const totalPrice = productsResult.totalPrice

    tableHTML += `
        <tr class="shopping-cart__total-row">
          <td>Total:</td>
          <td id="total-amount">$${totalPrice.toFixed(2)}</td>
        </tr>`

      }

    productTable.innerHTML = tableHTML;
    const amountCells = productTable.querySelectorAll(".shopping-cart__amount")
    amountCells.forEach(cell => {
        cell.addEventListener("input", (e) => updateProductAmount(e))
    })
}

const tableHeaderHTML = () => {
  return `
        <tr class="shopping-cart__headers">
          <td>Product</td>
          <td>Price</td>
          <td>Quantity</td>
          <td>Subtotal</td>
        </tr>`
}

const emptyShoppingcartHTML = () => {

  return `
      <tr>
        <td>
          <h2 class="shopping-cart__empty-text"> No items in shopping cart </span>
        </td>
      </tr>`
}

const updateProductAmount = (event) => {
    const productRow = event.target.closest(".shopping-cart__table-row")
    const productName = productRow.dataset.item
    const newAmount =  event.target.value;
    /* 
    Option 1

    products = products.map(product => {
        if(product.name === productName) product.amount = newAmount
        return product
    }) 
    */
    
    //Option 2
    products.forEach((product, index) => {
      if(product.title === productName) {
        if(newAmount == 0) {
          products.splice(index, 1)
        }
        else product.quantity = Number(newAmount)
      }
    })
    if(products.length == 0) {
      productTable.querySelector("tbody").innerHTML= `${tableHeaderHTML()} ${emptyShoppingcartHTML()}`
    }
    else if(newAmount == 0)
      { productTable.querySelector("tbody").removeChild(productRow); 
        updateTotalAmount()

      }
    else {
      updateProductTable(productName)
      updateTotalAmount()

    }

    saveToLocalStorage(products)
}

const updateTotalAmount = () => {
  const totalAmountCell = document.querySelector("#total-amount")
  const newTotal = products.reduce((total, product) => {
    total += product.quantity * product.price;
    return total;
  }, 0)
  totalAmountCell.innerHTML = `$${newTotal.toFixed(2)}`
}

const updateProductTable = (productName) => {
    let updatedRow;
    productTable.querySelectorAll(".shopping-cart__table-row").forEach(row => {
        if(row.dataset.item == productName) updatedRow = row;
    })
    const subtotal = updatedRow.querySelector(".shopping-cart__subtotal")
    let newSubTotal = 0;
    products.forEach(product => {
      if (product.title === productName) newSubTotal = product.quantity * product.price
    })
    subtotal.innerHTML = `$${newSubTotal.toFixed(2)}`
}

const saveToLocalStorage = (newCart) => {
  localStorage.setItem("cart", JSON.stringify(newCart)); 
}

const createProductRow = (product) => {
    let productHTML = `
        <tr class="shopping-cart__table-row" data-item="${product.title}">
          <td class="shopping-cart__product-cell">
            <img
              class="shopping-cart__product-images"
              src="${product.image}"
              alt="Produktbild"
              width="100px"
              height="auto"
            />
            <span class="shopping-cart__product-name">${product.title}</span>
          </td>
          <td class="shopping-cart__product-price">$${product.price}</td>
          <td>
            <input type="number" class="shopping-cart__amount" value="${product.quantity}"/>
          </td>
          <td class="shopping-cart__subtotal">$${(product.price * product.quantity).toFixed(2)}</td>
        </tr>
    `
    return productHTML
}

populateProductTable();