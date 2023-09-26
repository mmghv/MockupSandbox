// console proxy
const consoleMethods = ['log', 'error', 'clear'] as const
const realConsole: {[method in typeof consoleMethods[number]]?: Function} = {}
consoleMethods.forEach(method => {
  realConsole[method] = console[method]
  console[method] = (...args) => {
    realConsole[method]!(...args)
    const serializedData: string[] = args.map(arg => {
      if (typeof arg === "string") {
        return args.length == 1 && arg !== '' ? arg : JSON.stringify(arg)
      } else {
        return String(arg)
      }
    })
    parent.window.postMessage({ type: 'console', method, serializedData }, "*")
  }
});

window.addEventListener('error', function (e) {
  e.preventDefault()
  const msg = e.message.replace(/^(Uncaught .+: )/, "$&\n")
  console.error(`${msg} (at line ${e.lineno})`)
}, false)
