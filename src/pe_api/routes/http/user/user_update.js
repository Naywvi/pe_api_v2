const request = require("../../../auth3/decrypt_for_all_request");
const error_m = require("../../../../utils/error");
const user_func = require("../../../requests/user_request");
const utils = require("../../../requests/utils");

module.exports = {
  name: "/manage/user/update_one",
  description: "Manage a user",
  method: "POST",
  run: async (req, res) => {
    console.log("request_veracity");
    try {
      let request_veracity = await request.verify_request(req);
      console.log("request_veracity", request_veracity);

      await res.status(200).json("result");
    } catch (error) {
      await res.status(error.code).json(error);
    } finally {
      await res.end();
    }
  },
};
