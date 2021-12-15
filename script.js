/*
Já temos as funcionalidades de adicionar e remover um carro. Agora, vamos persistir esses dados, 
salvando-os temporariamente na memória de um servidor.
Nesse diretório do `challenge-32` tem uma pasta `server`. É um servidor simples, em NodeJS, para 
que possamos utilizar para salvar as informações dos nossos carros.
Para utilizá-lo, você vai precisar fazer o seguinte:
- Via terminal, acesse o diretório `server`;
- execute o comando `npm install` para instalar as dependências;
- execute `node app.js` para iniciar o servidor.
Ele irá ser executado na porta 3000, que pode ser acessada via browser no endereço: 
`http://localhost:3000`
O seu projeto não precisa estar rodando junto com o servidor. Ele pode estar em outra porta.
As mudanças que você irá precisar fazer no seu projeto são:
- Para listar os carros cadastrados ao carregar o seu projeto, faça um request GET no endereço
`http://localhost:3000/car`
- Para cadastrar um novo carro, faça um POST no endereço `http://localhost:3000/car`, enviando
os seguintes campos:
  - `image` com a URL da imagem do carro;
  - `brandModel`, com a marca e modelo do carro;
  - `year`, com o ano do carro;
  - `plate`, com a placa do carro;
  - `color`, com a cor do carro.
Após enviar o POST, faça um GET no `server` e atualize a tabela para mostrar o novo carro cadastrado.
Crie uma branch `challenge-32` no seu projeto, envie um pull request lá e cole nesse arquivo a URL
do pull request.
*/

(function ($, doc) {
  "use strict";
  function app() {
    var $title = $("[data-js='Title']");
    var $image = $("[data-js='image']");
    var $brandModel = $("[data-js='brandModel']");
    var $year = $("[data-js='year']");
    var $plate = $("[data-js='plate']");
    var $color = $("[data-js='color']");
    var $tbody = $("[data-js='tbody']");

    return {
      init: function init() {
        this.getInfoBussines();
        this.initEvents();
        this.getCars();
      },
      initEvents: function initEvents() {
        $('[data-js="form"]').on("submit", this.handleSubmit);
      },
      handleSubmit: function handleSubmit(e) {
        e.preventDefault();
        var ajax = new XMLHttpRequest();
        ajax.open("POST", "http://localhost:3000/car");
        ajax.setRequestHeader(
          "Content-type",
          "application/x-www-form-urlencoded"
        );
        ajax.send(
          `image=${$image.get()[0].value}&brandModel=${
            $brandModel.get()[0].value
          }&year=${$year.get()[0].value}&plate=${$plate.get()[0].value}&color=${
            $color.get()[0].value
          }`
        );
        console.log("começou a bagaceira");
        ajax.onreadystatechange = function () {
          if (ajax.readyState === 4) {
            app().getCars();
          }
        };
      },
      getCars: function getCars() {
        var ajax = new XMLHttpRequest();
        ajax.open("GET", "http://localhost:3000/car");
        ajax.send();
        ajax.addEventListener(
          "readystatechange",
          function () {
            if (ajax.readyState === 4 && ajax.status === 200) {
              var response = JSON.parse(ajax.responseText);
              app().listCars(response);
            }
          },
          false
        );
      },
      listCars: function listCars(cars) {
        var fragment = document.createDocumentFragment();

        if (!!cars[0]) {
          cars.map((c) => {
            var $tr = document.createElement("tr");
            var $tdImage = document.createElement("td");
            var $image = doc.createElement("img");
            var $tdBrandModel = document.createElement("td");
            var $tdYear = document.createElement("td");
            var $tdPlate = document.createElement("td");
            var $tdColor = document.createElement("td");
            $image.setAttribute("src", c.image);
            $tdImage.appendChild($image);
            $tdBrandModel.textContent = c.brandModel;
            $tdYear.textContent = c.year;
            $tdPlate.textContent = c.plate;
            $tdColor.textContent = c.color;
            $tr.appendChild($tdImage);
            $tr.appendChild($tdBrandModel);
            $tr.appendChild($tdYear);
            $tr.appendChild($tdPlate);
            $tr.appendChild($tdColor);
            $tr.appendChild(app().addButtonDelete());
            fragment.appendChild($tr);
            $tbody.get()[0].appendChild(fragment);
          });
        }
      },
      addButtonDelete: function addButtonDelete() {
        var $td = document.createElement("td");
        var $delButton = document.createElement("button");

        $delButton.textContent = "excluir";
        $delButton.addEventListener(
          "click",
          function () {
            var $tr = $td.parentNode;
            // console.log($tr);
            $tbody.get()[0].removeChild($tr);
            console.log($tbody.appendChild);
          },
          false
        );
        $td.appendChild($delButton);
        return $td;
      },
      deleteButton: function (e) {
        e.preventDefault();
      },

      getInfoBussines: function getInfoBussines() {
        var ajax = new XMLHttpRequest();
        ajax.open("GET", "company.json");
        ajax.send();
        ajax.addEventListener(
          "readystatechange",
          function () {
            if (ajax.readyState === 4 && ajax.status === 200) {
              var response = JSON.parse(ajax.responseText);
              $title.get()[0].innerHTML = `${response.name} Tel: ${response.phone}`;
            }
          },
          false
        );
      },
    };
  }
  app().init();
})(window.DOM, document);
