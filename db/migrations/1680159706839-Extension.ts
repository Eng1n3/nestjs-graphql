import { MigrationInterface, QueryRunner } from 'typeorm';

module.exports = class Extension1680159706839 {
  options = { uuidExtension: 'uuid-ossp' };

  async up(queryRunner) {
    await queryRunner.query(
      `CREATE EXTENSION IF NOT EXISTS "${
        this.options.uuidExtension || 'uuid-ossp'
      }"`,
    );
  }

  async down(queryRunner) {
    await queryRunner.query(
      `DROP EXTENSION "${this.options.uuidExtension || 'uuid-ossp'}"`,
    );
  }
};
