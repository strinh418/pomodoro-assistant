let session = 'Focus';
let focus_time = 1;
let short_break = 5;
let long_break = 15;
let timer_status = 'Not Started';
let start_time = null;
let end_time = null;
let time_remaining = null; // used for pauses
let intervals = 4;
let completed = 0;

let alarm = null;

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({session, focus_time, short_break, long_break, timer_status, start_time, end_time, time_remaining, intervals, completed});
})

// Alarm listener for timer
chrome.storage.onChanged.addListener(function (changes, area) {
    if (area === 'sync' && changes.end_time?.newValue) {
        end_time = changes.end_time.newValue;
        if (end_time == -1) {
            chrome.alarms.clearAll();
            log("All alarms cleared");
        } else {
            end_time = changes.end_time.newValue;
            const debug = new Date(end_time);
            log('DEBUG created alarm that ends at ' + debug.toLocaleTimeString());
            chrome.alarms.create('IntervalTimer', {
                when: end_time
            });
            log("New alarm created");
        }
    }
  });
chrome.alarms.onAlarm.addListener(timerListener);

function timerListener(alarm) {
    if (alarm.name === 'IntervalTimer') {
        log("Timer has finished");
        chrome.storage.sync.get([
            'session',
            'focus_time',
            'short_break',
            'completed',
            'intervals'
        ], function(variables) {
            session = variables.session;
            focus_time = variables.focus_time;
            short_break = variables.short_break;
            completed = variables.completed;
            intervals = variables.intervals;
            timer_status = 'Not Started';
            const now = new Date();
            // Finished a focus interval
            if (session === 'Focus') {
                completed += 1;
                if (completed === intervals) {
                    session = 'Long Break';
                    chrome.notifications.create('long break'  + now.getTime(), {
                        type: 'basic',
                        iconUrl: 'images/tomatoes.png',
                        title: 'Time for a longer break!',
                        message: 'Great work on completing a cycle.',
                        priority: 2
                    });
                    completed = 0;
                } else {
                    session = 'Short Break';
                    chrome.notifications.create('short break'  + now.getTime(), {
                        type: 'basic',
                        iconUrl: 'images/tomatoes.png',
                        title: 'Time for a break!',
                        message: 'Great work on completing an interval.',
                        priority: 2
                    });
                }
                chrome.storage.sync.set({completed});
            } else if (session === 'Short Break' || session === 'Long Break') {
                session = 'Focus';
                chrome.notifications.create('focus' + now.getTime(), {
                    type: 'basic',
                    iconUrl: 'images/tomatoes.png',
                    title: 'Time to work!',
                    message: 'Time to start another interval.',
                    priority: 2
                });
            }
            chrome.storage.sync.set({session, timer_status, completed});
            chrome.alarms.clearAll();
            log("Session updated to " + session + " and cleared alarms");
        });
    }
    
}

function log(msg) {
    const now = new Date();
    console.log(now.toLocaleTimeString() + ": " + msg);
}