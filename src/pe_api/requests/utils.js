const error_m = require("../../utils/error");
const UserModel = require("../../database/models/user");
const RankModel = require("../../database/models/rank");

const permit_modifications = {
  user: [
    "user_first_name",
    "user_last_name",
    "user_mail",
    "user_phone",
    "user_birthday",
    "user_address",
    "user_zip",
    "user_pwd",
  ],
  society: [
    "user_first_name",
    "user_last_name",
    "user_mail",
    "user_phone",
    "user_birthday",
    "user_address",
    "user_zip",
    "user_pwd",
    "user_rank_id",
  ],
  confirmateur: [
    "user_first_name",
    "user_last_name",
    "user_address",
    "user_zip",
  ],
  super_admin: [
    "user_inscription_date",
    "user_token",
    "user_soc_id",
    "user_rank_id",
    "user_first_name",
    "user_last_name",
    "user_mail",
    "user_phone",
    "user_birthday",
    "user_address",
    "user_zip",
    "user_pwd",
    "user_new",
    "user_banned",
  ],
};
async function format_date(date) {
  let a = new Date(date);
  let jour = a.getUTCDate();
  let mois = a.getUTCMonth() + 1;
  let annee = a.getUTCFullYear();
  date = `${jour}/${mois}/${annee}`;
  return date;
}
module.exports = {
  //<== format the request by permit_modifications rank
  check_modifications: async (user_request, rank) => {
    var modifications = {};
    permit_modifications[rank].forEach((element) => {
      if (
        user_request.request.update[element] !== undefined &&
        user_request.request.update[element] !== ""
      ) {
        modifications[element] = user_request.request.update[element];
      }
    });
    return modifications;
  },
  // <== format the result of the request
  generate_result: async (
    message,
    object_result,
    many = false,
    rank = false,
    transformed_client = false,
    transformed_client_many = false,
    tmp_society = false,
    society = false
  ) => {
    var result_clean;
    if (many) {
      result_clean = [];
      object_result.forEach(async (user) => {
        let date = await format_date(user.user_inscription_date);
        result_clean.push({
          user_first_name: user.user_first_name,
          user_last_name: user.user_last_name,
          user_address: user.user_address,
          user_city: user.user_city,
          user_inscription_date: date,
          user_banned: user.user_banned,
          user_new: user.user_new,
          user_phone: user.user_phone,
          user_mail: user.user_mail,
          user_zip: user.user_zip,
          user_birthday: user.user_birthday,
          user_soc_id: user.user_soc_id,
          user_id: user._id,
        });
      });
    } else if (rank) {
      result_clean = {
        rank_id: object_result.rank_id,
        rank_name: object_result.rank_name,
        rank_description: object_result.rank_desc,
        rank_active: object_result.rank_active,
      };
    } else if (transformed_client) {
      result_clean = {
        transformedclient_status: object_result.transformedclient_status,
        transformedclient_first_name:
          object_result.transformedclient_first_name,
        transformedclient_last_name: object_result.transformedclient_last_name,
        transformedclient_phone: object_result.transformedclient_phone,
        transformedclient_mail: object_result.transformedclient_mail,
        transformedclient_city: object_result.transformedclient_city,
        transformedclient_zip: object_result.transformedclient_zip,
      };
    } else if (transformed_client_many) {
      result_clean = [];
      object_result.forEach((transformed_client) => {
        result_clean.push({
          transformedclient_status: transformed_client.transformedclient_status,
          transformedclient_first_name:
            transformed_client.transformedclient_first_name,
          transformedclient_last_name:
            transformed_client.transformedclient_last_name,
          transformedclient_phone: transformed_client.transformedclient_phone,
          transformedclient_mail: transformed_client.transformedclient_mail,
          transformedclient_city: transformed_client.transformedclient_city,
          transformedclient_zip: transformed_client.transformedclient_zip,
        });
      });
    } else if (tmp_society) {
      result_clean = {
        temp_society_name: object_result.temp_society_name,
        temp_society_mail: object_result.temp_society_mail,
        temp_society_owner: object_result.temp_society_owner,
        temp_society_fix: object_result.temp_society_fix,
        temp_society_siret: object_result.temp_society_siret,
        temp_society_sirene: object_result.temp_society_sirene,
        temp_society_tva: object_result.temp_society_tva,
        temp_society_legal_status: object_result.temp_society_legal_status,
        temp_society_naf: object_result.temp_society_naf,
        temp_society_beneficiary: object_result.temp_society_beneficiary,
        temp_society_address: object_result.temp_society_address,
        temp_society_city: object_result.temp_society_city,
        temp_society_zip: object_result.temp_society_zip,
      };
    } else if (society) {
      result_clean = {
        society_name: object_result.society_name,
        society_mail: object_result.society_mail,
        society_owner: object_result.society_owner,
        society_fix: object_result.society_fix,
        society_siret: object_result.society_siret,
        society_sirene: object_result.society_sirene,
        society_tva: object_result.society_tva,
        society_legal_status: object_result.society_legal_status,
        society_naf: object_result.society_naf,
        society_beneficiary: object_result.society_beneficiary,
        society_address: object_result.society_address,
        society_city: object_result.society_city,
        society_zip: object_result.society_zip,
      };
    } else {
      let date = await format_date(object_result.user_inscription_date);
      let birthday = await format_date(object_result.user_birthday);
      result_clean = {
        user_first_name: object_result.user_first_name,
        user_last_name: object_result.user_last_name,
        user_address: object_result.user_address,
        user_city: object_result.user_city,
        user_inscription_date: date,
        user_banned: object_result.user_banned,
        user_new: object_result.user_new,
        user_phone: object_result.user_phone,
        user_mail: object_result.user_mail,
        user_zip: object_result.user_zip,
        user_birthday: birthday,
        user_soc_id: object_result.user_soc_id,
        user_id: object_result._id,
      };
    }

    const result = {
      message: message,
      result: result_clean,
    };
    return result;
  },
  // <== check if user already exists
  user_exist: async (
    user_request,
    search = false,
    society_search = false,
    search_by_id = false
  ) => {
    var user_exist;
    if (society_search) {
      user_exist = await UserModel.find({
        user_soc_id: user_request.request.user_society_id,
      });
      return user_exist;
    } else if (search_by_id) {
      user_exist = await UserModel.findOne({
        _id: user_request,
      });
      return user_exist;
    } else {
      user_exist = await UserModel.findOne({
        user_mail: user_request.user_mail,
        // user_first_name: user_request.user_first_name,
        // user_last_name: user_request.user_last_name,
      });
    }

    if (search) {
      if (user_exist) throw await error_m.already_exists();
    } else if (!search) {
      if (!user_exist) throw await error_m.not_found();
      else return user_exist;
    }
  },
  //====================================================================================================
  //<== check if rank already exists
  rank_exist: async (rank_request, returned = false) => {
    try {
      const exist_rank_name = await RankModel.findOne({
        rank_name: rank_request.request.rank_name,
      });

      const exist_rank_id = await RankModel.findOne({
        rank_id: rank_request.request.rank_id,
      });
      if (returned) {
        if (exist_rank_name) return exist_rank_name;
        else if (exist_rank_id) return exist_rank_id;
      } else if (exist_rank_name || exist_rank_id) return true;
      return false;
    } catch (error) {
      throw error;
    }
  },
  basic_rank_id: async () => {
    return [99, 1, 2, 6];
  },
  moderator_rank_id: async () => {
    return [99, 98];
  },
};
