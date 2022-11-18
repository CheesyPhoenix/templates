//Lag mappen Leksjon 5 - Modul for datalagring med Json-fil
//Lag filen fileStorage.js. Dette blir modulen for lagring av 
//data til fil.

const fs = require("fs")

/**
 * Funksjon for å lagra data til fil. Data vil lagres i JSON-formatet
 * @param {*} data Data som skal lagres. Valgfri datatype 
 * @param {*} dataFilePath Lagringssted. Som standard blir den lagret til ./data/data.json
 */

let storeData = function (data, dataFilePath = "../data/data.json") {
    //Først gjør vi dataen om til tekst, etter Json standarden
    const dataInJsonFormat = JSON.stringify(data)
    fs.writeFileSync(dataFilePath, dataInJsonFormat)
    console.log("Lagret følgende data: " + dataInJsonFormat)
}

/**
 * 
 * @param {*} dataFilePath Data som skal hentes. Som standard hentes ./data/data.json
 * @returns 
 */

let loadData = function(dataFilePath = "../data/data.json") {
    const dataInJsonFormat = fs.readFileSync(dataFilePath, "utf-8")
    const data = JSON.parse(dataInJsonFormat)
    console.log("Hentet følgende data: " + data)
    return data
}

exports.storeData = storeData
exports.loadData = loadData