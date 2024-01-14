const error_m = require("../../../../utils/error");
module.exports = {
  name: "/manage/user/delete",
  description: "Delete a user or groupe of users",
  method: "POST",
  run: async (req, res) => {
    try {
      throw error_m.not_implemented(res);
      await res.status(200).json("result");
    } catch (error) {
      await res.status(400).json(error);
    } finally {
      await res.end();
    }
  },
};
