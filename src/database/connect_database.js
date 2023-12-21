const mongoose = require('mongoose');

module.exports = {
    async connect(mongodbURI){
        try{
            const client = await mongoose.connect(mongodbURI);

            if(!client)
                throw new Error("Error connecting to database");
            
            console.log("=> [ Connected to database successfully ]\n");

        }
        catch(err){
            console.log(err);
        }
    }
}




