const error_message = require("../../utils/error");
const UserModel = require("../../database/models/user");
const utils = require("./utils");

module.exports = {
  create: async (user_request) => {
    try {
      //if create user request is valid, check if user already exists
      await utils.user_exist(user_request, true);

      //check the syntax of the user request
      const user = {
        ...user_request,
        user_admin: false,
        user_inscription_date: Date.now(),
      };
      const new_user = new UserModel(user);
      await new_user.save().catch((err) => {
        throw err;
      });

      return `${user_request.user_first_name} was created`;
    } catch (error) {
      throw error;
    }
  },
  read: async (user_request, query = false, same_user = false) => {
    try {
      var result;
      if (same_user) {
        //<== check is user is himself
        const user = await utils.user_exist(user_request, false, false, true);
        const result = await utils.generate_result(
          `${user.user_first_name}`,
          user
        );
        return result;
      } else if (query.visibility === undefined || query === false) {
        // <== if query.visibility is undefined, search for one user
        const user = await utils.user_exist(user_request);
        result = await utils.generate_result(`${user.user_first_name}`, user);
      } else if (query.visibility === "all") {
        //<== if query.visibility is defined, search for all users
        const users = await utils.user_exist(user_request, false, true);
        result = await utils.generate_result(`All users`, users, true);
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
  reset_password: async (user_request) => {
    try {
    } catch (error) {
      throw error;
    }
  },
  update: async (user_request, rank = false) => {
    try {
      //<== if user already exists
      const user = await utils.user_exist(user_request);
      if (!user) throw error_message.not_found;

      var result;
      var user_updated;

      //<== modificaions by rank permit_modifications
      if (rank) {
        if (rank === 1 || rank === 6) {
          const permissions = await utils.check_modifications(
            user_request,
            "society"
          );
          user_updated = await UserModel.updateOne(user, permissions);
          if (!user_updated.modifiedCount) throw error_message.already_updated;
        } else if (rank === 2) {
          const permissions = await utils.check_modifications(
            user_request,
            "confirmateur"
          );
          user_updated = await UserModel.updateOne(user, permissions);
          if (!user_updated.modifiedCount) throw error_message.already_updated;
        } else if (rank === 99) {
          const permissions = await utils.check_modifications(
            user_request,
            "super_admin"
          );
          user_updated = await UserModel.updateOne(user, permissions);
          if (!user_updated.modifiedCount) throw error_message.already_updated;
        }
      } else {
        //<== simple users modifications
        const permissions = await utils.check_modifications(
          user_request,
          "user"
        );
        user_updated = await UserModel.updateOne(user, permissions);
        if (!user_updated.modifiedCount) throw error_message.update_failed;
      }

      //<== format the result
      result = await utils.generate_result(
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
      const user = await utils.user_exist(user_request);

      //check if user is not already banned
      const banned = await UserModel.updateOne(user, { user_request });
      if (!banned.modifiedCount) throw error_message.already_banned;

      const result = await utils.generate_result(
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
      const user = await utils.user_exist(user_request);

      //check if user is not already unbanned
      const banned = await UserModel.updateOne(user, { user_banned: false });
      if (!banned.modifiedCount) throw error_message.already_unbanned;

      const result = await utils.generate_result(
        `${user.user_first_name} was unbanned`,
        user
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
};
