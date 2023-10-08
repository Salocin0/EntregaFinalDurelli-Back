const socket = io();
document.addEventListener('DOMContentLoaded', function () {
    const purchaseLink = document.getElementById('purchase-link');
    const cartid = document.getElementById('cart').getAttribute('value');
  
    if (purchaseLink) {
      purchaseLink.addEventListener('click', function (e) {
        e.preventDefault();
        const purchaseUrl = purchaseLink.getAttribute('href');
        socket.emit('purchase', cartid);
      });
    }
  });

  socket.on("purchased", (result) => {
    if (result === true) {
      window.location.href = 'http://localhost:8080/vista/products';
    } else {
      window.location.href = 'http://localhost:8080/vista/products';
    }
  });