// Globale Variablen
// OpenWeatherMap API-Schlüssel
const apiKey = "21b16efc49537cee3968102a84a92750";
// URL:PORT auf der der Node-Server (server.js) läuft
const nodeServer = 'http://localhost:3000/'
// Globales Objekt, das Informationen zu mehreren Städten speichert
const weatherinfo = {};
// Referenzen auf HTML-Objekte
const inputNewPlace = document.getElementById('NewPlace');
const inputNewQuery = document.getElementById('NewQuery');
const configOptions = document.getElementById('ConfigOptions');
const allLocations  = document.getElementById('LocationList');
const formResponse  = document.getElementById('FormResponder');

// SVG-Grafiken
const SVGicon = {
view: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M5 12s2.545-5 7-5c4.454 0 7 5 7 5s-2.546 5-7 5c-4.455 0-7-5-7-5z" />
    <path d="M12 13a1 1 0 100-2 1 1 0 000 2z" />
    <path d="M21 8V5a2 2 0 00-2-2H5a2 2 0 00-2 2v3m18 8v3a2 2 0 01-2 2H5a2 2 0 01-2-2v-3" />
</svg>`,

trash: `<svg width="20px" height="20px" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
<g id="invisible_box" data-name="invisible box">
    <rect width="48" height="48" fill="none"/>
</g>
<g id="icons_Q2" data-name="icons Q2">
    <path d="M43,8.8a2.3,2.3,0,0,1-.6,1.6A1.7,1.7,0,0,1,41,11H7.1A2.1,2.1,0,0,1,5,9.2a2.3,2.3,0,0,1,.6-1.6A1.7,1.7,0,0,1,7,7H17V5a2,2,0,0,1,2-2H29a2,2,0,0,1,2,2V7h9.9A2.1,2.1,0,0,1,43,8.8Z"/>
    <path d="M11.2,15h0a2,2,0,0,0-2,2.2l2.6,26a2,2,0,0,0,2,1.8H34.2a2,2,0,0,0,2-1.8l2.6-26a2,2,0,0,0-2-2.2H11.2Z"/>
</g>
</svg>`
}

// Funktion zum Abrufen der Wetterdaten
async function fetchWeather() {
    try {
        // Warten auf das Auslesen der Standorte
        await GetLocations();
        // Erstellen der Liste der Standorte
        generateCityListHTML();

        Object.values(weatherinfo).forEach(city => {
            // Erstellen der API-URL mit den Koordinaten der Stadt
            //let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&appid=${apiKey}&units=metric&lang=de`;
            // API-URL mit Such-String "q"
            let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city.query}&appid=${apiKey}&units=metric&lang=de`;
    
            // Abrufen der Wetterdaten von der OpenWeatherMap API
            fetch(apiUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Wetterdaten konnten nicht geladen werden');
                    }
                    return response.json();
                })
                .then(data => {
                    // Aufruf der saveWeather-Funktion mit den abgerufenen Daten
                    saveWeather(data);
                })
                .catch(error => {
                    console.error('Fehler beim Abrufen der Wetterdaten:', error);
                });
        });
    } catch (error) {
        console.error('Fehler beim Abrufen der Standorte:', error);
    }
}

// Funktion zum Speichern der Wetterdaten
function saveWeather(weatherData) {
    // Extrahieren der benötigten Daten
    let weatherPayload = {
        Location: String(weatherData.name),
        Temp: parseFloat(weatherData.main.temp).toFixed(0),
        TempMin: parseFloat(weatherData.main.temp_min).toFixed(0),
        TempMax: parseFloat(weatherData.main.temp_max).toFixed(0),
        Pressure: String(weatherData.main.pressure),
        Humidity: String(weatherData.main.humidity),
    };
    // Senden der Daten an den Server
    fetch(nodeServer+'saveweather', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(weatherPayload),
    })
    .then(response => response.text())
    .then(data => {
        console.log(`Server response:\n${data}`);
    })
    .catch((error) => {
        console.error(`Wetter-Daten konnten nicht gespeichert werden:\n${error}`);
    });
}

// Funktion zum Abrufen der gespeicherten Wetterdaten für einen bestimmten Standort
function getWeather(location, callback) {
    fetch(nodeServer+`getweather/${location}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Wetterdaten konnten nicht abgerufen werden');
            }
            return response.json();
        })
        .then(data => {
            // Aufruf der Callback-Funktion mit den abgerufenen Daten
            callback(data);
        })
        .catch(error => {
            console.error('Fehler beim Abrufen der Wetterdaten:', error);
        })
    ;
}

