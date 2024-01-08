const mongoose = require("mongoose");
const error_message = require("../../utils/error");
const deCrypt = require("./decryt");
const bcrypt = require("bcrypt");


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
  login: async (login, password) => {
    //<== check if user exist
    const user = await mongoose.model("User").findOne({ user_mail: login });
    if (!user) return false;

    //<== check if password is correct
    //> Decrypt password
    const deCrypte_password = await deCrypt.decrypt(password);
    const pass_validation = await bcrypt.compare(deCrypte_password, user.user_pwd);
    if (!pass_validation) return false;
    return user;
  },
};
