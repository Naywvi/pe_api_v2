const format_query = require("../../../../utils/format_query");
const check_user_request = require("../../../../utils/requests/user_request");

module.exports = {
  name: "/manage/user/read",
  description: "Search for a user or groupe of users",
  method: "POST",
  run: async (req, res) => {
    try {
      const user_request = format_query.run(req.body);
      const response = await check_user_request.read(user_request,req.query);
      const result = {
        message: "User(s) found",
        user: response,
      };
      res.status(200);
      res.json(result);
    } catch (error) {
      res.status(400);
      res.json(error);
    } finally {
      res.end();
    }
  },
};
