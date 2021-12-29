let session = 'Focus';
let focus_time = 25;
let minute = 25;
let second = 0;
let timer_status = 'Not Started';
let start_time = null;
let end_time = null;
let time_remaining = null; // used for pauses

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ session });
    chrome.storage.sync.set({ focus_time });
    chrome.storage.sync.set({ timer_status });
    chrome.storage.sync.set({ start_time });
    chrome.storage.sync.set({ end_time });
    chrome.storage.sync.set({ time_remaining })
})