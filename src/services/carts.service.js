import EErrors from '../services/errors/enums.js';
import CustomError from '../services/errors/custom-error.js';
import importModels from '../DAO/factory.js';

const models = await importModels();
const modelProduct = models.products;
const modelCart = models.carts;
const ticketsModel = models.tickets;

class CartService {
  validateId(id) {
    if (!id) {
      CustomError.createError({
        name: 'VALDIATION ERROR',
        cause: 'Parametros Faltantes o incorrectos.',
        message: 'os parámetros proporcionados son insuficientes o inválidos para llevar a cabo la creación. Por favor, revisa la información suministrada e intenta nuevamente.',
        code: EErrors.INVALID_INPUT_ERROR,
      });
    }
  }
  validateProduct(pid) {
    if (!pid) {
      CustomError.createError({
        name: 'VALDIATION ERROR',
        cause: 'Parametros Faltantes o incorrectos.',
        message: 'os parámetros proporcionados son insuficientes o inválidos para llevar a cabo la creación. Por favor, revisa la información suministrada e intenta nuevamente.',
        code: EErrors.INVALID_INPUT_ERROR,
      });
    }
  }

  async validateProductInCart(cid, pid) {
    this.validateId(cid);
    this.validateProduct(pid);
    const cart = await this.getCart(cid);
    if (!cart.products.find((p) => p.id._id.toString() === pid)) {
      CustomError.createError({
        name: 'VALDIATION ERROR',
        cause: 'Parametros Faltantes o incorrectos.',
        message: 'os parámetros proporcionados son insuficientes o inválidos para llevar a cabo la creación. Por favor, revisa la información suministrada e intenta nuevamente.',
        code: EErrors.INVALID_INPUT_ERROR,
      });
    }
    return true;
  }

  async getAllCarts() {
    const carts = await modelCart.getAllCarts();
    return carts;
  }

  async getCart(id) {
    this.validateId(id);
    const cart = await modelCart.getCart(id);
    return cart;
  }

  async createCart(userid) {
    let product = new Array();
    let cartCreated = null;
    if (userid) {
      cartCreated = await modelCart.createCart(product, userid);
    }
    return cartCreated;
  }

  async updateCart(id, products) {
    if (!id || !products) {
      return null;
    }
    const cartCreated = await modelCart.updateCart(id, products);
    return cartCreated;
  }

  async updateCantProd(cid, pid, quantity) {
    this.validateProductInCart(cid, pid);
    const cart = await this.getCart(cid);
    const productoIndex = cart.products.findIndex((prod) => prod.id._id.toString() === pid);
    if (productoIndex !== -1) {
      cart.products[productoIndex].quantity = quantity;
      return await this.updateCart(cid, cart.products);
    }
  }

  async deleteCart(id) {
    this.validateId(id);
    const deleted = await modelCart.deleteCart(id);
    return deleted;
  }

  async addProductToCart(cid, pid, email) {
    this.validateId(cid);
    this.validateProduct(pid);
    const product = await modelProduct.getProduct(pid);
    const cart = await this.getCart(cid);
    let existingProduct = cart.products.find((p) => p.id._id.toString() === pid.toString());
    if (!product.owner == email) {
      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        let newProduct = {
          id: pid.toString(),
          quantity: 1,
        };
        cart.products.push(newProduct);
      }
    }
    const updatedCart = await this.updateCart(cid, cart.products);
    return updatedCart;
  }

  async deleteProductInCart(cid, pid) {
    if (this.validateProductInCart(cid, pid)) {
      return null;
    }
    const cart = await this.getCart(cid);

    const newproducts = cart.products.filter((p) => p.id !== pid);
    this.updateCart(cid, newproducts);
    return await this.getCart(cid);
  }

  async getCartbyiduser(idUser) {
    const cart = await modelCart.getCartbyiduser(idUser);
    return cart;
  }

  async purchaseCart(id, email) {
    if (!id || !email) {
      return null;
    }
    const ticket = {
      code: Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000,
      purchase_datetime: new Date(),
      amount: 0,
      purchaser: email,
      products: [],
    };

    const cart = await this.getCart(id);

    const updatedProducts = [];

    for (const product of cart.products) {
      const productdb = await modelProduct.getProduct(product.id._id);

      if (productdb.stock >= product.quantity) {
        productdb.stock -= product.quantity;
        //total
        await modelProduct.updateProduct(
          productdb._id,
          productdb.title,
          productdb.description,
          productdb.code,
          productdb.price,
          productdb.status,
          productdb.stock,
          productdb.category,
          productdb.thumbnails
        );
        updatedProducts.push(productdb);
      } else {
        product.quantity -= productdb.stock;
        ticket.amount += productdb.price * productdb.stock;
        productdb.stock = 0;
        await modelProduct.updateProduct(
          productdb._id,
          productdb.title,
          productdb.description,
          productdb.code,
          productdb.price,
          productdb.status,
          productdb.stock,
          productdb.category,
          productdb.thumbnails
        );
        const index = cart.products.findIndex((p) => p.id._id === product.id._id);
        if (index !== -1) {
          cart.products[index].quantity = product.quantity;
        }
      }
    }

    cart.products = cart.products.filter((p) => !updatedProducts.some((updatedProduct) => updatedProduct._id.toString() === p.id._id.toString()));

    if (cart.products.length === 0) {
      await this.deleteCart(id);
    } else {
      await this.updateCart(id, cart.products);
    }

    await ticketsModel.create(ticket);

    // Mandar el email aquí

    return ticket;
  }
}

export const cartService = new CartService();
