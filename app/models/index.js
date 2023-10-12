const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.accountInfo = require("./accountInfo.model.js")(mongoose);
db.loginInfo = require("./login.model.js")(mongoose);

module.exports = db;
