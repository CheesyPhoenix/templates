import fs from "fs";
import path from "path";
import express from "express";
import hbs from "hbs";
import fileStorage from "./fileStorage";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Finner adresse til data-mappe
const dataPath = path.join(__dirname, "../data");

//Henter lagrede data
const data = fileStorage.loadData();

//Starter opp express, og skrur på public-mappen
const app = express();
const publicDirectoryPath = path.join(__dirname, "../public");
app.use(express.static(publicDirectoryPath));

//Legger til Handlebars for å få til Server Side Rendering
const viewPath = path.join(__dirname, "../views/pages");
const partialsPath = path.join(__dirname, "../views/partials");
app.set("view engine", hbs);
app.set("views", viewPath);
hbs.registerPartials(partialsPath);

//Legge inn funksjonen hovedSideRute, slik at denne
//vises når noen åpner "topp-domenet" vårt
app.get("", (req, res) => {
	res.render("index.hbs", {
		title: "TestTitle",
		content: ["Content A", "Content B", "Content C"],
	});
});

app.listen(3000, function () {
	console.log("Server is up! Check http://localhost:3000");
});
