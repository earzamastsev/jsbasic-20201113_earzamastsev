import Carousel from '../../6-module/3-task/index.js';
import slides from '../../6-module/3-task/slides.js';

import RibbonMenu from '../../7-module/1-task/index.js';
import categories from '../../7-module/1-task/categories.js';

import StepSlider from '../../7-module/4-task/index.js';
import ProductsGrid from '../../8-module/2-task/index.js';

import CartIcon from '../../8-module/1-task/index.js';
import Cart from '../../8-module/4-task/index.js';

export default class Main {

  constructor() {
    this.carousel = new Carousel(slides);
    this.ribbonMenu = new RibbonMenu(categories);
    this.stepSlider = new StepSlider({
      steps: 5,
      value: 3
    });
    this.cartIcon = new CartIcon();
    this.cart = new Cart(this.cartIcon);
    this.url = "./products.json";
    this.setListeners();
  }

  async render() {
    let carouselHolder = document.querySelector("[data-carousel-holder]");
    carouselHolder.append(this.carousel.elem);

    let ribbonHolder = document.querySelector("[data-ribbon-holder]");
    ribbonHolder.append(this.ribbonMenu.elem);

    let sliderHolder = document.querySelector("[data-slider-holder]");
    sliderHolder.append(this.stepSlider.elem);

    let cartHolder = document.querySelector("[data-cart-icon-holder]");
    cartHolder.append(this.cartIcon.elem);
    
    let response = await fetch(this.url);

    if (response.ok) {
      this.json = await response.json();
      let productHolder = document.querySelector("[data-products-grid-holder]");
      productHolder.innerHTML = "";
      this.productGrid = new ProductsGrid(this.json);
      productHolder.append(this.productGrid.elem);

      this.productGrid.updateFilter({
        noNuts: document.getElementById('nuts-checkbox').checked,
        vegeterianOnly: document.getElementById('vegeterian-checkbox').checked,
        maxSpiciness: this.stepSlider.value,
        category: ""
      });
  
    } else {
      alert("Ошибка HTTP: " + response.status);
    }
  }

  setListeners() {
    document.body.addEventListener("product-add", event => {
      let product = this.json.filter(item => item.id == event.detail);
      this.cart.addProduct(product[0]);
      
    });
    this.stepSlider.elem.addEventListener("slider-change", event => {
      this.productGrid.updateFilter({
        maxSpiciness: event.detail
      });
    });

    this.ribbonMenu.elem.addEventListener("ribbon-select", event => {
      this.productGrid.updateFilter({
        category: event.detail
      });
    });

    let vegeterianCheckbox = document.getElementById("vegeterian-checkbox");
    vegeterianCheckbox.addEventListener("change", event => {
      this.productGrid.updateFilter({
        vegeterianOnly: vegeterianCheckbox.checked,
      });
    });

    let noNutsCheckbox = document.getElementById("nuts-checkbox");
    noNutsCheckbox.addEventListener("change", event => {
      this.productGrid.updateFilter({
        noNuts: noNutsCheckbox.checked,
      });
    });

  }
}
