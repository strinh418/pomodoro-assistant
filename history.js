loadTableData();

function loadTableData(items) {
    const table = document.getElementById('history_table');
    chrome.storage.sync.get('history', ({ history }) => {
        history.forEach(cycle => {
            cycle = JSON.parse(cycle);
            let fields = [cycle.date, (new Date(cycle.startTime)).toLocaleTimeString(), (new Date(cycle.endTime)).toLocaleTimeString(), cycle.numPomodoros, cycle.tasks, cycle.rating];
            let row = table.insertRow();
            for (var i = 0; i < fields.length; i++) {
                let cell = row.insertCell(i);
                cell.innerHTML = fields[i];
            }
        })
    })
}