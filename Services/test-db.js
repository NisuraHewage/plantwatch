const { Sequelize,Model,DataTypes } = require('sequelize');

// Move to config
const sequelize = new Sequelize('og_test', 'admin', "AristotlE456", {
    host:  'og.cbnfndsvtpgr.us-east-2.rds.amazonaws.com',
    dialect: 'mysql',
    port: 3306
});

const Users = require('./src/models/Users');
const User = Users(sequelize, DataTypes);
async function userCreate(){
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        // 

        const newUser = await User.create({ Email: "ahmednishad4@gmail.com", Password : "whatssupppp" });
        // Return login token
        console.log(newUser);
        await sequelize.close();
      
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
}

 userCreate().then(()=> {

})