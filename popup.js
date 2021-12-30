let status_bar = document.getElementById('status');
let timer = document.getElementById('timer');
let timer_btn = document.getElementById('start_stop');
let main_content = document.getElementById('main_content');
let options = document.getElementById('options');
let settings_btn = document.getElementById('settings_btn');
let save_options_btn = document.getElementById('save_options');
let cancel_options_btn = document.getElementById('cancel_options');

let focusInput = document.getElementById('focusLength');
let shortBreakInput = document.getElementById('shortBreakLength');
let longBreakInput = document.getElementById('longBreakLength');
let intervalsInput = document.getElementById('numIntervals');

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
    settings_btn.addEventListener('click', clickSettings);
    save_options_btn.addEventListener('click', clickSaveOptions);
    cancel_options_btn.addEventListener('click', clickCancelOptions);
    chrome.storage.sync.get([
        'session',
        'timer_status',
        'focus_time',
        'short_break',
        'long_break',
        'end_time',
        'time_remaining',
        'intervals'
    ], function(variables) {
        session = variables.session;
        timer_status = variables.timer_status;
        focus_time = variables.focus_time;
        short_break = variables.short_break;
        long_break = variables.long_break;
        end_time = variables.end_time;
        time_remaining = variables.time_remaining;
        intervals = variables.intervals;

        status_bar.innerHTML = "Time for: " + session;
        focusInput.value = focus_time;
        shortBreakInput.value = short_break;
        longBreakInput.value = long_break;
        intervalsInput.value = intervals;
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

// Helper functions
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

// Click event handlers
function handleTimer() {
    // Timer currently not playing but the play button is pressed
    if (timer_status === 'Not Started') {
        log("Start button pressed");
        startTimer();
    // Timer currently playing and the pause button is pressed
    } else if (timer_status === 'Playing') {
        log("Pause button pressed");
        pauseTimer();
    // Timer currently paused and the play button is pressed
    } else if (timer_status === 'Paused') {
        log("Play button pressed");
        playTimer();
    } else {
        timer_btn.innerHTML = 'ERROR';
        return;
    }
    chrome.storage.sync.set({timer_status});
}

function clickSettings() {
    main_content.style.display = 'none';
    options.style.display = 'block';
}

function clickCancelOptions() {
    main_content.style.display = 'block';
    options.style.display = 'none';
}

function clickSaveOptions() {
    if (focus_time != focusInput.value) {
        focus_time = Number(focusInput.value);
        chrome.storage.sync.set({focus_time});
    }
    if (short_break != shortBreakInput.value) {
        short_break = Number(shortBreakInput.value);
        chrome.storage.sync.set({short_break});
    }
    if (long_break != longBreakInput.value) {
        long_break = Number(longBreakInput.value);
        chrome.storage.sync.set({long_break});
    }
    if (intervals != intervalsInput.value) {
        intervals = Number(intervalsInput.value);
        chrome.storage.sync.set({intervals});
    }
    main_content.style.display = 'block';
    options.style.display = 'none';
}

// Functions to handle timer
function startTimer() {
    timer_status = 'Playing';
    timer_btn.innerHTML = 'Pause';
    start_time = new Date();
    end_time = new Date(start_time.getFullYear(), start_time.getMonth(), start_time.getDate(), start_time.getHours(), start_time.getMinutes(), start_time.getSeconds(), start_time.getMilliseconds());
    log('DEBUG start_time is ' + start_time.toLocaleTimeString());
    log('DEBUG end_time before increment is ' + end_time.toLocaleTimeString());
    log('DEBUG interval_time when incrementing is ' + interval_time);
    end_time.setMinutes(end_time.getMinutes() + interval_time);
    log('DEBUG end_time in startTimer is '+ end_time.toLocaleTimeString());

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
    end_time = -1;
    chrome.storage.sync.set({time_remaining});
    chrome.storage.sync.set({end_time});
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

// Chrome storage
function storageListener(changes, area) {
    if (area === 'sync' && changes.session?.newValue && changes.timer_status?.newValue) {
        session = changes.session.newValue;
        log("Session changed to " + session);
        // Switching from break to focus
        if (session === 'Focus') {
            timer.style.backgroundColor = '#ff6666';
            interval_time = focus_time;
        // Switching from focus to short break
        } else if (session === 'Short Break') {
            timer.style.backgroundColor = '#39b535';
            interval_time = short_break;
            log('DEBUG switch to short break with interval ' + interval_time);
        } else if (session === 'Long Break') {
            timer.style.backgroundColor = '#63d0ff';
            interval_time = long_break;
        }
        timer_status = changes.timer_status.newValue;
        restartTimer();
    }
}

// Logging
function log(msg) {
    const now = new Date();
    console.log(now.toLocaleTimeString() + ": " + msg);
}
