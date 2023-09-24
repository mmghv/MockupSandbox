"use strict";
// console proxy
const consoleMethods = ['log', 'error', 'clear'];
const realConsole = {};
consoleMethods.forEach(method => {
    realConsole[method] = console[method];
    console[method] = (...args) => {
        realConsole[method](...args);
        const serializedData = args.map(arg => {
            if (typeof arg === "string") {
                return args.length == 1 && arg !== '' ? arg : JSON.stringify(arg);
            }
            else {
                return String(arg);
            }
        });
        parent.window.postMessage({ type: 'console', method, serializedData }, "*");
    };
});
window.addEventListener('message', function (e) {
    const blob = new Blob([e.data.code], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    const scriptElement = document.createElement("script");
    scriptElement.onload = () => {
        parent.window.postMessage({ type: 'run-finished', save: e.data.save }, "*");
    };
    scriptElement.src = url;
    document.head.appendChild(scriptElement);
});
window.addEventListener('error', function (e) {
    e.preventDefault();
    const msg = e.message.replace(/^(Uncaught .+: )/, "$&\n");
    console.error(`${msg} (at line ${e.lineno})`);
}, false);
