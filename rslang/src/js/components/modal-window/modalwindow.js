import create from '../../utils/сreate';

export default class ModalWindow {
  constructor(classNames, id, title) {
    this.id = id;

    const spanButton = create('span', 'modal-block__close-button');
    spanButton.addEventListener('click', (this.clickHandler).bind(this));
    const spanTitle = create('span', 'modal-block__title', title);
    const navbar = create('div', 'modal-block__navbar', [spanTitle, spanButton]);

    this.content = create('div', 'modal-block__content');
    this.main = create('div', 'modal-block__main', [navbar, this.content]);
    this.background = create('div', `modal-block modal-block_hidden ${classNames}`, this.main, document.body, ['id', id]);
    this.background.addEventListener('click', (this.clickHandler).bind(this));
  }

  setContent(body, clearOldContent = false) {
    if (clearOldContent) {
      this.content.innerHTML = '';
    }
    this.content.append(body);
  }

  openModal() {
    const modal = document.querySelector(`#${this.id}`);
    if (modal) {
      modal.classList.remove('modal-block_hidden');
      document.body.classList.add('body_overflow-hidden');
    }
  }

  closeModal() {
    const modal = document.querySelector(`#${this.id}`);
    if (modal) {
      modal.classList.add('modal-block_hidden');
      document.body.classList.remove('body_overflow-hidden');
      if (this.callbackFnOnClose) {
        this.callbackFnOnClose();
      }
    }
  }

  clickHandler(event) {
    const elem = event.target;
    if (elem.classList.contains('modal-block') || elem.classList.contains('modal-block__close-button')) {
      this.closeModal();
    }
  }

  addCallbackFnOnClose(callbackFn) {
    if (typeof callbackFn === 'function') {
      this.callbackFnOnClose = callbackFn;
    }
  }
}
