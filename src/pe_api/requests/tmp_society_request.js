const error_message = require("../../utils/error");
const TempSocietyModel = require("../../database/models/tmp_society");
const utils = require("./utils");

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

module.exports = {
  create: async (user_request) => {
    try {
      //<== check if the society already exist
      const society_exist = await tmp_society_exist(user_request);
      if (society_exist) throw error_message.already_exists;

      //<== create the society
      const tmp_society = new TempSocietyModel(user_request.request);
      const save = await tmp_society.save();
      if (!save) throw error_message.society_not_saved;

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
      if (!society_exist) throw error_message.not_found;

      //<== read the society
      const tmp_society = await TempSocietyModel.findOne({
        temp_society_owner: user_request.request.temp_society_owner,
        temp_society_siret: user_request.request.temp_society_siret,
        temp_society_sirene: user_request.request.temp_society_sirene,
      });
      if (!tmp_society) throw error_message.not_found;

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
    } catch (error) {
      throw error;
    }
  },
  delete: async (user_request) => {
    try {
    } catch (error) {
      throw error;
    }
  },
};
