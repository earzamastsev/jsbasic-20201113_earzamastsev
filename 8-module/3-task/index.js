export default class Cart {
  
  // cartItems = []; // [product: {...}, count: N]

  constructor(cartIcon) {
    this.cartIcon = cartIcon;
    this.cartItems = [];
  }

  addProduct(product) {
    if (this.cartItems.length == 0) {
      let newProduct = {product: product,
        count: 1};
      this.cartItems.push(newProduct);
      this.onProductUpdate(newProduct);
    } else {
      let elem = this.cartItems.find(elem => elem.product.id === product.id);
      if (elem) {
        elem.count += 1;
        this.onProductUpdate(elem);
      } else {
        let newProduct = {product: product,
          count: 1};
        this.cartItems.push(newProduct);
        this.onProductUpdate(newProduct);
      }
    }
  }

  updateProductCount(productId, amount) {
    let elem = this.cartItems.find(elem => elem.product.id === productId);
    elem.count += +amount;
    if (elem.count == 0) {
      let idx = this.cartItems.indexOf(elem);
      this.cartItems.splice(idx, 1);
    }
    this.onProductUpdate(elem);
  }

  isEmpty() {
    if (this.cartItems.length == 0) {return true;}
    else {return false;}
  }

  getTotalCount() {
    let totalCount = 0;
    for (let elem of this.cartItems) {
      totalCount += elem.count;
    }
    return totalCount;
  }

  getTotalPrice() {
    let totalPrice = 0;
    for (let elem of this.cartItems) {
      if (elem.count == 1) {totalPrice += elem.product.price;}
      else {totalPrice += elem.count * elem.product.price;}
    }
    return totalPrice;
  }

  onProductUpdate(cartItem) {
    // реализуем в следующей задаче
    this.cartIcon.update(this);
  }
}

