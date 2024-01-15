const error_m = require("../../utils/error");
const planningModel = require("../../database/models/planning");

//Parse by "/"
async function date_parse(date) {
    const dateParts = date.split("/"); // Divisez la chaîne en parties en utilisant le tiret comme séparateur
    const day = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1; // Soustrayez 1 du mois car les mois dans JavaScript sont de 0 à 11
    const year = parseInt(dateParts[2], 10);
    return new Date(year, month, day);
}

module.exports = {
    create: async (user_request) => {
        //> Check if the user has a planning
        const planning = await planningModel.findOne({ planning_user: user_request.sender._id });
        if (planning === null) throw await error_m.not_found();

        delete user_request.sender;

        //> Add date format to the event
        user_request.startDate = new Date(await date_parse(user_request.startDate)) // Assurez-vous que req.body.startDate est une date valide
        user_request.endDate = new Date(await date_parse(user_request.endDate)) // Si endDate est toujours statique
        planning.planning_events.push(user_request);

        //> Save the event
        const save = await planning.save();
        if (save === null) throw await error_m.badly_formatted();

        return { message: "Event created" };
    },
    read: async (user_request) => {
        //> Check if the user has a planning
        const planning = await planningModel.findOne({ planning_user: user_request.sender._id });
        if (planning === null) throw await error_m.not_found();

        //> Check if the event exists
        const event = planning.planning_events;
        if (event === null) throw await error_m.not_found();

        return event;
    },
    delete_one: async (user_request) => {
        //> Check if the user has a planning
        const planning = await planningModel.findOne({ planning_user: user_request.sender._id });
        if (planning === null) throw await error_m.not_found();

        //> Check if the event exists
        const event = planning.planning_events;
        if (event === null) throw await error_m.not_found();

        //> Delete the event
        const delete_event = await planningModel.updateOne({ planning_user: user_request.sender._id }, { $pull: { planning_events: { _id: user_request._id } } });
        console.log(user_request)
        if (delete_event.modifiedCount === 0) throw await error_m.badly_formatted();

        return { message: "Event deleted" };
    },
}