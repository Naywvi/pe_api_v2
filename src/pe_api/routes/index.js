const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require('body-parser');

module.exports = async (app) => {
  app.use(express.json());

  const loadRoutesRecursively = async (app, folderPath) => {
    fs.readdirSync(folderPath).forEach(async (file) => {
      const filePath = path.join(folderPath, file);
      const stat = fs.statSync(filePath);
      app.use(bodyParser.urlencoded({ extended: true }));
      if (stat.isDirectory()) {
        // if is a directory
        loadRoutesRecursively(app, filePath);
      } else if (file.endsWith(".js")) {
        //if is a js file

        try {
          const route = require(filePath);

          app[route.method.toLowerCase()](route.name, route.run);

          if (!route) throw new Error("Error loading route");
          console.log(`   Loading route ${filePath}`);
        } catch (err) {
          console.log(err);
        }
      }
    });
  };

  await loadRoutesRecursively(app, path.join(__dirname, "http"));
};
