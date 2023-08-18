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
  const btn = htmlElement(`<button class="button primary shadowed my-1 mr-1">${title}</button>`)
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
      return input.value
    },
    set value(value) {
      input.value = value
    },
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
