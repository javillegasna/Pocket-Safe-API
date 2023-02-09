import { MigrationInterface, QueryRunner } from "typeorm";

export class AddToAccountsTotalAmount1675912578101 implements MigrationInterface {
    name = 'AddToAccountsTotalAmount1675912578101'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_account" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "type" varchar CHECK( "type" IN ('SAVINGS','CURRENT','CASH') ) NOT NULL DEFAULT ('SAVINGS'), "icon" varchar NOT NULL, "userId" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "totalAmount" numeric(2,2) NOT NULL, CONSTRAINT "FK_60328bf27019ff5498c4b977421" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_account"("id", "name", "type", "icon", "userId", "created_at", "updated_at", "deleted_at") SELECT "id", "name", "type", "icon", "userId", "created_at", "updated_at", "deleted_at" FROM "account"`);
        await queryRunner.query(`DROP TABLE "account"`);
        await queryRunner.query(`ALTER TABLE "temporary_account" RENAME TO "account"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" RENAME TO "temporary_account"`);
        await queryRunner.query(`CREATE TABLE "account" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "type" varchar CHECK( "type" IN ('SAVINGS','CURRENT','CASH') ) NOT NULL DEFAULT ('SAVINGS'), "icon" varchar NOT NULL, "userId" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, CONSTRAINT "FK_60328bf27019ff5498c4b977421" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "account"("id", "name", "type", "icon", "userId", "created_at", "updated_at", "deleted_at") SELECT "id", "name", "type", "icon", "userId", "created_at", "updated_at", "deleted_at" FROM "temporary_account"`);
        await queryRunner.query(`DROP TABLE "temporary_account"`);
    }

}
