class HistoryData {
    static currentEntry = null;
    static stored = false;

    static logNewPomodoro(startDate, endDate) {
        // TODO: add tasks field
        var pomodoro = new PomodoroEntry(startDate, endDate);
        if (HistoryData.currentEntry && pomodoro.endTime.getTime() - HistoryData.currentEntry.startTime.getTime() < 3600000) {
            HistoryData.currentEntry.addPomodoroToEntry(pomodoro);
        } else {
            HistoryData.currentEntry = new HistoryEntry(pomodoro);
        }

        if (HistoryData.stored) {
            HistoryData.updateHistoryEntryInStorage();
        } else {
            HistoryData.addHistoryEntryToStorage();
        }
    }

    static updateHistoryEntryInStorage() {
        chrome.storage.sync.get('history', ({ history }) => {
            history.pop();
            history.push(JSON.stringify(HistoryData.currentEntry));
            log(HistoryData.currentEntry);
            log(history);
            chrome.storage.sync.set({ history });
        })
    }

    static addHistoryEntryToStorage() {
        chrome.storage.sync.get('history', ({ history }) => {
            history.push(JSON.stringify(HistoryData.currentEntry));
            log(history);
            chrome.storage.sync.set({ history });
            HistoryData.stored = true;
        })
    }
}

function log(msg) {
    const now = new Date();
    console.log(now.toLocaleTimeString() + ": " + msg);
}
