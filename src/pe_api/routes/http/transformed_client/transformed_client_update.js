const format_query = require("../../../../utils/format_query");
const error_message = require("../../../../utils/error");
const is_valid = require("../../../auth3/auth_token");
const transformed_client_request = require("../../../requests/transformed_client_request");
const check_auth = require("../../../auth3/auth");

module.exports = {
  name: "/manage/transformed_client/update",
  description: "update a transformed client - rank 99 - 1 - 2 - 6 only",
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
      if (rank !== 99 || rank !== 1 || rank !== 2 || rank !== 6)
        throw error_message.unauthorized;

      //<== check the society of the user
      const user_society_id = await check_auth.check_society_id(
        request.sender.token,
        request.sender._id
      );

      //<== super admin bypass same society check
      if (rank !== 99)
        if (user_society_id !== request.request.user_society_id)
          //<== check if user is in the same society
          throw error_message.unauthorized;

      //<== disable the rank
      const result = await transformed_client_request.update(request);

      res.status(200);
      res.json(result);
    } catch (error) {
      res.status(400);
      res.json(error);
    } finally {
      res.end();
    }
  },
};