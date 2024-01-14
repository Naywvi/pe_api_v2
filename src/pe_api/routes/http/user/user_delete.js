const error_m = require("../../../../utils/error");
module.exports = {
  name: "/manage/user/delete",
  description: "Delete a user or groupe of users",
  method: "POST",
  run: async (req, res) => {
    try {
      throw await error_m.not_implemented();
      await res.status(200).json("result");
    } catch (error) {
      await res.status(error.code).json(error);
    } finally {
      await res.end();
    }
  },
};
