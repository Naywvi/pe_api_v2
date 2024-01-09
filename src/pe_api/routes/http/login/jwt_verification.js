const { body, validationResult } = require("express-validator");
const error_message = require("../../../../utils/error");
const check_auth_token = require("../../../auth3/auth_token");
const userModel = require("../../../../database/models/user");

module.exports = {
  name: "/auth/login/jwt_verification",
  description: "Ban a user",
  method: "POST",
  run: async (req, res) => {
    try {
      //> Validation des données
      const validationRules = [
        body("authorization").isLength({ min: 30 }).escape(),
      ];
      //> Vérification des données
      validationRules.forEach((validationRule) =>
        validationRule(req, res, () => {})
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

      //>Attibution du token jwt
      const user_token = await userModel.findOneAndUpdate(
        {
          user_first_name: decoded.first_name,
          user_mail: decoded.mail,
          user_rank_id: decoded.rank_id,
        },
        { user_token: token }
      );
      if (!user_token) throw error_message.unauthorized;

      //> Envoie du cookie pour l'api
      await res.cookie("authentified", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 3600000, // Durée de vie du cookie en millisecondes (1 heure ici)
      });

      res.status(200);
    } catch (error) {
      res.status(400);
      res.json(error);
    } finally {
      res.end();
    }
  },
};
