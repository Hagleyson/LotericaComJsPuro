(function (win, doc) {
  //construtor
  function DOM(no) {
    if (!(this instanceof DOM)) return new DOM(no);
    this.element = doc.querySelectorAll(no);
  }
  //função de adicionar listener
  DOM.prototype.on = function on(e, callback) {
    Array.prototype.forEach.call(this.element, function (element) {
      element.addEventListener(e, callback, false);
    });
  };
  //função de remover listener
  DOM.prototype.off = function off(e, callback) {
    Array.prototype.forEach.call(this.element, function (element) {
      element.removeEventListener(e, callback, false);
    });
  };
  //função para trazer o elemento
  DOM.prototype.get = function get() {
    return this.element;
  };

  //map
  DOM.prototype.map = function map() {
    return Array.prototype.map.apply(this.element, arguments);
  };
  DOM.prototype.forEach = function forEach() {
    return Array.prototype.forEach.apply(this.element, arguments);
  };
  //filter
  DOM.prototype.filter = function filter() {
    return Array.prototype.filter.apply(this.element, arguments);
  };

  win.DOM = DOM;
})(window, document);
