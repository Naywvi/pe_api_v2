const request = require("../../../auth3/decrypt_for_all_request");
const error_message = require("../../../../utils/error");
const check_user_request = require("../../../requests/user_request");
const utils = require("../../../requests/utils");

module.exports = {
  name: "/manage/user/update_one",
  description: "Manage a user",
  method: "POST",
  run: async (req, res) => {
    console.log("request_veracity");
    try {
      let request_veracity = await request.verify_request(req);

      await res.status(200).json(result);
    } catch (error) {
      await res.status(400).json(error);
    } finally {
      await res.end();
    }
  },
};
