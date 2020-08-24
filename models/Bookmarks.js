const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define(
    "bookmarks",
    {
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
      },
      blog_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "blogs",
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
