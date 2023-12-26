const format_query = require("../../../../utils/format_query");
const error_message = require("../../../../utils/error");
const is_valid = require("../../../auth3/auth_token");
const society_request = require("../../../requests/society_request");
const check_auth = require("../../../auth3/auth");

module.exports = {
    name: "/manage/society/delete",
    description: "Delete one society - rank 99 only",
    method: "POST",
    run: async (req, res) => {
        try {
            //<== format & check the request
            const request = format_query.run(req.body);

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

            if (rank !== 99) throw error_message.unauthorized;

            //<== delete the society
            const result = await society_request.delete(update);

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
