class HistoryEntry {
    constructor(date, startTime, endTime, numPomodoros, pomodoros, tasks, rating) {
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
        this.numPomodoros = numPomodoros;
        this.pomodoros = pomodoros;
        this.tasks = tasks;
        this.rating = rating;
    }

    static createEntry(pomodoro) {
        return new HistoryEntry(pomodoro.date, pomodoro.startTime, pomodoro. endTime,
            1, [pomodoro], pomodoro.tasks, 5);
    }

    static fromJson(json) {
        var obj = JSON.parse(json);
        return new HistoryEntry(obj.date, obj.startTime, obj.endTime, obj.numPomodoros,
            obj.pomodoros, obj.tasks, obj.rating);
    }
    
    addPomodoroToEntry(pomodoro) {
        this.numPomodoros += 1;
        this.pomodoros.push(pomodoro);
        this.tasks += pomodoro.tasks;
        this.endTime = pomodoro.endTime;
    }

    toJson() {
        return JSON.stringify(this);
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
