(function ($, doc) {
  "use strict";
  function app() {
    var $desc = $("[data-js='desc']");
    var $gameAtual = {};
    var $numbers = $('[data-js="numbers"]');
    var $SelectedNumber = [];

    return {
      init: function init() {
        this.getInfoGame(0);
        this.initEvents();
      },
      initEvents: function initEvents() {
        $('[data-js="lotofacil"]').on("click", function () {
          app().handleClick(0);
        });
        $('[data-js="megasena"]').on("click", function () {
          app().handleClick(1);
        });
        $('[data-js="lotomania"]').on("click", function () {
          app().handleClick(2);
        });
      },
      handleClick: function handleClick(type) {
        app().getInfoGame(type);
      },
      createFieldBet: function createFieldBet(range) {
        var $fragment = document.createDocumentFragment();
        for (let index = 0; index <= range; index++) {
          var $div = doc.createElement("div");
          var $h1 = doc.createElement("h1");
          $h1.textContent = index;
          $div.appendChild($h1);
          $fragment.appendChild($div);
        }
        $numbers.get()[0].innerHTML = "";
        $numbers.get()[0].appendChild($fragment);
      },
      getInfoGame: function getInfoGame(type) {
        var ajax = new XMLHttpRequest();
        ajax.open("GET", "games.json");
        ajax.send();
        ajax.addEventListener(
          "readystatechange",
          function () {
            if (ajax.readyState === 4 && ajax.status === 200) {
              var response = JSON.parse(ajax.responseText);
              $gameAtual = response.types[type];
              $desc.get()[0].innerHTML = $gameAtual.description;
              app().createFieldBet($gameAtual.range);
            }
          },
          false
        );
      },
    };
  }
  app().init();
})(window.DOM, document);
