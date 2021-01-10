import createElement from '../../assets/lib/create-element.js';
import escapeHtml from '../../assets/lib/escape-html.js';

import Modal from '../../7-module/2-task/index.js';

export default class Cart {
  // cartItems = []; // [product: {...}, count: N]

  constructor(cartIcon) {
    this.cartItems = [];
    this.cartIcon = cartIcon;
    this.modal = new Modal();
    this.addEventListeners();
  }

  addProduct(product) {
    if (this.cartItems.length == 0) {
      let newProduct = {product: product,
        count: 1};
      this.cartItems.push(newProduct);
      this.onProductUpdate(newProduct);
    } else {
      let elem = this.cartItems.find(elem => elem.product.id == product.id);
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

  renderProduct(product, count) {
    return createElement(`
    <div class="cart-product" data-product-id="${product.id}">
      <div class="cart-product__img">
        <img src="/assets/images/products/${product.image}" alt="product">
      </div>
      <div class="cart-product__info">
        <div class="cart-product__title">${escapeHtml(product.name)}</div>
        <div class="cart-product__price-wrap">
          <div class="cart-counter">
            <button type="button" class="cart-counter__button cart-counter__button_minus">
              <img src="/assets/images/icons/square-minus-icon.svg" alt="minus">
            </button>
            <span class="cart-counter__count">${count}</span>
            <button type="button" class="cart-counter__button cart-counter__button_plus">
              <img src="/assets/images/icons/square-plus-icon.svg" alt="plus">
            </button>
          </div>
          <div class="cart-product__price">€${product.price.toFixed(2)}</div>
        </div>
      </div>
    </div>`);
  }

  renderOrderForm() {
    return createElement(`<form class="cart-form">
      <h5 class="cart-form__title">Delivery</h5>
      <div class="cart-form__group cart-form__group_row">
        <input name="name" type="text" class="cart-form__input" placeholder="Name" required value="Santa Claus">
        <input name="email" type="email" class="cart-form__input" placeholder="Email" required value="john@gmail.com">
        <input name="tel" type="tel" class="cart-form__input" placeholder="Phone" required value="+1234567">
      </div>
      <div class="cart-form__group">
        <input name="address" type="text" class="cart-form__input" placeholder="Address" required value="North, Lapland, Snow Home">
      </div>
      <div class="cart-buttons">
        <div class="cart-buttons__buttons btn-group">
          <div class="cart-buttons__info">
            <span class="cart-buttons__info-text">total</span>
            <span class="cart-buttons__info-price">€${this.getTotalPrice().toFixed(2)}</span>
          </div>
          <button type="submit" class="cart-buttons__button btn-group__button button">order</button>
        </div>
      </div>
    </form>`);
  }

  renderModal() {
    this.modal.setTitle('Your order');
    let modalBody = document.createElement('div');
    for (let elem of this.cartItems) {
      modalBody.append(this.renderProduct(elem.product, elem.count));
    }
    modalBody.append(this.renderOrderForm());
    this.modal.setBody(modalBody);
    this.modal.open();
    let elemClick = document.querySelector(".modal__body");
    elemClick.addEventListener('click', event => {
      if (event.target.closest('button').classList.contains('cart-counter__button_plus')) {
        let productId = event.target.closest('.cart-product').dataset.productId;
        this.updateProductCount(productId, 1);
      }
      
      if (event.target.closest('button').classList.contains('cart-counter__button_minus')) {
        let productId = event.target.closest('.cart-product').dataset.productId;
        this.updateProductCount(productId, -1);
      }
    });
    let submitElem = document.querySelector("form.cart-form");
    // submitElem.addEventListener("submit", event => { this.onSubmit(event); });
    submitElem.addEventListener("submit", this.onSubmit.bind(this));

  }
  onProductUpdate(cartItem) {
    this.cartIcon.update(this);
    // if (this.getTotalCount() == 0) {
    //   this.modal.close();
    // }
    if (document.querySelector('.is-modal-open')) {
      let elem = document.querySelector(`.cart-product[data-product-id=${cartItem.product.id}]`);
      if (elem && cartItem.count != 0) {
        document.querySelector(`.cart-buttons__info-price`).innerHTML = `€${this.getTotalPrice().toFixed(2)}`;
        elem.querySelector(".cart-counter__count").innerHTML = cartItem.count;
        elem.querySelector(".cart-product__price").innerHTML = `€${(cartItem.product.price * cartItem.count).toFixed(2)}`;
      } else {
        if (cartItem.count == 0) {
          elem.remove();
        }
        if (this.cartItems.length == 0) {
          this.modal.close();
        }
      }
    }
  }

  async onSubmit(event) {
    event.preventDefault();
    document.querySelector("button[type=submit]").classList.add('is-loading');

    // 3. Сделать запрос на сервер с помощью `fetch` и методом `POST` на адрес - `https://httpbin.org/post`. 
    // Данные для отправки нужно сформировать из формы с классом `cart-form` с помощью конструктора `FormData`. 
    // Подробнее об этом можно прочитать в статье - [FormData](https://learn.javascript.ru/formdata).
  
    
    let data = new FormData(event.currentTarget);
    let response = await fetch('https://httpbin.org/post', {
      method: 'POST',
      body: data
    });
    let result = await response.json();

    this.modal.setTitle('Success!');
    let elemBody = document.createElement("div");
    elemBody.classList.add("modal__body-inner");
    const sucessTemplate = `
    <p>
      Order successful! Your order is being cooked :) <br>
      We’ll notify you about delivery time shortly.<br>
      <img src="/assets/images/delivery.gif">
    </p>
  `;
    elemBody.innerHTML = sucessTemplate;
    this.modal.setBody(elemBody);
    this.cartItems = [];
    this.cartIcon.update(this);

  }

  addEventListeners() {
    this.cartIcon.elem.onclick = () => this.renderModal();
  }
}

