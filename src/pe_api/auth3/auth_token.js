const mongoose = require("mongoose");
const error_message = require("../../utils/error");

module.exports = {
  //<== check if token is valid
  check_validity_token: async (token, _id) => {
    const is_valid = await mongoose
      .model("User")
      .findOne({ _id: _id, user_token: token });
    if (!is_valid) return false;
    return true;
  },
  //<== check the rank of the user
  check_rank: async (token, _id) => {
    const is_valid = await mongoose
      .model("User")
      .findOne({ _id: _id, user_token: token });
    if (!is_valid) throw error_message.unauthorized;
    if (is_valid.user_admin) return 99;
    return is_valid.user_rank_id;
  },
  check_society_id: async (token, _id) => {
    const is_valid = await mongoose
      .model("User")
      .findOne({ _id: _id, user_token: token });
    if (!is_valid) throw error_message.unauthorized;
    return is_valid.user_soc_id;
  },
};
