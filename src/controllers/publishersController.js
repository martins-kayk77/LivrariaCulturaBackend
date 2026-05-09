import express, { request, response } from "express";
import { AppDataSource } from "../database/data-source.js";
import publishers from "../entities/publishers.js";
import {Like, IsNull} from "typeorm";

const route = express.Router();
const publishersRepository = AppDataSource.getRepository(publishers);

route.get("/",async (request, response) => {
   const publishersS = await publishersRepository.findBy({deletedAt:
    IsNull()});
    return response.status(200).send({"response":publishersS});
});


route.get("/:nameFound",async(request, response)=>{
    const {nameFound} = request.params;
    const publishersFound = await publishersRepository.findBy({nome_editora: Like
        (`%${nameFound}%`)});
    return response.status(200).send({"response": publishersFound});
});


route.post("/", async(request, response) =>{
    const {nome_editora, cnpj, email } = request.body;
    const cnpjNumbers = cnpj.replace(/\D/g, "");

    if(nome_editora.length < 1){
        return response.status(400).send({"response":"O nome da Editora deve contem no minimo 1 caractere."});
    }
    if(cnpjNumbers.length !== 14){
        return response.status(400).send({"response":"Digite um CNPJ valido com 14 numeros."});
    }
    if(!email.includes('@')){
        return response.status(400).send({"response":"formato incorreto."})
    }

    const newPublishers = publishersRepository.create({nome_editora, cnpj, email});
    await publishersRepository.save(newPublishers)
    
    return response.status(201).send({"response":"Editora cadastrada com sucesso"})
});


route.put('/:codigo_editora',async(request, response)=> {
    const{nome_editora, email, cnpj,} = request.body;
    const {codigo_editora} = request.params;
    const cnpjNumbers = cnpj.replace(/\D/g, "");

    if(isNaN (codigo_editora)){
        return response.status(400).send({"response":"Campo de 'codigo' deve ser numerico"})
    }
    
    if(nome_editora.length < 1){
        return response.status(400).send({"response":"Campo de nome deve ter pelo menos uma carectere."});
    }
    if(!email.includes('@')){
        return response.status(400).send({"response":"formato incorreto."})
    }
    if(cnpjNumbers.length !== 14){
        return response.status(400).send({"response":"Digite um CNPJ valido com 14 numeros."});
    }
    
    await publishersRepository.update({codigo_editora},{nome_editora,cnpj,email});

    return response.status(200).send({"message":"Editora atualizada com sucesso!"});

});


route.delete('/:codigo_editora',async (request, response) => {
    const {codigo_editora} = request.params;

    if(isNaN(codigo_editora)){
        response.status(400).send({"response":"O codigo da Editora precisa ser numerico"});
    }
    await publishersRepository.update({codigo_editora},
    {deletedAt: () => "CURRENT_TIMESTAMP"});

    return response.status(200).send({"response":"Editora deletado com sucesso"});

});

export default route
