const initialTitle = document.title;

const editorFrame = document.getElementById('editor') as HTMLIFrameElement
editorFrame.src = 'editor.html' + location.search

const state = {
  code: '',
  codeURIChanged: false,
}

// @ts-ignore
function htmlElement(html: string, parent: Node = document.body): HTMLElement {
  const template = document.createElement('template');
  template.innerHTML = html.trim();
  const element = template.content.firstChild;
  if (parent && element) {
    parent.appendChild(element)
  }
  return element as HTMLElement;
}

function consoleLog(serializedData: string[], isError: boolean) {
  const consoleDiv = document.getElementById('console') as HTMLDivElement
  const line = htmlElement(`<pre class="p-1 ${isError ? 'console-error' : 'mb-1'}"></pre>`, consoleDiv) as HTMLElement
  serializedData.forEach(val => htmlElement(`<span class="mr-2">${val}</span>`, line));
  consoleDiv.scrollTop = line.offsetTop
}
const customConsole = {
  log: (serializedData: string[]) => consoleLog(serializedData, false),
  error: (serializedData: string[]) => consoleLog(serializedData, true),
  clear: () => {document.getElementById('console')!.innerHTML = ''},
}

// @ts-ignore
function run(code: string, save: boolean) {
  // console.clear()
  customConsole.clear()
  document.title = initialTitle
  const output = document.querySelector('#output')!
  output.innerHTML = ''
  const iframe = htmlElement(`<iframe src="output.html" width="100%" height="100%">`) as HTMLIFrameElement
  iframe.onload = () => {
    state.code = code
    iframe.contentWindow!.postMessage({code, save}, "*")
  }
  output.appendChild(iframe)
}

function runFinished(save: boolean) {
  if (save) {
    const encodedQuery = '.?code=' + codeCompressForURI(state.code)
    if (state.codeURIChanged) {
      history.replaceState(null, '', encodedQuery)
    } else {
      history.pushState(null, '', encodedQuery)
      state.codeURIChanged = true
    }
  }
}

// reload on back/forward
addEventListener('popstate', () => location.reload())

window.addEventListener('message', function(e) {
  const data = e.data
  if (data.type == 'console') {
    customConsole[data.method as keyof typeof customConsole](data.serializedData)
  } else if (data.type == 'run') {
    run(data.code, data.save)
  } else if (data.type == 'run-finished') {
    runFinished(data.save)
  } else if (data.type == 'title') {
    document.title = initialTitle + (data.title ? ' - ' + data.title : '')
  }
});

// page splitter breakpoint
declare const Metro: any
Metro.makePlugin("#page", "splitter");
window.addEventListener('resize', pageSplitter)
pageSplitter()
function pageSplitter() {
  const mobile = (window.innerWidth <= 700)
  const page = document.getElementById('page') as HTMLDivElement
  const gutter = page.querySelector('.gutter') as HTMLElement
  const splitterOptions = Metro.getPlugin(page).splitter.options
  const mobileView = (splitterOptions.splitMode == 'vertical')
  if (mobileView == mobile) return

  splitterOptions.splitMode = mobile ? 'vertical' : 'horizontal'
  page.classList.toggle('vertical', mobile)
  gutter.setAttribute('style', `${mobile ? 'height' : 'width'}: ${splitterOptions.gutterSize}px`)
}
