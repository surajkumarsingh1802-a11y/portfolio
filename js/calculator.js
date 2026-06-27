// Calculator logic for mouse clicks and keyboard input.
const result = document.getElementById("result");
const history = document.getElementById("history");
const keys = document.querySelector(".keys");

let expression = "";
let justCalculated = false;

function updateDisplay(value = expression) {
  result.textContent = value || "0";
}

function appendValue(value) {
  const operators = ["+", "-", "*", "/", "%"];
  const lastCharacter = expression.slice(-1);

  if (justCalculated && !operators.includes(value)) {
    expression = "";
    history.textContent = "";
  }

  if (value === "." && expression.split(/[+\-*/%]/).pop().includes(".")) {
    return;
  }

  if (operators.includes(value) && operators.includes(lastCharacter)) {
    expression = expression.slice(0, -1) + value;
  } else {
    expression += value;
  }

  justCalculated = false;
  updateDisplay();
}

function clearCalculator() {
  expression = "";
  history.textContent = "";
  justCalculated = false;
  updateDisplay();
}

function deleteLastValue() {
  expression = expression.slice(0, -1);
  updateDisplay();
}

function calculate() {
  if (!expression || /[+\-*/%.]$/.test(expression)) {
    return;
  }

  try {
    const answer = Function(`"use strict"; return (${expression})`)();

    if (!Number.isFinite(answer)) {
      throw new Error("Invalid calculation");
    }

    history.textContent = expression.replaceAll("*", "×").replaceAll("/", "÷") + " =";
    expression = String(Number(answer.toFixed(10)));
    updateDisplay(expression);
    justCalculated = true;
  } catch {
    updateDisplay("Error");
    expression = "";
    justCalculated = true;
  }
}

keys.addEventListener("click", (event) => {
  const button = event.target.closest("button");

  if (!button) return;

  if (button.dataset.value) {
    appendValue(button.dataset.value);
  }

  if (button.dataset.action === "clear") {
    clearCalculator();
  }

  if (button.dataset.action === "delete") {
    deleteLastValue();
  }

  if (button.dataset.action === "calculate") {
    calculate();
  }
});

document.addEventListener("keydown", (event) => {
  const allowedKeys = "0123456789.+-*/%";

  if (allowedKeys.includes(event.key)) {
    appendValue(event.key);
  }

  if (event.key === "Enter" || event.key === "=") {
    event.preventDefault();
    calculate();
  }

  if (event.key === "Backspace") {
    deleteLastValue();
  }

  if (event.key === "Escape") {
    clearCalculator();
  }
});
