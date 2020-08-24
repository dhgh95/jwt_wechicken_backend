const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define(
    "blog_types",
    {
      type: {
        type: DataTypes.STRING(20),
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
