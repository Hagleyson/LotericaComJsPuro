(function ($, doc) {
  "use strict";
  var $desc = $("[data-js='desc']");
  var $containerGames = $('[data-js="containerGames"]');
  var $selectedNumber = [];
  var $gameAtual = {};
  var $totalPrice = [];

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

        $('[data-js="clearGame"]').on("click", app().handleClear);
        $('[data-js="completeGame"]').on("click", app().handleComplete);
        $('[data-js="addToCar"]').on("click", app().handleAddToCar);
      },
      handleClick: function handleClick(type) {
        app().getInfoGame(type);
        $selectedNumber = [];
      },
      handleClear: function handleClear() {
        app().createFieldBet($gameAtual.range);
        $selectedNumber = [];
      },
      handleAddToCar: function handleAddToCar() {
        var maxNumber = $gameAtual["max-number"];
        if ($selectedNumber.length < maxNumber) {
          alert(`Você deve selecionar: ${maxNumber} números`);
          return;
        }
        $totalPrice = Number($totalPrice) + Number($gameAtual.price);
        var $fragment = doc.createDocumentFragment();
        var $li = doc.createElement("li");
        var $button = doc.createElement("button");
        var $p = doc.createElement("p");
        var $strong = doc.createElement("strong");
        var $span = doc.createElement("span");
        $li.classList.add(app().addClass());
        $button.classList.add("far");
        $button.classList.add("fa-trash-alt");
        $button.classList.add("buttonDefault");
        $button.addEventListener(
          "click",
          function () {
            app().handleRemoveItemCar(this, $gameAtual.price);
          },
          false
        );
        $p.textContent = $selectedNumber.join(", ");
        $strong.textContent = $gameAtual.type;
        $span.textContent = ` R$ ${$gameAtual.price}`;
        $strong.appendChild($span);
        $li.appendChild($button);
        $li.appendChild($p);
        $li.appendChild($strong);
        $fragment.appendChild($li);
        $('[data-js="card"]').get()[0].appendChild($fragment);
        $('[data-js="tot"]').get()[0].innerHTML = `TOTAL ${$totalPrice}`;
        app().handleClear();
      },
      handleRemoveItemCar: function handleRemoveItemCar(element, value) {
        $('[data-js="card"]').get()[0].removeChild(element.parentNode);
        $totalPrice -= Number(value);
        $('[data-js="tot"]').get()[0].innerHTML = `TOTAL ${$totalPrice}`;
      },
      addClass: function () {
        switch ($gameAtual.type) {
          case "Lotofácil":
            return "lotofacil";
          case "Mega-Sena":
            return "megaSena";
          case "Quina":
            return "lotomania";
          default:
            return "";
        }
      },
      createFieldBet: function createFieldBet(range) {
        var $fragment = doc.createDocumentFragment();
        for (let index = 0; index <= range; index++) {
          var $div = doc.createElement("div");
          $div.textContent = index;
          $div.textContent = index;
          $div.setAttribute("data-js", "ball");
          $div.addEventListener(
            "click",
            function () {
              var numberSelected = this.innerHTML;
              if (
                $selectedNumber.some((element) => +element === +numberSelected)
              ) {
                this.classList.remove("selected");
                $selectedNumber.splice(
                  $selectedNumber.indexOf(+numberSelected),
                  1
                );
                return;
              }
              if ($selectedNumber.length < $gameAtual["max-number"]) {
                $selectedNumber.push(+numberSelected);
                this.classList.add("selected");
              }
            },
            false
          );
          $fragment.appendChild($div);
        }
        $containerGames.get()[0].innerHTML = "";
        $containerGames.get()[0].appendChild($fragment);
      },
      handleComplete: function handleComplete() {
        for (
          let index = 0;
          $selectedNumber.length < $gameAtual["max-number"];
          index++
        ) {
          var aleatorio = Math.ceil(Math.random() * $gameAtual.range);
          if (!$selectedNumber.some((element) => element === aleatorio)) {
            $selectedNumber.push(aleatorio);
          }
        }
        app().applySelectedStyle();
      },
      applySelectedStyle: function applySelectedStyle() {
        var balls = $('[data-js="ball"]');
        balls.forEach(function (b) {
          if ($selectedNumber.some((number) => +number === +b.innerHTML)) {
            b.classList.add("selected");
          }
        });
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
