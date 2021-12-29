let status_bar = document.getElementById('status');
let timer = document.getElementById('timer');
let timer_btn = document.getElementById('start_stop');

var session;
var timer_status;
var start_time;
var end_time;
var focus_time;
var time_remaining;

var second;
var minute;
var ms = 0;
var interval;

setupPopup();

function setupPopup() {
    timer_btn.addEventListener('click', handleTimer);
    chrome.storage.sync.get([
        'session',
        'timer_status',
        'focus_time',
        'end_time',
        'time_remaining'
    ], function(variables) {
        session = variables.session;
        timer_status = variables.timer_status;
        focus_time = variables.focus_time;
        end_time = variables.end_time;
        time_remaining = variables.time_remaining;

        console.log(timer_status);
        status_bar.innerHTML = "Time to: " + session;
        if (session === 'Focus') {
            timer.style.backgroundColor = '#ff6666';
        }
        if (timer_status === 'Not Started') {
            timer_btn.innerHTML = 'Start';
            timer.innerHTML = focus_time + ":00";
        } else if (timer_status === 'Paused') {
            timer_btn.innerHTML = 'Play';
            setRemainingTime(time_remaining);
            timer.innerHTML = minute + ":" + checkSecond(second);
        } else if (timer_status === 'Playing') {
            timer_btn.innerHTML = 'Pause';
            setMinSec(end_time);
            timer.innerHTML = minute + ":" + checkSecond(second);
            setTimeout(startTimer, ms);
            interval = setInterval(startTimer, 1000);
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
    if (timer_status === 'Not Started') {
        startFocusTimer();
    } else if (timer_status === 'Playing') {
        pauseFocusTimer();
    } else if (timer_status === 'Paused') {
        playFocusTimer();
    } else {
        timer_btn.innerHTML = 'ERROR';
        return;
    }
    chrome.storage.sync.set({timer_status});
}

function startFocusTimer() {
    timer_status = 'Playing';
    timer_btn.innerHTML = 'Pause';
    start_time = new Date();
    end_time = new Date(start_time.getFullYear(), start_time.getMonth(), start_time.getDate(), start_time.getHours(), start_time.getMinutes(), start_time.getSeconds(), start_time.getMilliseconds());
    end_time.setMinutes(end_time.getMinutes() + focus_time);

    start_time = start_time.getTime();
    end_time = end_time.getTime();
    chrome.storage.sync.set({start_time});
    chrome.storage.sync.set({end_time});
    chrome.storage.sync.set({timer_status});

    second = 0;
    minute = focus_time;
    startTimer();
    interval = setInterval(startTimer, 1000);
}

function pauseFocusTimer() {
    timer_status = 'Paused';
    timer_btn.innerHTML = 'Play';
    const now = new Date();
    time_remaining = end_time - now.getTime();
    chrome.storage.sync.set({time_remaining});
    chrome.storage.sync.set({timer_status});
    clearInterval(interval);
}

function playFocusTimer() { 
    timer_status = 'Playing';
    timer_btn.innerHTML = 'Pause';
    const now = new Date();
    end_time = now.getTime() + time_remaining;

    chrome.storage.sync.set({end_time});
    chrome.storage.sync.set({timer_status});

    setTimeout(startTimer, ms);
    interval = setInterval(startTimer, 1000);
}

function startTimer() {
    if (second == 0) {
        second = 59;
    } else {
        second = second - 1;
    }
    
    if (second == 59){
        minute -= 1;
    }

    timer.innerHTML = minute + ":" + checkSecond(second);
}