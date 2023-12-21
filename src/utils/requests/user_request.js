const error_message = require("../error");
const UserModel = require("../../database/models/user");
const CsocietyModel = require("../../database/models/csociety");

module.exports = {
    create: async (user_request) => {
        try {
            //check if user is valid
            const find_user = await UserModel.findOne({
                user_token: user_request.sender.token,
                _id: user_request.sender._id,
            });
            if (!find_user) throw error_message.badly_formated;
            const rank = find_user.user_rank_id;

            //check if user is an administrator
            const find_user_admin = await UserModel.findOne({
                user_token: user_request.sender.token,
                _id: user_request.sender._id,
                user_admin: true,
            });
            if (!find_user_admin) {
                //<== if user is not an administrator
                //check if user is owner of client society
                const client_society_owner = await CsocietyModel.findOne({
                    csoc_admin_owner: find_user.user_token,
                });
                if (!client_society_owner) {
                    //if is not confirmateur/trice or PE_Admin
                    if (!(rank <= 2) || !(rank > 0)) throw error_message.unauthorized;
                    else if (rank === 2) {
                        //<== if user is confirmateur/trice can't create society admin or more
                        const rank_request = user.request.user_rank_id;
                        if (!(rank_request <= 4) || !(rank_request > 2))
                            throw error_message.unauthorized;
                        else if (find_user.user_soc_id !== user_request.request.user_soc_id) throw error_message.unauthorized;//<== if soc id is not the same
                    }
                }
            }

            //if create user request is valid, check if user already exists
            const user_exist = await UserModel.findOne({
                user_first_name: user_request.request.user_first_name,
                user_last_name: user_request.request.user_last_name,
            });
            if (user_exist) throw error_message.already_exists;

            //check the syntax of the user request
            const user = { ...user_request.request, user_admin: false };
            const new_user = new UserModel(user);
            const save_user = await new_user.save().catch(() => {
                throw error_message.badly_formated;
            });

            return save_user;
        } catch (error) {
            throw error;
        }
    },
    read: async (user_request, query) => {
        try {
            //check if user is valid
            const find_user = await UserModel.findOne({
                user_token: user_request.sender.token,
                _id: user_request.sender._id,
            });
            if (!find_user) throw error_message.badly_formated;
            const rank = find_user.user_rank_id;

            //check if user is an administrator
            const find_user_admin = await UserModel.findOne({
                user_token: user_request.sender.token,
                _id: user_request.sender._id,
                user_admin: true,
            });
            if (!find_user_admin) {
                //<== if user is not an administrator
                //check if user is owner of client society
                const client_society_owner = await CsocietyModel.findOne({
                    csoc_admin_owner: find_user.user_token,
                });
                if (!client_society_owner) {
                    //if is not confirmateur/trice or PE_Admin
                    if (!(rank <= 2) || !(rank > 0)) throw error_message.unauthorized;
                }
            }

            //if user is valid, check if user exist
            var user_exist;
            var message;
            if (query.several === "true") {
                //<== if query is true, search for several users
                user_exist = await UserModel.find(user_request.request);
                if (!user_exist) throw error_message.not_found;

                //check if administrator is not here
                for (let i = 0; i < user_exist.length; i++) {
                    if (user_exist[i].user_admin) throw error_message.unauthorized;
                    message[i] = user_exist[i].user_first_name + " " + user_exist[i].user_last_name;
                }
            } else {
                user_exist = await UserModel.findOne(user_request.request);
                if (!user_exist) throw error_message.not_found;
                else if (user_exist.user_admin) throw error_message.unauthorized;
            }

            return { response: user_exist, response_message: message };
        } catch (error) {
            throw error;
        }
    },
    delete: async (user_request, query) => {
        try {
            //check if user is valid
            const find_user = await UserModel.findOne({
                user_token: user_request.sender.token,
                _id: user_request.sender._id,
            });
            if (!find_user) throw error_message.badly_formated;
            const rank = find_user.user_rank_id;

            //check if user is an administrator
            const find_user_admin = await UserModel.findOne({
                user_token: user_request.sender.token,
                _id: user_request.sender._id,
                user_admin: true,
            });
            if (!find_user_admin) {
                //<== if user is not an administrator
                //check if user is owner of client society
                const client_society_owner = await CsocietyModel.findOne({
                    csoc_admin_owner: find_user.user_token,
                });
                if (!client_society_owner) {
                    //if is not confirmateur/trice or PE_Admin
                    if (!(rank <= 2) || !(rank > 0)) throw error_message.unauthorized;
                }
            }

            //if user is valid, check if user exist
            var user_exist;
            if (query.several === "true") {
                //<== if query is true, search for several users
                user_exist = await UserModel.find(user_request.request);
                if (!user_exist) throw error_message.not_found;

                //check if administrator is not here
                for (let i = 0; i < user_exist.length; i++) {
                    if (user_exist[i].user_admin) throw error_message.unauthorized;
                }
            } else {
                user_exist = await UserModel.findOne(user_request.request);
                if (!user_exist) throw error_message.not_found;
                else if (user_exist.user_admin) throw error_message.unauthorized;
            }

            return user_exist;
        } catch (error) {
            throw error;
        }
    },
    update: async (user_request) => {
        try {
            //check if user is valid
            const find_user = await UserModel.findOne({
                user_token: user_request.sender.token,
                _id: user_request.sender._id,
            });
            if (!find_user) throw error_message.badly_formated;
            //check if user exist
            const user_exist = await UserModel.findOne({
                user_token: find_user.user_token,
                _id: find_user._id,
            });
            if (!user_exist) throw error_message.unauthorized;
            //check if user is the user or administrator
            if ((find_user.user_token === user_exist.user_token && find_user._id.toString() === user_exist._id.toString()) || (find_user.user_admin)) {

                const user_update = await UserModel.findOne({
                    _id: user_request.updater._id,
                });
                if (!user_update) throw error_message.badly_formated;
                else if (!user_exist.user_admin) {//<== if is not an administrator
                    if (user_request.sender._id.toString() !== user_request.updater._id.toString()) throw error_message.unauthorized;//<== if is not the user
                }
                //check if user is uptated
                const user = { ...user_request.request, user_admin: false };
                const update_user = await UserModel.updateOne(
                    { _id: user_request.updater._id }, // Critères de recherche pour identifier le document à mettre à jour
                    { $set: user } // Modification que vous souhaitez apporter au document
                );
                if (!update_user) throw error_message.badly_formated;
                return update_user;
            } else throw error_message.unauthorized;
        }
        catch (error) {
            throw error;
        }
    },
    ban: async (user_request) => {
        try {

            //check if user is valid
            const find_user = await UserModel.findOne({
                user_token: user_request.sender.token,
                _id: user_request.sender._id,
            });
            if (!find_user) throw error_message.badly_formated;

            //check if user exist
            const user_exist = await UserModel.findOne({
                user_token: find_user.user_token,
                _id: find_user._id,
            });
            if (!user_exist) throw error_message.unauthorized;

            //check if user is administrator
            if ((find_user.user_token === user_exist.user_token && find_user._id.toString() === user_exist._id.toString()) && (find_user.user_admin)) {

                const user_ban = await UserModel.findOne({
                    _id: user_request.request._id,
                });
                if (!user_ban) throw error_message.badly_formated;

                //check if user is uptated
                const ban = { user_banned: true };
                const update_user = await UserModel.updateOne(
                    { _id: user_request.request._id }, // Critères de recherche pour identifier le document à mettre à jour
                    { $set: ban } // Modification que vous souhaitez apporter au document
                );
                if (!update_user) throw error_message.badly_formated;
                if(user_ban.user_banned) throw error_message.already_banned
                return user_ban;
            } else throw error_message.unauthorized;

        } catch (error) {
            throw error;
        }
    },
    unban: async (user_request) => {
        try {
            //check if user is valid
            const find_user = await UserModel.findOne({
                user_token: user_request.sender.token,
                _id: user_request.sender._id,
            });
            if (!find_user) throw error_message.badly_formated;

            //check if user exist
            const user_exist = await UserModel.findOne({
                user_token: find_user.user_token,
                _id: find_user._id,
            });
            if (!user_exist) throw error_message.unauthorized;

            //check if user is administrator
            if ((find_user.user_token === user_exist.user_token && find_user._id.toString() === user_exist._id.toString()) && (find_user.user_admin)) {

                const user_ban = await UserModel.findOne({
                    _id: user_request.request._id,
                });
                if (!user_ban) throw error_message.badly_formated;

                //check if user is uptated
                const ban = { user_banned: false };
                const update_user = await UserModel.updateOne(
                    { _id: user_request.request._id }, // Critères de recherche pour identifier le document à mettre à jour
                    { $set: ban } // Modification que vous souhaitez apporter au document
                );
                if (!update_user) throw error_message.badly_formated;
                if(!user_ban.user_banned) throw error_message.already_banned;
                return user_ban;
            } else throw error_message.unauthorized;
        } catch (error) {
            throw error;
        }
    }
};
