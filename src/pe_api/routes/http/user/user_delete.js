const format_query = require("../../../../utils/format_query");
const check_user_request = require("../../../../utils/requests/user_request");

module.exports = {
  name: "/manage/user/delete",
  description: "Delete a user or groupe of users",
  method: "POST",
  run: async (req, res) => {
    try {

      const user_request = format_query.run(req.body);
      const { response, message } = await check_user_request.delete(user_request, req.query);
      var result;

      if (message) {
        result = {
          message: `${message} was deleted`,
          user: response,
        };
      } else {
        result = {
          message: `${response.user_first_name} users were deleted`,
          user: response,
        }
      }

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
