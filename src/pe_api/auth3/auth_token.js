const mongoose = require("mongoose");
const error_message = require("../../utils/error");

module.exports = {
  check_validity_token: async (token, _id) => {
    const is_valid = await mongoose
      .model("User")
      .findOne({ _id: _id, user_token: token });
    if (!is_valid) return false;
    return true;
  },
};
