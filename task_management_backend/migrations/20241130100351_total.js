/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.table('tasks', function (table) {
        table.float('total_time').nullable();
    })
        .then(() => {
            return knex('tasks').whereNotNull('start_time').whereNotNull('end_time')
                .update({
                    total_time: knex.raw('TIMESTAMPDIFF(HOUR, start_time, end_time)')
                });
        });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.table('tasks', function (table) {
        table.dropColumn('total_time');
    });
};
