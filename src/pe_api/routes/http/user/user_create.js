const request = require("../../../auth3/decrypt_for_all_request");
const error_m = require("../../../../utils/error");
const check_user_request = require("../../../requests/user_request");
const utils = require("../../../requests/utils");
const deCrypt = require("../../../auth3/decryt");
const planning = require("../../../requests/planning_request");

module.exports = {
  name: "/manage/user/create",
  description: "Create a new user - rank 99 | 1 | 2 | 6",
  method: "POST",
  run: async (req, res) => {
    try {
      const data = [
        "sender",
        "user_last_name",
        "user_first_name",
        "user_mail",
        "user_phone",
        "user_birthday",
        "user_city",
        "user_pwd",
      ];

      let request_veracity = await request.verify_request(req, data);

      //> Decrypt password
      const decrypt_password = await deCrypt.decrypt(request_veracity.user_pwd);

      //> attibute the decrypted password to the parsed request
      request_veracity.user_pwd = decrypt_password;

      //<== check the rank of the user
      const rank = request_veracity.sender.user_rank_id;

      const rank_id = await utils.basic_rank_id();
      if (!rank_id.includes(rank)) throw error_m.unauthorized(res);

      //> Attribute society ID & delete the sender
      request_veracity.user_soc_id = request_veracity.sender.user_soc_id;

      delete request_veracity.sender;

      //<== create the user
      let result = await check_user_request.create(request_veracity, res);

      //> Create planning
      await planning.create(result._id);

      await res.status(200).json(result.response);
    } catch (error) {
      await res.status(400).json(error);
    } finally {
      await res.end();
    }
  },
};
