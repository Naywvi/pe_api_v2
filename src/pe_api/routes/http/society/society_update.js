const format_query = require("../../../../utils/format_query");
const error_m = require("../../../../utils/error");
const is_valid = require("../../../auth3/auth_token");
const society_func = require("../../../requests/society_request");
const check_auth = require("../../../auth3/auth");
const utils = require("../../../requests/utils");

module.exports = {
  name: "/manage/society/update",
  description: "Update one society - rank 99 only",
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

      //<== check rank if != moderator
      if (rank !== 98) {
        const rank_id = await utils.basic_rank_id();
        if (!rank_id.includes(rank)) throw await error_m.unauthorized();
        else {
          if (rank !== 99) {
            if (rank !== 1) throw await error_m.unauthorized();
            const user_society_id = await check_auth.check_society_id(
              request.sender.token,
              request.sender._id
            );
            if (user_society_id !== request.request.society_id)
              throw await error_m.unauthorized();
          }
        }
      }

      //<== update the society
      const result = await society_func.update(request, rank);

      await res.status(200).json(result);
    } catch (error) {
      await res.status(error.code).json(error);
    } finally {
      await res.end();
    }
  },
};
