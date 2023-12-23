const error_message = require("../../utils/error");
const UserModel = require("../../database/models/user");

async function generate_result(message, object_result) {
  const result = {
    message: message,
    user: object_result,
  };
  return result;
}

module.exports = {
  create: async (user_request) => {
    try {
      //if create user request is valid, check if user already exists
      const user_exist = await UserModel.findOne({
        user_first_name: user_request.request.user_first_name,
        user_last_name: user_request.request.user_last_name,
        user_birthday: user_request.request.user_birthday,
      });
      if (user_exist) throw error_message.already_exists;

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
  read: async (user_request, query) => {
    try {
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
  update: async (user_request) => {
    try {
    } catch (error) {
      throw error;
    }
  },
  ban: async (user_request) => {
    try {
    } catch (error) {
      throw error;
    }
  },
  unban: async (user_request) => {
    try {
    } catch (error) {
      throw error;
    }
  },
};
