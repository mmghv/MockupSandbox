function loadSnippets(monaco) {
  monaco.languages.registerCompletionItemProvider('javascript', {
    provideCompletionItems: () => ({suggestions: [
      {
        label: 'console.log()',
        kind: monaco.languages.CompletionItemKind.Snippet,
        documentation: 'Add console.log()',
        insertText: 'console.log(${1:})',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        preselect: true,
      }
    ]})
  })
}
