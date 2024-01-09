const Mail = require("../../../../database/models/mail");
const User = require("../../../../database/models/user");
const request = require("../../../auth3/decrypt_for_all_request");
const error_message = require("../../../../utils/error");

module.exports = {
  name: "/manage/mail/create",
  description: "create a mail",
  method: "POST",
  run: async (req, res) => {
    try {
      let request_veracity = await request.verify_request(req);

      const { from, to, subject, text, html, sentAt, error, attachments } =
        request_veracity;

      const user_id = request_veracity.sender.id;

      if (!from || !to || !sentAt) throw error_message.badly_formated;

      const mail = new Mail({
        from,
        to,
        subject,
        text,
        html,
        sentAt,
        error,
        attachments,
        user_id,
      });
      console.log("Mail created");
      await mail.save();

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
