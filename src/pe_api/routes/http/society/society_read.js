const format_query = require("../../../../utils/format_query");
const error_message = require("../../../../utils/error");
const is_valid = require("../../../auth3/auth_token");
const society_request = require("../../../requests/society_request");
const check_auth = require("../../../auth3/auth");
const utils = require("../../../requests/utils");

module.exports = {
    name: "/manage/society/read",
    description: "Create temp society - rank 99 - 98  & basic rank if is on the same society",
    method: "POST",
    run: async (req, res) => {
        try {
            //<== format & check the request
            const request = format_query.run(req.body);

            //<== need society_rank_id to verify identity
            if (!request.request.society_id) throw error_message.missing_information;
            const is_valid_token = await is_valid.check_validity_token(
                request.sender.token,
                request.sender._id
            );
            if (!is_valid_token) throw error_message.invalid_token;

            //<== check the rank of the user
            const rank = await check_auth.check_rank(
                request.sender.token,
                request.sender._id
            );

            //<== check rank if != moderator
            if (rank !== 98) {
                const rank_id = await utils.basic_rank_id();
                if (!rank_id.includes(rank)) throw error_message.unauthorized;
                else {
                    if (rank !== 99) {
                        const user_society_id = await check_auth.check_society_id(
                            request.sender.token,
                            request.sender._id
                        );
                        if (user_society_id !== request.request.society_id) throw error_message.unauthorized;
                    }
                }
            }

            //<== read the society
            const result = await society_request.read(request);

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
