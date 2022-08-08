const mongoose = require("mongoose");
const { DB_URL } = require("./index");

const connection = mongoose.createConnection(DB_URL, {});

module.exports = connection;
