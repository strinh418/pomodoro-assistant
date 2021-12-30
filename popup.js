let status_bar = document.getElementById('status');
let timer = document.getElementById('timer');
let timer_btn = document.getElementById('start_stop');

var session;
var timer_status;
var start_time;
var end_time;
var focus_time;
var short_break;
var interval_time;
var time_remaining;

var second;
var minute;
var ms = 0;
var interval;

// When popup first comes up from toolbar
setupPopup();

// Chrome Event Listeners
chrome.storage.onChanged.addListener(storageListener);

function setupPopup() {
    timer_btn.addEventListener('click', handleTimer);
    chrome.storage.sync.get([
        'session',
        'timer_status',
        'focus_time',
        'short_break',
        'long_break',
        'end_time',
        'time_remaining'
    ], function(variables) {
        session = variables.session;
        timer_status = variables.timer_status;
        focus_time = variables.focus_time;
        short_break = variables.short_break;
        long_break = variables.long_break;
        end_time = variables.end_time;
        time_remaining = variables.time_remaining;

        console.log(timer_status);
        status_bar.innerHTML = "Time for: " + session;
        if (session === 'Focus') {
            timer.style.backgroundColor = '#ff6666';
            interval_time = focus_time;
        } else if (session === 'Short Break') {
            timer.style.backgroundColor = '#39b535';
            interval_time = short_break;
        } else if (session === 'Long Break') {
            timer.style.backgroundColor = '#63d0ff';
            interval_time = long_break;
        }
        if (timer_status === 'Not Started') {
            timer_btn.innerHTML = 'Start';
            timer.innerHTML = interval_time + ":00";
            if (interval) {
                // clear any existing intervals
                clearInterval(interval);
            }
        } else if (timer_status === 'Paused') {
            timer_btn.innerHTML = 'Play';
            setRemainingTime(time_remaining);
            timer.innerHTML = minute + ":" + checkSecond(second);
        } else if (timer_status === 'Playing') {
            timer_btn.innerHTML = 'Pause';
            setMinSec(end_time);
            timer.innerHTML = minute + ":" + checkSecond(second);
            setTimeout(countdown, ms);
            interval = setInterval(countdown, 1000);
        } else {
            timer_btn.innerHTML = 'ERROR';
        }
    });
}

function checkSecond(sec) {
    if (sec < 10 && sec >= 0) {
        sec = "0" + sec;
    }
    return sec;
}

function setMinSec(endTime) {
    const now = new Date();
    const timeDiff = endTime - now.getTime();
    setRemainingTime(timeDiff);
}

function setRemainingTime(timeDiff) {
    minute = Math.floor(timeDiff / (1000 * 60));
    second = Math.floor((timeDiff / 1000) % 60);
    ms = timeDiff % 1000;
}

function handleTimer() {
    // Timer currently not playing but the play button is pressed
    if (timer_status === 'Not Started') {
        console.log('handle timer: Not Started');
        startTimer();
    // Timer currently playing and the pause button is pressed
    } else if (timer_status === 'Playing') {
        console.log('handle timer: Playing');
        pauseTimer();
    // Timer currently paused and the play button is pressed
    } else if (timer_status === 'Paused') {
        console.log('handle timer: Paused');
        playTimer();
    } else {
        timer_btn.innerHTML = 'ERROR';
        return;
    }
    chrome.storage.sync.set({timer_status});
}

function startTimer() {
    timer_status = 'Playing';
    timer_btn.innerHTML = 'Pause';
    start_time = new Date();
    end_time = new Date(start_time.getFullYear(), start_time.getMonth(), start_time.getDate(), start_time.getHours(), start_time.getMinutes(), start_time.getSeconds(), start_time.getMilliseconds());
    end_time.setMinutes(end_time.getMinutes() + interval_time);

    start_time = start_time.getTime();
    end_time = end_time.getTime();
    chrome.storage.sync.set({start_time});
    chrome.storage.sync.set({end_time});
    chrome.storage.sync.set({timer_status});
    second = 0;
    minute = interval_time;
    countdown();
    interval = setInterval(countdown, 1000);
}

function pauseTimer() {
    timer_status = 'Paused';
    timer_btn.innerHTML = 'Play';
    const now = new Date();
    time_remaining = end_time - now.getTime();
    chrome.storage.sync.set({time_remaining});
    chrome.storage.sync.set({timer_status});
    clearInterval(interval);
}

function restartTimer() {
    // timer_status = 'Not Started'; (Timer status now set in background.js)
    timer.innerHTML = interval_time + ':00';
    status_bar.innerHTML = "Time for: " + session;
    //chrome.storage.sync.set({timer_status});
    timer_btn.innerHTML = 'Start';
    clearInterval(interval);
}

function playTimer() { 
    timer_status = 'Playing';
    timer_btn.innerHTML = 'Pause';
    const now = new Date();
    end_time = now.getTime() + time_remaining;

    chrome.storage.sync.set({end_time});
    chrome.storage.sync.set({timer_status});

    setTimeout(countdown, ms);
    interval = setInterval(countdown, 1000);
}

function countdown() {
    if (second == 0) {
        if (minute == 0) {
            return;
        }
        second = 59;
    } else {
        second = second - 1;
    }
    
    if (second == 59){
        minute -= 1;
    }

    timer.innerHTML = minute + ":" + checkSecond(second);
}

function storageListener(changes, area) {
    if (area === 'sync' && changes.session?.newValue && changes.timer_status?.newValue) {
        session = changes.session.newValue;
        console.log('Session successfully changed to ' + session);
        // Switching from break to focus
        if (session === 'Focus') {
            timer.style.backgroundColor = '#ff6666';
            interval_time = focus_time;
        // Switching from focus to short break
        } else if (session === 'Short Break') {
            timer.style.backgroundColor = '#39b535';
            interval_time = short_break;
        } else if (session === 'Long Break') {
            timer.style.backgroundColor = '#63d0ff';
            interval_time = long_break;
        }
        timer_status = changes.timer_status.newValue;
        restartTimer();
    }
}

/*function timerStatusListener(changes, area) {
    if (area === 'sync' && changes.timer_status?.newValue) {
        timer_status = changes.timer_status.newValue;
    }
}*/