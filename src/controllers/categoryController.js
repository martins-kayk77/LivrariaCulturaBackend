import express, { request, response } from "express";
import { AppDataSource } from "../database/data-source.js";
import category from "../entities/category.js";
import {Like, IsNull} from "typeorm";

const route = express.Router();
const categoryRepository = AppDataSource.getRepository(category);

route.get("/",async (request, response) => {
   const categorys = await categoryRepository.findBy({deletedAt:
    IsNull()});
    return response.status(200).send({"response":categorys});
});



route.get("/:nameFound",async(request, response)=>{
    const {nameFound} = request.params;
    const categoryFound = await categoryRepository.findBy({nome_categoria: Like
        (`%${nameFound}%`)});
    return response.status(200).send({"response": categoryFound});
});

route.post("/", async(request, response) =>{
    const { nome_categoria } = request.body;

    if(nome_categoria.length < 1){
        return response.status(400).send({"response":"O nome da Categoria deve contem no minimo 1 caractere."});
    }
    

    const newCategory = categoryRepository.create({nome_categoria});
    await categoryRepository.save(newCategory)
    
    return response.status(201).send({"response":"Categoria cadastrada com sucesso"})
});


route.put('/:codigo_categoria',async(request, response)=> {
    const{nome_categoria} = request.body;
    const {codigo_categoria} = request.params;

    if(isNaN (codigo_categoria)){
        return response.status(400).send({"response":"Campo de 'codigo' deve ser numerico"})
    }
    
    if(nome_categoria.length < 1){
        return response.status(400).send({"response":"Campo de nome deve ter pelo menos uma carectere."});
    }
   
    
    await categoryRepository.update({codigo_categoria},{nome_categoria});

    return response.status(200).send({"message":"Categoria atualizado com sucesso!"});

});


route.delete('/:codigo_categoria',async (request, response) => {
    const {codigo_categoria} = request.params;

    if(isNaN(codigo_categoria)){
        response.status(400).send({"response":"O codigo da Categoria precisa ser numerico"});
    }
    await categoryRepository.update({codigo_categoria},
    {deletedAt: () => "CURRENT_TIMESTAMP"});

    return response.status(200).send({"response":"Categoria deletada com sucesso"});

});






















export default route