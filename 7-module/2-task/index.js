import createElement from '../../assets/lib/create-element.js';

export default class Modal {
  constructor() {
    this.modalTitleText = "";
    this.modalBodyElement = "";
    this.firstTime = true;
  }
  setTitle(title) {
    this.modalTitleText = title;
    let modalTitle = document.querySelector('.modal__title');
    if (modalTitle) {modalTitle.textContent = title;}
  }

  setBody(body) {
    this.modalBodyElement = body;
    let modalBody = document.querySelector('.modal .modal__body');
    if (modalBody) {
      modalBody.innerHTML = "";
      modalBody.insertAdjacentElement('afterBegin', body);
    }
  }

  open() {
    let modalTemplate = `
    <div class="modal">
    <div class="modal__overlay"></div>
    <div class="modal__inner">
      <div class="modal__header">
        <button type="button" class="modal__close">
          <img src="/assets/images/icons/cross-icon.svg" alt="close-icon" />
        </button>
        <h3 class="modal__title">${this.modalTitleText}</h3>
      </div>
      <div class="modal__body">
      ${this.modalBodyElement.outerHTML}
      </div>
     </div>
    </div>
     `;
    document.body.insertAdjacentHTML('beforeEnd', modalTemplate);
    document.body.classList.add('is-modal-open');
    let modalCloseBtn = document.querySelector('.modal__close');
    modalCloseBtn.addEventListener('click', event => {
      this.close();
    });

    if (this.firstTime) {
      document.addEventListener('keydown', event => {
        if (event.code == "Escape") {this.close();}
      });
      this.firstTime = false;
    }
   
  }

  close() {
    let modal = document.querySelector('.modal');
    if (modal) {
      document.body.classList.remove('is-modal-open');
      document.querySelector('.modal').remove();
    }

  }
}

