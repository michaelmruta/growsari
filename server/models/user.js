module.exports = function(sequelize) {

    return sequelize.define('User', {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV1,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        email: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false,
            validate: {
                isEmail: true,
            }
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        }
    }, {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        paranoid: true
    });

}