const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class Db1761347804025 {
    name = 'Db1761347804025'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(50) NOT NULL, \`password\` varchar(50) NOT NULL, \`email\` varchar(255) NOT NULL, \`typeuser\` enum ('admin', 'comum') NOT NULL, \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`deletedAt\` datetime NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`publishers\` (\`codigo_editora\` int NOT NULL AUTO_INCREMENT, \`nome_editora\` varchar(100) NOT NULL, \`cnpj\` varchar(45) NOT NULL, \`email\` varchar(100) NOT NULL, \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`deletedAt\` datetime NULL, PRIMARY KEY (\`codigo_editora\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`profile\` (\`id\` int NOT NULL AUTO_INCREMENT, \`url_photo_profile\` varchar(250) NOT NULL, \`userId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`livro_autor\` (\`autorId\` int NOT NULL, \`livroId\` int NOT NULL, \`createAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`deleteAt\` datetime NULL, \`authorCodigoAutor\` int NOT NULL, PRIMARY KEY (\`autorId\`, \`livroId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`livro\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nome_livro\` varchar(45) NOT NULL, \`publicacao\` date NOT NULL, \`pages\` int NOT NULL, \`price\` decimal(6,2) NOT NULL, \`createAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`deleteAt\` datetime NULL, \`categoryCodigoCategoria\` int NOT NULL, \`publishersCodigoEditora\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`category\` (\`codigo_categoria\` int NOT NULL AUTO_INCREMENT, \`nome_categoria\` varchar(45) NOT NULL, \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`deletedAt\` datetime NULL, PRIMARY KEY (\`codigo_categoria\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`author\` (\`codigo_autor\` int NOT NULL AUTO_INCREMENT, \`nome_autor\` varchar(45) NOT NULL, \`nasc_autor\` date NOT NULL, \`nascionalidade\` varchar(45) NOT NULL, \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`deletedAt\` datetime NULL, PRIMARY KEY (\`codigo_autor\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`profile\` ADD CONSTRAINT \`FK_a24972ebd73b106250713dcddd9\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`livro_autor\` ADD CONSTRAINT \`FK_c5eeee110ee3c1736bd89f2bdc8\` FOREIGN KEY (\`authorCodigoAutor\`) REFERENCES \`author\`(\`codigo_autor\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`livro_autor\` ADD CONSTRAINT \`FK_1d62d7f2f9cebcc3f65a2bc1c4f\` FOREIGN KEY (\`livroId\`) REFERENCES \`livro\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`livro\` ADD CONSTRAINT \`FK_8d4c84544baed3fe26771c10b09\` FOREIGN KEY (\`categoryCodigoCategoria\`) REFERENCES \`category\`(\`codigo_categoria\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`livro\` ADD CONSTRAINT \`FK_d03bd9a0226483977abb1dc245e\` FOREIGN KEY (\`publishersCodigoEditora\`) REFERENCES \`publishers\`(\`codigo_editora\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`livro\` DROP FOREIGN KEY \`FK_d03bd9a0226483977abb1dc245e\``);
        await queryRunner.query(`ALTER TABLE \`livro\` DROP FOREIGN KEY \`FK_8d4c84544baed3fe26771c10b09\``);
        await queryRunner.query(`ALTER TABLE \`livro_autor\` DROP FOREIGN KEY \`FK_1d62d7f2f9cebcc3f65a2bc1c4f\``);
        await queryRunner.query(`ALTER TABLE \`livro_autor\` DROP FOREIGN KEY \`FK_c5eeee110ee3c1736bd89f2bdc8\``);
        await queryRunner.query(`ALTER TABLE \`profile\` DROP FOREIGN KEY \`FK_a24972ebd73b106250713dcddd9\``);
        await queryRunner.query(`DROP TABLE \`author\``);
        await queryRunner.query(`DROP TABLE \`category\``);
        await queryRunner.query(`DROP TABLE \`livro\``);
        await queryRunner.query(`DROP TABLE \`livro_autor\``);
        await queryRunner.query(`DROP TABLE \`profile\``);
        await queryRunner.query(`DROP TABLE \`publishers\``);
        await queryRunner.query(`DROP TABLE \`user\``);
    }
}
