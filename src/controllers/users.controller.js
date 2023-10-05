import { userService } from '../services/users.service.js';
import CustomError from '../services/errors/custom-error.js';
import EErrors from '../services/errors/enums.js';


class UserController {
  async getAll(req, res) {
    try {
      const users = await userService.getAllUsers();
      if (users.length !== 0) {
        return res.status(200).json({
          status: 'success',
          msg: 'listado de usuarios',
          data: users,
        });
      } else {
        CustomError.createError({
          name: 'Error Entrada Invalida',
          cause: 'Parametros Faltantes o incorrectos.',
          message: 'Algunos de los parámetros requeridos están ausentes o son incorrectos para completar la petición.',
          code: EErrors.INVALID_INPUT_ERROR,
        });
      }
    } catch (e) {
      CustomError.createError({
        name: 'Error Del Servidor',
        cause: 'Ocurrió un error inesperado en el servidor. La operación no pudo completarse.',
        message: 'Lo sentimos, ha ocurrido un error inesperado en el servidor. Por favor, contacta al equipo de soporte.',
        code: EErrors.ERROR_INTERNO_SERVIDOR,
      });
    }
  }

  async getOne(req, res) {
    try {
      const { id } = req.params;
      const user = await userService.getOneUser(id);
      if (user) {
        return res.status(200).json({
          status: 'success',
          msg: 'usuario encontrado',
          data: user,
        });
      } else {
        CustomError.createError({
          name: 'Error Entrada Invalida',
          cause: 'Parametros Faltantes o incorrectos.',
          message: 'Algunos de los parámetros requeridos están ausentes o son incorrectos para completar la petición.',
          code: EErrors.INVALID_INPUT_ERROR,
        });
      }
    } catch (e) {
      CustomError.createError({
        name: 'Error Del Servidor',
        cause: 'Ocurrió un error inesperado en el servidor. La operación no pudo completarse.',
        message: 'Lo sentimos, ha ocurrido un error inesperado en el servidor. Por favor, contacta al equipo de soporte.',
        code: EErrors.ERROR_INTERNO_SERVIDOR,
      });
    }
  }

  async create(req, res) {
    try {
      const { firstName, lastName, email, age, password } = req.body;
      const userCreated = await userService.createUser(firstName, lastName, email, age, password);
      return res.status(201).json({
        status: 'success',
        msg: 'user created',
        data: userCreated,
      });
    } catch (e) {
      console.log(e);
      CustomError.createError({
        name: 'Error Del Servidor',
        cause: 'Ocurrió un error inesperado en el servidor. La operación no pudo completarse.',
        message: 'Lo sentimos, ha ocurrido un error inesperado en el servidor. Por favor, contacta al equipo de soporte.',
        code: EErrors.ERROR_INTERNO_SERVIDOR,
      });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { firstName, lastName, email } = req.body;
      const userUptaded = await userService.updateUser(id, firstName, lastName, email);
      return res.status(201).json({
        status: 'success',
        msg: 'user uptaded',
        data: userUptaded,
      });
    } catch (e) {
      CustomError.createError({
        name: 'Error Del Servidor',
        cause: 'Ocurrió un error inesperado en el servidor. La operación no pudo completarse.',
        message: 'Lo sentimos, ha ocurrido un error inesperado en el servidor. Por favor, contacta al equipo de soporte.',
        code: EErrors.ERROR_INTERNO_SERVIDOR,
      });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await userService.deleteUser(id);
      return res.status(200).json({
        status: 'success',
        msg: 'user deleted',
        data: deleted,
      });
    } catch (e) {
      CustomError.createError({
        name: 'Error Del Servidor',
        cause: 'Ocurrió un error inesperado en el servidor. La operación no pudo completarse.',
        message: 'Lo sentimos, ha ocurrido un error inesperado en el servidor. Por favor, contacta al equipo de soporte.',
        code: EErrors.ERROR_INTERNO_SERVIDOR,
      });
    }
  }

  async changerol(req, res) {
    try {
      const { uid } = req.params;
      const changed = await userService.changerol(uid);
      if (changed) {
        return res.status(201).json({
          status: 'success',
          msg: 'user rol change',
          data: changed,
        });
      }else{
        return res.status(400).json({
          status: 'error',
          msg: 'faltan documentos para pasar a premium',
          data: changed,
        });
      }
    } catch (e) {
      console.log(e);
      CustomError.createError({
        name: 'Error Del Servidor',
        cause: 'Ocurrió un error inesperado en el servidor. La operación no pudo completarse.',
        message: 'Lo sentimos, ha ocurrido un error inesperado en el servidor. Por favor, contacta al equipo de soporte.',
        code: EErrors.SERVER_ERROR,
      });
    }
  }

  async documents(req, res) {
    try {
      const { uid } = req.params;
      const { files } = req;

      const documentos = userService.documents(uid,files);

      if (documentos) {
        return res.status(200).json({
          status: 'success',
          msg: 'Document uploaded',
          data: documentos,
        });
      }

    } catch (e) {
      console.log(e);
      CustomError.createError({
        name: 'Error Del Servidor',
        cause: 'Ocurrió un error inesperado en el servidor. La operación no pudo completarse.',
        message: 'Lo sentimos, ha ocurrido un error inesperado en el servidor. Por favor, contacta al equipo de soporte.',
        code: EErrors.SERVER_ERROR,
      });
    }
  }
}

export const userController = new UserController();
