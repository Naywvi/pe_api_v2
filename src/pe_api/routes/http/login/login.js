const { body, validationResult } = require("express-validator");
const error_m = require("../../../../utils/error");
const check_auth = require("../../../auth3/auth");

async function generate_temp_token() {
  const currentDate = Date.now();
  const randomPart1 = Math.random().toString(36).substring(2, 15);
  const randomPart2 = Math.random().toString(36).substring(2, 15);

  const result = currentDate + randomPart1 + randomPart2;
  return result;
}

module.exports = {
  name: "/auth/login",
  description: "Ban a user",
  method: "POST",
  run: async (req, res) => {
    try {
      //> Validation des données
      const validationRules = [
        body("login").isLength({ min: 5 }).escape(),
        body("password").isLength({ min: 8 }).escape(),
      ];

      //> Vérification des données
      validationRules.forEach((validationRule) =>
        validationRule(req, res, () => {})
      );
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw await error_m.bad_request();
      }

      //> Vérification de l'existence de l'utilisateur
      const postData = {
        login: req.body.login,
        password: req.body.password,
      };

      //> Vérification de l'existence de l'utilisateur & compare bcrypt password
      let user_exist = await check_auth.login(
        postData.login,
        postData.password
      );
      if (!user_exist) throw await error_m.unauthorized();

      //> Si y a un soucis avec le token, on le gère ici !
      user_exist.user_token = await generate_temp_token();

      //Dé parse l'object pour l'id
      user_exist = JSON.stringify(user_exist);
      user_exist = JSON.parse(user_exist);

      await res.json(user_exist).status(200);
    } catch (error) {
      await res.status(error.code).json(error);
    } finally {
      await res.end();
    }
  },
};
