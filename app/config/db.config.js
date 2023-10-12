require('dotenv').config();
// console.log(process.env.MONGO_USER);
module.exports = {
  url: `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@desmondcluster.ft6kbdn.mongodb.net/MT_Account_db`
};
