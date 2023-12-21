const fs = require("fs");
const readline = require("readline");
const filePath = "./src/assets/ascii.txt";

module.exports = {
  ascii: async () => {
    async function readAndPrintFile(filePath) {
      try {
        const fileStream = await fs.createReadStream(filePath);
        const rl = readline.createInterface({
          input: fileStream,
          crlfDelay: Infinity,
        });

        for await (const line of rl) {
          console.log(line);
        }
      } catch (error) {
        console.error(`Error reading file: ${error.message}`);
      }
    }

    await readAndPrintFile(filePath);
  },
};
