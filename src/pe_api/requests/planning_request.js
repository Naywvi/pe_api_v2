const error_message = require("../../utils/error");
const planningModel = require("../../database/models/planning");

module.exports = {
  create: async (user_request) => {
    try {
      //> Check if user have a planning
      const find_planning = await planningModel.findOne({
        planning_user: user_request,
      });
      if (find_planning !== null) throw error_message.already_exists;

      //> Add start date
      const startDate = Date.now();
      const startDateObj = new Date(startDate);

      const planning = {
        planning_user: user_request,
        planning_startDate: startDateObj,
      };

      // //> Create planning
      const new_planning = new planningModel(planning);
      await new_planning.save();
    } catch (error) {
      throw error;
    }
  },
  read: async (user_request) => {
    try {
      //> Check if user have a planning
      const find_planning = await planningModel.findOne({
        user: user_request.user,
      });
      if (find_planning === null) throw error_message.not_found;

      return find_planning;
    } catch (error) {
      throw error;
    }
  },
};
