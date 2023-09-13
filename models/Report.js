// models/report.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
  const Report = sequelize.define('Report', {
    status: {
      type: DataTypes.ENUM('up', 'down'),
      allowNull: true,
    },
    availability: {
      type: DataTypes.FLOAT, // A percentage value (e.g., 98.5)
      allowNull: true,
    },
    outages: {
      type: DataTypes.INTEGER, // Total number of downtimes
      allowNull: true,
    },
    downtime: {
      type: DataTypes.INTEGER, // Total time in seconds of downtime
      allowNull: true,
    },
    uptime: {
      type: DataTypes.INTEGER, // Total time in seconds of uptime
      allowNull: true,
    },
    responseTime: {
      type: DataTypes.FLOAT, // Average response time in milliseconds
      allowNull: true,
    },
    history: {
      type: DataTypes.JSONB, // Timestamped logs of polling requests
      allowNull: true,
    },
    createdAt: {
      type: 'TIMESTAMP',
      defaultValue: Sequelize.fn('NOW'),
    },
    updatedAt: {
      type: 'TIMESTAMP',
      defaultValue: Sequelize.fn('NOW'),
    },
  },
  { freezeTableName: true, timestamps: true });
  
  Report.associate = models => {
    Report.belongsTo(models.CheckUrl, { foreignKey: { allowNull: true } });
  };

  return Report;
};
