const { DataTypes } = require('sequelize');

      module.exports = (sequelize, Sequelize) => {
        const CheckUrl = sequelize.define("CheckUrl", {
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        url: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        protocol: {
          type: DataTypes.ENUM('HTTP', 'HTTPS', 'TCP'),
          allowNull: false,
        },
        path: {
          type: DataTypes.STRING,
        },
        port: {
          type: DataTypes.INTEGER,
        },
        timeout: {
          type: DataTypes.INTEGER,
          defaultValue: 5, // Default value of 5 seconds
        },
        interval: {
          type: DataTypes.INTEGER,
          defaultValue: 600, // Default value of 10 minutes = 60*10
        },
        threshold: {
          type: DataTypes.INTEGER,
          defaultValue: 1, 
        },
        authentication: {
          type: DataTypes.JSONB,
          defaultValue: {
            username: 'defaultUser',
            password: 'defaultPassword',
          }, 
        },
        httpHeaders: {
          type: DataTypes.JSONB,
          defaultValue: [{ key: 'User-Agent', value: 'MyApp' }], 
        },
        assert: {
          type: DataTypes.JSONB,
          defaultValue: {
            statusCode: 200,
          },
        },
        tags: {
          type: DataTypes.ARRAY(DataTypes.STRING),
          defaultValue: ['defaultTag'], 
        },
        ignoreSSL: {
          type: DataTypes.BOOLEAN,
          defaultValue: true, 
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
       
       CheckUrl.associate = models => {
        CheckUrl.belongsTo(models.User, { foreignKey: { allowNull: true } });
        CheckUrl.hasMany(models.Report, { foreignKey: { allowNull: true } });

     };
    
      return CheckUrl;

}




