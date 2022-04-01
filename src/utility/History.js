export function createHistory() {
    localStorage.setItem('history', window.location.href);
}

export function getHistory() {
    return localStorage.getItem('history');
}

export function currentURL() {
    return localStorage.getItem(window.location.href);
}

export function getCurrentPath() {
    const { pathname } = window.location;
    return pathname;
}
