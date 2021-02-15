import {MigrationInterface, QueryRunner, TableColumn, TableForeignKey} from "typeorm";

export  class AddUserIdToAppointment1611268621547 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.addColumn('appointments', new TableColumn({
            name: 'user_id',
            type: 'uuid',
            isNullable: true
        }))

        await queryRunner.createForeignKey('appointments', new TableForeignKey({
            name: 'AppointmentProvider',
            columnNames: ['provider_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE'
        }))

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey('appointments', 'AppointmentProvider')
        await queryRunner.dropColumn('appointments', 'user_id')
    }

}
