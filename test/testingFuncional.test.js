import chai from 'chai';
import supertest from 'supertest';
import { faker } from '@faker-js/faker';
import { __dirname } from '../src/dirname.js';
import fs from 'fs';
import FormData from 'form-data';

const expect = chai.expect;
const requester = supertest('http://localhost:8080');
describe('testing de integracion', () => {
  var cookieName;
  var cookieValue;
  var idUsuario;
  var idproducto;

  describe('Testing Usuarios parte 1', () => {
    const mockUsuario = {
      email: 'nicolasarieldurelli@gmail.com',
      password: '123',
      firstName: 'nicolas',
      lastName: 'durelli',
      age: 23,
    };

    it('En endpoint POST /api/users debe crear un usuario "user"', async function () {
      this.timeout(50000);
      const response = await requester.post('/api/users').send(mockUsuario);
      const { status, ok, body } = response;
      expect(status).to.equal(201);
      expect(ok).to.equal(true);
      expect(body.data).to.have.property('_id');
      idUsuario = body.data._id.toString();
    });

    it('En endpoint GET /api/users/premium/:id no debe carmbiar el rol del usuario a "premium" sin los documentos', async function () {
      this.timeout(50000);
      const response = await requester.get(`/api/users/premium/${idUsuario}`);
      const { status, ok, body } = response;
      expect(status).to.equal(400);
      expect(ok).to.equal(false);
    });

    it('En endpoint GET /api/users/premium/:id debe cambiar el rol del usuario a "premium"', async function () {
      this.timeout(50000);

      const documentsToUpload = ['Comprobante de domicilio.txt', 'Comprobante de estado de cuenta.txt', 'Identificacion.txt'];
      const documentPaths = documentsToUpload.map((document) => `${__dirname}/../test/docs/${document}`);

      const documentUploadResponse = await requester.post(`/api/users/${idUsuario}/documents`).attach("documents", documentPaths[0]).attach("documents", documentPaths[1]).attach("documents", documentPaths[2]);

      expect(documentUploadResponse.status).to.equal(200);
      expect(documentUploadResponse.ok).to.equal(true);

      const response = await requester.get(`/api/users/premium/${idUsuario}`);
      const { status, ok } = response;
      expect(status).to.equal(201);
      expect(ok).to.equal(true);
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
      idproducto = body.data._id.toString();
      expect(status).to.equal(201);
      expect(ok).to.equal(true);
      expect(body.data).to.have.property('_id');
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
    let cartidtest= null;
    it('En endpoint POST /api/carts debe crear un carrito', async function () {
      this.timeout(50000);
      const response = await requester.post('/api/carts').set('Cookie', [`${cookieName}=${cookieValue}`]);
      const { status, ok, body } = response;
      expect(status).to.equal(201);
      expect(ok).to.equal(true);
      cartidtest = body.data._id.toString();
      console.log(body.data._id.toString())
    });
  });

  describe('Testing Usuarios parte 2', () => {
    const mockUsuarioUpdated = {
      email: 'nicolasarieldurelli@gmail.com',
      password: '123',
      firstName: 'nicolas2',
      lastName: 'durelli2',
      age: 50,
    };

    it('En endpoint PUT /api/users/:id debe actualizar el usuario', async function () {
      this.timeout(50000);
      const response = await requester.put(`/api/users/${idUsuario}`).send(mockUsuarioUpdated);
      const { status, ok, body } = response;
      expect(status).to.equal(201);
      expect(ok).to.equal(true);
    });

    it('En endpoint DELETE /api/users/:id debe eliminar el usuario', async function () {
      this.timeout(50000);
      const response = await requester.delete(`/api/users/${idUsuario}`);
      const { status, ok, body } = response;
      expect(status).to.equal(201);
      expect(ok).to.equal(true);
    });
  });
});
