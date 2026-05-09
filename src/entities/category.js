import { EntitySchema, Generated } from "typeorm";
const category = new EntitySchema({
    name: "category",
    tableName: "category",
    columns:{
       codigo_categoria: {primary: true, type:"int", generated:"increment"},
       nome_categoria: {type: "varchar", length:45, nullable:false},
       created_at: {type: "datetime", nullable:false, default: () => "CURRENT_TIMESTAMP"},
        deletedAt: {type: "datetime", nullable:true }
    }
});
export default category;