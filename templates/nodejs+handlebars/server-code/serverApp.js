const fs = require('fs')
const path = require('path')
const express = require('express')
const hbs = require('hbs')
const fileStorage = require("./fileStorage")

//Finner adresse til data-mappe
const dataPath = path.join(__dirname, "../data")

//Henter lagrede data
const data = fileStorage.loadData();

//Starter opp express, og skrur på public-mappen
const app = express()
const publicDirectoryPath = path.join(__dirname, "../public")
app.use(express.static(publicDirectoryPath))

//Legger til Handlebars for å få til Server Side Rendering
const viewPath = path.join(__dirname, "../views/pages")
const partialsPath = path.join(__dirname, "../views/partials")
app.set("view engine", hbs)
app.set('views',viewPath)
hbs.registerPartials(partialsPath)

//Funksjon (handler) for å vise fremsiden
function hovedSideRute(request, response){
    response.render("index.hbs", {
        title: "TestTitle",
        content: ["Content A", "Content B", "Content C"]
    })
}
//Legge inn funksjonen hovedSideRute, slik at denne 
//vises når noen åpner "topp-domenet" vårt
app.get('',hovedSideRute)

app.listen(3000, function() { 
    console.log("Server is up! Check http://localhost:3000")
})


