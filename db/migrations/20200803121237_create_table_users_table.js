
exports.up = function(knex) {
    return knex.schema.createTable('users', (usersTable) => {
        usersTable.string('username', 50).primary().notNullable()
        usersTable.string('avatar_url', 250).notNullable()
        usersTable.string('name', 50)
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('users')
};
