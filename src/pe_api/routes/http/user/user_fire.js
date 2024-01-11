const request = require("../../../auth3/decrypt_for_all_request");

const format_query = require("../../../../utils/format_query");
const error_message = require("../../../../utils/error");
const is_valid = require("../../../auth3/auth_token");
const check_user_request = require("../../../requests/user_request");
const check_auth = require("../../../auth3/auth");
const utils = require("../../../requests/utils");

module.exports = {
    name: "/manage/user/fire",
    description: "Fire an employee",
    method: "POST",
    run: async (req, res) => {
        try {
            let request_veracity = await request.verify_request(req);
            //  <== check if user_society_id is present
            if (request_veracity.sender.user_soc_id === undefined)
                throw error_message.badly_formated;

            //<== check the rank of the user
            const rank = request_veracity.sender.user_rank_id;
            const rank_id = await utils.basic_rank_id();
            if (!rank_id.includes(rank)) throw error_message.unauthorized;

            //<== read the user(s)
            const result = await check_user_request.ban_one(request_veracity);
            if (result === undefined) throw error_message.not_found;

            res.status(200);
            res.json("User banned");
        } catch (error) {
            res.status(400);
            res.json(error);
        } finally {
            res.end();
        }
    },
};
