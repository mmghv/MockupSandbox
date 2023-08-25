# Simple-Sandbox

A simple sandbox for learning JavaScript with basic UI controls

https://mmghv.github.io/Simple-Sandbox

The main goal of this tool is to provide the student with a simple coding sandbox equipped with a small set of basic UI controls that can be utilized from JavaScript, It enables the learner to focus on fundamental language concepts while connecting these concepts to user interfaces that make sense and not only logging to the console.

## Who is this for

This is intended for absolute beginners who wish to start learning programming with JavaScript directly without needing to go through HTML and CSS first.

## Supported UI controls

Currently, there're only 4 UI controls that can be used (Titles, Inputs, Outputs & Buttons), Other controls will be added in the future.

```js
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
```

There're also `rtl()` and `ltr()` functions to change the page direction to right-to-left and left-to-right respectively.

## TODO

- [ ] Add other UI controls (like tables & lists that can be used with arrays and loops).
- [ ] Add Dark/Light mode switch.
- [ ] Allow saving & sharing code via links.
- [x] Make the layout mobile-friendly.
- [ ] Add the ability to control the layout.
- [ ] Build a desktop version for offline use

Please feel free to suggest or contribute enhancements that may benefit the beginners.

## License

Copyright © 2023 [Mohamed Gharib](https://github.com/mmghv), Released under the [MIT license](LICENSE).