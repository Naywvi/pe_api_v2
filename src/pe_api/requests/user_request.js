const error_message = require("../../utils/error");
const UserModel = require("../../database/models/user");
const format_query = require("../../utils/format_query");

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

//<== format the request by permit_modifications rank
async function check_modifications(user_request, rank) {
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
}

// <== format the result of the request
async function generate_result(message, object_result, many = false) {
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
}

// <== check if user already exists
async function user_exist(
  user_request,
  search = false,
  society_search = false,
  search_by_id = false
) {
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
}

module.exports = {
  create: async (user_request) => {
    try {
      //if create user request is valid, check if user already exists
      await user_exist(user_request, true);

      //cancel bypass admin
      if (user_request.request.user_rank_id === 99)
        throw error_message.unauthorized;

      //check the syntax of the user request
      const user = { ...user_request.request, user_admin: false };
      const new_user = new UserModel(user);
      const save_user = await new_user.save().catch(() => {
        throw error_message.badly_formated;
      });

      const result = await generate_result(
        `${save_user.user_first_name} was created`,
        save_user
      );

      return result;
    } catch (error) {
      throw error;
    }
  },
  read: async (user_request, query = false, same_user = false) => {
    try {
      var result;
      if (same_user) {
        //<== check is user is himself
        const user = await user_exist(user_request, false, false, true);
        const result = await generate_result(`${user.user_first_name}`, user);
        return result;
      } else if (query.visibility === undefined || query === false) {
        // <== if query.visibility is undefined, search for one user
        const user = await user_exist(user_request);
        result = await generate_result(`${user.user_first_name}`, user);
      } else if (query.visibility === "all") {
        //<== if query.visibility is defined, search for all users
        const users = await user_exist(user_request, false, true);
        result = await generate_result(`All users`, users, true);
      }
      return result;
    } catch (error) {
      throw error;
    }
  },
  delete: async (user_request, query) => {
    try {
    } catch (error) {
      throw error;
    }
  },
  update: async (user_request, rank = false) => {
    try {
      //<== if user already exists
      const user = await user_exist(user_request);
      if (!user) throw error_message.not_found;

      var result;
      var user_updated;

      //<== modificaions by rank permit_modifications
      if (rank) {
        if (rank === 1 || rank === 6) {
          const permissions = await check_modifications(
            user_request,
            "society"
          );
          user_updated = await UserModel.updateOne(user, permissions);
          if (!user_updated.modifiedCount) throw error_message.already_updated;
        } else if (rank === 2) {
          const permissions = await check_modifications(
            user_request,
            "confirmateur"
          );
          user_updated = await UserModel.updateOne(user, permissions);
          if (!user_updated.modifiedCount) throw error_message.already_updated;
        } else if (rank === 99) {
          const permissions = await check_modifications(
            user_request,
            "super_admin"
          );
          user_updated = await UserModel.updateOne(user, permissions);
          if (!user_updated.modifiedCount) throw error_message.already_updated;
        }
      } else {
        //<== simple users modifications
        const permissions = await check_modifications(user_request, "user");
        user_updated = await UserModel.updateOne(user, permissions);
        if (!user_updated.modifiedCount) throw error_message.update_failed;
      }

      //<== format the result
      result = await generate_result(
        `${user.user_first_name} was updated`,
        user
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
  ban: async (user_request) => {
    try {
      //if user already exists
      const user = await user_exist(user_request);

      //check if user is not already banned
      const banned = await UserModel.updateOne(user, { user_request });
      if (!banned.modifiedCount) throw error_message.already_banned;

      const result = await generate_result(
        `${user.user_first_name} was banned`,
        user
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
  unban: async (user_request) => {
    try {
      //if user already exists
      const user = await user_exist(user_request);

      //check if user is not already unbanned
      const banned = await UserModel.updateOne(user, { user_banned: false });
      if (!banned.modifiedCount) throw error_message.already_unbanned;

      const result = await generate_result(
        `${user.user_first_name} was unbanned`,
        user
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
};
