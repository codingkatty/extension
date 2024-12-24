document.getElementById('open').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'createFloatingWindow' });
});

document.getElementById('close').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'closeFloatingWindow' });
});