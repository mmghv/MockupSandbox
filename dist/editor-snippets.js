"use strict";
function registerSnippets(monaco) {
    monaco.languages.registerCompletionItemProvider('javascript', {
        provideCompletionItems: () => {
            return {
                suggestions: jsSnippets().map(snippet => (Object.assign({ kind: monaco.languages.CompletionItemKind.Snippet, insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, preselect: true }, snippet)))
            };
        }
    });
}
function jsSnippets() {
    return [
        {
            label: 'console.log()',
            detail: 'Log to the console',
            insertText: 'console.log(${1:})',
            sortText: '1console.log'
        },
        {
            label: 'log',
            detail: 'Log to the console',
            insertText: 'console.log(${1:})',
        },
        {
            label: 'console.clear()',
            detail: 'Clear the console',
            insertText: 'console.clear()',
            sortText: '2console.clear'
        },
        {
            label: 'function',
            detail: 'Create a Function',
            insertText: [
                'function ${1:name}(${2:}) {',
                '\t${3:}',
                '}',
            ].join('\n'),
        },
        {
            label: 'if',
            detail: 'If Statement',
            insertText: [
                'if (${1:}) {',
                '\t${2:}',
                '}',
            ].join('\n'),
        },
        {
            label: 'ifelse',
            detail: 'If-Else Statement',
            insertText: [
                'if (${1:}) {',
                '\t${2:}',
                '} else {',
                '\t${3:}',
                '}',
            ].join('\n'),
        },
        {
            label: 'for',
            detail: 'For Loop',
            insertText: [
                'for (let ${1:i} = 0; ${1:i} < ${2:10}; ${1:i}++) {',
                '\t${3:}',
                '}',
            ].join('\n'),
        },
        {
            label: 'foreach',
            detail: 'For-Each Loop',
            insertText: [
                '${1:array}.forEach(${2:element} => {',
                '\t${3:}',
                '})',
            ].join('\n'),
        },
        {
            label: 'while',
            detail: 'While Statement',
            insertText: [
                'while (${1:}) {',
                '\t${2:}',
                '}',
            ].join('\n'),
        },
        {
            label: 'dowhile',
            detail: 'Do-While Statement',
            insertText: [
                'do {',
                '\t${2:}',
                '} while (${1:})',
            ].join('\n'),
        },
        {
            label: 'switch',
            detail: 'Switch Statement',
            insertText: [
                'switch (${1:expression}) {',
                '\tcase ${2:value}:',
                '\t\t${3:}',
                '\t\tbreak;',
                '\tcase ${4:value}:',
                '\t\t${5:}',
                '\t\tbreak;',
                '\tdefault:',
                '\t\t${6:}',
                '}',
            ].join('\n'),
        },
        {
            label: 'setInterval',
            detail: 'setInterval Function',
            insertText: [
                'setInterval(() => {',
                '\t${2:}',
                '}, ${1:interval})',
            ].join('\n'),
        },
        {
            label: 'setTimeout',
            detail: 'setTimeout Function',
            insertText: [
                'setTimeout(() => {',
                '\t${2:}',
                '}, ${1:timeout})',
            ].join('\n'),
        },
        {
            label: 'trycatch',
            detail: 'Try-Catch Statement',
            insertText: [
                'try {',
                '\t${2:}',
                '} catch (${1:error}) {',
                '\t${3:}',
                '}',
            ].join('\n'),
        },
    ];
}
