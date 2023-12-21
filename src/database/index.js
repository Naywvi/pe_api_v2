const database = require("./connect_database.js");
module.exports = {
    async run(mongodbURI){
        await database.connect(mongodbURI);
    }
}
