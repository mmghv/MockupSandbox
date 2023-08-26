function htmlElement(html, parent = document.body) {
  const template = document.createElement('template');
  html = html.trim();
  template.innerHTML = html;
  const element = template.content.firstChild;
  if (parent) {
    parent.appendChild(element)
  }
  return element;
}

function rtl() {
  document.body.setAttribute('dir', 'rtl')
}

function ltr() {
  document.body.setAttribute('dir', 'ltr')
}

function title(title = '') {
  const titlebar = htmlElement(`<div class="title">${title}</div>`)
  return {
    get title() {
      return titlebar.textContent
    },
    set title(title) {
      titlebar.textContent = title
    },
  }
}

function button(title = 'Button', onclick) {
  const btn = htmlElement(`<button class="button primary shadowed my-1">${title}</button>`)
  if (onclick) btn.onclick = onclick
}

function input(title = '', value = '') {
  const input = htmlElement(`<input type="text" data-role="input" data-prepend="${title}" value="${value}">`)
  input.onkeydown = function (e) {
    if (e.key == 'Enter') {
      const btn = document.querySelector('body > button')
      if (btn && btn.onclick) btn.onclick()
    }
  }
  return {
    get value() {
      return input.getAttribute('type') == 'number' ? (input.value*1) : input.value
    },
    set value(value) {
      input.value = input.getAttribute('type') == 'number' ? (value*1) : value
    },
    number() {
      input.setAttribute('type', 'number')
      input.value = input.value == '' ? '' : (input.value*1)
      return this
    }
  }
}

function output(title = '', value = '') {
  const input = htmlElement(`<input class="my-1" type="text" data-role="input" data-prepend="${title}" value="${value}" readonly>`)
  return {
    get value() {
      return input.value
    },
    set value(value) {
      input.value = value
    },
  }
}

function table(...header) {
  if (Array.isArray(header[0])) {
    header = header[0]
  }
  const headerRow = `<tr>${header.map(val => `<th>${val}</th>`).join('')}</tr>`
  const table = htmlElement(`<table class="table table-border cell-border my-2"><thead>${headerRow}</thead><tbody></tbody></table>`)
  const body = table.querySelector('tbody')
  const columns = header.map((title, index) => {
    return {
      index,
      title,
      type: 'text',
      inputType: '',
      onclick: null,
    }
  })
  const rowFound = (index, tb) => {
    if (index >=0 && index < tb.rows) {
      return true
    } else {
      console.error(`Table row index (${index}) is not found!`)
    }
  }
  const columnFound = (index) => {
    if (index >=0 && index < columns.length) {
      return true
    } else {
      console.error(`Table columns index (${index}) is not found!`)
    }
  }
  const setupCell = (column, td) => {
    const text = td.textContent
    if (column.type == 'button') {
      td.textContent = ''
      const btn = htmlElement(`<button class="button primary shadowed">${text}</button>`, td)
      btn.onclick = column.onclick
    } else if (column.type == 'input') {
      td.textContent = ''
      const input = htmlElement(`<input type="${column.inputType}" data-role="input">`, td)
      input.value = input.getAttribute('type') == 'number' ? (text == '' ? '' : (text*1)) : text
    }
  }
  return {
    get rows() {
      return body.childElementCount
    },
    get columns() {
      return columns.length
    },
    add(...rowValues) {
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
          setupCell(columns[index], tr.querySelector(`td:nth-child(${index+1})`))
        }
      });
    },
    remove(rowIndex) {
      if (rowFound(rowIndex, this)) {
        body.querySelector(`tr:nth-child(${rowIndex+1})`).remove()
      }
    },
    clear() {
      body.innerHTML = ''
    },
    getValue(columnIndex, rowIndex) {
      if (columnFound(columnIndex) && rowFound(rowIndex, this)) {
        const cell = body.querySelector(`tr:nth-child(${rowIndex+1}) > td:nth-child(${columnIndex+1})`)
        if (columns[columnIndex].type == 'text') {
          return cell.textContent
        } else if (columns[columnIndex].type == 'button') {
          return cell.children[0].textContent
        } else if (columns[columnIndex].type == 'input') {
          const input = cell.querySelector('input')
          return input.getAttribute('type') == 'number' ? (input.value*1) : input.value
        }
      }
    },
    setValue(columnIndex, rowIndex, value) {
      if (columnFound(columnIndex) && rowFound(rowIndex, this)) {
        const cell = body.querySelector(`tr:nth-child(${rowIndex+1}) > td:nth-child(${columnIndex+1})`)
        if (columns[columnIndex].type == 'text') {
          cell.textContent = value
        } else if (columns[columnIndex].type == 'button') {
          cell.children[0].textContent = value
        } else if (columns[columnIndex].type == 'input') {
          const input = cell.querySelector('input')
          input.value = input.getAttribute('type') == 'number' ? (value*1) : value
        }
      }
    },
    button(columnIndex, onclick) {
      if (columnFound(columnIndex)) {
        columns[columnIndex].type = 'button'
        columns[columnIndex].onclick = (e) => {
          if (onclick == null) return
          const tr = e.target.closest('tr')
          for (let i = 0; i < body.childElementCount; i++) {
            if (tr === body.children[i]) {
              return onclick(i)
            }
          }
        }
        body.querySelectorAll(`tr > td:nth-child(${columnIndex+1})`).forEach(td => {
          setupCell(columns[columnIndex], td)
        })
      }
    },
    input(columnIndex) {
      if (columnFound(columnIndex)) {
        columns[columnIndex].type = 'input'
        columns[columnIndex].inputType = 'text'
        body.querySelectorAll(`tr > td:nth-child(${columnIndex+1})`).forEach(td => {
          setupCell(columns[columnIndex], td)
        })
      }
      return {
        number() {
          columns[columnIndex].inputType = 'number'
          body.querySelectorAll(`tr > td:nth-child(${columnIndex+1}) input`).forEach(input => {
            input.setAttribute('type', 'number')
            input.value = input.value == '' ? '' : (input.value*1)
          })
        }
      }
    },
  }
}
