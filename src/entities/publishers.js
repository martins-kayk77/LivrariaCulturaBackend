import { EntitySchema, Generated } from "typeorm";
const publishers = new EntitySchema({
    name: "publishers",
    tableName: "publishers",
    columns:{
        codigo_editora: {primary: true, type:"int", generated:"increment"},
        nome_editora: {type: "varchar", length:100, nullable:false},
        cnpj: {type: "varchar", length:45, nullable:false},
        email: {type: "varchar", length:100, nullable:false},
        created_at: {type: "datetime", nullable:false, default: () => "CURRENT_TIMESTAMP"},
        deletedAt: {type: "datetime", nullable:true }
    }

});

export default publishers;
