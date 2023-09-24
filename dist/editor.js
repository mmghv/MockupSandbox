"use strict";
let editor;
let quickSuggestions = true;
require.config({ paths: { vs: 'libs/monaco-editor/min/vs' } });
require(['vs/editor/editor.main'], () => {
    editor = monaco.editor.create(document.getElementById('container'), {
        value: code,
        language: 'javascript',
        theme: "vs-dark",
        automaticLayout: true,
        // scrollBeyondLastLine: false,
        fontSize: 18,
        quickSuggestions,
        suggest: {
            showDeprecated: false,
        },
    });
    registerSnippets(monaco);
    editor.addCommand([monaco.KeyCode.F4], () => {
        quickSuggestions = !quickSuggestions;
        editor.updateOptions({ quickSuggestions });
    });
    let timeoutId;
    editor.onDidChangeModelContent(() => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            run(true);
        }, 500);
    });
    fetch('./src/ui-controls.ts')
        .then(r => r.text())
        .then(r => {
        monaco.languages.typescript.javascriptDefaults.addExtraLib(r, "ts:filename/ui-controls.ts");
    });
    run(false);
});
// @ts-ignore
function run(save) {
    parent.window.postMessage({ type: 'run', code: editor.getValue(), save }, "*");
}
