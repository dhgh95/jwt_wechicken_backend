const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define(
    "users",
    {
      user_name: {
        type: DataTypes.STRING(20),
      },
      gmail_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: "gmail_id",
      },
      gmail: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: "gmail",
      },
      blog_address: {
        type: DataTypes.STRING,
        unique: "blog_address",
      },
      user_thumbnail: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      recent_scraped: {
        type: DataTypes.STRING,
        unique: "recent_scraped",
      },
      admin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      is_group_joined: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
