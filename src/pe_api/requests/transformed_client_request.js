const error_message = require("../../utils/error");
const transformed_client_Model = require("../../database/models/transformed_client");
const utils = require("./utils");

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
      if (exist) throw error_message.already_exists;

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
      if (!save) throw error_message.badly_formated;

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
  update: async (transformed_client_request) => {
    try {
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
      if (!exist) throw error_message.not_found;

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
      if (!transformed_client) throw error_message.badly_formated;

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
  read: async (transformed_client_request) => {
    try {
      return "a";
    } catch (error) {
      throw error;
    }
  },
};
