const { body, validationResult } = require("express-validator");
const deCrypt = require("./decryt");
const deCrypt_cookie = require("./auth_token");
const check_auth = require("./auth");
const error_message = require("../../utils/error");

module.exports = {
  verify_request: async (req, data = false) => {
    if (data) {
      var validationRules = [];
      data.forEach((element) => {
        validationRules.push(body(element).notEmpty().escape());
      });
      const errors = validationResult(req);
      if (!errors.isEmpty()) throw error_message.bad_request;
    }

    //> Decrypt the request & Parse
    const decrypt_request = await deCrypt.decrypt(req.body.data);
    const parsed_request = JSON.parse(decrypt_request);
    if (!parsed_request) throw error_message.bad_request;

    const jwt_token = parsed_request.sender.authentified;

    //> Decrypt the cookie / JWT token
    const decrypt_sender = await deCrypt_cookie.verify_jwt(jwt_token);
    if (!decrypt_sender) throw error_message.invalid_token;

    //> Check if the user exist
    const { iat, ...new_payload } = decrypt_sender;

    let user_exist = await check_auth.user(new_payload, jwt_token);
    if (!user_exist) throw error_message.unauthorized;

    user_exist = JSON.stringify(user_exist);
    user_exist = JSON.parse(user_exist);

    parsed_request.sender = user_exist;
    return parsed_request;
  },
};
