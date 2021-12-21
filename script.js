(function ($, doc) {
  "use strict";
  var $desc = $("[data-js='desc']");
  var $containerGames = $('[data-js="containerGames"]');
  var $selectedNumber = [];
  var $gameInformation = [];
  var $gameAtual = {};
  var $totalPrice = [];

  function app() {
    return {
      init: function init() {
        this.getInfoGame();
        this.initEvents();
      },
      getInfoGame: function getInfoGame(type) {
        const ajax = new XMLHttpRequest();
        ajax.open("GET", "games.json");
        ajax.send();
        ajax.addEventListener(
          "readystatechange",
          function () {
            if (ajax.readyState === 4 && ajax.status === 200) {
              const response = JSON.parse(ajax.responseText);
              $gameInformation = response.types;
              $gameAtual = $gameInformation[0];
              app().createFieldBet($gameAtual.range);
              app().addDescAndTypeGame();
            }
            app().addButoes();
          },
          false
        );
      },
      addButoes: function addButoes() {
        let $fragment = doc.createDocumentFragment();
        $gameInformation.forEach((element) => {
          let $button = doc.createElement("button");
          $button.setAttribute("data-js", `${element.type}`);
          $button.classList.add("button");
          $button.classList.add("buttonSelectGame");
          $button.style.border = `2px solid ${element.color}`;
          if ($gameAtual.type === element.type) {
            $button.style.backgroundColor = element.color;
            $button.style.color = "#fff";
          } else {
            $button.style.color = element.color;
          }
          $button.textContent = element.type;
          $button.addEventListener(
            "click",
            function () {
              $gameInformation.forEach((element) => {
                if (element.type === this.getAttribute("data-js")) {
                  $gameAtual = element;
                  app().addButoes();
                  app().createFieldBet(element.range);
                  $selectedNumber = [];
                  app().addDescAndTypeGame();
                }
              });
            },
            false
          );
          $fragment.appendChild($button);
        });
        $('[data-js="groupButtons"]').get()[0].innerHTML = "";
        $('[data-js="groupButtons"]').get()[0].appendChild($fragment);
      },
      addDescAndTypeGame: function addDescAndTypeGame() {
        $desc.get()[0].innerHTML = $gameAtual.description;
        $(
          '[data-js="titleGame"]'
        ).get()[0].innerHTML = `FOR ${$gameAtual.type.toUpperCase()}`;
      },
      initEvents: function initEvents() {
        $('[data-js="clearGame"]').on("click", app().handleClear);
        $('[data-js="completeGame"]').on("click", app().handleComplete);
        $('[data-js="addToCar"]').on("click", app().handleAddToCar);
      },
      handleClear: function handleClear() {
        console.log($gameAtual.range);
        app().createFieldBet($gameAtual.range);
        $selectedNumber = [];
      },
      handleAddToCar: function handleAddToCar() {
        const maxNumber = $gameAtual["max-number"];
        if ($selectedNumber.length < maxNumber) {
          const total = maxNumber - $selectedNumber.length;
          $selectedNumber.length === 0
            ? alert(`Você deve selecionar: ${maxNumber} números`)
            : alert(
                `Você deve selecionar mais ${total} ${
                  total === 1 ? "número" : "números"
                }.`
              );
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
            app().handleRemoveItemCar(this);
          },
          false
        );
        $p.textContent = $selectedNumber.sort((a, b) => a - b).join(", ");
        $strong.textContent = `${$gameAtual.type}`;
        $span.textContent = $gameAtual.price;
        $strong.appendChild($span);
        $li.appendChild($button);
        $li.appendChild($p);
        $li.appendChild($strong);
        $fragment.appendChild($li);
        $('[data-js="card"]').get()[0].appendChild($fragment);
        $('[data-js="tot"]').get()[0].innerHTML = `TOTAL: ${app().convertReal(
          $totalPrice
        )}`;
        app().handleClear();
      },
      convertReal: function convertReal(value) {
        return value.toLocaleString("pt-br", {
          style: "currency",
          currency: "BRL",
        });
      },
      handleRemoveItemCar: function handleRemoveItemCar(element) {
        $('[data-js="card"]').get()[0].removeChild(element.parentNode);
        var value = element.parentNode.lastChild.lastChild.innerHTML;
        $totalPrice = Number($totalPrice) - Number(value);
        $('[data-js="tot"]').get()[0].innerHTML = `TOTAL: ${$totalPrice}`;
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
        for (let index = 1; index <= range; index++) {
          var $div = doc.createElement("div");
          $div.textContent = index < 10 ? `0${index}` : index;

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
              } else {
                alert("Não é possível adicionar um novo número ao game");
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
          const aleatorio = Math.ceil(Math.random() * $gameAtual.range);
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
    };
  }
  app().init();
})(window.DOM, document);
