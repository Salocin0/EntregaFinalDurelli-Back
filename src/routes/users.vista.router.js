import express from "express";
import { userService } from "../services/users.service.js";
import UsersDTO from "../DAO/DTO/users.dto.js";
import { checkAdmin } from '../middlewares/auth.js';

export const routerVistaUsers = express.Router();

routerVistaUsers.get("/", checkAdmin,async (req, res) => {
  const users = await userService.getAllUsers()
  res.status(200).render("allUsers", {
    users: users?.map((user) => ({
          firstName: user.firstName,
          email: user.email,
          rol: user.rol,
          id: user.id,
      })),
  });
});

routerVistaUsers.get("/editDelete/:id", checkAdmin,async (req, res) => {
  const id = req.params.id;
  const user = await userService.getOneUser(id)
  const userOut={
    firstName: user.firstName,
    email: user.email,
    rol: user.rol,
    id: user.id,
  }
  res.status(200).render("deleteOldUsers", {
    user: userOut,
  });
});
