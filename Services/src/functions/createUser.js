'use strict';

const { Sequelize,Model,DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

// Move to config
const sequelize = new Sequelize('og_test', 'admin', process.env.MYSQL_PASSWORD, {
    host:  process.env.MYSQL_ENDPOINT,
    dialect: 'mysql',
    port: 3306
});

const User = sequelize.define('User', {
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    // Other model options go here
  });

async function userCreate(email, password, event){
    try {
        console.log(email);
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

       // Validate Email, Password

        const exitingUsers = await User.findAll({
          where:{email}
        });

        if(exitingUsers.length != 0){
          return {
            statusCode: 400,
            body:{
              message: "Email Already Exists"
            },
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Credentials': true,
              'Access-Control-Allow-Headers': 'Authorization'
            }
          }
        }

        // 

        const newUser = await User.create({ email, password : bcrypt.hashSync(password, 10) });
        // Return login token

        await sequelize.close();
        console.log('User successfully created');
        return {
          statusCode: 201,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Allow-Headers': 'Authorization'
          }
        };
      } catch (error) {
        console.error('Unable to connect to the database:', error);
        return {
          statusCode: 500,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Allow-Headers': 'Authorization'
          }
        }
      }
}

module.exports.createUser = async (event, context) => {
  const body = JSON.parse(event.body);
  await userCreate(body.email, body.password, event);

  return ;
};
