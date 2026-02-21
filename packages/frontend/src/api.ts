export function getHello() {
    return fetch('/api/').then((res) => res.text())
}