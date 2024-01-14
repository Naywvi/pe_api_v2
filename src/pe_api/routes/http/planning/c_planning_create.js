const request = require("../../../auth3/decrypt_for_all_request");
const error_m = require("../../../../utils/error");
const cplanning_func = require("../../../requests/c_planning_request");
const utils = require("../../../requests/utils");

module.exports = {
  name: "/manage/cplanning/create",
  description: "Create planning config",
  method: "POST",
  run: async (req, res) => {
    try {
      let request_veracity = await request.verify_request(req);

      //<== check the rank of the user
      const rank = request_veracity.sender.user_rank_id;
      const rank_id = await utils.basic_rank_id();
      if (!rank_id.includes(rank)) throw await error_m.unauthorized();

      const result = await cplanning_func.create(req.body);
      if (result === undefined) throw await error_m.not_found();

      await res.status(200).json("Config planning created");
    } catch (error) {
      await res.status(error.code).json(error);
    } finally {
      await res.end();
    }
  },
};

// {
//   "sender":{},
//   "cplanning_daysOff": ["2024-01-15", "2024-01-20"]
// }
