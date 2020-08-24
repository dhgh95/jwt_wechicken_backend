const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define(
    "wecode_nth",
    {
      title: {
        type: DataTypes.STRING(45),
      },
      nth: {
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
