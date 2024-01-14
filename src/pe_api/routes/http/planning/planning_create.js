const request = require("../../../auth3/decrypt_for_all_request");
const error_m = require("../../../../utils/error");
const planning_func = require("../../../requests/planning_request");
const utils = require("../../../requests/utils");

module.exports = {
  name: "/manage/planning/create",
  description: "Fire an employee",
  method: "POST",
  run: async (req, res) => {
    try {
      // let request_veracity = await request.verify_request(req);

      // const result = await planning.create(req.body);
      // if (result === undefined) throw  await error_m.not_found();

      await res.status(200).json("config planning created");
    } catch (error) {
      await res.status(error.code).json(error);
    } finally {
      await res.end();
    }
  },
};

// {
//   "user": "6586379c70996b4f96f8ba30",
//   "daysOff": [] // Aucun jour de congé par défaut
// }
