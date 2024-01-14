const format_query = require("../../../../utils/format_query");
const error_m = require("../../../../utils/error");
const is_valid = require("../../../auth3/auth_token");
const transformed_client_func = require("../../../requests/transformed_client_request");
const check_auth = require("../../../auth3/auth");
const utils = require("../../../requests/utils");

module.exports = {
  name: "/manage/transformed_client/create",
  description: "create a transformed client - rank 99 - 1 - 2 - 6 only",
  method: "POST",
  run: async (req, res) => {
    try {
      //<== format & check the request
      const request = format_query.run(req.body);

      const is_valid_token = await is_valid.check_validity_token(
        request.sender.token,
        request.sender._id
      );
      if (!is_valid_token) throw await error_m.invalid_token();

      //<== check the rank of the user
      const rank = await check_auth.check_rank(
        request.sender.token,
        request.sender._id
      );

      const rank_id = await utils.basic_rank_id();
      if (!rank_id.includes(rank)) throw await error_m.unauthorized();

      //<== check the society of the user
      const user_society_id = await check_auth.check_society_id(
        request.sender.token,
        request.sender._id
      );

      //<== create the transformed client
      const result = await transformed_client_func.create(
        request,
        user_society_id
      );

      await res.status(200).json(result);
    } catch (error) {
      await res.status(error.code).json(error);
    } finally {
      await res.end();
    }
  },
};
