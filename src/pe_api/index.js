const express = require('express');
const routes = require("./routes");
module.exports = {
    async run(PORT) {
        var app = express();
        app.use(express.json());

        await routes(app)
            .then(
                app.listen(PORT, () => {
                    console.log(`\n=> [ Server is running on http://localhost:${PORT} ]\n`)
                })
            );
    }
}