import createElement from '../../assets/lib/create-element.js';

export default class CartIcon {
  constructor() {
    this.render();
    this.initialTopCoord = 0;

    this.startCartX = this.elem.getBoundingClientRect().x;
    this.startCartY = this.elem.getBoundingClientRect().y;

    this.addEventListeners();
  }

  render() {
    this.elem = createElement('<div class="cart-icon"></div>');
  }

  update(cart) {
    if (!cart.isEmpty()) {
      this.elem.classList.add('cart-icon_visible');

      this.elem.innerHTML = `
        <div class="cart-icon__inner">
          <span class="cart-icon__count">${cart.getTotalCount()}</span>
          <span class="cart-icon__price">€${cart.getTotalPrice().toFixed(2)}</span>
        </div>`;

      this.updatePosition();

      this.elem.classList.add('shake');
      this.elem.addEventListener('transitionend', () => {
        this.elem.classList.remove('shake');
      }, {once: true});

    } else {
      this.elem.classList.remove('cart-icon_visible');
    }
  }

  addEventListeners() {
    document.addEventListener('scroll', () => this.updatePosition());
    window.addEventListener('resize', () => this.updatePosition());
  }

  updatePosition() {
    let leftOffset = 20;
    let topOffset = 50;
    let rightOffset = 10;
    let leftElem = document.querySelector('.container');
    let leftShift = leftElem.getBoundingClientRect().right + leftOffset;
    let rightShift = document.documentElement.clientWidth - this.elem.offsetWidth - rightOffset;

    let leftIndent = Math.min(leftShift, rightShift) + 'px';
    let isMobile = document.documentElement.clientWidth <= 767;
    if (this.initialTopCoord == 0) this.initialTopCoord = this.elem.getBoundingClientRect().top + window.pageYOffset;
    
    if (isMobile) {
      Object.assign(this.elem.style, {
        position: '',
        top: '',
        left: '',
        zIndex: ''
      });
    } else {
    if (window.pageYOffset > this.initialTopCoord) {
      Object.assign(this.elem.style, {
        position: 'fixed',
        top: '50px',
        zIndex: 1e3,
        right: '10px',
        left: leftIndent
      });
    } else {
      Object.assign(this.elem.style, {
        position: '',
        top: '',
        left: '',
        zIndex: ''
      });
    }
  }

    // let pageWidth = document.documentElement.clientWidth;
    // let pageHeight = document.documentElement.clientHeight;

    // let currentY = this.elem.getBoundingClientRect().y;
    // let currentX = this.elem.getBoundingClientRect().x;
    // let width = this.elem.getBoundingClientRect().width;
    // let height = this.elem.getBoundingClientRect().height;

    // let leftOffset = 20;
    // let topOffset = 50;
    // let rightOffset = 10;
    // let leftElem = document.querySelector('.container');
    // let leftShift = leftElem.getBoundingClientRect().x + leftElem.getBoundingClientRect().width + leftOffset;

    // if (currentY < 0 || (currentX + width) > pageWidth) {
    //   this.elem.style.cssText = "position:fixed";
    //   this.elem.style.top = topOffset + 'px';
    //   this.elem.style.left =  leftShift + 'px';
      
    // }
  }
}
