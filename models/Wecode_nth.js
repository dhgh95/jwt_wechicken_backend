const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define(
    "wecode_nth",
    {
      nth: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING(45),
      },
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      count: {
        type: DataTypes.INTEGER,
      },
      penalty: {
        type: DataTypes.INTEGER,
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );
};
