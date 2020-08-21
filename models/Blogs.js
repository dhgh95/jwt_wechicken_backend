const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define(
    "blogs",
    {
      title: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
      subtitle: {
        type: DataTypes.STRING(45),
      },
      thumbnail: {
        type: DataTypes.STRING(45),
      },
      link: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      dates_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "dates",
          key: "id",
        },
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
