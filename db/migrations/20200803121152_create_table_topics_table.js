
exports.up = function(knex) {
    return knex.schema.createTable('topics', (topicsTable) => {
        topicsTable.string('slug', 50).primary()
        topicsTable.string('description', 250)
    })
  
};

exports.down = function(knex) {
    return knex.schema.dropTable('topics')
  
};
