const error_message = require("../../utils/error");
const UserModel = require("../../database/models/user");

const permit_modifications = {
  user: [
    "user_first_name",
    "user_last_name",
    "user_mail",
    "user_phone",
    "user_birthday",
    "user_address",
    "user_zip",
    "user_pwd",
  ],
  society: [
    "user_first_name",
    "user_last_name",
    "user_mail",
    "user_phone",
    "user_birthday",
    "user_address",
    "user_zip",
    "user_pwd",
    "user_rank_id",
  ],
  confirmateur: [
    "user_first_name",
    "user_last_name",
    "user_address",
    "user_zip",
  ],
  super_admin: [
    "user_inscription_date",
    "user_token",
    "user_soc_id",
    "user_rank_id",
    "user_first_name",
    "user_last_name",
    "user_mail",
    "user_phone",
    "user_birthday",
    "user_address",
    "user_zip",
    "user_pwd",
    "user_new",
    "user_banned",
  ],
};

module.exports = {
  //<== format the request by permit_modifications rank
  check_modifications: async (user_request, rank) => {
    var modifications = {};
    permit_modifications[rank].forEach((element) => {
      if (
        user_request.request.update[element] !== undefined &&
        user_request.request.update[element] !== ""
      ) {
        modifications[element] = user_request.request.update[element];
      }
    });
    return modifications;
  },
  // <== format the result of the request
  generate_result: async (message, object_result, many = false) => {
    var result_clean_user;
    if (many) {
      result_clean_user = [];
      object_result.forEach((user) => {
        result_clean_user.push({
          user_first_name: user.user_first_name,
          user_last_name: user.user_last_name,
          user_phone: user.user_phone,
          user_email: user.user_email,
          user_zip: user.user_zip,
          user_birthday: user.user_birthday,
          user_soc_id: user.user_soc_id,
        });
      });
    } else {
      result_clean_user = {
        user_first_name: object_result.user_first_name,
        user_last_name: object_result.user_last_name,
        user_phone: object_result.user_phone,
        user_email: object_result.user_email,
        user_birthday: object_result.user_birthday,
        user_zip: object_result.user_zip,
        user_soc_id: object_result.user_soc_id,
      };
    }

    const result = {
      message: message,
      user: result_clean_user,
    };
    return result;
  },
  // <== check if user already exists
  user_exist: async (
    user_request,
    search = false,
    society_search = false,
    search_by_id = false
  ) => {
    var user_exist;
    if (society_search) {
      user_exist = await UserModel.find({
        user_soc_id: user_request.request.user_society_id,
      });
      return user_exist;
    } else if (search_by_id) {
      user_exist = await UserModel.findOne({
        _id: user_request,
      });
      return user_exist;
    } else {
      user_exist = await UserModel.findOne({
        user_first_name: user_request.request.user_first_name,
        user_last_name: user_request.request.user_last_name,
        user_birthday: user_request.request.user_birthday,
      });
    }

    if (search) {
      if (user_exist) throw error_message.already_exists;
    } else if (!search) {
      if (!user_exist) throw error_message.not_found;
      else return user_exist;
    }
  },
};
