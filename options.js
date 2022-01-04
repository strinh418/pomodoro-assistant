let save_options_btn = document.getElementById('save_options');
let focusInput = document.getElementById('focusLength');
let shortBreakInput = document.getElementById('shortBreakLength');
let longBreakInput = document.getElementById('longBreakLength');
let intervalsInput = document.getElementById('numIntervals');

save_options_btn.addEventListener('click', clickSaveOptions);

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