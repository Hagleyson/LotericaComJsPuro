(function ($, doc) {
  "use strict";
  var $desc = $("[data-js='desc']");
  var $containerGames = $('[data-js="containerGames"]');
  var $selectedNumber = [];
  var $gameAtual = {};
  function app() {
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
        $('[data-js="clearGame"]').on("click", function () {
          app().createFieldBet;
          $selectedNumber = [];
          console.log($selectedNumber);
        });
        $('[data-js="completeGame"]').on("click", app().handleComplete);
      },
      handleClick: function handleClick(type) {
        app().getInfoGame(type);
      },
      createFieldBet: function createFieldBet(range) {
        var $fragment = document.createDocumentFragment();
        for (let index = 0; index <= range; index++) {
          var $div = doc.createElement("div");
          $div.textContent = index;
          // var $h1 = doc.createElement("h1");
          // $h1.textContent = index;
          // $div.appendChild($h1);
          $div.textContent = index;
          $div.setAttribute("data-js", "ball");
          $fragment.appendChild($div);
        }
        $containerGames.get()[0].innerHTML = "";
        $containerGames.get()[0].appendChild($fragment);
      },
      handleComplete: function handleComplete() {
        var numberSelected = [1, 2];
        for (
          let index = 0;
          numberSelected.length < $gameAtual["max-number"];
          index++
        ) {
          var aleatorio = Math.ceil(Math.random() * $gameAtual.range);
          if (!numberSelected.some((element) => element === aleatorio)) {
            numberSelected.push(aleatorio);
          }
        }

        $selectedNumber = numberSelected;
        app().applySelectedStyle();
      },
      applySelectedStyle: function applySelectedStyle() {
        var balls = $('[data-js="ball"]');
        balls.forEach(function (b) {
          if ($selectedNumber.some((number) => +number === +b.innerHTML)) {
            b.classList.add("teste");
          }
        });
        // $selectedNumber.forEach(function (element) {
        //   console.log(element);
        // });
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
