const format_query = require("../../../../utils/format_query");
const check_user_request = require("../../../../utils/requests/user_request");
module.exports = {
  name: "/manage/user/create",
  description: "Create a new user",
  method: "POST",
  run: async (req, res) => {
    try {
        const user_request = format_query.run(req.body);
        const response = await check_user_request.create(user_request);
        const result = {
          message: `${response.user_first_name} was created`,
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
