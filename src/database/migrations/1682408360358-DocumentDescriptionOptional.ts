import { MigrationInterface, QueryRunner } from 'typeorm';

export class DocumentDescriptionOptional1682408360358
  implements MigrationInterface
{
  name = 'DocumentDescriptionOptional1682408360358';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "document" ALTER COLUMN "description" DROP NOT NULL`,
    );
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "document" ALTER COLUMN "description" SET NOT NULL`,
    );
  }
}
