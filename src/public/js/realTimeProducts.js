const socket = io();

let formProducts = document.getElementById("form-products")
formProducts.addEventListener("submit", (e) => {
  e.preventDefault();
  let newProduct = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    price: document.getElementById("price").value,
    thumbnails: document.getElementById("thumbnails"),
    code: document.getElementById("code").value,
    stock: document.getElementById("stock").value,
    category: document.getElementById("category").value,
    status: document.getElementById("status").checked
  };
  socket.emit("new-product-created", newProduct);
});

socket.on("repeat-code", (bool)=>{
  if(bool){
    Swal.fire({
      title: 'duplicate code',
      text: "Please change the code",
      icon: 'warning',
    });
  }
})

window.addEventListener("load", async () => {
  socket.emit("all-products");
});

socket.on("all-the-products", (pagProducts) => {
  let container = document.getElementById("dinamic-product-list");
  container.innerHTML = '';
  const mappedProducts = pagProducts.products.docs.map(product => {
    let data = document.createElement("tr");
    container.append(data);
    data.innerHTML = `
      <td>${(product._id).toString()}</td>
      <td>${product.title}</td>
      <td>${product.description}</td>
      <td>${product.price}</td>
      <td>[${product.thumbnails}]</td>
      <td>${product.code}</td>
      <td>${product.stock}</td>
      <td>${product.category}</td>
      <td>${product.status}</td>
      <td>
        <button type="button" class="btn-delete" value=${(product._id).toString()}>Eliminar
        </button>
      </td>
    `;
    btnDelete = document.querySelectorAll(".btn-delete");
    setDelete(btnDelete);
  });
});

let btnDelete = document.querySelectorAll(".btn-delete");

function setDelete(btnDelete) {
  for (let btn of btnDelete) {
    btn.addEventListener("click", () => {
      Swal.fire({
        title: 'Do you want to delete',
        text: `you are going to delete the product with the ID: "${btn.value}"`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          let idToDelete = btn.value
          socket.emit("delete-product", idToDelete)
          Swal.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success'
          )
        }
      })
    });
  };
}

setDelete(btnDelete);
socket.on("delete-product-in-table", (idToDelete) => {

btnDelete = document.querySelectorAll(".btn-delete");
for (let btn of btnDelete) {
  if (btn.value == idToDelete) {
    let hijo = btn.parentNode;
    let padre = hijo.parentNode;
    padre.remove()
  }
}
})