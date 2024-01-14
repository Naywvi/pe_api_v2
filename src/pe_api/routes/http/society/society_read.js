const format_query = require("../../../../utils/format_query");
const error_m = require("../../../../utils/error");
const is_valid = require("../../../auth3/auth_token");
const society_request = require("../../../requests/society_request");
const check_auth = require("../../../auth3/auth");
const utils = require("../../../requests/utils");

module.exports = {
  name: "/manage/society/read",
  description:
    "Create temp society - rank 99 - 98  & basic rank if is on the same society",
  method: "POST",
  run: async (req, res) => {
    try {
      //<== format & check the request
      const request = format_query.run(req.body);

      //<== need society_rank_id to verify identity
      if (!request.request.society_id) throw error_m.missing_information(res);
      const is_valid_token = await is_valid.check_validity_token(
        request.sender.token,
        request.sender._id
      );
      if (!is_valid_token) throw error_m.invalid_token(res);

      //<== check the rank of the user
      const rank = await check_auth.check_rank(
        request.sender.token,
        request.sender._id
      );

      //<== check rank if != moderator
      if (rank !== 98) {
        const rank_id = await utils.basic_rank_id();
        if (!rank_id.includes(rank)) throw error_m.unauthorized(res);
        else {
          if (rank !== 99) {
            const user_society_id = await check_auth.check_society_id(
              request.sender.token,
              request.sender._id
            );
            if (user_society_id !== request.request.society_id)
              throw error_m.unauthorized(res);
          }
        }
      }

      //<== read the society
      const result = await society_request.read(request);

      await res.status(200).json(result);
    } catch (error) {
      await res.status(400).json(error);
    } finally {
      await res.end();
    }
  },
};
