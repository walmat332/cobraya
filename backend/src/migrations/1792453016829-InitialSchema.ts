import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1792453016829 implements MigrationInterface {
  name = 'InitialSchema1792453016829';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "company" ("id" varchar PRIMARY KEY NOT NULL, "ruc" varchar NOT NULL, "razonSocial" varchar NOT NULL, "address" varchar, "sunatEnvironment" varchar NOT NULL DEFAULT ('DEMO'), CONSTRAINT "UQ_ff7cf4a7fea3ee1088f54b8845f" UNIQUE ("ruc"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" varchar PRIMARY KEY NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, "role" varchar NOT NULL DEFAULT ('ADMIN'), "companyId" varchar NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "product" ("id" varchar PRIMARY KEY NOT NULL, "companyId" varchar NOT NULL, "type" varchar NOT NULL DEFAULT ('PRODUCT'), "name" varchar NOT NULL, "code" varchar, "price" decimal(10,2) NOT NULL, "igvIncluded" boolean NOT NULL DEFAULT true)`,
    );
    await queryRunner.query(
      `CREATE TABLE "document" ("id" varchar PRIMARY KEY NOT NULL, "companyId" varchar NOT NULL, "series" varchar(4) NOT NULL, "number" integer NOT NULL, "documentType" varchar(20) NOT NULL, "customerName" varchar, "customerDocument" varchar, "customerDocumentType" varchar, "subtotal" real NOT NULL, "igv" real NOT NULL, "total" real NOT NULL, "status" varchar NOT NULL DEFAULT ('EMITIDO'), "createdAt" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
    );
    await queryRunner.query(
      `CREATE TABLE "document_item" ("id" varchar PRIMARY KEY NOT NULL, "companyId" varchar NOT NULL, "documentId" varchar NOT NULL, "description" varchar NOT NULL, "quantity" real NOT NULL, "unitPrice" real NOT NULL, "subtotal" real NOT NULL, "igv" real NOT NULL, "total" real NOT NULL, "productId" varchar)`,
    );
    await queryRunner.query(
      `CREATE TABLE "document_sequence" ("id" varchar PRIMARY KEY NOT NULL, "companyId" varchar NOT NULL, "series" varchar(4) NOT NULL, "documentType" varchar(20) NOT NULL, "currentNumber" integer NOT NULL DEFAULT 0, "nextNumber" integer NOT NULL DEFAULT 1, CONSTRAINT "UQ_49a5c7d4a47f669b1a4116887b5" UNIQUE ("companyId", "series"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "customer" ("id" varchar PRIMARY KEY NOT NULL, "companyId" varchar NOT NULL, "documentType" varchar NOT NULL DEFAULT ('DNI'), "documentNumber" varchar NOT NULL, "name" varchar NOT NULL, "address" varchar, "email" varchar)`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_user" ("id" varchar PRIMARY KEY NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, "role" varchar NOT NULL DEFAULT ('ADMIN'), "companyId" varchar NOT NULL, UNIQUE ("email"), CONSTRAINT "FK_86586021a26d1180b0968f98502" FOREIGN KEY ("companyId") REFERENCES "company" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_user"("id", "email", "password", "role", "companyId") SELECT "id", "email", "password", "role", "companyId" FROM "user"`,
    );
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`ALTER TABLE "temporary_user" RENAME TO "user"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" RENAME TO "temporary_user"`);
    await queryRunner.query(
      `CREATE TABLE "user" ("id" varchar PRIMARY KEY NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, "role" varchar NOT NULL DEFAULT ('ADMIN'), "companyId" varchar NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"))`,
    );
    await queryRunner.query(
      `INSERT INTO "user"("id", "email", "password", "role", "companyId") SELECT "id", "email", "password", "role", "companyId" FROM "temporary_user"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_user"`);
    await queryRunner.query(`DROP TABLE "customer"`);
    await queryRunner.query(`DROP TABLE "document_sequence"`);
    await queryRunner.query(`DROP TABLE "document_item"`);
    await queryRunner.query(`DROP TABLE "document"`);
    await queryRunner.query(`DROP TABLE "product"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "company"`);
  }
}
