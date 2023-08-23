const examples = {
  // ----------------------------------------
  hello_world: `
title("Hello World")

let input1 = input("My name")
let output1 = output("Message")
button("Say hi!", sayHi)

function sayHi() {
    let name = input1.value
    if (name == "") {
        console.log("Enter your name!")
        output1.value = ""
    } else {
        output1.value = "Hello, " + name
    }
}
`,
  // ----------------------------------------
  basic_controls: `
// Add title bar
title("Page Title")

// Add empty input field
let input1 = input()

// Add input field with title and initial value
let input2 = input("Input title", "Input value")

// Add output field
let output1 = output("Output title")

// Get input value
console.log(input2.value)

// Set output (or input) value
output1.value = "Output value"

// Add button
button("Click me!", click)

// Button click callback function
function click() {
    input1.value = "Button clicked!"
    console.log("Button clicked!")
}
`,
  // ----------------------------------------
  simple_calculator: `
title("Simple Caclulator")

let num1 = input("First number", 4)
let num2 = input("Second number", 3)
let result = output("Result")

button("+", add)
button("-", subtract)

function add() {
    let a = num1.value * 1
    let b = num2.value * 1
    result.value = a + b
}

function subtract() {
    let a = num1.value * 1
    let b = num2.value * 1
    result.value = a - b
}
`,
  // ----------------------------------------
  rtl: `
rtl()
title("اهلاً وسهلاً")

let input1 = input("الاسم")
let output1 = output("الرسالة")
button("ترحيب", sayHi)

function sayHi() {
    let name = input1.value
    if (name == "") {
        console.log("اكتب اسمك اولاً!")
        output1.value = ""
    } else {
        output1.value = "اهلاً بك يا " + name
    }
}
`,
  // ----------------------------------------
}

const urlParams = new URLSearchParams(location.search);
const example = urlParams.get('example');

window.code = (examples[example] || examples['hello_world']).substr(1)
