const error_m = require("../../utils/error");
const UserModel = require("../../database/models/user");
const utils = require("./utils");

module.exports = {
  create: async (user_request, res) => {
    try {
      //if create user request is valid, check if user already exists

      const user_exist = UserModel.findOne({
        user_mail: user_request.user_mail,
      });
      const error = await error_m.already_exists(res);
      if (user_exist) throw error;

      //check the syntax of the user request
      const user = {
        ...user_request,
        user_admin: false,
        user_inscription_date: Date.now(),
      };
      const new_user = new UserModel(user);
      const id = new_user._id.toString();

      await new_user.save().catch((err) => {
        throw err;
      });

      const response = {
        response: `${user_request.user_first_name} was created`,
        _id: id,
      };

      return response;
    } catch (error) {
      throw error;
    }
  },
  read_society: async (user_request) => {
    try {
      let result = await UserModel.find({
        user_soc_id: user_request.sender.user_soc_id,
      });
      result = await utils.generate_result(`All users`, result, true);
      return result;
    } catch (error) {
      throw error;
    }
  },
  read_one: async (user_request) => {
    try {
      let result = await UserModel.findOne({ _id: user_request.user_id });
      result = JSON.stringify(result);
      result = JSON.parse(result);
      if (result._id === user_request.sender._id)
        result = await utils.generate_result(`himself`, result);
      else if (result._id !== user_request.sender._id)
        result = await utils.generate_result(`user`, result);
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
  update: async (user_request, rank = false, res) => {
    try {
      //<== if user already exists
      const user = await utils.user_exist(user_request);
      if (!user) throw error_m.not_found;

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
          if (!user_updated.modifiedCount) throw error_m.already_updated(res);
        } else if (rank === 2) {
          const permissions = await utils.check_modifications(
            user_request,
            "confirmateur"
          );
          user_updated = await UserModel.updateOne(user, permissions);
          if (!user_updated.modifiedCount) throw error_m.already_updated(res);
        } else if (rank === 99) {
          const permissions = await utils.check_modifications(
            user_request,
            "super_admin"
          );
          user_updated = await UserModel.updateOne(user, permissions);
          if (!user_updated.modifiedCount) throw error_m.already_updated(res);
        }
      } else {
        //<== simple users modifications
        const permissions = await utils.check_modifications(
          user_request,
          "user"
        );
        user_updated = await UserModel.updateOne(user, permissions);
        if (!user_updated.modifiedCount) throw error_m.update_failed(res);
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
  ban_one: async (user_request, res) => {
    try {
      //check if user is not already banned
      let banned = await UserModel.updateOne(
        { _id: user_request.user_id },
        { user_banned: true }
      );
      if (!banned.modifiedCount) throw error_m.already_banned(res);
      banned = JSON.stringify(banned);
      banned = JSON.parse(banned);
      return true;
    } catch (error) {
      throw error;
    }
  },
  unban_one: async (user_request, res) => {
    try {
      //check if user is not already banned
      let banned = await UserModel.updateOne(
        { _id: user_request.user_id },
        { user_banned: false }
      );
      if (!banned.modifiedCount) throw error_m.already_banned(res);
      banned = JSON.stringify(banned);
      banned = JSON.parse(banned);
      return true;
    } catch (error) {
      throw error;
    }
  },
  add_token: async (user_id, token, res) => {
    try {
      const user = await UserModel.updateOne(
        { _id: user_id },
        { user_token: token }
      );
      if (!user.modifiedCount) throw error_m.bad_request(res);
      return true;
    } catch (error) {
      throw error;
    }
  },
};
