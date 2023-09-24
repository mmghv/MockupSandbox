/**
 * Add an html element to the page
 * @param html HTML to create the element from
 * @param parent Parent element to append the element to
 */
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

/**
 * Change the page direction to right-to-left for languages like Arabic
 */
function rtl() {
  document.body.setAttribute('dir', 'rtl')
}

/**
 * Change the page direction to left-to-right
 */
function ltr() {
  document.body.setAttribute('dir', 'ltr')
}

interface Title {
  title: string
}

/**
 * Add title bar
 * @param title Text of the title
 */
function title(title: string = ''): Title {
  const titlebar = htmlElement(`<div class="title">${title}</div>`)
  parent.window.postMessage({type: 'title', title}, "*")
  return {
    get title(): string {
      return titlebar.textContent ?? ''
    },
    set title(title) {
      titlebar.textContent = title
    },
  }
}

/**
 * Add a button
 * @param title Title of the button
 * @param onclick Function to execute when clicked
 */
function button(title = 'Button', onclick: (e: MouseEvent) => void) {
  const btn = htmlElement(`<button class="button primary shadowed my-1">${title}</button>`) as HTMLButtonElement
  if (onclick) btn.onclick = onclick
}

interface Input {
  value: string|number

  /**
   * Change the input type to number so value returns a number and not a string
   */
  number(): this
}

/**
 * Add an input field
 * @param title Title of the input
 * @param value Initial value of the input
 */
function input(title = '', value = ''): Input {
  const input = htmlElement(`<input type="text" data-role="input" data-prepend="${title}" value="${value}">`) as HTMLInputElement
  input.onkeydown = function (e) {
    if (e.key == 'Enter') {
      const btn = document.querySelector('body > button') as HTMLButtonElement | null
      if (btn && btn.onclick) btn.onclick(new MouseEvent('click'))
    }
  }
  return {
    get value() {
      return input.getAttribute('type') == 'number' ? (input.value as any * 1) : input.value
    },
    set value(value) {
      input.value = String(input.getAttribute('type') == 'number' ? (value as any * 1) : value)
    },
    number() {
      input.setAttribute('type', 'number')
      input.value = String(input.value == '' ? '' : (input.value as any * 1))
      return this
    }
  }
}

interface Output {
  value: string
}

/**
 * Add an output field
 * @param title Title of the output
 * @param value Initial value of the output
 */
function output(title = '', value = ''): Output {
  const input = htmlElement(`<input class="my-1" type="text" data-role="input" data-prepend="${title}" value="${value}" readonly>`) as HTMLInputElement
  return {
    get value() {
      return input.value
    },
    set value(value) {
      input.value = value
    },
  }
}


interface Table {
  /**
   * Get rows count
   */
  rows: number

  /**
   * Get columns count
   */
  columns: number

  /**
   * Add new row to the table
   * @param rowValues Row cells values
   */
  add(...rowValues: string[]): void

  /**
   * Remove table row
   * @param rowIndex Row index (starts from 0)
   */
  remove(rowIndex: number): void

  /**
   * Clear the table (remove all rows)
   */
  clear(): void

  /**
   * Get cell value
   * @param columnIndex Column index (starts from 0)
   * @param rowIndex Row index (starts from 0)
   */
  getValue(columnIndex: number, rowIndex: number): string | number

  /**
   * Set cell value
   * @param columnIndex Column index (starts from 0)
   * @param rowIndex Row index (starts from 0)
   * @param value New cell value
   */
  setValue(columnIndex: number, rowIndex: number, value: string): void

  /**
   * Setup a column as a button
   * @param columnIndex Column index (starts from 0)
   * @param onclick Button click callback function, recieves the row index
   */
  button(columnIndex: number, onclick?: (index: number) => void): void

  /**
   * Setup a column as a button
   * @param columnIndex Column index (starts from 0)
   */
  input(columnIndex: number): {
      /**
       * Chaneg the input type to number so getValue() returns a number
       */
      number(): void
  }
}

/**
 * Add a table
 * @param header table header
 */
