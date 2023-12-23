const mongoose = require("mongoose");
const error_message = require("../../utils/error");

module.exports = {
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
  same_user: async (user1, user2) => {
    for (const key in user1) {
      if (typeof user1[key] == "object") {
        //<== can't check object need to convert to string
        if (user1[key].toString() !== user2[key].toString()) return false;
      } else {
        if (user1[key] !== user2[key]) return false;
      }
    }
    return true;
  },
};
