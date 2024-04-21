const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
const port = 3000;
// MySQL-Datenbankverbindung konfigurieren
const db = mysql.createConnection({
    host: 'localhost',      // Der Host, auf dem der MySQL-Server läuft
    user: 'sudo',           // Hier muss ein MySQL-Benutzernamen angegeben werden
    password: 'Q1yW2xE3c',  // Hier muss das MySQL-Passwort für den Benutzer angegeben werden
    database: 'WeatherData' // Die Datenbank 'WeatherData' muss existieren
});

// Verbindung zur Datenbank herstellen
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySQL verbunden...');
});

app.use(bodyParser.json());

// Route zum Speichern der Wetterdaten
app.post('/saveweather', (req, res) => {
    let data = { ...req.body };
    let sql = 'REPLACE INTO Weather SET ?';
    let query = db.query(sql, data, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send('Wetterdaten gespeichert...');
    });
});

// Route zum Abrufen der Wetterdaten für einen bestimmten Standort
app.get('/getweather/:location', (req, res) => {
    let sql = 'SELECT * FROM Weather WHERE Location = ?';
    let query = db.query(sql, [req.params.location], (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

// Route zum Auslesen aller Datensätze aus Locations
app.get('/locations', (req, res) => {
    let sql = 'SELECT * FROM Locations';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Route zum Hinzufügen eines neuen Datensatzes in Locations
app.post('/addlocation', (req, res) => {
    let data = { Name: req.body.name, Query: req.body.query };
    let sql = 'INSERT INTO Locations SET ?';
    db.query(sql, data, (err, result) => {
        if (err) throw err;
        res.send('Datensatz erfolgreich hinzugefügt.');
    });
});

// Route zum Löschen eines bestimmten Datensatzes aus Locations
app.delete('/deletelocation/:name', (req, res) => {
    let sql = 'DELETE FROM Locations WHERE Name = ?';
    db.query(sql, [req.params.name], (err, result) => {
        if (err) throw err;
        res.send('Datensatz erfolgreich gelöscht.');
    });
});


app.listen(port, () => {
    console.log(`Server läuft auf Port ${port}`);
});