// Funktion zum Generieren der HTML-Struktur für die Städteliste
function generateCityListHTML() {
    let htmlCode = '<table class="selectTable" cellspacing="0" cellpadding="0">';
    // Durchlaufen des weatherinfo-Objekts und Hinzufügen der Städte zum HTML-String
    Object.values(weatherinfo).forEach(city => {
        htmlCode += `
            <tr>
                <td class="selTabL fontNormal"><strong>${city.name}</strong></td>
                <td class="selTabR fontNormal" onclick="ShowWeatherInfo('${city.name}')">${SVGicon.view}</td>
            </tr>
        `;
    });
    htmlCode += '</table>';
    // Einfügen des generierten HTML-Codes in den DIV-Container
    document.getElementById('selectBox').innerHTML = htmlCode;
}

// Funktion zum Abrufen und Anzeigen der Wetterdaten nach Standort
function ShowWeatherInfo(LocationID) {
    let Content = document.getElementById('WeatherData');
    let htmlcode = ``;
    let data;
    getWeather(LocationID, function(wdata) {
        // Überprüfen, ob Daten vorhanden sind
        if (wdata && wdata.length > 0) {
            data = wdata[0]; // Nehmen wir das erste Element, wenn mehrere zurückgegeben werden
            htmlcode = `<weather-infocard cardid='Weather-${data.Location}' `+
            `visibility='visible' posx='calc((100% - 200px) / 2)' posy='360px' `+
            `Location='${data.Location}' Temp='${data.Temp}' `+
            `TempMin='${data.TempMin}' TempMax='${data.TempMax}' `+
            `Pressure='${data.Pressure}' Humidity='${data.Humidity}'>
            </weather-infocard>`;
            // Setzen des HTML-Codes im DOM
            Content.innerHTML = htmlcode;
        } else {
            console.error(`Für den Ort ${LocationID} konnten keine Daten abgerufen werden.`);
            htmlcode = `<table class="WeatherError fontNormal" cellspacing="0" cellpadding="0">
                <tr>
                    <td><strong>Wetterdaten für<br>${LocationID}<br>nicht verfügbar</strong></td>
                </tr>
            </table>`;
            Content.innerHTML = htmlcode;
        }
    });
}

// Diese Funktion ruft alle Standorte aus der Datenbank ab und speichert sie im globalen Objekt weatherinfo.
function GetLocations() {
    return new Promise((resolve, reject) => {
        fetch(nodeServer + 'locations')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Fehler beim Abrufen der Standort-Daten');
                }
                return response.json();
            })
            .then(data => {
                // Leeren des aktuellen weatherinfo Objekts
                Object.keys(weatherinfo).forEach(key => delete weatherinfo[key]);
                
                // Füllen des weatherinfo Objekts mit den neuen Daten
                data.forEach((location, index) => {
                    weatherinfo[`city${index + 1}`] = {
                        name: location.Name,
                        query: location.Query
                    };
                });
                resolve();
            })
            .catch(error => {
                console.error('Fehler beim Abrufen der Standort-Daten:', error);
                reject(error);
            });
    });
}

// Funktion fügt eine neue Location zur Datenbank hinzu
function AddNewLocation(LocationID, QueryString) {
    return new Promise((resolve, reject) => {
        fetch(nodeServer + 'addlocation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: LocationID, query: QueryString }),
        })
        .then(response => response.text())
        .then(data => {
            console.log('Neue Daten erfolgreich in SQL-Datenbank gespeichert:', data);
            resolve(true);
        })
        .catch((error) => {
            console.error('Fehler beim Speichern der Daten in der SQL-Datenbank:', error);
            reject(error);
        });
    });
}

