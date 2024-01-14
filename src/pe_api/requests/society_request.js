const SocietyModel = require("../../database/models/society");
const error_m = require("../../utils/error");
const utils = require("./utils");

const permit_modifications = {
  society: [
    "society_name",
    "society_tel",
    "society_fix",
    "society_fax",
    "society_address",
    "society_zip",
    "society_city",
    "society_mail",
    "society_sirene",
    "society_naf",
  ],
  moderator: [
    "society_name",
    "society_tel",
    "society_fix",
    "society_fax",
    "society_address",
    "society_zip",
    "society_city",
    "society_mail",
    "society_rank_id",
  ],
  super_admin: [
    "society_name",
    "society_tel",
    "society_fix",
    "society_fax",
    "society_address",
    "society_zip",
    "society_city",
    "society_mail",
    "society_sirene",
    "society_naf",
    "society_siret",
    "society_naf",
    "society_tva",
    "society_rank_id",
  ],
};

//<== add permit_modifications to the rank
async function society_permits(user_request, rank) {
  try {
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
  } catch (error) {
    throw error;
  }
}

//<== check if the society exist
async function exist_society(user_request) {
  try {
    const society = await SocietyModel.findOne({
      society_sirene: user_request.request.society_sirene,
      society_siret: user_request.request.society_siret,
    });
    if (!society) return false;
    return true;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  create: async (user_request) => {
    try {
      //<== check if the society exist
      const exist_s = await exist_society(user_request);
      if (exist_s) throw await error_m.already_exists();

      //<== create the society
      const society = new SocietyModel(user_request.request);
      const save = await society.save();
      if (!save) throw await error_m.badly_formatted();

      //<== generate the result
      const result = utils.generate_result(
        `${user_request.request.society_name} was created`,
        society,
        false,
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
  update: async (user_request, rank) => {
    try {
      //<== check if the society exist
      const exist_s = await exist_society(user_request);
      if (!exist_s) throw await error_m.not_found();
      var modifications;
      //<== check if the rank is allowed to modify the society
      if (rank === 99) {
        modifications = await society_permits(user_request, "super_admin");
      } else if (rank === 98) {
        modifications = await society_permits(user_request, "moderator");
      } else if (rank === 1) {
        modifications = await society_permits(user_request, "society");
      } else throw await error_m.unauthorized();

      //<== update the society
      const society = await SocietyModel.findOne({
        society_sirene: user_request.request.society_sirene,
        society_siret: user_request.request.society_siret,
      });
      if (!society) throw await error_m.not_found();

      const update = await SocietyModel.updateOne(society, modifications);
      if (update.modifiedCount === 0) throw await error_m.already_updated();
      console.log(update);
      //<== generate the result
      const result = utils.generate_result(
        `${society.society_name} was updated`,
        society,
        false,
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
      //<== check if the society exist
      const exist_s = await exist_society(user_request);
      if (!exist_s) throw await error_m.not_found();

      if (!user_request.request.society_name)
        throw await error_m.badly_formatted();

      //<== delete the society
      const society = await SocietyModel.findOneAndDelete({
        society_sirene: user_request.request.society_sirene,
        society_siret: user_request.request.society_siret,
      });
      if (!society) throw await error_m.not_found();

      //<== generate the result
      const result = utils.generate_result(
        `${society.society_name} was deleted`,
        society,
        false,
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
      //<== check if the society exist
      const exist_s = await exist_society(user_request);
      if (!exist_s) throw await error_m.not_found();

      //<== find the society
      const society = await SocietyModel.findOne({
        society_sirene: user_request.request.society_sirene,
        society_siret: user_request.request.society_siret,
      });
      if (!society) throw await error_m.not_found();

      //<== generate the result
      const result = utils.generate_result(
        `${society.society_name} was found`,
        society,
        false,
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
  ban: async (user_request) => {
    try {
      //<== check if the society exist
      const exist_s = await exist_society(user_request);
      if (!exist_s) throw await error_m.not_found();

      //<== ban the society
      const society = await SocietyModel.findOneAndUpdate(
        {
          society_sirene: user_request.request.society_sirene,
          society_siret: user_request.request.society_siret,
        },
        { society_banned: true }
      );
      if (!society) throw await error_m.not_found();

      //<== ban all users from the society
      const user = await UserModel.updateMany(
        { user_soc_id: society.society_id },
        { user_banned: true }
      ).catch(async () => {
        throw await error_m.badly_formatted();
      });

      //<== generate the result
      const result = utils.generate_result(
        `${society.society_name} was banned`,
        society,
        false,
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
  unban: async (user_request) => {
    try {
      //<== check if the society exist
      const exist_s = await exist_society(user_request);
      if (!exist_s) throw await error_m.not_found();

      //<== ban the society
      const society = await SocietyModel.findOneAndUpdate(
        {
          society_sirene: user_request.request.society_sirene,
          society_siret: user_request.request.society_siret,
        },
        { society_banned: false }
      );
      if (!society) throw await error_m.not_found();

      //<== ban all users from the society
      const user = await UserModel.updateMany(
        { user_soc_id: society.society_id },
        { user_banned: false }
      ).catch(async () => {
        throw await error_m.badly_formatted();
      });

      //<== generate the result
      const result = utils.generate_result(
        `${society.society_name} was banned and all users unbanned`,
        society,
        false,
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
};
