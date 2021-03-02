
const { Sequelize,Model,DataTypes } = require('sequelize');

const sequelize = new Sequelize('og_test', 'admin', 'AristotlE456', {
    host: 'og.cbnfndsvtpgr.us-east-2.rds.amazonaws.com',
    dialect: 'mysql'/* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */,
    port: 3306
});

const User = require('./models/user');
const Device = require('./models/device');
const PlantProfile = require('./models/plantProfile');
const Plant = require('./models/plant');
const Parameter = require('./models/parameter');

async function testConnect(){
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        await User.sync({ alter: true });
        await Device.sync({ alter: true });
        await PlantProfile.sync({ alter: true });
        await Plant.sync({ alter: true });
        await Parameter.sync({ alter: true });

      //  const jane = await User.create({ email: "Jane", password: "Doe" });

        await sequelize.close();
        console.log('Connection has been closed successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
}

testConnect().then(() => {
    console.log("Done")
})
