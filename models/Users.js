const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define(
    "users",
    {
      user_name: {
        type: DataTypes.STRING(20),
      },
      gmail_id: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      gmail: {
        type: DataTypes.STRING(40),
        allowNull: false,
      },
      blog_address: {
        type: DataTypes.STRING(30),
      },
      blog_type_id: {
        type: DataTypes.INTEGER,
        reference: {
          model: "blog_types",
          key: "id",
        },
      },
      introduction: {
        type: DataTypes.STRING(30),
      },
      admin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      user_thumbnail: {
        type: DataTypes.STRING(50),
      },
      wecode_nth: {
        type: DataTypes.INTEGER,
        reference: {
          model: "wecode_nth",
          key: "nth",
        },
      },
      recent_scraped: {
        type: DataTypes.STRING(50),
      },
      is_group_joined: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
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
