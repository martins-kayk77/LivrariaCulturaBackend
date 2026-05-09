import { EntitySchema } from "typeorm";

const profile = new EntitySchema({
    name:"profile",
    tableName:"profile",
    columns: {
        id: {primary: true, type: "int", generated: true},
        url_photo_profile: {type: "varchar", length:250, nullable:false},
    },
    relations: {
        user: {type: "many-to-one", target: "user", nullable:false}
    },
});


export default profile;