import express from "express";
import userController from "./controllers/userController.js";
import authorController from "./controllers/authorController.js";
import categoryController from "./controllers/categoryController.js";
import publishersController from "./controllers/publishersController.js";
import livroController from "./controllers/livroController.js";
import loginController from "./controllers/loginController.js";


const routes = express();

routes.use("/user", userController);

routes.use("/author", authorController);

routes.use("/category", categoryController);

routes.use("/publishers", publishersController);

routes.use("/livro", livroController);

routes.use("/login", loginController);

export default routes;
