const request = require("../../../auth3/decrypt_for_all_request");
const error_m = require("../../../../utils/error");
const user_func = require("../../../requests/user_request");
const utils = require("../../../requests/utils");

module.exports = {
  name: "/manage/user/unfire",
  description: "Unban a user",
  method: "POST",
  run: async (req, res) => {
    try {
      let request_veracity = await request.verify_request(req);

      if (request_veracity.user_id === request_veracity.sender._id)
        return res.status(400).json("You can't unfire yourself");
      //  <== check if user_society_id is present
      if (request_veracity.sender.user_soc_id === undefined)
        throw error_m.badly_formatted(res);

      //<== check the rank of the user
      const rank = request_veracity.sender.user_rank_id;
      const rank_id = await utils.basic_rank_id();
      if (!rank_id.includes(rank)) throw error_m.unauthorized(res);

      //<== read the user(s)
      const result = await user_func.unban_one(request_veracity, res);
      if (result === undefined) throw error_m.not_found(res);
      await res.status(200).json("User unbanned");
    } catch (error) {
      await res.status(400).json(error);
    } finally {
      await res.end();
    }
  },
};
