import express from "express";
import routes from "./routes.js";
import { AppDataSource } from "./database/data-source.js"; 
import cors from 'cors';

const port = process.env.PORT || 3333;
const server = express();
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map((item) => item.trim())
  : true;

server.use(express.json());
server.use(cors({
  origin: allowedOrigins,
}));

server.get("/health", (request, response) => {
  return response.status(200).send({ response: "ok" });
});

server.use("/", routes);

AppDataSource.initialize().then(async() =>{
    console.log("banco funcionando");

server.listen(port, () => {
    console.log(`Servidor esta funcionando na porta ${port}!`);
});

}).catch((err) => {
  console.error("Erro ao conectar com o banco:", err);
});


