const format_query = require("../../utils/format_query");
const csocietyModel = require("../../database/models/csociety");
const UserModel = require("../../database/models/user");
const error_message = require("../../utils/error");

module.exports = {
    create: async (user_request) => {
        try {

            //check if user is valid
            const find_user = await UserModel.findOne({
                user_token: user_request.sender.token,
                _id: user_request.sender._id,
            });
            if (!find_user) throw error_message.badly_formated;

            //check if user is an administrator
            const find_user_admin = await UserModel.findOne({
                user_token: user_request.sender.token,
                _id: user_request.sender._id,
                user_admin: true,
            });

            //check if user is a super administrator or an administrator
            if (!find_user_admin) {
                if (!find_user.user_admin) throw error_message.unauthorized;
            }

            //check syntax of the request && can't create a admin csociety
            const csociety = { ...user_request.request, csoc_admin: false }

            //check saved data
            const newCsociety = new csocietyModel(csociety)
                .catch(() => {
                    throw error_message.badly_formated;
                }
            );
            if (!newCsociety) throw error_message.badly_formated;

            const save = await newCsociety.save();
            if (!save) throw error_message.badly_formated;

            return save;

        } catch (error) {
            throw error
        }
    },
    delete: async (user_request) => {
        try {

        } catch (error) {
            throw error
        }
    },
    read: async (user_request) => {
        try {

        } catch (error) {
            throw error
        }
    },
    update: async (user_request) => {
        try {

        } catch (error) {
            throw error
        }
    },
}