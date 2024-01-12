const request = require("../../../auth3/decrypt_for_all_request");
const error_message = require("../../../../utils/error");
const check_user_request = require("../../../requests/user_request");
const utils = require("../../../requests/utils");

module.exports = {
    name: "/manage/user/read_one",
    description: "Read one user - rank 99 | 1 | 2 | 6",
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
            const result = await check_user_request.read_one(request_veracity);

            await res.status(200).json(result);
        } catch (error) {
            res.status(400);
            res.json(error);
        } finally {
            res.end();
        }
    },
};