import express from "express";
import livro from "../entities/livro.js";
import Category from "../entities/category.js";
import publishers from "../entities/publishers.js";
import { AppDataSource } from "../database/data-source.js";
import { Like, IsNull } from "typeorm";

const route = express.Router();

const livroRepository = AppDataSource.getRepository(livro);
const categoryRepository = AppDataSource.getRepository(Category);
const publishersRepository = AppDataSource.getRepository(publishers);

route.post("/", async (request, response) => {
  const { nome_livro, publicacao, pages, price, codigo_categoria, codigo_editora } = request.body;
  const normalizedPrice = String(price).replace(",", ".");

  if (nome_livro.length < 1) {
    return response.status(400).send({ response: "Campo 'book_name' deve ter pelo menos um caractere." });
  }

  if (publicacao.length !== 10) {
    return response.status(400).send({ response: "Formato invalido" });
  }

  if (isNaN(pages)) {
    return response.status(400).send({ response: "O campo de Pagina deve ser numerico" });
  }

  if (isNaN(Number(normalizedPrice))) {
    return response.status(400).send({ response: "O campo preco deve ser numerico" });
  }

  try {
    const publisherFound = await publishersRepository.findOneBy({
      codigo_editora,
      deletedAt: IsNull(),
    });

    if (!publisherFound) {
      return response.status(400).send({ response: "Editora informada nao encontrada." });
    }

    const categoryFound = await categoryRepository.findOneBy({
      codigo_categoria,
      deletedAt: IsNull(),
    });

    if (!categoryFound) {
      return response.status(400).send({ response: "Categoria informada nao encontrada." });
    }

    const newLivro = livroRepository.create({
      nome_livro,
      publicacao,
      pages,
      price: normalizedPrice,
      publishers: publisherFound,
      category: categoryFound,
    });

    await livroRepository.save(newLivro);
    return response.status(201).send({ response: "Livro cadastrado com sucesso." });
  } catch (err) {
    return response.status(500).send({ response: "Erro interno do servidor" });
  }
});

route.get("/", async (request, response) => {
  const livross = await livroRepository.findBy({ deleteAt: IsNull() });
  return response.status(200).send({ response: livross });
});

route.get("/:nameFound", async (request, response) => {
  const { nameFound } = request.params;
  const livroFound = await livroRepository.findBy({
    nome_livro: Like(`%${nameFound}%`),
  });

  return response.status(200).send({ response: livroFound });
});

route.put("/:id", async (request, response) => {
  const { nome_livro, publicacao, pages, price, codigo_categoria, codigo_editora } = request.body;
  const { id } = request.params;
  const normalizedPrice = String(price).replace(",", ".");

  if (nome_livro.length < 1) {
    return response.status(400).send({ response: "Campo de nome deve ter pelo menos um caractere." });
  }

  if (publicacao.length !== 10) {
    return response.status(400).send({ response: "Formato invalido" });
  }

  if (isNaN(pages)) {
    return response.status(400).send({ response: "O campo de Pagina deve ser numerico" });
  }

  if (isNaN(Number(normalizedPrice))) {
    return response.status(400).send({ response: "O campo preco deve ser numerico" });
  }

  try {
    const publisherFound = await publishersRepository.findOneBy({
      codigo_editora,
      deletedAt: IsNull(),
    });

    if (!publisherFound) {
      return response.status(400).send({ response: "Editora informada nao encontrada." });
    }

    const categoryFound = await categoryRepository.findOneBy({
      codigo_categoria,
      deletedAt: IsNull(),
    });

    if (!categoryFound) {
      return response.status(400).send({ response: "Categoria informada nao encontrada." });
    }

    if (isNaN(id)) {
      return response.status(400).send({ response: "Campo de 'id' deve ser numerico" });
    }

    await livroRepository.update(
      { id },
      {
        nome_livro,
        publicacao,
        pages,
        price: normalizedPrice,
        publishers: publisherFound,
        category: categoryFound,
      }
    );

    return response.status(201).send({ response: "Livro atualizado com sucesso!!" });
  } catch (err) {
    return response.status(500).send({ response: "Erro interno do servidor" });
  }
});

route.delete("/:id", async (request, response) => {
  const { id } = request.params;

  if (isNaN(id)) {
    return response.status(400).send({ response: "O id precisa ser numerico" });
  }

  await livroRepository.update({ id }, { deleteAt: () => "CURRENT_TIMESTAMP" });

  return response.status(200).send({ response: "Livro deletado com sucesso" });
});

export default route;
