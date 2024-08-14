// const { Sequelize } = require("sequelize");

// const sequelize = new Sequelize("parapoia_ligtas", "parapoia_ligtas", "Ligtas1123!!", {
//   dialect: "mysql",
//   host: "localhost", // Update with your database host
//   timezone: "+08:00", // Adjust this based on your database server's timezone
// });

// module.exports = sequelize;

// const sequelize = new Sequelize('parapoia_shop_ims', 'parapoia_shop_ims', 'Shopims1123!', {
//   dialect: 'mysql',
//   host: 'localhost', // Update with your database host
//   timezone: '+08:00', // Adjust this based on your database server's timezone
// });

// module.exports = sequelize;


const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("steerhub_guest_management_system", "root", "", {
  dialect: "mysql",
  host: "localhost", // Update with your database host
  timezone: "+08:00", // Adjust this based on your database server's timezone
});

module.exports = sequelize;