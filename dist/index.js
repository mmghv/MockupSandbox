"use strict";
const initialTitle = document.title;
const editorFrame = document.getElementById('editor');
editorFrame.src = 'editor.html' + location.search;
const state = {
    outputTemplate: '',
    codeURIChanged: false,
};
// @ts-ignore
function htmlElement(html, parent = document.body) {
    const template = document.createElement('template');
    template.innerHTML = html.trim();
    const element = template.content.firstChild;
    if (parent && element) {
        parent.appendChild(element);
    }
    return element;
}
function consoleLog(serializedData, isError) {
    const consoleDiv = document.getElementById('console');
    const line = htmlElement(`<pre class="p-1 ${isError ? 'console-error' : 'mb-1'}"></pre>`, consoleDiv);
    serializedData.forEach(val => htmlElement(`<span class="mr-2">${val}</span>`, line));
    consoleDiv.scrollTop = line.offsetTop;
}
const customConsole = {
    log: (serializedData) => consoleLog(serializedData, false),
    error: (serializedData) => consoleLog(serializedData, true),
    clear: () => { document.getElementById('console').innerHTML = ''; },
};
// @ts-ignore
function run(code, save) {
    // console.clear()
    customConsole.clear();
    document.title = initialTitle;
    const output = document.querySelector('#output');
    if (!state.outputTemplate) {
        const iframe = htmlElement(`<iframe src="output.html" width="100%" height="100%">`);
        iframe.onload = () => {
            state.outputTemplate = iframe.contentDocument.documentElement.outerHTML;
            // remove live-server injected script
            state.outputTemplate = state.outputTemplate.replace(/<!-- Code injected by live-server -->.+?<\/script>/s, '');
            // enable metro.js
            state.outputTemplate = state.outputTemplate.replace(/(<meta name="metro4:init" content=")(false)/, '$1true');
            run(code, save);
        };
        output.appendChild(iframe);
        return;
    }
    const iframe = output.children[0];
    const blob = new Blob([code], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    // <script> immediately ready in body so document.write() works
    iframe.srcdoc = state.outputTemplate.replace('<!-- {{ code-script }} -->', `<script src="${url}"></script>`);
    iframe.onload = () => {
        runFinished(code, save);
    };
}
function runFinished(code, save) {
    if (save) {
        const encodedQuery = '.?code=' + codeCompressForURI(code);
        if (state.codeURIChanged) {
            history.replaceState(null, '', encodedQuery);
        }
        else {
            history.pushState(null, '', encodedQuery);
            state.codeURIChanged = true;
        }
    }
}
// reload on back/forward
addEventListener('popstate', () => location.reload());
window.addEventListener('message', function (e) {
    const data = e.data;
    if (data.type == 'console') {
        customConsole[data.method](data.serializedData);
    }
    else if (data.type == 'run') {
        run(data.code, data.save);
    }
    else if (data.type == 'title') {
        document.title = initialTitle + (data.title ? ' - ' + data.title : '');
    }
});
Metro.makePlugin("#page", "splitter");
window.addEventListener('resize', pageSplitter);
pageSplitter();
function pageSplitter() {
    const mobile = (window.innerWidth <= 700);
    const page = document.getElementById('page');
    const gutter = page.querySelector('.gutter');
    const splitterOptions = Metro.getPlugin(page).splitter.options;
    const mobileView = (splitterOptions.splitMode == 'vertical');
    if (mobileView == mobile)
        return;
    splitterOptions.splitMode = mobile ? 'vertical' : 'horizontal';
    page.classList.toggle('vertical', mobile);
    gutter.setAttribute('style', `${mobile ? 'height' : 'width'}: ${splitterOptions.gutterSize}px`);
}