// Funktion löscht eine Location aus der Datenbank
function RemoveLocation(LocationID) {
    return new Promise((resolve, reject) => {
        fetch(nodeServer + `deletelocation/${LocationID}`, {
            method: 'DELETE',
        })
        .then(response => response.text())
        .then(data => {
            console.log('Datensatz wurde erfolgreich aus der SQL-Datenbank gelöscht:', data);
            resolve(true);
        })
        .catch((error) => {
            console.error('Fehler beim Löschen der Daten aus der SQL-Datenbank:', error);
            reject(error);
        });
    });
}

// Funktion wird bei Klick auf das "Schraubenschlüsse"-Symbol aufgerufen
function ShowConfigLayer() {
    // Dynamisches generieren der Liste aller Orte
    let htmlCode = '<table class="selectTable" cellspacing="0" cellpadding="0">';
    // Durchlaufen des weatherinfo-Objekts und Hinzufügen der Städte zum HTML-String
    Object.values(weatherinfo).forEach(city => {
        htmlCode += `
            <tr>
                <td class="selTabL fontNormal"><strong>${city.name}</strong></td>
                <td class="selTabR fontNormal" onclick="DeleteLocation('${String(city.name)}')">${SVGicon.trash}</td>
            </tr>
        `;
    });
    htmlCode += '</table>';
    // HTML Code veröffentlichen
    allLocations.innerHTML = htmlCode;
    // Zurücksetzen der Eingabefelder
    inputNewPlace.value = "";
    inputNewQuery.value = "";
    // Einblenden des "Config"-Layers
    configOptions.style.visibility = 'visible';
}

// Funktion wird bei Klick auf den "Schließen"-Button aufgerufen
function HideConfigLayer() {
    // Zurücksetzen der Eingabefelder (sicherheitshalber)
    inputNewPlace.value = "";
    inputNewQuery.value = "";
    // Einblenden des "Config"-Layers
    configOptions.style.visibility = 'hidden';
}

// Funktion wird bei Klick auf "Speichern" aufgerufen
async function SaveNewLocation() {
    let local = {error: false, debug: '',};
    let response;
    // speichern der Werte aus den Eingabefeldern
    let varNewPlace = String(inputNewPlace.value).trim();
    let varNewQuery = String(inputNewQuery.value).trim();
    try {
        if(varNewPlace.length === 0 || varNewQuery.length === 0) {
            local.error = true;
            local.debug = "Es müssen beide Felder ausgefüllt werden";
        } else if (varNewQuery.includes(",") !== true) {
            local.error = true;
            local.debug = "Der Such-String muss ein Komma enthalten";
        }
        Object.values(weatherinfo).forEach(city => {
            // Zerlegen der Such-Strings für einen besseren Abgleich
            let splitQuery = varNewQuery.split(",");
            splitQuery[0] = String(splitQuery[0]).toLowerCase().trim();
            splitQuery[1] = String(splitQuery[1]).toLowerCase().trim();
            let splitValue = String(city.query).split(",");
            splitValue[0] = String(splitValue[0]).toLowerCase().trim();
            splitValue[1] = String(splitValue[1]).toLowerCase().trim();
            // Prüfen auf identischen Eintrag
            if(splitQuery[0] === splitValue[0] && splitQuery[1] === splitValue[1]) {
                // Den angegebenen Such-String gibt es bereits!
                if( String(city.name).toLowerCase() === varNewPlace.toLowerCase()) {
                    // Beide Einträge stimmen überein
                    console.log("Match found: Both entries match");
                    local.error = true;
                    local.debug = "Es gibt bereits einen Eintrag mit identischen Angaben.";
                } else {
                    // Nur der Such-String ist identisch
                    console.log("Match found: Search-String matches!");
                    local.error = true;
                    local.debug = "Der angegebene Such-String existiert bereits.";
                }
            }
            // Hier würde nun mindestens ein Teil des Such-Strings übereinstimmen ... was im Grunde kein Problem ist.
            // Einziges "Problem" könnte sein, dass openweathermap zu diesem Such-String kein Ergebnis liefern kann.
        });
        if(local.error === false) {
            // Bis jetzt gibt es keine Fehler
            // Vorbereiten der Daten
            let splitQuery = varNewQuery.split(",");
            splitQuery[0] = String(splitQuery[0]).trim();
            splitQuery[1] = String(splitQuery[1]).trim();
            // Schreibt den Datensatz in die SQL-Datenbank
            response = await AddNewLocation(varNewPlace,`${splitQuery[0]}, ${splitQuery[1]}`);
            if(response === true) {
                // Erneutes Initalisieren der Datensätze
                await fetchWeather();
                // Erneutes Erstellen der Liste der Standorte
                generateCityListHTML();
                // Führt u.A. eine Re-Initialisierung der Liste aller Orte durch
                ShowConfigLayer();
                // Einblenden einer Meldung
                ConfigMessage('success','Eintrag wurde in der Datenbank gespeichert.');
            } else {
                ConfigMessage('error','Datensatz konnte nicht erstellt werden!');
            }
        } else {
            // Es ist ein Fehler aufgetreten -> Meldung einblenden
            ConfigMessage('error',String(local.debug));
        }
    } catch (error) {
        console.error(`Fehler in Funktion SaveNewLocation():\n${error}`);
        // Es ist ein Fehler aufgetreten -> Meldung einblenden
        ConfigMessage('error','Die Daten konnten nicht verarbeitet werden!');
    }
}

