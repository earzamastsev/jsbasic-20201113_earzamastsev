import createElement from '../../assets/lib/create-element.js';
import ProductCard from '../../6-module/2-task/index.js';

export default class ProductGrid {
  constructor(products) {
    this.products = products;
    this.filters = {
      noNuts: false, // true/false
      vegeterianOnly: false, // true/false
      maxSpiciness: 4, // числа от 0 до 4
      category: '' // уникальный идентификатор категории товара
    };
    this.elem = this.render();
  }

  render() {
    let elem = document.createElement('div');
    elem.classList.add("products-grid");
    let elemInner = document.createElement('div');
    elemInner.classList.add("products-grid__inner");
    elem.append(elemInner);
    for (let product of this.products) {
      let card = new ProductCard(product);
      elemInner.append(card.elem);
    }
    return elem;
  }

  updateFilter(filters) {
    for (let cat in filters) {
      this.filters[cat] = filters[cat];
    }
    let filteredProducts = this.products;
    let productSet;

    if (this.filters['noNuts']) {filteredProducts = this.products.filter(item => (!item.nuts == this.filters['noNuts']));}
    if (this.filters['vegeterianOnly']) {filteredProducts = filteredProducts.filter(item => (item.vegeterian == this.filters['vegeterianOnly']));}
    if (this.filters['maxSpiciness'] < 4) {filteredProducts = filteredProducts.filter(item => (item.spiciness <= this.filters['maxSpiciness']));}
    if (this.filters['category'] != "") {filteredProducts = filteredProducts.filter(item => (item.category == this.filters['category']));}

    let grid = document.querySelector(".products-grid__inner");
    grid.innerHTML = "";
    for (let product of filteredProducts) {
      let card = new ProductCard(product);
      grid.append(card.elem);
    }
  }
}

