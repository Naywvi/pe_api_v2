const format_query = require("../../../../utils/format_query");
const error_message = require("../../../../utils/error");
const is_valid = require("../../../auth3/auth_token");
const check_user_request = require("../../../requests/user_request");
const check_auth = require("../../../auth3/auth");

module.exports = {
  name: "/manage/user/update",
  description: "Manage a user",
  method: "POST",
  run: async (req, res) => {
    try {
      //<== format & check the request
      const request = format_query.run(req.body);

      // <== check if user_society_id is present
      if (request.request.user_society_id === undefined)
        throw error_message.badly_formated;

      const is_valid_token = await is_valid.check_validity_token(
        request.sender.token,
        request.sender._id
      );
      if (!is_valid_token) throw error_message.invalid_token;

      //<== check the rank of the user
      const rank = await check_auth.check_rank(
        request.sender.token,
        request.sender._id
      );

      //<== check if user is himself
      const user_to_updated = await check_user_request.read(request, undefined);
      if (!user_to_updated) throw error_message.badly_formated;

      const user_who_want_update = await check_user_request.read(
        request.sender._id,
        undefined,
        true
      );
      if (!user_who_want_update) throw error_message.invalid_token;

      const same_user = await check_auth.same_user(
        user_to_updated.user,
        user_who_want_update.user
      );

      // //<== for check the society of the user
      const user_society_id = await check_auth.check_society_id(
        request.sender.token,
        request.sender._id
      );

      //<== super admin bypass same user check

      var result;

      if (same_user) {
        console.log("same_user");
        result = await check_user_request.update(request);
      } else if (rank === 99) {
        console.log("super admin");
        //<== super admin bypass same user check
        result = await check_user_request.update(request, rank);
      } else if (rank === 2 || rank === 1 || rank === 6) {
        console.log("confirmateur");
        //<== confirmateur bypass same user check
        if (user_society_id !== request.request.user_society_id)
          throw error_message.unauthorized;
        else result = await check_user_request.update(request, rank);
      } else throw error_message.unauthorized;

      res.status(200);
      res.json(result);
    } catch (error) {
      res.status(400);
      console.log(error);
      res.json(error);
    } finally {
      res.end();
    }
  },
};
