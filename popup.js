let status_bar = document.getElementById('status');
let timer = document.getElementById('timer');
let timer_btn = document.getElementById('start_stop');

var session;
var minute;
var second;
var timer_status;

timer_btn.addEventListener('click', handleTimer);
chrome.storage.sync.get([
    'minute',
    'second',
    'session',
    'timer_status'
   ], function(variables) {
    session = variables.session;
    minute = variables.minute;
    second = checkSecond(variables.second);
    timer_status = variables.timer_status;

    status_bar.innerHTML = "Time to: " + session;
    if (session === 'Focus') {
        timer.style.backgroundColor = '#ff6666';
        timer.innerHTML = minute + ":" + second;
    }
    if (timer_status === 'Not Started') {
        timer_btn.innerHTML = 'Start';
    } else if (timer_status === 'Paused') {
        timer_btn.innerHTML = 'Play';
    } else if (timer_status === 'Playing') {
        timer_btn.innerHTML = 'Pause';
    } else {
        timer_btn.innerHTML = 'ERROR';
    }
});

chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'sync' && changes.second?.newValue) {
        second = checkSecond(changes.second.newValue);
    }
    if (area === 'sync' && changes.minute?.newValue) {
        minute = changes.minute.newValue;
    }
    timer.innerHTML = minute + ":" + second;
});

function handleTimer() {
    if (timer_status === 'Not Started') {
        timer_status = 'Playing';
        timer_btn.innerHTML = 'Pause';
    } else if (timer_status === 'Playing') {
        timer_status = 'Paused';
        timer_btn.innerHTML = 'Play';
    } else if (timer_status === 'Paused') {
        timer_status = 'Playing';
        timer_btn.innerHTML = 'Pause';
    } else {
        timer_btn.innerHTML = 'ERROR';
        return;
    }
    chrome.storage.sync.set({timer_status});
}

function checkSecond(sec) {
    if (sec < 10 && sec >= 0) {
        sec = "0" + sec
    };
    return sec;
}