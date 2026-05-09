const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class PasswordHash1774740000000 {
    name = "PasswordHash1774740000000"

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`password\` \`password\` varchar(255) NOT NULL`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`password\` \`password\` varchar(50) NOT NULL`);
    }
}
