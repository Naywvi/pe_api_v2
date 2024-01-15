const request = require("../../../auth3/decrypt_for_all_request");
const error_m = require("../../../../utils/error");
const event_func = require("../../../requests/event_request");
const utils = require("../../../requests/utils");

module.exports = {
    name: "/manage/planning/event/delete_all",
    description: "Delete all events",
    method: "POST",
    run: async (req, res) => {
        try {
            let request_veracity = await request.verify_request(req);

            //<== check the rank of the user
            const rank = request_veracity.sender.user_rank_id;
            const rank_id = await utils.basic_rank_id();
            if (!rank_id.includes(rank)) throw await error_m.unauthorized();

            const result = await event_func.delete_all(request_veracity);
            if (result === undefined) throw await error_m.not_found();

            await res.status(200).json(result);
        } catch (error) {
            await res.status(error.code).json(error);
        } finally {
            await res.end();
        }
    },
};
