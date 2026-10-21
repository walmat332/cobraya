import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateCompany1792578133000 implements MigrationInterface {
  name = 'UpdateCompany1792578133000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "company" ADD "phone" varchar`,
    );
    await queryRunner.query(
      `ALTER TABLE "company" ADD "email" varchar`,
    );
    await queryRunner.query(
      `ALTER TABLE "company" ADD "commercial_name" varchar`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "commercial_name"`);
    await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "email"`);
    await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "phone"`);
  }
}