// Funktion wird bei Klick auf den "Abbrechen"-Button aufgerufen
function CancelNewLocation() {
    // Zurücksetzen der Eingabefelder und Meldung einblenden
    ConfigMessage('','Formular wurde zurückgesetzt.');
}

// Funktion wird bei Klick auf das "Mülleimer"-Symbol aufgerufen
async function DeleteLocation(LocationID) {
    let local = {error: false, debug: '',};
    let response;
    try {
        // Löschen des Datensatzes aus der SQL-Datenbank
        response = await RemoveLocation(LocationID);
        if(response === true) {
            // Erneutes Initalisieren der Datensätze
            await fetchWeather();
            // Erneutes Erstellen der Liste der Standorte
            generateCityListHTML();
            // Führt u.A. eine Re-Initialisierung der Liste aller Orte durch
            ShowConfigLayer();
            // Einblenden einer Meldung
            ConfigMessage('success','Eintrag wurde aus der Datenbank gelöscht.');
        } else {
            // Es ist ein Fehler aufgetreten -> Meldung einblenden
            ConfigMessage('error','Löschen des Datensatzes fehlgeschlagen!');
        }
    } catch (error) {
        console.error(`Fehler in Funktion SaveNewLocation():\n${error}`);
        // Es ist ein Fehler aufgetreten -> Meldung einblenden
        ConfigMessage('error','Der Vorgang konnte nicht durchgeführt werden!');
    }

}

// Funktion zum Anzeigen/Einblenden einer Meldung
function ConfigMessage(type,message) {
    let varType = String(type).toLowerCase();
    if(varType === 'success') {
        formResponse.style.backgroundColor = '#00A323';
        formResponse.style.border = '2px solid rgba(0, 109, 24, 0.8)';
        formResponse.style.color  = '#303030';
        formResponse.innerHTML = `<strong>${message}</strong>`;
        formResponse.style.visibility = 'visible';
        setTimeout(function() {
            // Lässt die Meldung nach 3 Sekunden verschwinden
            formResponse.style.visibility = 'hidden';
        }, 3000);
    } else if(varType === 'error') {
        formResponse.style.backgroundColor = '#CC0000';
        formResponse.style.border = '2px solid rgba(153, 0, 0, 0.8)';
        formResponse.style.color  = '#F3F3F3';
        formResponse.innerHTML = `<strong>${message}</strong>`;
        formResponse.style.visibility = 'visible';
        setTimeout(function() {
            // Lässt die Meldung nach 3 Sekunden verschwinden
            formResponse.style.visibility = 'hidden';
        }, 3000);
    } else {
        inputNewPlace.value = "";
        inputNewQuery.value = "";
        formResponse.style.backgroundColor = '#F3F3F3';
        formResponse.style.border = '2px solid rgba(48,48,48,0.8)';
        formResponse.style.color  = '#303030';
        formResponse.innerHTML = `<strong>${message}</strong>`;
        formResponse.style.visibility = 'visible';
        setTimeout(function() {
            // Blendet die Meldung automatisch nach 3 Sekunden aus
            formResponse.style.visibility = 'hidden';
        }, 3000);
    }
}

// Wetterdaten beim Laden der Seite abrufen und Städteliste generieren
document.addEventListener('DOMContentLoaded', () => {
    fetchWeather();
});