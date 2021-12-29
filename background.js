let session = 'Focus';
let focus_time = 25;
let minute = 25;
let second = 0;
let timer_status = 'Not Started';
let interval = null;

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ session });
    chrome.storage.sync.set({ focus_time });
    chrome.storage.sync.set({ minute });
    chrome.storage.sync.set({ second });
    chrome.storage.sync.set({ timer_status });
})

chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'sync' && changes.timer_status?.newValue) {
        timer_status = changes.timer_status.newValue;
        if (timer_status === 'Playing') {
            interval = setInterval(startTimer, 1000);
        } else if (interval) {
            clearInterval(interval);
            interval = null;
        }
    }
});

function startTimer() {
    if (second == 0) {
        second = 59;
    } else {
        second = second - 1;
    }
    
    if (second == 59){
        minute -= 1
        chrome.storage.sync.set({minute});
      }
    chrome.storage.sync.set({second});
}