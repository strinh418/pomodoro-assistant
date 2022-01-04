class HistoryEntry {
    static currentEntry = null;
    constructor(pomodoro) {
        this.date = pomodoro.date;
        this.startTime = pomodoro.startTime;
        this.endTime = pomodoro.endTime;
        this.numPomodoros = 1;
        this.pomodoros = [pomodoro];
        this.tasks = pomodoro.tasks;
        this.rating = 5;
    }

    addPomodoroToEntry(pomodoro) {
        this.numPomodoros += 1;
        this.pomodoros.push(pomodoro);
        this.tasks += pomodoro.tasks;
        this.endTime = pomodoro.endTime;
    }
}

class PomodoroEntry {
    constructor(startDate, endDate) {
        // TODO: add tasks field
        this.date = startDate.toLocaleDateString();
        this.startTime = startDate;//startDate.toLocaleTimeString();
        this.endTime = endDate;//endDate.toLocaleTimeString();
        this.tasks = 0;
    }
}
