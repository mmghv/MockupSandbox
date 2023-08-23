
interface Title {
    title: string
}

interface Input {
    value: string
}

interface Output {
    value: string
}

/**
 * Add html element to the page
 * @param html HTML to create the element from
 * @param parent Parent element to append the element to
 */
declare function htmlElement(html: string, parent = document.body): HTMLElement

/**
 * Change the page direction to right-to-left for languages like Arabic
 */
declare function rtl(): void

/**
 * Change the page direction to left-to-right
 */
declare function ltr(): void

/**
 * Add title bar
 * @param title Text of the title
 */
declare function title(title: string): Title

/**
 * Add a button
 * @param title Title of the button
 * @param onclick Function to execute when clicked
 */
declare function button(title = 'Button', onclick: function): void

/**
 * Add an input field
 * @param title Title of the input
 * @param value Initial value of the input
 */
declare function input(title = '', value = ''): Input

/**
 * Add an output field
 * @param title Title of the output
 * @param value Initial value of the output
 */
declare function output(title = '', value = ''): Output
