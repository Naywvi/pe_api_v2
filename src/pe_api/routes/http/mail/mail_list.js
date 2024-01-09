const { Mail } = require("../../../../database/models/mail");
const { User } = require("../../../../database/models/user");
const request = require("../../../auth3/decrypt_for_all_request");

module.exports = {
  name: "/manage/mail/list",
  description: "get user mail list",
  method: "POST",
  run: async (req, res) => {
    try {
      let request_veracity = await request.verify_request(req);

      const user_id = request_veracity.sender.id;

      // get the user mail from the "to" field or the "from" field with no duplicates
      let mail = await Mail.find({
        $or: [{ to: user_id }, { from: user_id }],
      }).distinct("to from");

      if (!mail) throw new Error("No mail found");

      res.status(200);
      res.json(mail);
    } catch (error) {
      res.status(400);
      res.json(error);
    } finally {
      res.end();
    }
  },
};
