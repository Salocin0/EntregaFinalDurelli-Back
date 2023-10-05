import chai from 'chai';
import supertest from 'supertest';
import { faker } from '@faker-js/faker';

const expect = chai.expect;
const requester = supertest('http://localhost:8080');
describe('testing de integracion', () => {
  let cookieName;
  let cookieValue;
  let idUsuario;

  describe('Testing Usuarios parte 1', () => {
    const mockUsuario = {
      email:"nicolasarieldurelli2@gmail.com",
      password:"123",
      firstName:"nicolas",
      lastName:"durelli",
      age:23,
    }

    it('En endpoint POST /api/users debe crear un usuario "user"', async function () {
      this.timeout(50000);
      const response = await requester
        .post('/api/users')
        .send(mockUsuario)
      const { status, ok, body } = response;
      expect(status).to.equal(201);
      expect(ok).to.equal(true);
      expect(body.data).to.have.property('_id');
      idUsuario = body.data._id.toString();
    });

    it('En endpoint GET /api/users/premium/:id debe carmbiar el rol del usuario a "premium"', async function () {
      this.timeout(50000);
      const response = await requester.get(`/api/users/premium/${idUsuario}`);
      const { status, ok, body } = response;
      expect(status).to.equal(200);
      expect(ok).to.equal(true);
    });

    it('En endpoint GET /api/users/ debe retornar todos los usuarios registrados', async function () {
      this.timeout(50000);
      const response = await requester.get('/api/users');
      const { status, ok, body } = response;
      expect(status).to.equal(200);
      expect(ok).to.equal(true);
      expect(Array.isArray(body.data)).to.equal(true);
      expect(body.data.length).to.be.greaterThan(0);
    });

    it('En endpoint GET /api/users/:id debe retornar el usuarios con el id', async function () {
      this.timeout(50000);
      const response = await requester.get(`/api/users/${idUsuario}`);
      const { status, ok, body } = response;
      expect(status).to.equal(200);
      expect(ok).to.equal(true);
      expect(body.data).to.have.property('_id');
    });

    it('En endpoint POST /api/sessions/login debe devolver una cookie de logueado', async function () {
      this.timeout(50000);
      const result = await requester.post('/api/sessions/login').send({
        email: 'nicolasarieldurelli@gmail.com',
        password: '123',
      });
      const cookie = result.headers['set-cookie'][0];
      expect(cookie).to.be.ok;

      cookieName = cookie.split('=')[0];
      cookieValue = cookie.split('=')[1];
      expect(cookieName).to.be.ok.and.eql('connect.sid');
      expect(cookieValue).to.be.ok;
    });
  });

  describe('Testing Products', () => {
    let idproducto;
    const mockProduct = {
      title: 'producto test',
      description: 'descripcion test',
      code: '99999',
      price: 10,
      status: true,
      stock: 10,
      category: 'almacen',
      thumbnails: ['1', '2', '3'],
    };

    const mockProductUpdated = {
      title: 'producto test updated',
      description: 'descripcion test updated',
      code: '99999',
      price: 10,
      status: true,
      stock: 10,
      category: 'almacen',
      thumbnails: ['1', '2', '3'],
    };

    it('En endpoint POST /api/products debe crear un producto (debe ser admin/premium)', async function () {
      this.timeout(50000);
      const response = await requester
        .post('/api/products')
        .send(mockProduct)
        .set('Cookie', [`${cookieName}=${cookieValue}`]);
      const { status, ok, body } = response;
      expect(status).to.equal(201);
      expect(ok).to.equal(true);
      expect(body.data).to.have.property('_id');
      idproducto = body.data._id.toString();
    });

    it('En endpoint GET /api/products debe traer productos registrados', async function () {
      this.timeout(50000);
      const response = await requester.get('/api/products');
      const { status, ok, body } = response;
      expect(status).to.equal(200);
      expect(ok).to.equal(true);
      expect(Array.isArray(body.payload)).to.equal(true);
      expect(body.payload.length).to.be.greaterThan(0);
    });

    it('En endpoint PUT /api/products/:id debe actualizar un producto (debe ser admin/premium)', async function () {
      this.timeout(50000);
      const response = await requester
        .put(`/api/products/${idproducto}`)
        .send(mockProductUpdated)
        .set('Cookie', [`${cookieName}=${cookieValue}`]);
      const { status, ok, body } = response;
      expect(status).to.equal(201);
      expect(ok).to.equal(true);
    });

    it('En endpoint GET /api/products/:id debe traer un producto', async function () {
      this.timeout(50000);
      const response = await requester.get(`/api/products/${idproducto}`);
      const { status, ok, body } = response;
      expect(status).to.equal(200);
      expect(ok).to.equal(true);
      expect(body.data).to.have.property('_id');
    });

    it('En endpoint DELETE /api/products/:id debe eliminar un producto (debe ser admin/premium)', async function () {
      this.timeout(50000);
      const response = await requester.delete(`/api/products/${idproducto}`).set('Cookie', [`${cookieName}=${cookieValue}`]);
      const { status, ok, body } = response;
      expect(status).to.equal(200);
      expect(ok).to.equal(true);
    });
  });

  describe('Testing Carritos', () => {
    it('En endpoint POST /api/carts debe crear un carrito', async function () {});

    it('En endpoint GET /api/carts debe traer carritos registrados', async function () {});

    it('En endpoint PUT /api/carts/:id debe actualizar un carrito', async function () {});

    it('En endpoint GET /api/carts/:id debe traer un carrito', async function () {});

    it('En endpoint DELETE /api/carts/:id debe eliminar un carrito', async function () {});

    it('En endpoint PUT /api/carts/:cid/product/:pid debe agregar el producto con el pid al carrito con el cid (debe ser owner)', async function () {});

    it('En endpoint POST /api/carts/:cid/purchase debe generarse la compra del carrito con el cid (debe ser owner)', async function () {});

    it('En endpoint PUT /api/carts/:cid/products/:pid debe actualizarse el producto pid en el cart cid', async function () {});

    it('En endpoint DELETE /api/carts/:cid/products/:pid debe eliminarse el producto pid en el cart cid', async function () {});
  });

  describe('Testing Usuarios parte 2', () => {
    const mockUsuarioUpdated = {
      email:"nicolasarieldurelli2@gmail.com",
      password:"123",
      firstName:"nicolas",
      lastName:"durelli",
      age:50,
    };

    it('En endpoint PUT /api/users/:id debe actualizar el usuario', async function () {
      this.timeout(50000);
      const response = await requester
        .put(`/api/users/${idUsuario}`)
        .send(mockUsuarioUpdated)
      const { status, ok, body } = response;
      expect(status).to.equal(201);
      expect(ok).to.equal(true);
    });

    it('En endpoint DELETE /api/users/:id debe eliminar el usuario', async function () {
      this.timeout(50000);
      const response = await requester.delete(`/api/users/${idUsuario}`);
      const { status, ok, body } = response;
      expect(status).to.equal(200);
      expect(ok).to.equal(true);
    });
  });
});