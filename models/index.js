const { sequelize, Sequelize } = require('../config/db');
const db={};
db.Sequelize = Sequelize;
db.sequelize = sequelize;


db.Report = require('./Report')(sequelize,Sequelize)
db.User= require('./User')(sequelize,Sequelize)
db.CheckUrl = require('./CheckUrl')(sequelize,Sequelize)

db.Report.associate(db);
db.User.associate(db);
db.CheckUrl.associate(db);

module.exports = db;