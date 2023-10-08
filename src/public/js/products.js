const socket = io();

document.addEventListener('click', function (event) {
  if (event.target.classList.contains('btn-add')) {
    const btnAdd = event.target;
    const btnValue = btnAdd.value;
    addCart(btnValue);
  }
});

function addCart(pid) {
  const carritoElement = document.getElementById('carrito');
  const emailElement = document.getElementById('email');
  const email = emailElement.getAttribute('value');
  const cid = carritoElement.getAttribute('value');
  socket.emit("add-cart",{datos:{
    email: email,
    cartid: cid,
    productid: pid
  }})
}


window.addEventListener('DOMContentLoaded', async function () {});
