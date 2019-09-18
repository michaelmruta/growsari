module.exports = function(sequelize) {

    return sequelize.define('Message', {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV1,
            primaryKey: true
        },
        message: {
            type: Sequelize.STRING,
        },
    }, {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        paranoid: true
    });

}