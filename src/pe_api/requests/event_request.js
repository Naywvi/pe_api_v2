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

        user_request.startDate = new Date(user_request.startDate) // Assurez-vous que req.body.startDate est une date valide
        user_request.endDate = new Date(user_request.endDate) // Si endDate est toujours statique
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
        if (delete_event.modifiedCount === 0) throw await error_m.badly_formatted();

        return { message: "Event deleted" };
    },
    delete_all: async (user_request) => {
        //> Check if the user has a planning
        const planning = await planningModel.findOne({ planning_user: user_request.sender._id });
        if (planning === null) throw await error_m.not_found();

        //> Check if the event exists
        const event = planning.planning_events;
        if (event === null) throw await error_m.not_found();

        //> Delete all events
        const delete_event = await planningModel.updateOne({ planning_user: user_request.sender._id }, { $set: { planning_events: [] } });
        if (delete_event.modifiedCount === 0) throw await error_m.badly_formatted();

        return { message: "All events deleted" };
    },
    update: async (user_request) => {
        //> Check if the user has a planning
        const planning = await planningModel.findOne({ planning_user: user_request.sender._id });
        if (planning === null) throw await error_m.not_found();

        //> Check if the event exists
        const event = planning.planning_events;
        if (event === null) throw await error_m.not_found();

        //> Update the event
        const update_event = await planningModel.updateOne({ planning_user: user_request.sender._id, "planning_events._id": user_request._id }, { $set: { "planning_events.$": user_request } });
        if (update_event.modifiedCount === 0) throw await error_m.badly_formatted();

        return { message: "Event updated" };
    },
    //   { start_date: "2023-04-16 10:00", end_date: "2023-04-16 12:00", text: "Front-end meeting" },
    format: async (user_request) => {

        //> Check if the user has a planning
        const planning = await planningModel.findOne({ planning_user: user_request.sender._id });
        if (planning === null) throw await error_m.not_found();

        const events = planning.planning_events;
        if (events === null) throw await error_m.not_found();

        //> Format the event
        const formattedEvents = [];

        await Promise.all(events.map(async (event) => {
            const formattedEvent = {
                start_date: event.startDate.toISOString().slice(0, 10) + ` ${event.startTime}`, // Format "AAAA-MM-JJ"
                end_date: event.endDate.toISOString().slice(0, 10) + ` ${event.endTime}`, // Format "AAAA-MM-JJ"
                text: event.text,
                _id: event._id
            };
            formattedEvents.push(formattedEvent);
        }));
        return formattedEvents
    }
}