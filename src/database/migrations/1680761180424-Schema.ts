import { MigrationInterface, QueryRunner } from 'typeorm';

export class Schema1680761180424 implements MigrationInterface {
  name = 'Schema1680761180424';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "priority" ("idPriority" character varying NOT NULL, "name" character varying NOT NULL, "description" text NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_9658b4dbb2043a4517d7d0e6621" UNIQUE ("name"), CONSTRAINT "PK_971e90a9f51d46e149fc78cd71a" PRIMARY KEY ("idPriority"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("idUser" character varying NOT NULL, "email" character varying(100) NOT NULL, "password" character varying(100) NOT NULL, "fullname" character varying(100), "birthDay" TIMESTAMP WITH TIME ZONE, "pathImage" text NOT NULL, "role" character varying(50) NOT NULL, "bio" text, "homepage" character varying(100), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_c815460ecf7189b12a7ddd2d635" PRIMARY KEY ("idUser"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "project" ("idProject" character varying NOT NULL, "projectName" character varying NOT NULL, "description" text NOT NULL, "deadLine" TIMESTAMP WITH TIME ZONE NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "idUser" character varying, "priority" character varying, CONSTRAINT "PK_270e1677e3c885da49d0a75871e" PRIMARY KEY ("idProject"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "document" ("idDocument" character varying NOT NULL, "documentName" character varying(50) NOT NULL, "pathDocument" text NOT NULL, "description" text NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "idProject" character varying, CONSTRAINT "PK_3775578e57fb6ca889a3a661f6e" PRIMARY KEY ("idDocument"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ADD CONSTRAINT "FK_b9669a6730a3361e81eed71a9df" FOREIGN KEY ("idUser") REFERENCES "user"("idUser") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ADD CONSTRAINT "FK_0daad8c8bfe716495f566a26d66" FOREIGN KEY ("priority") REFERENCES "priority"("idPriority") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "document" ADD CONSTRAINT "FK_97057ace2ca7c3536415dc00418" FOREIGN KEY ("idProject") REFERENCES "project"("idProject") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "document" DROP CONSTRAINT "FK_97057ace2ca7c3536415dc00418"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" DROP CONSTRAINT "FK_0daad8c8bfe716495f566a26d66"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" DROP CONSTRAINT "FK_b9669a6730a3361e81eed71a9df"`,
    );
    await queryRunner.query(`DROP TABLE "document"`);
    await queryRunner.query(`DROP TABLE "project"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "priority"`);
  }
}
