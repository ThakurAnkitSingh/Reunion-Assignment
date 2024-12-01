/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('tasks', (table) => {
        table.increments('id').primary();
        table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
        table.string('title').notNullable();
        table.timestamp('start_time').notNullable();
        table.timestamp('end_time').notNullable();
        table.integer('priority').unsigned().notNullable();
        table.enum('status', ['pending', 'finished']).defaultTo('pending');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists('tasks');n
};
