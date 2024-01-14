const error_m = require("../../utils/error");
const cplanningModel = require("../../database/models/planning_config");

module.exports = {
  create: async (user_request, res) => {
    try {
      //> Check if user have a planning
      const find_planning = await cplanningModel.findOne({
        cplanning_society: user_request.cplanning_society,
      });
      if (find_planning !== null) throw error_m.already_exists(res);

      //> Add start date
      const startDate = Date.now();
      const startDateObj = new Date(startDate);
      user_request = { ...user_request, cplanning_startDate: startDateObj };
      user_request = {
        ...user_request,
        cplanning_society: user_request.sender.user_soc_id,
      };

      //> Delete sender field
      delete user_request.sender;

      //> Create planning
      const new_planning = new cplanningModel(user_request);
      await new_planning.save();
      if (new_planning === null) throw error_m.badly_formated(res);

      return `Planning created for user ${user_request.user}`;
    } catch (error) {
      throw error;
    }
  },
  read: async (user_request, res) => {
    try {
      //> Check if user have a planning
      const find_planning = await cplanningModel.findOne({
        cplanning_society: user_request.sender.user_soc_id,
      });
      if (find_planning === null) throw error_m.not_found(res);

      return find_planning;
    } catch (error) {
      throw error;
    }
  },
};
