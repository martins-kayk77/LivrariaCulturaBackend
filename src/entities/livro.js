import { EntitySchema } from "typeorm";

const livro = new EntitySchema({
    name: "livro",
    tableName: "livro",
    columns: {
        id: {primary: true, type: "int",generated: true},
        nome_livro: {type: "varchar", length: "45", nullable: false},
        publicacao: {type: "date", nullable: false},
        pages: {type: "int",nullable: false},
        price: {type:"decimal", precision:6, scale:2, nullable: false},
        createAt: {type:"datetime", nullable: false, default: () => "CURRENT_TIMESTAMP"},
        deleteAt: {type: "datetime", nullable: true}
    },
    relations: {
        category: {type: "many-to-one", target: "category", nullable: false},
        publishers: {type: "many-to-one", target: "publishers", nullable: false}
    },
})

export default livro;