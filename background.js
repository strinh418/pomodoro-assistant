let session = 'Focus';
let focus_time = 25;
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
    chrome.storage.sync.set({ session });
    chrome.storage.sync.set({ focus_time });
    chrome.storage.sync.set({ short_break });
    chrome.storage.sync.set({ long_break });
    chrome.storage.sync.set({ timer_status });
    chrome.storage.sync.set({ start_time });
    chrome.storage.sync.set({ end_time });
    chrome.storage.sync.set({ time_remaining });
    chrome.storage.sync.set({ intervals });
    chrome.storage.sync.set({ completed });
})

// Alarm listener for timer
chrome.storage.onChanged.addListener(function (changes, area) {
    if (area === 'sync' && changes.end_time?.newValue) {
        console.log("end time changed");
        end_time = changes.end_time.newValue;
        chrome.alarms.create('IntervalTimer', {
            when: end_time
        });
        console.log("alarm created");
    }
  });
chrome.alarms.onAlarm.addListener(timerListener);
console.log("listener added");

function timerListener(alarm) {
    if (alarm.name === 'IntervalTimer') {
        console.log("Timer finished!")
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
        });
        /*const now = new Date();
        if (session === 'Focus') {
            chrome.notifications.create('focus' + now.getTime(), {
                type: 'basic',
                iconUrl: 'images/tomatoes.png',
                title: 'Time to work!',
                message: 'Time to start another interval.',
                priority: 2
            });
        } else if (session === 'Short Break') {
            chrome.notifications.create('short break'  + now.getTime(), {
                type: 'basic',
                iconUrl: 'images/tomatoes.png',
                title: 'Time for a break!',
                message: 'Great work on completing an interval.',
                priority: 2
            });
        } else if (session === 'Long Break') {
            chrome.notifications.create('long break'  + now.getTime(), {
                type: 'basic',
                iconUrl: 'images/tomatoes.png',
                title: 'Time for a longer break!',
                message: 'Great work on completing a cycle.',
                priority: 2
            });
        }*/
    }
    
}