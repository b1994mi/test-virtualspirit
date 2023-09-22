/**
 * @param {import("sequelize").Sequelize} sequelize
 * @param {import("sequelize").DataTypes} DataTypes
 */
module.exports = (sequelize, DataTypes) => {
    const Task = sequelize.define("Task", {
        title: DataTypes.STRING,
        description: DataTypes.STRING,
        completed: DataTypes.BOOLEAN,
    }, {
        tableName: "tasks"
    })

    return Task
}
