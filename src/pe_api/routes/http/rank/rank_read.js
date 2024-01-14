const format_query = require("../../../../utils/format_query");
const error_m = require("../../../../utils/error");
const is_valid = require("../../../auth3/auth_token");
const rank_func = require("../../../requests/rank_request");
const check_auth = require("../../../auth3/auth");

module.exports = {
  name: "/manage/rank/read",
  description: "Read a rank - rank 99 only",
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
      if (rank !== 99) throw await error_m.unauthorized();

      //<== read the rank
      const result = await rank_func.read(request);

      await res.status(200).json(result);
    } catch (error) {
      await res.status(error.code).json(error);
    } finally {
      await res.end();
    }
  },
};
