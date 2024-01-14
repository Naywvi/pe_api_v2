const Mail = require("../../../../database/models/mail");
const User = require("../../../../database/models/user");
const request = require("../../../auth3/decrypt_for_all_request");
const error_m = require("../../../../utils/error");

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

      if (!from || !to || !sentAt) throw await error_m.badly_formatted();

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

      await res.status(200).json(mail);
    } catch (error) {
      await res.status(error.code).json(error);
    } finally {
      await res.end();
    }
  },
};
