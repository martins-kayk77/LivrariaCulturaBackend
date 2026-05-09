import { EntitySchema, Generated } from "typeorm";
const user = new EntitySchema({
    name: "user",
    tableName: "user",
    columns:{
        id: {primary: true, type:"int", generated:"increment"},
        name: {type: "varchar", length:50, nullable:false},
        password: {type: "varchar", length:255, nullable:false},
        email: {type: "varchar", length:255, nullable:false},
        typeuser: {type: "enum", enum:["admin","comum"], nullable:false},
        created_at: {type: "datetime", nullable:false, default: () => "CURRENT_TIMESTAMP"},
        deletedAt: {type: "datetime", nullable:true }
    }

});

export default user;
