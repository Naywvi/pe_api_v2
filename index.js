require("dotenv").config();

const startServerAndConnectToDB = async () => {
  try {
    if (!process.env.PORT_SERVER_EXPRESS)
      throw new Error("PORT_SERVER_EXPRESS is not defined in .env file");
    if (!process.env.MONGODB_URI)
      throw new Error("MONGODB_URI is not defined in .env file");

    await require("./src/utils/ascii.js").ascii();
    await require("./src/database/index.js").run(process.env.MONGODB_URI);
    await require("./src/pe_api").run(process.env.PORT_SERVER_EXPRESS);
  } catch (err) {
    console.log(err);
  }
};

startServerAndConnectToDB();
