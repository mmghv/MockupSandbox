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

interface Title {
    title: string
}

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

interface Input {
    value: string|number

    /**
     * Change the input type to number so value returns a number and not a string
     */
    number(): this
}

/**
 * Add an output field
 * @param title Title of the output
 * @param value Initial value of the output
 */
declare function output(title = '', value = ''): Output

interface Output {
    value: string
}

/**
 * Add a table
 * @param header table header
 */
declare function table(...header: string): Table

interface Table {
    rows: number
    columns: number

    /**
     * Add new row to the table
     * @param rowValues Row cells values
     */
    add(...rowValues: string): void

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
    getValue(columnIndex: number, rowIndex: number): string|number

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
    button(columnIndex: number, onclick: (index: number) => void): void

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