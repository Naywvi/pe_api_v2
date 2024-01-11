const request = require("../../../auth3/decrypt_for_all_request");
const error_message = require("../../../../utils/error");
const check_user_request = require("../../../requests/user_request");
const utils = require("../../../requests/utils");
const deCrypt = require("../../../auth3/decryt");

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
      if (!rank_id.includes(rank)) throw error_message.unauthorized;

      //> Attribute society ID & delete the sender
      request_veracity.user_soc_id = request_veracity.sender.user_soc_id;
      delete request_veracity.sender;

      //<== create the user
      const result = await check_user_request.create(request_veracity);

      res.status(200);
      res.json(result);
    } catch (error) {
      console.log(error)
      res.status(400);
      res.json(error);
    } finally {
      res.end();
    }
  },
};
