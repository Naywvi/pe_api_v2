const error_m = require("../../utils/error");
const transformed_client_Model = require("../../database/models/transformed_client");
const utils = require("./utils");

const permit_modifications = {
  society_and_confirmateur: [
    "transformedclient_status",
    "transformedclient_help",
    "transformedclient_first_name",
    "transformedclient_last_name",
    "transformedclient_phone",
    "transformedclient_mail",
    "transformedclient_city",
    "transformedclient_zip",
    "transformedclient_habitation",
    "transformedclient_type_residence",
    "transformedclient_type_heating",
    "transformedclient_type_boiler",
    "transformedclient_fiscal_years",
    "transformedclient_property_tax",
    "transformedclient_construction_date",
    "transformedclient_metter_habitable_surface",
    "transformedclient_isolation_type",
    "transformedclient_isolation_surface",
  ],
  super_admin: [
    "transformedclient_society_id",
    "transformedclient_status",
    "transformedclient_help",
    "transformedclient_first_name",
    "transformedclient_last_name",
    "transformedclient_phone",
    "transformedclient_mail",
    "transformedclient_city",
    "transformedclient_zip",
    "transformedclient_habitation",
    "transformedclient_type_residence",
    "transformedclient_type_heating",
    "transformedclient_type_boiler",
    "transformedclient_fiscal_years",
    "transformedclient_property_tax",
    "transformedclient_construction_date",
    "transformedclient_metter_habitable_surface",
    "transformedclient_isolation_type",
    "transformedclient_isolation_surface",
  ],
};
async function check_modifications(user_request, rank) {
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
}
async function exist_transformed_client(req) {
  try {
    const result = await transformed_client_Model.findOne({
      transformedclient_first_name: req.transformedclient_first_name,
      transformedclient_last_name: req.transformedclient_last_name,
      transformedclient_phone: req.transformedclient_phone,
      transformedclient_mail: req.transformedclient_mail,
      transformedclient_city: req.transformedclient_city,
      transformedclient_zip: req.transformedclient_zip,
    });
    if (result) return true;
    else return false;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  create: async (transformed_client_request, id) => {
    try {
      // <== check if transformed_client already exists
      const exist = await exist_transformed_client(
        transformed_client_request.request
      );
      if (exist) throw await error_m.already_exists();

      // <== create the transformed_client
      const formatted_transformed_client = {
        ...transformed_client_request.request,
        transformedclient_society_id: id,
      };
      //console.log(formatted_transformed_client);
      const transformed_client = new transformed_client_Model(
        formatted_transformed_client
      );
      const save = await transformed_client.save();
      if (!save) throw await error_m.badly_formatted();

      // <== generate the result
      const result = await utils.generate_result(
        `${transformed_client_request.request.transformedclient_first_name} was created`,
        transformed_client,
        false,
        false,
        true
      );

      return result;
    } catch (error) {
      throw error;
    }
  },
  update: async (transformed_client_request, rank) => {
    try {
      // <== check if transformed_client already exists
      const exist = await exist_transformed_client(
        transformed_client_request.request
      );
      if (!exist) throw await error_m.not_found();

      // <== check if the user can update the transformed_client
      var permissions;
      if (rank === 99) {
        permissions = await check_modifications(
          transformed_client_request,
          "super_admin"
        );
      } else if (rank === 1 || rank === 6 || rank === 6) {
        permissions = await check_modifications(
          transformed_client_request,
          "society_and_confirmateur"
        );
      } else throw await error_m.unauthorized();

      //<== delete the update key
      delete transformed_client_request.request.update;

      //<== update the transformed_client
      const transformed_client = await transformed_client_Model.updateOne(
        transformed_client_request.request,
        permissions
      );
      if (!transformed_client.modifiedCount)
        throw await error_m.already_updated();

      // <== generate the result
      const result = await utils.generate_result(
        `${transformed_client_request.request.transformedclient_first_name} was updated`,
        transformed_client_request.request,
        false,
        false,
        true
      );

      return result;
    } catch (error) {
      throw error;
    }
  },
  delete: async (transformed_client_request) => {
    try {
      // <== check if transformed_client already exists
      const exist = await exist_transformed_client(
        transformed_client_request.request
      );
      if (!exist) throw await error_m.not_found();

      // <== delete the transformed_client
      const transformed_client = await transformed_client_Model.deleteOne({
        transformedclient_first_name:
          transformed_client_request.request.transformedclient_first_name,
        transformedclient_last_name:
          transformed_client_request.request.transformedclient_last_name,
        transformedclient_phone:
          transformed_client_request.request.transformedclient_phone,
        transformedclient_mail:
          transformed_client_request.request.transformedclient_mail,
        transformedclient_city:
          transformed_client_request.request.transformedclient_city,
        transformedclient_zip:
          transformed_client_request.request.transformedclient_zip,
      });
      if (!transformed_client) throw await error_m.badly_formatted();

      // <== generate the result
      const result = await utils.generate_result(
        `${transformed_client_request.request.transformedclient_first_name} was deleted`,
        transformed_client,
        false,
        false,
        true
      );

      return result;
    } catch (error) {
      throw error;
    }
  },
  read: async (transformed_client_request, query = undefined) => {
    try {
      // <== check if transformed_client already exists
      const exist = await exist_transformed_client(
        transformed_client_request.request
      );
      if (!exist) throw await error_m.not_found();
      var result;
      if (query.visibility === "all") {
        // <== read the transformed_client of all the society
        const transformed_client = await transformed_client_Model.find({
          transformedclient_society_id:
            transformed_client_request.request.transformedclient_society_id,
        });
        if (!transformed_client) throw await error_m.not_found();

        // <== generate the result
        result = await utils.generate_result(
          `The transformed clients of the society ${transformed_client_request.request.transformedclient_society_id} was found`,
          transformed_client,
          false,
          false,
          false,
          true
        );
      } else {
        const transformed_client = await transformed_client_Model.findOne(
          transformed_client_request.request
        );
        if (!transformed_client) throw await error_m.not_found();

        // <== generate the result
        result = await utils.generate_result(
          `${transformed_client_request.request.transformedclient_first_name} was found`,
          transformed_client,
          false,
          false,
          true
        );
      }

      return result;
    } catch (error) {
      throw error;
    }
  },
};
