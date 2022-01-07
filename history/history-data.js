class HistoryData {
    static currentEntry = null;
    static stored = false;

    static logNewPomodoro(startDate, endDate) {
        // TODO: add tasks field
        var pomodoro = new PomodoroEntry(startDate, endDate);
        chrome.storage.sync.get('last_stored', ({ last_stored }) => {
            if (last_stored && pomodoro.startTime.getTime() - last_stored < 3600000) {
                HistoryData.updateHistoryEntryInStorage(pomodoro);
            } else {
                HistoryData.addHistoryEntryToStorage(pomodoro);
            }
            last_stored = endDate.getTime();
            chrome.storage.sync.set({ last_stored});
        })
    }

    static updateHistoryEntryInStorage(pomodoro) {
        chrome.storage.sync.get('history', ({ history }) => {
            var lastEntry = HistoryEntry.fromJson(history.pop());
            lastEntry.addPomodoroToEntry(pomodoro);
            history.push(lastEntry.toJson());
            log(history);
            chrome.storage.sync.set({ history });
        })
    }

    static addHistoryEntryToStorage(pomodoro) {
        chrome.storage.sync.get('history', ({ history }) => {
            var currentEntry = HistoryEntry.createEntry(pomodoro);
            history.push(currentEntry.toJson());
            log(history);
            chrome.storage.sync.set({ history });
        })
    }
}

function log(msg) {
    const now = new Date();
    console.log(now.toLocaleTimeString() + ": " + msg);
}
