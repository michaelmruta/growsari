module.exports = function(sequelize) {

    return sequelize.define('Topic', {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV1,
            primaryKey: true
        },
        subject: {
            type: Sequelize.STRING,
            allowNull: false
        },
        description: {
            type: Sequelize.STRING,
            allowNull: false
        },
    }, {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        paranoid: true
    });
}