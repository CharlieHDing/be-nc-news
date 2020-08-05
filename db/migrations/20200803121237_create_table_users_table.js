
exports.up = function(knex) {
    return knex.schema.createTable('users', (usersTable) => {
        usersTable.string('username', 50).primary()
        usersTable.string('avatar_url', 250)
        usersTable.string('name', 50)
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('users')
};
