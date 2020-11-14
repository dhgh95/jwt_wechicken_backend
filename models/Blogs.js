const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  return sequelize.define(
    'blogs',
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      subtitle: {
        type: DataTypes.STRING,
      },
      thumbnail: {
        type: DataTypes.STRING(800),
      },
      link: {
        type: DataTypes.STRING(800),
        allowNull: false,
      },
      date_id: {
        type: DataTypes.INTEGER,
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at',
    }
  )
}
