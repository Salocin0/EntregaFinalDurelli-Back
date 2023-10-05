import { selectedLogger } from "../../utils/logger.js";
let cartid = '';

document.addEventListener('click', function (event) {
  if (event.target.classList.contains('btn-add')) {
    const btnAdd = event.target;
    const btnValue = btnAdd.value;
    addCart(btnValue);
  }
});

function getProduct(pid, callback) {
  const url = 'http://localhost:8080/api/products/';
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `${url}${pid}`, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 400) {
      const respuesta = JSON.parse(xhr.responseText);
      callback(respuesta.data);
    } else {
      selectedLogger.error('La solicitud falló con un código de estado: ' + xhr.status);
    }
  };
  xhr.onerror = function () {
    selectedLogger.error('Error de red al realizar la solicitud');
  };
  xhr.send();
}

function addCart(pid) {
  const carritoElement = document.getElementById('carrito');
  const cid = carritoElement.getAttribute('value');

  getProduct(pid, function (product) {
    const cuerpo = JSON.stringify({
      title: product.title,
      description: product.description,
      code: product.code,
      price: product.price,
      status: product.status,
      stock: product.stock,
      category: product.category,
      thumbnails: product.thumbnails,
    });

    const url = 'http://localhost:8080/api/carts/';
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${url}${cid}/product/${pid}`, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 400) {
        const respuesta = JSON.parse(xhr.responseText);
      } else {
        selectedLogger.error('La solicitud falló con un código de estado: ' + xhr.status);
      }
    };
    xhr.onerror = function () {
      selectedLogger.error('Error de red al realizar la solicitud');
    };
    xhr.send(cuerpo);
  });
}

window.addEventListener('DOMContentLoaded', async function () {});
