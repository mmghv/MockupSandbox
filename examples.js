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

// Add input of type number (value returns a number and not a string)
let input3 = input("Number input").number()

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
    input3.value = input3.value + 1
    console.log("Button clicked!")
}
`,
  // ----------------------------------------
  table: `
title("Table example")

// Create a table with 4 columns
let tb = table("ID", "Name", "Notes", "Edit", "Remove")

// Note that table rows and columns are zero-based, first row & first column has index 0

// Set the 3rd column to be an editable input
tb.input(2)

// Columns can be input of type number so getValue() return a number
// tb.input(0).number()

// Set the 4th column to be a button and register the click callback function
tb.button(3, edit)

// click callback receives the row index of the clicked button
function edit(index) {
    // Get cell value (2nd column, row of clicked button)
    let oldName = tb.getValue(1, index)

    let newName = prompt("Edit student name :", oldName)

    if (newName != null) {
        // Set cell value
        tb.setValue(1, index, newName)
    }
}

// Set the 5th column to be a button, use an anonymous callback function
tb.button(4, function (index) {
    // Remove table row
    tb.remove(index)
})

let id = 1

// Add rows to the table
for (let i = 1; i <= 5; i++) {
    tb.add(id, "student " + i, "notes " + i, "Edit", "X")
    id++
}

let nameInput = input("New student")
button("Add student", add)
button("Clear table", clear)

function add() {
    // Add new row
    tb.add(id, nameInput.value, "", "Edit", "X")
    nameInput.value = ""
    id++
}

function clear() {
    // Clear the table
    tb.clear()
    id = 1
}

let searchInput = input("Search by name")

button("Search", function() {
    let searchText = searchInput.value

    if (searchText == "") {
        console.log("Enter a search text")
        return
    }

    // Iterate over the rows
    for (let i = 0; i < tb.rows; i++) {
        let studentName = tb.getValue(1, i)

        if (studentName.includes(searchText)) {
            console.log("Found student with name : " + studentName + " - row index : " + i)
            return
        }
    }

    console.log("No student found with this name!")
})
`,
  // ----------------------------------------
  simple_calculator: `
title("Simple Caclulator")

let num1 = input("First number", 4).number()
let num2 = input("Second number", 3).number()
let result = output("Result")

button("+", add)
button("-", subtract)

function add() {
    result.value = num1.value + num2.value
}

function subtract() {
    result.value = num1.value - num2.value
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
