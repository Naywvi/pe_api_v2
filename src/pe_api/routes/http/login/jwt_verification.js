const { body, validationResult } = require("express-validator");
const error_message = require("../../../../utils/error");
const check_auth_token = require("../../../auth3/auth_token");
const user = require("../../../requests/user_request")

module.exports = {
  name: "/auth/login/jwt_verification",
  description: "Ban a user",
  method: "POST",
  run: async (req, res) => {
    try {
      //> Validation des données
      const validationRules = [
        body("authorization").isLength({ min: 20 }).escape(),
      ];
      //> Vérification des données
      validationRules.forEach((validationRule) =>
        validationRule(req, res, () => { })
      );

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw error_message.bad_request;
      }

      //> Vérification du token jwt
      const token =
        req.headers.authorization && req.headers.authorization.split(" ")[1];
      if (!token) throw error_message.unauthorized;

      //> Décodage du token jwt
      const decoded = await check_auth_token.verify_jwt(token);
      if (!decoded) throw error_message.unauthorized;

      //> Ajout du token à l'utilisateur
      const add_to = await user.add_token(decoded._id, token);
      if (!add_to) throw error_message.bad_request;

      //> Envoie du cookie pour l'api
      await res.cookie("authentified", token);

      res.status(200);
    } catch (error) {
      res.status(400);
      res.json(error);
    } finally {
      res.end();
    }
  },
};
