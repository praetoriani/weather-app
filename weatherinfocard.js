/*
*/
class WeatherInfoCard extends HTMLElement {

    // Getter zum Überwachen der Attribute der Komponente
    static get observedAttributes() {
        return ['cardid', 'visibility', 'posx', 'posy', 'Location', 'Temp', 'TempMin', 'TempMax', 'Pressure', 'Humidity'];
    }
    
    constructor() {
        // Aufruf des Konstruktors der Eltern-Klasse (HTMLElement).
        super();
        // Hinzufügen des Custom Elements zum Shadow Root
        this.attachShadow({ mode: 'open' });
        // Variablen für die Attribute initialisieren
        this.varCardID = "";
        this.varDisplay = "";
        this.varPosX = "";
        this.varPosY = "";
        this.varLocation = "";
        this.varTempCur = "";
        this.varTempMin = "";
        this.varTempMax = "";
        this.varHumidity = "";
        this.varPressure = "";
        // Benötigt für Errorhandling
        this.BugSniffer = false;
    }

    CatchAttributes() {
        let errormsg = ``;
        // Abrufen der Attribut-Werte der Komponente
        this.varCardID   = this.getAttribute('cardid');
        this.varDisplay  = this.getAttribute('visibility');
        this.varPosX     = this.getAttribute('posx');
        this.varPosY     = this.getAttribute('posy');
        this.varLocation = this.getAttribute('Location');
        this.varTempCur  = this.getAttribute('Temp');
        this.varTempMin  = this.getAttribute('TempMin');
        this.varTempMax  = this.getAttribute('TempMax');
        this.varHumidity = this.getAttribute('Humidity');
        this.varPressure = this.getAttribute('Pressure');
        // Prüfen auf mögliche Fehler
        if(typeof this.varCardID !== 'string' || this.varCardID.length == 0) {
            // Attribut cardid ist ungültig
            this.BugSniffer = true;
            errormsg = `Attribut cardid ist entweder nicht definiert oder hat den falschen Typ!\n`;
            console.error(`Fehler in der Klasse WeatherInfoCard:\n${errormsg}`);
        } else if(typeof this.varDisplay !== 'string') {
            // Attribut visibility ist ungültig
            this.BugSniffer = true;
            errormsg = `Attribut visibility hat den falschen Typ (muss ein String sein)!\n`;
            console.error(`Fehler in der Klasse WeatherInfoCard:\n${errormsg}`);
        } else if(this.varDisplay.toLowerCase() !== 'visible' && this.varDisplay.toLowerCase() !== 'hidden') {
            // Attribut visibility ist ungültig
            this.BugSniffer = true;
            errormsg = `Attribut visibility hat den falschen Wert (kann nur 'visible' oder 'hidden' sein)!\n`;
            console.error(`Fehler in der Klasse WeatherInfoCard:\n${errormsg}`);
        } else if(typeof this.varLocation !== 'string') {
            // Attribut visibility ist ungültig
            this.BugSniffer = true;
            errormsg = `Attribut Location hat den falschen Typ (muss ein String sein)!\n`;
            console.error(`Fehler in der Klasse WeatherInfoCard:\n${errormsg}`);
        }
    }

    // connectedCallback() wird ausgeführt, wenn die Komponente im DOM gerendert wird
    connectedCallback() {
        // Abrufen der Attribut-Werte der Komponente
        this.CatchAttributes();
        // Komponente rendern
        this.RenderComponent();
        // RESERVED FOR LATER USE
        this.addEventListeners();
    }

    // The RenderComponent method will generate
    // the HTML content of the custom element.
    RenderComponent() {
        // Set the inner HTML of the shadow root
        this.shadowRoot.innerHTML = `<style>
        @import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');
        .fontHead {
            font-family: "Roboto", sans-serif;
            font-weight: 400;
            font-style: normal;
            font-size: 18px;
        }
        
        .fontNormal {
            font-family: "Roboto", sans-serif;
            font-weight: 400;
            font-style: normal;
            font-size: 14px;
        }
        .weatherBox {
            width: 200px;
            height: auto;
            background-color: #F3F3F3;
            border: 2px solid rgba(48,48,48,0.8);
            border-radius: 11px;
            position: absolute;
            top: ${this.varPosY};
            left: ${this.varPosX};
            overflow: hidden;
            visibility: ${this.varDisplay};
        }
        .weatherTable {
            width: 100%;
            height: auto;
            padding: 0px;
            margin: 0px;
        }
        .wTabHead {
            width: 100%;
            height: 40px;
            text-align: center;
            vertical-align: middle;
        }
        .wTabSideL {
            width: 50%;
            height: 40px;
            text-align: left;
            vertical-align: middle;
            padding-left: 8px;
        }
        .wTabSideR {
            width: 50%;
            height: 40px;
            text-align: right;
            vertical-align: middle;
            padding-right: 8px;
        }
        </style>
        <div id="weatherBox" class="weatherBox">
            <table class="weatherTable" cellspacing="0" cellpadding="0">
                <tr>
                    <td colspan="2" class="wTabHead fontHead">${this.varLocation}</td>
                </tr>
                <tr>
                    <td class="wTabSideL fontNormal"><strong>Temperatur</strong></td>
                    <td class="wTabSideR fontNormal">${this.varTempCur} °C</td>
                </tr>
                <tr>
                    <td class="wTabSideL fontNormal"><strong>Temp. Min.:</strong></td>
                    <td class="wTabSideR fontNormal">${this.varTempMin} °C</td>
                </tr>
                <tr>
                    <td class="wTabSideL fontNormal"><strong>Temp. Max.:</strong></td>
                    <td class="wTabSideR fontNormal">${this.varTempMax} °C</td>
                </tr>
                <tr>
                    <td class="wTabSideL fontNormal"><strong>Luftfeuchte:</strong></td>
                    <td class="wTabSideR fontNormal">${this.varHumidity} %</td>
                </tr>
                <tr>
                    <td class="wTabSideL fontNormal"><strong>Luftdruck:</strong></td>
                    <td class="wTabSideR fontNormal">${this.varPressure} hPa</td>
                </tr>
            </table>
        </div>
        `;
        // Wird nicht benötigt
        //this.UpdateComponent();
    }
    UpdateComponent() {
    }
    
    addEventListeners() {
    }

}
/* Erstellen des Custom Element */
window.customElements.define('weather-infocard', WeatherInfoCard);