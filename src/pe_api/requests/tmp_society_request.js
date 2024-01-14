const error_m = require("../../utils/error");
const TempSocietyModel = require("../../database/models/tmp_society");
const utils = require("./utils");
const permit_modifications = {
  moderator_and_admin: [
    "temp_society_owner",
    "temp_society_audited",
    "temp_society_comment",
    "temp_society_rank",
    "temp_society_name",
    "temp_society_phone",
    "temp_society_fix",
    "temp_society_fax",
    "temp_society_mail",
    "temp_society_zip",
    "temp_society_city",
    "temp_society_address",
    "temp_society_beneficiary",
    "temp_society_web",
    "temp_society_siret",
    "temp_society_sirene",
    "temp_society_tva",
    "temp_society_legal_status",
    "temp_society_naf",
    "temp_society_certification",
  ],
};
async function tmp_society_exist(tmp_society) {
  try {
    const tmp_society_exist = await TempSocietyModel.findOne({
      temp_society_siret: tmp_society.request.temp_society_siret,
      temp_society_sirene: tmp_society.request.temp_society_sirene,
    });
    if (tmp_society_exist) return true;
    return false;
  } catch (error) {
    throw error;
  }
}
async function check_modifications(user_request) {
  var modifications = {};
  permit_modifications["moderator_and_admin"].forEach((element) => {
    if (
      user_request.request.update[element] !== undefined &&
      user_request.request.update[element] !== ""
    ) {
      modifications[element] = user_request.request.update[element];
    }
  });
  return modifications;
}

module.exports = {
  create: async (user_request) => {
    try {
      //<== check if the society already exist
      const society_exist = await tmp_society_exist(user_request);
      if (society_exist) throw await error_m.already_exists();

      //<== create the society
      const tmp_society = new TempSocietyModel(user_request.request);
      const save = await tmp_society.save();
      if (!save) throw await error_m.society_not_saved();

      //<== return the result
      const result = await utils.generate_result(
        `${user_request.request.temp_society_name} was created`,
        tmp_society,
        false,
        false,
        false,
        false,
        true
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
  read: async (user_request) => {
    try {
      //<== check if the society already exist
      const society_exist = await tmp_society_exist(user_request);
      if (!society_exist) throw await error_m.not_found();

      //<== read the society
      const tmp_society = await TempSocietyModel.findOne({
        temp_society_owner: user_request.request.temp_society_owner,
        temp_society_siret: user_request.request.temp_society_siret,
        temp_society_sirene: user_request.request.temp_society_sirene,
      });
      if (!tmp_society) throw await error_m.not_found();

      //<== return the result
      const result = await utils.generate_result(
        `${tmp_society.temp_society_name} was found`,
        tmp_society,
        false,
        false,
        false,
        false,
        true
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
  update: async (user_request) => {
    try {
      //<== check if the society already exist
      const society_exist = await tmp_society_exist(user_request);
      if (!society_exist) throw await error_m.not_found();

      //<== check the modifications
      const modifications = await check_modifications(user_request);
      if (modifications.length === 0) throw await error_m.no_modifications();

      //<== delete the update request
      delete user_request.request.update;

      //forced find to result

      const result_tmp_society = await TempSocietyModel.findOne({
        temp_society_siret: user_request.request.temp_society_siret,
        temp_society_sirene: user_request.request.temp_society_sirene,
      });

      //<== update the tmp society
      const tmp_society = await TempSocietyModel.updateOne(
        result_tmp_society,
        modifications
      );
      if (tmp_society.modifiedCount === 0) throw await error_m.update_failed();

      //<== return the result
      const result = await utils.generate_result(
        `${result_tmp_society.temp_society_name} was updated`,
        result_tmp_society,
        false,
        false,
        false,
        false,
        true
      );

      return result;
    } catch (error) {
      throw error;
    }
  },
  delete: async (user_request) => {
    try {
      //<== check if the society already exist
      const society_exist = await tmp_society_exist(user_request);
      if (!society_exist) throw await error_m.not_found;

      //<== read the society
      const tmp_society = await TempSocietyModel.findOneAndDelete({
        temp_society_owner: user_request.request.temp_society_owner,
        temp_society_siret: user_request.request.temp_society_siret,
        temp_society_sirene: user_request.request.temp_society_sirene,
      });
      if (!tmp_society) throw await error_m.not_found();
      if (tmp_society.modifiedCount === 0) throw await error_m.not_found();

      //<== return the result
      const result = await utils.generate_result(
        `${tmp_society.temp_society_name} was deleted`,
        tmp_society,
        false,
        false,
        false,
        false,
        true
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
  audit_validation: async (user_request) => {
    try {
    } catch (error) {
      throw error;
    }
  },
  audit_refused: async (user_request) => {
    try {
    } catch (error) {
      throw error;
    }
  },
};
