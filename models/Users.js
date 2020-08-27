const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define(
    "users",
    {
      user_name: {
        type: DataTypes.STRING(20),
      },
      gmail_id: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      gmail: {
        type: DataTypes.STRING(40),
        allowNull: false,
      },
      blog_address: {
        type: DataTypes.STRING(30),
      },
      user_thumbnail: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      recent_scraped: {
        type: DataTypes.STRING,
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
      wecode_nth: {
        type: DataTypes.INTEGER,
      },
      blog_type_id: {
        type: DataTypes.INTEGER,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
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
