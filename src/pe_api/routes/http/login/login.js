const { body, validationResult } = require('express-validator');
const error_message = require("../../../../utils/error");
const check_auth = require("../../../auth3/auth");
module.exports = {
    name: "/auth/login",
    description: "Ban a user",
    method: "POST",
    run: async (req, res) => {
        try {
            //> Validation des données
            const validationRules = [
                body('login').isLength({ min: 5 }).escape(),
                body('password').isLength({ min: 8 }).escape(),
            ];
            //> Vérification des données
            validationRules.forEach(validationRule => validationRule(req, res, () => { }));
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw error_message.bad_request;
            }

            //> Vérification de l'existence de l'utilisateur
            const postData = {
                login: req.body.login,
                password: req.body.password,
            };

            const user_exist = await check_auth.login(postData.login, postData.password);
            if (!user_exist) throw error_message.unauthorized;
            res.json(user_exist);
            res.status(200);
        } catch (error) {
            console.log(error)
            res.status(400);
            res.json(error);
        } finally {
            res.end();
        }
    },
};
