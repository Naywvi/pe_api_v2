const request = require("../../../auth3/decrypt_for_all_request");
const error_m = require("../../../../utils/error");
const planning_func = require("../../../requests/planning_request");
const utils = require("../../../requests/utils");

module.exports = {
  name: "/manage/planning/read",
  description: "Read planning",
  method: "POST",
  run: async (req, res) => {
    try {
      let request_veracity = await request.verify_request(req);

      //<== check the rank of the user
      const rank = request_veracity.sender.user_rank_id;
      const rank_id = await utils.basic_rank_id();
      if (!rank_id.includes(rank)) throw error_m.unauthorized(res);

      const result = await planning_func.read(req.body, res);
      if (result === undefined) throw error_m.not_found(res);

      await res.status(200).json(result);
    } catch (error) {
      await res.status(400).json(error);
    } finally {
      await res.end();
    }
  },
};

// {
//   "sender":{},
//   "cplanning_daysOff": ["2024-01-15", "2024-01-20"]
// }
