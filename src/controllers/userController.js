import express from "express";
import bcrypt from "bcryptjs";
import user from "../entities/user.js";
import { AppDataSource } from "../database/data-source.js";
import { Like, IsNull } from "typeorm";
import { authenticate } from "../utils/jwt.js";

const route = express.Router();
const userRepository = AppDataSource.getRepository(user);

function sanitizeUser(userData) {
  if (!userData) return null;

  const { password, ...safeUser } = userData;
  return safeUser;
}

route.get("/profile", authenticate, async (request, response) => {
  const { email } = request.user;
  const foundUser = await userRepository.findOneBy({ email });

  if (!foundUser) {
    return response.status(404).send({ response: "Usuario nao encontrado." });
  }

  return response.status(200).send({
    users: sanitizeUser(foundUser),
  });
});

route.get("/", async (request, response) => {
  const users = await userRepository.findBy({ deletedAt: IsNull() });
  return response.status(200).send({
    response: users.map(sanitizeUser),
  });
});

route.get("/:nameFound", async (request, response) => {
  const { nameFound } = request.params;
  const foundUsers = await userRepository.findBy({
    name: Like(`%${nameFound}%`),
    deletedAt: IsNull(),
  });

  return response.status(200).send({
    response: foundUsers.map(sanitizeUser),
  });
});



route.post("/", async (request, response) => {
  const { name, email, password, typeuser } = request.body;
  const hasNumber = /\d/.test(password);
  const hasUppercase = /[A-Z]/.test(password);

  if (name.length < 4) {
    return response.status(400).send({ response: "Digite o nome completo." });
  }

  if (!email.includes("@")) {
    return response.status(400).send({ response: "Formato incorreto." });
  }

  if (password.length < 6) {
    return response.status(400).send({ response: "A senha deve ter no minimo 6 caracteres." });
  }

  if (!hasNumber) {
    return response.status(400).send({ response: "A senha deve conter numero." });
  }

  if (!hasUppercase) {
    return response.status(400).send({ response: "A senha deve conter letra maiuscula." });
  }

  if (typeuser !== "admin" && typeuser !== "comum") {
    return response.status(400).send({ response: "Usuario invalido." });
  }

  const existingUser = await userRepository.findOneBy({
  email,
  deletedAt: IsNull()
});

if (existingUser) {
  return response.status(400).send({ response: "Ja existe um usuario com este email." });
}

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = userRepository.create({
    name,
    email,
    password: hashedPassword,
    typeuser,
  });

  await userRepository.save(newUser);

  return response.status(201).send({ response: "Usuario cadastrado com sucesso." });
});

route.put("/", async (request, response) => {
  const { id, name, email, password, typeuser } = request.body;
  const hasNumber = /\d/.test(password);
  const hasUppercase = /[A-Z]/.test(password);

  if (typeof id !== "number") {
    return response.status(400).send({ response: "Campo 'id' deve ser numerico." });
  }

  if (name.length < 4) {
    return response.status(400).send({ response: "Digite o nome completo." });
  }

  if (!email.includes("@")) {
    return response.status(400).send({ response: "Formato incorreto." });
  }

  if (password.length < 6) {
    return response.status(400).send({ response: "A senha deve ter no minimo 6 caracteres." });
  }

  if (!hasNumber) {
    return response.status(400).send({ response: "A senha deve conter numero." });
  }

  if (!hasUppercase) {
    return response.status(400).send({ response: "A senha deve conter letra maiuscula." });
  }

  if (typeuser !== "admin" && typeuser !== "comum") {
    return response.status(400).send({ response: "Usuario invalido." });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await userRepository.update(
    { id },
    { name, email, password: hashedPassword, typeuser }
  );

  return response.status(200).send({ message: "Usuario atualizado com sucesso!" });
});

route.delete("/:id", async (request, response) => {
  const { id } = request.params;

  if (isNaN(id)) {
    return response.status(400).send({ response: "O 'id' precisa ser numerico." });
  }

  await userRepository.update({ id }, { deletedAt: () => "CURRENT_TIMESTAMP" });

  return response.status(200).send({ response: "Usuario deletado com sucesso." });
});

export default route;
