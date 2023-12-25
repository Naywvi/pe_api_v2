const mongoose = require("mongoose");

module.exports = {
  //<== check if token is valid
  check_validity_token: async (token, _id) => {
    const is_valid = await mongoose
      .model("User")
      .findOne({ _id: _id, user_token: token });
    if (!is_valid) return false;
    return true;
  },
};