function table(...header: string[]): Table {
  if (Array.isArray(header[0])) {
    header = header[0]
  }

  const headerRow = `<tr>${header.map(val => `<th>${val}</th>`).join('')}</tr>`
  const table = htmlElement(`<table class="table table-border cell-border my-2"><thead>${headerRow}</thead><tbody></tbody></table>`)
  const body = table.querySelector('tbody') as HTMLTableSectionElement
  const columns = header.map((title, index) => {
    return {
      index,
      title,
      type: 'text',
      inputType: '',
      onclick: (e: MouseEvent) => {},
    }
  })

  const tb = {
    get rows() {
      return body.childElementCount
    },
    get columns() {
      return columns.length
    },
    add(...rowValues: string[]) {
      if (Array.isArray(rowValues[0])) {
        rowValues = rowValues[0]
      }
      if (rowValues.length < columns.length) {
        rowValues.push(...Array(columns.length - rowValues.length).fill(''))
      } else if (rowValues.length > columns.length) {
        rowValues.splice(columns.length)
      }
      const tr = htmlElement(`<tr>${rowValues.map(val => `<td>${val}</td>`).join('')}</tr>`, body)
      columns.forEach((col, index) => {
        if (col.type != 'text') {
          setupCell(columns[index], tr.querySelector(`td:nth-child(${index+1})`) as HTMLTableCellElement)
        }
      });
    },
    remove(rowIndex: number) {
      if (rowFound(rowIndex)) {
        body.querySelector(`tr:nth-child(${rowIndex+1})`)!.remove()
      }
    },
    clear() {
      body.innerHTML = ''
    },
    getValue(columnIndex: number, rowIndex: number): string | number {
      if (columnFound(columnIndex) && rowFound(rowIndex)) {
        const cell = body.querySelector(`tr:nth-child(${rowIndex+1}) > td:nth-child(${columnIndex+1})`) as HTMLTableCellElement
        if (columns[columnIndex].type == 'text') {
          return cell.textContent ?? ''
        } else if (columns[columnIndex].type == 'button') {
          return cell.children[0].textContent ?? ''
        } else if (columns[columnIndex].type == 'input') {
          const input = cell.querySelector('input') as HTMLInputElement
          return input.getAttribute('type') == 'number' ? (input.value as any * 1) : input.value
        }
      }
      return ''
    },
    setValue(columnIndex: number, rowIndex: number, value: string) {
      if (columnFound(columnIndex) && rowFound(rowIndex)) {
        const cell = body.querySelector(`tr:nth-child(${rowIndex+1}) > td:nth-child(${columnIndex+1})`) as HTMLTableCellElement
        if (columns[columnIndex].type == 'text') {
          cell.textContent = value
        } else if (columns[columnIndex].type == 'button') {
          cell.children[0].textContent = value
        } else if (columns[columnIndex].type == 'input') {
          const input = cell.querySelector('input') as HTMLInputElement
          input.value = String(input.getAttribute('type') == 'number' ? (value as any * 1) : value)
        }
      }
    },
    button(columnIndex: number, onclick?: (index: number) => void) {
      if (columnFound(columnIndex)) {
        columns[columnIndex].type = 'button'
        columns[columnIndex].onclick = (e: MouseEvent) => {
          if (onclick == undefined) return
          const tr = (e.target as HTMLElement).closest('tr')
          for (let i = 0; i < body.childElementCount; i++) {
            if (tr === body.children[i]) {
              return onclick(i)
            }
          }
        }
        body.querySelectorAll(`tr > td:nth-child(${columnIndex+1})`).forEach(td => {
          setupCell(columns[columnIndex], td as HTMLTableCellElement)
        })
      }
    },
    input(columnIndex: number) {
      if (columnFound(columnIndex)) {
        columns[columnIndex].type = 'input'
        columns[columnIndex].inputType = 'text'
        body.querySelectorAll(`tr > td:nth-child(${columnIndex+1})`).forEach(td => {
          setupCell(columns[columnIndex], td as HTMLTableCellElement)
        })
      }
      return {
        number() {
          columns[columnIndex].inputType = 'number'
          const inputs = body.querySelectorAll(`tr > td:nth-child(${columnIndex+1}) input`) as NodeListOf<HTMLInputElement>
          inputs.forEach((input) => {
            input.setAttribute('type', 'number')
            input.value = String(input.value == '' ? '' : (input.value as any * 1))
          })
        }
      }
    },
  }

  function rowFound(index: number) {
    if (index >=0 && index < tb.rows) {
      return true
    } else {
      console.error(`Table row index (${index}) is not found!`)
    }
  }
  function columnFound(index: number) {
    if (index >=0 && index < columns.length) {
      return true
    } else {
      console.error(`Table columns index (${index}) is not found!`)
    }
  }
  function setupCell(column: typeof columns[number], td: HTMLTableCellElement) {
    const text = td.textContent ?? ''
    if (column.type == 'button') {
      td.textContent = ''
      const btn = htmlElement(`<button class="button primary shadowed">${text}</button>`, td)
      btn.onclick = column.onclick
    } else if (column.type == 'input') {
      td.textContent = ''
      const input = htmlElement(`<input type="${column.inputType}" data-role="input">`, td) as HTMLInputElement
      input.value = String(input.getAttribute('type') == 'number' ? (text == '' ? '' : (text as any * 1)) : text)
    }
  }

  return tb
}
