const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define(
    "dates",
    {
      date: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
      underscored: true,
      timestamps: true,
    }
  );
};
