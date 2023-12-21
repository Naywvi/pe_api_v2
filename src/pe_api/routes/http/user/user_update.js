const format_query = require("../../../../utils/format_query");
const check_user_request = require("../../../../utils/requests/user_request");

module.exports = {
  name: "/manage/user/update",
  description: "Manage a user",
  method: "POST",
  run: async (req, res) => {
    try {
      const user_request = format_query.run(req.body);
      const user = await check_user_request.update(user_request);

      const result = {
        message: `${user_request.request.user_first_name} updated`,
        user: user,
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
