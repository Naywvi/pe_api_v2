const format_query = require("../../../../utils/format_query");
const check_user_request = require("../../../../utils/requests/user_request");

module.exports = {
  name: "/manage/user/ban",
  description: "Ban a user",
  method: "POST",
  run: async (req, res) => {
    try {
      const request_user = format_query.run(req.body); 
      const response = await check_user_request.ban(request_user);

        const result = {
          message: `${response.user_first_name} banned`,
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
