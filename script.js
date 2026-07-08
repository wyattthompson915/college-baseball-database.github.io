let ascending = true;

const DATA_FILES = {
    batting: "../data/team_batting.json",
    pitching: "../data/team_pitching.json",
    fielding: "../data/team_fielding.json",
    p_batting: "../data/player_batting.json",
    p_pitching: "../data/player_pitching.json",
    p_fielding: "../data/player_fielding.json"
};

// Load one JSON file
async function loadJSON(path) {
    const response = await fetch(path);

    if (!response.ok) {
        throw new Error(`Failed to load ${path}`);
    }

    return response.json();
}

// Load all datasets
async function loadAllStats() {
    const results = await Promise.all([
        loadJSON(DATA_FILES.batting),
        loadJSON(DATA_FILES.pitching),
        loadJSON(DATA_FILES.fielding),
        loadJSON(DATA_FILES.p_batting),
        loadJSON(DATA_FILES.p_pitching),
        loadJSON(DATA_FILES.p_fielding)
    ]);

    return {
        batting: results[0],
        pitching: results[1],
        fielding: results[2],
        p_batting: results[3],
        p_pitching: results[4],
        p_fielding: results[5]
    };
}

// Build a table from an array of objects
function loadTable(data, tableId) {
    const table = document.getElementById(tableId);

    // Clear the table in case it already has content
    table.innerHTML = "";

    if (data.length === 0) return;

    const headers = Object.keys(data[0]);

    const thead = table.createTHead();
    const headerRow = thead.insertRow();

    headers.forEach(header => {
        const th = document.createElement("th");
        th.textContent = header;
        th.style.cursor = "pointer";
        th.addEventListener("click", () => {
            sortTable(tableId, header);
        });
        headerRow.appendChild(th);
    });

    const tbody = table.createTBody();

    data.forEach(row => {
        const tr = tbody.insertRow();

        headers.forEach(header => {
            const td = tr.insertCell();
            td.textContent = row[header];
        });
    });
}

// Determine which page we're on
const page = window.location.pathname;

let stats;

window.addEventListener("DOMContentLoaded", async () => {
    stats = await loadAllStats();

    // Load the default table
    if (page.includes("team_stats")) {
        loadTable(stats.batting, "battingTable");
    } else if (page.includes("player_stats")) {
        loadTable(stats.p_batting, "battingTable");
    }

    // Search
    const searchBox = document.getElementById("searchBox");

    if (searchBox) {
        searchBox.addEventListener("input", () => {
        const filter = searchBox.value.toLowerCase();

        const rows = document.querySelectorAll("#battingTable tbody tr");

        rows.forEach(row => {
            let text;

            if (page.includes("team_stats")) {
                text = row.cells[0].textContent.toLowerCase();
            } else {
                text =
                    row.cells[0].textContent.toLowerCase() + " " +
                    row.cells[1].textContent.toLowerCase();
            }

            row.style.display = text.includes(filter) ? "" : "none";
        });
});
    }

    // Buttons
    const battingBtn = document.getElementById("battingBtn");
    const pitchingBtn = document.getElementById("pitchingBtn");
    const fieldingBtn = document.getElementById("fieldingBtn");

    if (battingBtn) {
        battingBtn.addEventListener("click", () => {
            if (page.includes("team_stats")) {
                loadTable(stats.batting, "battingTable");
            } else {
                loadTable(stats.p_batting, "battingTable");
            }
        });
    }

    if (pitchingBtn) {
        pitchingBtn.addEventListener("click", () => {
            if (page.includes("team_stats")) {
                loadTable(stats.pitching, "battingTable");
            } else {
                loadTable(stats.p_pitching, "battingTable");
            }
        });
    }

    if (fieldingBtn) {
        fieldingBtn.addEventListener("click", () => {
            if (page.includes("team_stats")) {
                loadTable(stats.fielding, "battingTable");
            } else {
                loadTable(stats.p_fielding, "battingTable");
            }
        });
    }
});