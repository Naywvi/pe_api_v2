const { Mail } = require("../../../../database/models/mail");
const { User } = require("../../../../database/models/user");
const request = require("../../../auth3/decrypt_for_all_request");

module.exports = {
  name: "/manage/mail/delete",
  description: "delete a mail",
  method: "POST",
  run: async (req, res) => {
    try {
      let request_veracity = await request.verify_request(req);

      const user_id = request_veracity.sender.id;
      const mail_id = request_veracity.mail_id;

      const mail = await Mail.findOneAndDelete({
        mail_id: mail_id,
        user_id: user_id,
      });

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
