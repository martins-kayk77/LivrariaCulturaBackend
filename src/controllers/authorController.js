import express, { request, response } from "express";
import { AppDataSource } from "../database/data-source.js";
import author from "../entities/author.js";
import {Like, IsNull} from "typeorm";
import { authenticate } from "../utils/jwt.js";

const route = express.Router();
const authorRepository = AppDataSource.getRepository(author);

route.get("/",async (request, response) => {
   const authors = await authorRepository.findBy({deletedAt:
    IsNull()});
    return response.status(200).send({"response":authors});
});

route.get("/:nameFound",async(request, response)=>{
    const {nameFound} = request.params;
    const authorFound = await authorRepository.findBy({nome_autor: Like
        (`%${nameFound}%`)});
    return response.status(200).send({"response": authorFound});
})

route.post("/", authenticate, async(request, response) =>{
    const {nome_autor, nasc_autor, nascionalidade } = request.body;

    if(nome_autor.length < 1){
        return response.status(400).send({"response":"O nome do autor deve contem no minimo 1 caractere."});
    }
    if(nasc_autor.length !== 10){
        return response.status(400).send({"response":"O campo de data deve estar no formato aaaa-mm-dd"});
    }
    if(nascionalidade.length < 1){
        return response.status(400).send({"response":"Digite no minimo 1 caractere"});
    }

    const newAuthor = authorRepository.create({nome_autor, nasc_autor, nascionalidade});
    await authorRepository.save(newAuthor)
    
    return response.status(201).send({"response":"Autor cadastrado com sucesso"})
});


route.put('/:codigo_autor', authenticate, async(request, response)=> {
    const{nome_autor, nasc_autor, nascionalidade,} = request.body;
    const {codigo_autor} = request.params;

    if(isNaN (codigo_autor)){
        return response.status(400).send({"response":"Campo de 'codigo' deve ser numerico"})
    }
    
    if(nome_autor.length < 1){
        return response.status(400).send({"response":"Campo de nome deve ter pelo menos uma carectere."});
    }
    if(nasc_autor.length !== 10){
        return response.status(400).send({"response":"O formato deve ser aaaa-mm-dd."})
    }
    if(nascionalidade.length < 1){
        return response.status(400).send({"response":"O campo de nascionalidade deve conter 1 caractere."})
    }
    
    await authorRepository.update({codigo_autor},{nome_autor,nasc_autor,nascionalidade});

    return response.status(200).send({"message":"Autor atualizado com sucesso!"});

});




route.delete('/:codigo_autor', authenticate, async (request, response) => {
    const {codigo_autor} = request.params;

    if(isNaN(codigo_autor)){
        response.status(400).send({"response":"O codigo do autor precisa ser numerico"});
    }
    await authorRepository.update({codigo_autor},
    {deletedAt: () => "CURRENT_TIMESTAMP"});

    return response.status(200).send({"response":"Autor deletado com sucesso"});

});




export default route
