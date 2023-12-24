const message_error = require("../../../../utils/error");
module.exports = {
  name: "/manage/user/reset_password",
  description: "Reset a user password",
  method: "POST",
  run: async (req, res) => {
    try {
      throw message_error.not_implemented;
      res.status(200);
      res.json("result");
    } catch (error) {
      res.status(400);
      res.json(error);
    } finally {
      res.end();
    }
  },
};
