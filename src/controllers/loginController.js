import express from "express";
import bcrypt from "bcryptjs";
import user from "../entities/user.js";
import { AppDataSource } from "../database/data-source.js";
import { IsNull } from "typeorm";
import {
  generateToken,
  generateResetToken,
  verifyResetToken,
} from "../utils/jwt.js";
import { sendResetEmail } from "../helpers/nodemailer.js";

const route = express.Router();
const userRepository = AppDataSource.getRepository(user);

route.post("/", async (request, response) => {
  const { email, password } = request.body;

  if (!email.includes("@")) {
    return response.status(400).send({ response: "Formato de email invalido." });
  }

  if (password.length < 6) {
    return response.status(400).send({ response: "A senha deve ter no minimo 6 caracteres." });
  }

  const foundUser = await userRepository.findOneBy({ email, deletedAt: IsNull() });

  if (!foundUser) {
    return response.status(401).send({ response: "Usuario ou senha invalidos." });
  }

  const isValidPassword = await bcrypt.compare(password, foundUser.password);

  if (!isValidPassword) {
    return response.status(401).send({ response: "Usuario ou senha invalidos." });
  }

  const token = generateToken({
    user: foundUser.name,
    email: foundUser.email,
    typeuser: foundUser.typeuser,
  });

  return response.status(200).send({ response: "Login realizado com sucesso.", token });
});

route.put("/reset", async (request, response) => {
  const { email } = request.body;
  const foundUser = await userRepository.findOneBy({ email, deletedAt: IsNull() });

  if (!foundUser) {
    return response.status(400).send({ response: "Usuario nao encontrado." });
  }

  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const token = generateResetToken(foundUser.email);
  const resetLink = `${frontendUrl}/redefinir-senha?token=${token}`;

  sendResetEmail(resetLink, foundUser.email);

  return response.status(200).send({
    response: "Link de redefinicao enviado para o email cadastrado.",
  });
});

route.put("/reset/confirm", async (request, response) => {
  const { token, password } = request.body;

  if (!token) {
    return response.status(400).send({ response: "Token nao informado." });
  }

  if (!password || password.length < 6) {
    return response.status(400).send({ response: "A senha deve ter no minimo 6 caracteres." });
  }

  const hasNumber = /\d/.test(password);
  const hasUppercase = /[A-Z]/.test(password);

  if (!hasNumber) {
    return response.status(400).send({ response: "A senha deve conter numero." });
  }

  if (!hasUppercase) {
    return response.status(400).send({ response: "A senha deve conter letra maiuscula." });
  }

  try {
    const payload = verifyResetToken(token);
    const foundUser = await userRepository.findOneBy({
      email: payload.email,
      deletedAt: IsNull(),
    });

    if (!foundUser) {
      return response.status(400).send({ response: "Usuario nao encontrado." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await userRepository.update({ email: payload.email }, { password: hashedPassword });

    return response.status(200).send({ response: "Senha redefinida com sucesso." });
  } catch (err) {
    return response.status(400).send({ response: "Link invalido ou expirado." });
  }
});

export default route;
