const display = document.querySelector("#display");
const expression = document.querySelector("#expression");
const keypad = document.querySelector(".keypad");
const operatorButtons = keypad.querySelectorAll(".operator");

const operators = {
    "+": { symbol: "+", calculate: (a, b) => a + b },
    "-": { symbol: "−", calculate: (a, b) => a - b },
    "*": { symbol: "×", calculate: (a, b) => a * b },
    "/": { symbol: "÷", calculate: (a, b) => a / b }
};

let entry = "0";
let firstNumber = null;
let operator = null;
let startNewEntry = true;

function reset() {
    entry = "0";
    firstNumber = null;
    operator = null;
    startNewEntry = true;
    expression.textContent = "";
}

function enterDigit(key) {
    if (startNewEntry) {
        entry = "0";
        startNewEntry = false;
        if (!operator) expression.textContent = "";
    }

    if (key === ".") {
        if (!entry.includes(".")) entry += ".";
    } else if (entry.replace(".", "").length < 12) {
        entry = entry === "0" ? key : entry + key;
    }
}

function calculate() {
    const secondNumber = Number(entry);
    const operation = operators[operator];
    expression.textContent = firstNumber + " " + operation.symbol + " " + entry + " =";

    const result = operation.calculate(firstNumber, secondNumber);

    if (operator === "/" && secondNumber === 0) {
        entry = "Cannot divide by zero";
    } else if (!Number.isFinite(result)) {
        entry = "Number too large";
    } else {
        entry = String(Number(result.toPrecision(12)));
    }

    firstNumber = null;
    operator = null;
    startNewEntry = true;
    return Number.isFinite(result);
}

function chooseOperator(key) {
    if (!Number.isFinite(Number(entry))) return;
    if (operator && !startNewEntry && !calculate()) return;

    firstNumber = Number(entry);
    operator = key;
    expression.textContent = firstNumber + " " + operators[key].symbol;
    startNewEntry = true;
}

function handleKey(key) {
    if (/^[0-9.]$/.test(key)) {
        enterDigit(key);
    } else if (Object.hasOwn(operators, key)) {
        chooseOperator(key);
    } else if (key === "=" && operator && !startNewEntry) {
        calculate();
    } else if (key === "Escape") {
        reset();
    } else if (key === "Backspace" && !startNewEntry) {
        entry = entry.slice(0, -1) || "0";
    }

    display.textContent = entry;
    display.classList.toggle("compact", entry.length > 10);

    for (const button of operatorButtons) {
        button.classList.toggle("is-selected", button.dataset.key === operator);
    }
}

keypad.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-key]");
    if (button) handleKey(button.dataset.key);
});

document.addEventListener("keydown", (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === "Enter" && event.target instanceof HTMLButtonElement) return;

    const key = event.key === "Enter" ? "=" : event.key;
    if (/^[0-9.+*/=\-]$/.test(key) || key === "Backspace" || key === "Escape") {
        event.preventDefault();
        handleKey(key);
    }
});
