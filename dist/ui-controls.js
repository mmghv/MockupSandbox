"use strict";
/**
 * Add an html element to the page
 * @param html HTML to create the element from
 * @param parent Parent element to append the element to
 */
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
/**
 * Change the page direction to right-to-left for languages like Arabic
 */
function rtl() {
    document.body.setAttribute('dir', 'rtl');
}
/**
 * Change the page direction to left-to-right
 */
function ltr() {
    document.body.setAttribute('dir', 'ltr');
}
/**
 * Add title bar
 * @param title Text of the title
 */
function title(title = '') {
    const titlebar = htmlElement(`<div class="title">${title}</div>`);
    parent.window.postMessage({ type: 'title', title }, "*");
    return {
        get title() {
            var _a;
            return (_a = titlebar.textContent) !== null && _a !== void 0 ? _a : '';
        },
        set title(title) {
            titlebar.textContent = title;
        },
    };
}
/**
 * Add a button
 * @param title Title of the button
 * @param onclick Function to execute when clicked
 */
function button(title = 'Button', onclick) {
    const btn = htmlElement(`<button class="button primary shadowed my-1">${title}</button>`);
    if (onclick)
        btn.onclick = onclick;
}
/**
 * Add an input field
 * @param title Title of the input
 * @param value Initial value of the input
 */
function input(title = '', value = '') {
    const input = htmlElement(`<input type="text" data-role="input" data-prepend="${title}" value="${value}">`);
    input.onkeydown = function (e) {
        if (e.key == 'Enter') {
            const btn = document.querySelector('body > button');
            if (btn && btn.onclick)
                btn.onclick(new MouseEvent('click'));
        }
    };
    return {
        get value() {
            return input.getAttribute('type') == 'number' ? (input.value * 1) : input.value;
        },
        set value(value) {
            input.value = String(input.getAttribute('type') == 'number' ? (value * 1) : value);
        },
        number() {
            input.setAttribute('type', 'number');
            input.value = String(input.value == '' ? '' : (input.value * 1));
            return this;
        }
    };
}
/**
 * Add an output field
 * @param title Title of the output
 * @param value Initial value of the output
 */
function output(title = '', value = '') {
    const input = htmlElement(`<input class="my-1" type="text" data-role="input" data-prepend="${title}" value="${value}" readonly>`);
    return {
        get value() {
            return input.value;
        },
        set value(value) {
            input.value = value;
        },
    };
}
/**
 * Add a table
 * @param header table header
 */
function table(...header) {
    if (Array.isArray(header[0])) {
        header = header[0];
    }
    const headerRow = `<tr>${header.map(val => `<th>${val}</th>`).join('')}</tr>`;
    const table = htmlElement(`<table class="table table-border cell-border my-2"><thead>${headerRow}</thead><tbody></tbody></table>`);
    const body = table.querySelector('tbody');
    const columns = header.map((title, index) => {
        return {
            index,
            title,
            type: 'text',
            inputType: '',
            onclick: (e) => { },
        };
    });
    const tb = {
        get rows() {
            return body.childElementCount;
        },
        get columns() {
            return columns.length;
        },
        add(...rowValues) {
            if (Array.isArray(rowValues[0])) {
                rowValues = rowValues[0];
            }
            if (rowValues.length < columns.length) {
                rowValues.push(...Array(columns.length - rowValues.length).fill(''));
            }
            else if (rowValues.length > columns.length) {
                rowValues.splice(columns.length);
            }
            const tr = htmlElement(`<tr>${rowValues.map(val => `<td>${val}</td>`).join('')}</tr>`, body);
            columns.forEach((col, index) => {
                if (col.type != 'text') {
                    setupCell(columns[index], tr.querySelector(`td:nth-child(${index + 1})`));
                }
            });
        },
        remove(rowIndex) {
            if (rowFound(rowIndex)) {
                body.querySelector(`tr:nth-child(${rowIndex + 1})`).remove();
            }
        },
        clear() {
            body.innerHTML = '';
        },
        getValue(columnIndex, rowIndex) {
            var _a, _b;
            if (columnFound(columnIndex) && rowFound(rowIndex)) {
                const cell = body.querySelector(`tr:nth-child(${rowIndex + 1}) > td:nth-child(${columnIndex + 1})`);
                if (columns[columnIndex].type == 'text') {
                    return (_a = cell.textContent) !== null && _a !== void 0 ? _a : '';
                }
                else if (columns[columnIndex].type == 'button') {
                    return (_b = cell.children[0].textContent) !== null && _b !== void 0 ? _b : '';
                }
                else if (columns[columnIndex].type == 'input') {
                    const input = cell.querySelector('input');
                    return input.getAttribute('type') == 'number' ? (input.value * 1) : input.value;
                }
            }
            return '';
        },
        setValue(columnIndex, rowIndex, value) {
            if (columnFound(columnIndex) && rowFound(rowIndex)) {
                const cell = body.querySelector(`tr:nth-child(${rowIndex + 1}) > td:nth-child(${columnIndex + 1})`);
                if (columns[columnIndex].type == 'text') {
                    cell.textContent = value;
                }
                else if (columns[columnIndex].type == 'button') {
                    cell.children[0].textContent = value;
                }
                else if (columns[columnIndex].type == 'input') {
                    const input = cell.querySelector('input');
                    input.value = String(input.getAttribute('type') == 'number' ? (value * 1) : value);
                }
            }
        },
        button(columnIndex, onclick) {
            if (columnFound(columnIndex)) {
                columns[columnIndex].type = 'button';
                columns[columnIndex].onclick = (e) => {
                    if (onclick == undefined)
                        return;
                    const tr = e.target.closest('tr');
                    for (let i = 0; i < body.childElementCount; i++) {
                        if (tr === body.children[i]) {
                            return onclick(i);
                        }
                    }
                };
                body.querySelectorAll(`tr > td:nth-child(${columnIndex + 1})`).forEach(td => {
                    setupCell(columns[columnIndex], td);
                });
            }
        },
        input(columnIndex) {
            if (columnFound(columnIndex)) {
                columns[columnIndex].type = 'input';
                columns[columnIndex].inputType = 'text';
                body.querySelectorAll(`tr > td:nth-child(${columnIndex + 1})`).forEach(td => {
                    setupCell(columns[columnIndex], td);
                });
            }
            return {
                number() {
                    columns[columnIndex].inputType = 'number';
                    const inputs = body.querySelectorAll(`tr > td:nth-child(${columnIndex + 1}) input`);
                    inputs.forEach((input) => {
                        input.setAttribute('type', 'number');
                        input.value = String(input.value == '' ? '' : (input.value * 1));
                    });
                }
            };
        },
    };
    function rowFound(index) {
        if (index >= 0 && index < tb.rows) {
            return true;
        }
        else {
            console.error(`Table row index (${index}) is not found!`);
        }
    }
    function columnFound(index) {
        if (index >= 0 && index < columns.length) {
            return true;
        }
        else {
            console.error(`Table columns index (${index}) is not found!`);
        }
    }
    function setupCell(column, td) {
        var _a;
        const text = (_a = td.textContent) !== null && _a !== void 0 ? _a : '';
        if (column.type == 'button') {
            td.textContent = '';
            const btn = htmlElement(`<button class="button primary shadowed">${text}</button>`, td);
            btn.onclick = column.onclick;
        }
        else if (column.type == 'input') {
            td.textContent = '';
            const input = htmlElement(`<input type="${column.inputType}" data-role="input">`, td);
            input.value = String(input.getAttribute('type') == 'number' ? (text == '' ? '' : (text * 1)) : text);
        }
    }
    return tb;
}
