const format_query = require("../../../../utils/format_query");

module.exports = {
  name: "/manage/user/ban",
  description: "Ban a user",
  method: "POST",
  run: async (req, res) => {
    try {
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
