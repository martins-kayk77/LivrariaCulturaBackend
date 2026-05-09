import { EntitySchema } from "typeorm";

const livro_autor = new EntitySchema({
    name:"livro_autor",
    tableName: "livro_autor",
    columns: {
        autorId: {primary:true, type:Number, nullable:false},
        livroId: {primary:true, type:Number, nullable:false},
        createAt: {
            type: "datetime",
            nullable: false,
            default: () => "CURRENT_TIMESTAMP",
        },
        deleteAt: {type:"datetime", nullable:true},
    },
    relations:{
        author: {type: "many-to-one", target: "author", nullable: false},
        livro: {type: "many-to-one", target: "livro", nullable: false},
    },
});

export default livro_autor;