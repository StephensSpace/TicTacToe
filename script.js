let fields = [
    'cross',
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null
];

// Gewinnbedingungen
const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// SVGs für X (Blau) und Kreis (Rot)
const svgCross = `
    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 100 100">
        <line x1="10" y1="10" x2="90" y2="90" stroke="blue" stroke-width="10"/>
        <line x1="90" y1="10" x2="10" y2="90" stroke="blue" stroke-width="10"/>
    </svg>
`;

const svgCircle = `
    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" stroke="red" stroke-width="10" fill="none" />
    </svg>
`;

// Variable für den aktuellen Spieler, initial 'cross'
let currentPlayer = 'cross';

// Spiel neu starten
function init() {
    fields = [null, null, null, null, null, null, null, null, null];
    currentPlayer = 'cross';
    render();
}

// Klick-Event für Spielfeld
function fieldClick(index) {
    // Überprüfen, ob das Feld bereits besetzt ist
    if (fields[index] !== null) return;

    // Wert im Array ändern
    fields[index] = currentPlayer;

    // SVG im entsprechenden Feld setzen
    render();

    // Überprüfen der Gewinnbedingungen
    checkWinCondition();
}

// Gewinnbedingungen prüfen
function checkWinCondition() {
    const currentlyClicked = [];

    // Aktuell geklickte Felder bestimmen
    for (let i = 0; i < fields.length; i++) {
        if (fields[i] === currentPlayer) {
            currentlyClicked.push(i);
        }
    }

    // Überprüfen, ob die aktuell geklickten Felder eine Gewinnbedingung erfüllen
    const hasWon = winConditions.some(condition =>
        condition.every(index => currentlyClicked.includes(index))
    );


    if (hasWon) {
        const currentPlayerMessage = `${currentPlayer === 'cross' ? svgCross : svgCircle} hat gewonnen!`;
        document.getElementById('current-player').innerHTML = currentPlayerMessage; // Nachricht in das h3 setzen
        showRestartButton();
        winConditions.some(condition => {
            const isWinningCondition = condition.every(index => currentlyClicked.includes(index));
            if (isWinningCondition) {
                // Speichere die gewinnende Kombination
                const winningCombination = condition.slice(); // Kopiere das Array

                calculateLineStart(winningCombination);
            }
        document.getElementById('table').classList.add('pointerNone');
        });
    } else {
        // Spieler wechseln
        currentPlayer = currentPlayer === 'cross' ? 'circle' : 'cross';
        render(); // Aktualisiere die Anzeige
    }
}


function calculateLineStart(winningCombination) {
    let startIdofElement = document.getElementById(`${winningCombination[0]}`)
    const startDivPos = startIdofElement.getBoundingClientRect();
    console.log(startDivPos);
    if (winningCombination[0] == 2 && winningCombination[2] == 6) {
        let xPosition = (startDivPos.x - 51) + 'px';
        let yPosition = (startDivPos.y + 51) + 'px';
        console.log(winningCombination);
        selectLineType(winningCombination, xPosition, yPosition);
    } else {
        if (winningCombination[0] == 0 && winningCombination[2] == 8) {
            let xPosition = (startDivPos.x + 153) + 'px';
            let yPosition = (startDivPos.y + 51) + 'px';
            console.log(winningCombination);
            selectLineType(winningCombination, xPosition, yPosition);
        } else {
            let xPosition = (startDivPos.x + 51) + 'px';
            let yPosition = (startDivPos.y + 51) + 'px';
            console.log(winningCombination);
            selectLineType(winningCombination, xPosition, yPosition);
        }
    }
}

function selectLineType(winningCombination, xPosition, yPosition) {
    let content = document.getElementById('content');
    if (winningCombination[0] == 0 && winningCombination[2] == 8) {
        content.innerHTML += drawParallelLine(xPosition, yPosition, 0);
    } else if (winningCombination[0] == 2 && winningCombination[2] == 6) {
        content.innerHTML += drawParallelLine(xPosition, yPosition, 1);
    } else if (winningCombination[0] == 6 || winningCombination[1] == 1 || winningCombination[2] == 5) {
        content.innerHTML += drawVerticalLine(xPosition, yPosition);
    } else {
        content.innerHTML += drawHorizontalLine(xPosition, yPosition);
    }
}



function drawParallelLine(xPosition, yPosition, index) {
    return `<div style="top: ${yPosition}; left: ${xPosition}; width: 12px; height: 214px;" class="winning-line${index}"></div>`
}

function drawVerticalLine(xPosition, yPosition) {
    return `<div style="top: ${yPosition}; left: ${xPosition}; width: 214px; height: 12px;" class="winning-line0"></div>`
}

function drawHorizontalLine(xPosition, yPosition) {
    return `<div style="top: ${yPosition}; left: ${xPosition}; width: 12px; height: 214px; transform: skew(0deg)" class="winning-line0"></div>`
}

// Tabelle erstellen
function createTable() {
    let table = "<table id='table'>"; // Tabelle als HTML-String beginnen

    for (let i = 0; i < 3; i++) {
        table += "<tr>"; // Neue Zeile starten
        for (let j = 0; j < 3; j++) {
            const fieldIndex = i * 3 + j;
            let cellContent = ""; // Der Inhalt der Zelle (SVG oder leer)

            if (fields[fieldIndex] === 'cross') {
                cellContent = `<td class="cross" id="${fieldIndex}" onclick="fieldClick(${fieldIndex})">${svgCross}</td>`;
            } else if (fields[fieldIndex] === 'circle') {
                cellContent = `<td class="circle" id="${fieldIndex}" onclick="fieldClick(${fieldIndex})">${svgCircle}</td>`;
            } else {
                cellContent = `<td class="empty" id="${fieldIndex}" onclick="fieldClick(${fieldIndex})"></td>`;
            }

            table += cellContent; // Zelle zur Zeile hinzufügen
        }
        table += "</tr>"; // Zeile abschließen
    }

    table += "</table>"; // Tabelle abschließen
    return table; // Die Tabelle als HTML-String zurückgeben
}



// Aktuellen Spieler aktualisieren
function updateCurrentPlayer() {
    const currentPlayerHTML = currentPlayer === 'cross'
        ? `${svgCross} ist dran`
        : `${svgCircle} ist dran`;

    return `<h3 id="current-player" style="text-align: center; font-size: 24px; margin-bottom: 20px;">${currentPlayerHTML}</h3>`;
}

// Restart-Button anzeigen
function showRestartButton() {
    const content = document.getElementById('content');
    content.innerHTML += `<button onclick="init()" style="margin-top: 20px;">Wiederholen</button>`;
}

// Render-Funktion
function render() {
    const content = document.getElementById('content');

    // HTML für den aktuellen Spieler generieren und in den content-Bereich einfügen
    const currentPlayerHTML = updateCurrentPlayer();

    // Tabelle als HTML-String erstellen
    const tableHTML = createTable();

    // Den aktuellen Spieler und die Tabelle in den content-Bereich einfügen
    content.innerHTML = `${currentPlayerHTML}${tableHTML}`;
}