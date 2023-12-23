const format_query = require("../../../../utils/format_query");
const error_message = require("../../../../utils/error");
const is_valid = require("../../../auth3/auth_token");
const check_user_request = require("../../../requests/user_request");

module.exports = {
  name: "/manage/user/ban",
  description: "Ban a user",
  method: "POST",
  run: async (req, res) => {
    try {
      //<== format & check the request
      const request = format_query.run(req.body);
      const is_valid_token = await is_valid.check_validity_token(
        request.sender.token,
        request.sender._id
      );
      if (!is_valid_token) throw error_message.invalid_token;

      //<== check the rank of the user
      const rank = await is_valid.check_rank(
        request.sender.token,
        request.sender._id
      );
      if (rank !== 99 && rank !== 1 && rank !== 2 && rank !== 6)
        throw error_message.unauthorized;

      //<== ban the user
      const result = await check_user_request.ban(request);
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
