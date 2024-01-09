const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = {
  //<== check if token is valid
  check_validity_token: async (token, _id) => {
    const is_valid = await mongoose
      .model("User")
      .findOne({ _id: _id, user_token: token });
    if (!is_valid) return false;
    return true;
  },
  verify_jwt: async (token) => {
    return jwt.verify(token, process.env.KEY_JWT, async (err, decoded) => {
      if (err) return false;
      return decoded;
    });
  },
};
