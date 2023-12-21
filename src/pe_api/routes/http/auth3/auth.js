module.exports = {
  name: "/user/auth/auth",
  description: "Get a user",
  method: "GET",
  run: async (req, res) => {
    try {
      if (!req.body) throw "Badly formatted";
      throw "User not found";
    } catch (err) {
      res.status(400);
      res.send({ error: err });
    }
  },
};
