const request = require("../../../auth3/decrypt_for_all_request");
const error_m = require("../../../../utils/error");
const user_func = require("../../../requests/user_request");
const utils = require("../../../requests/utils");

module.exports = {
  name: "/manage/user/read_one",
  description: "Read one user - rank 99 | 1 | 2 | 6",
  method: "POST",
  run: async (req, res) => {
    try {
      let request_veracity = await request.verify_request(req);

      //  <== check if user_society_id is present
      if (request_veracity.sender.user_soc_id === undefined)
        throw await error_m.badly_formatted();

      //<== check the rank of the user
      const rank = request_veracity.sender.user_rank_id;
      const rank_id = await utils.basic_rank_id();
      if (!rank_id.includes(rank)) throw await error_m.unauthorized();

      //<== read the user(s)
      const result = await user_func.read_one(request_veracity);

      await res.status(200).json(result);
    } catch (error) {
      await res.status(error.code).json(error);
    } finally {
      await res.end();
    }
  },
};
