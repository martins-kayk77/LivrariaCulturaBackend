import { EntitySchema, Generated } from "typeorm";
const author = new EntitySchema({
    name: "author",
    tableName: "author",
    columns:{
        codigo_autor: {primary: true, type:"int", generated:"increment"},
        nome_autor: {type: "varchar", length:45, nullable:false},
        nasc_autor: {type: "date", nullable:false},
        nascionalidade: {type: "varchar", length:45, nullable:false},
        created_at: {type: "datetime", nullable:false, default: () => "CURRENT_TIMESTAMP"},
        deletedAt: {type: "datetime", nullable:true }
    }
});
export default author;