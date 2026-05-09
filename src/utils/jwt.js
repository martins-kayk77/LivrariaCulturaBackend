import "dotenv/config";
import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET;

function generateToken(payload) {
  return jwt.sign(payload, secret, { expiresIn: 60 * 60 * 5 });
}

function generateResetToken(email) {
  return jwt.sign({ email, purpose: "password-reset" }, secret, {
    expiresIn: "30m",
  });
}

function verifyResetToken(token) {
  const payload = jwt.verify(token, secret);

  if (payload.purpose !== "password-reset") {
    throw new Error("Token invalido para redefinicao.");
  }

  return payload;
}

function authenticate(request, response, next) {
  const { authorization } = request.headers;

  if (!authorization) {
    return response.status(401).send({ message: "Token nao informado." });
  }

  const bearer = authorization.split(" ")[0];
  const token = authorization.split(" ")[1];

  if (bearer !== "Bearer") {
    return response.status(401).send({ message: "Token nao possui 'Bearer'." });
  }

  jwt.verify(token, secret, (err, user) => {
    if (err) {
      return response.status(401).send({ message: "Acesso nao autorizado. Token invalido." });
    }

    request.user = user;
    next();
  });
}

export { generateToken, generateResetToken, verifyResetToken, authenticate };
