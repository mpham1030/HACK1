const display = document.getElementById("display");


let expression = "";
let justCalculated = false;


function updateDisplay() {
   display.value = expression || "0";
   display.scrollLeft = display.scrollWidth;
}


function appendNumber(number) {
   if (expression === "Error" || justCalculated) {
       expression = "";
       justCalculated = false;
   }


   if (number === ".") {
       const currentNumber = expression.split(/[+\-*/]/).pop();


       if (currentNumber.includes(".")) {
           return;
       }


       if (currentNumber === "") {
           expression += "0";
       }
   }


   expression += number;
   updateDisplay();
}


function chooseOperator(selectedOperator) {
   if (expression === "Error") return;


   justCalculated = false;


   if (expression === "") {
       if (selectedOperator === "-") {
           expression = "-";
       }
       updateDisplay();
       return;
   }


   if (selectedOperator === "-" && /[+*/]$/.test(expression)) {
       expression += "-";
       updateDisplay();
       return;
   }


   if (/[+\-*/]$/.test(expression)) {
       expression = expression.slice(0, -1);
   }


   if (expression.endsWith(".")) {
       expression += "0";
   }


   if (expression === "") {
       updateDisplay();
       return;
   }


   expression += selectedOperator;
   updateDisplay();
}


function calculate() {
   if (!expression || expression === "Error") {
       return;
   }


   if (/[+\-*/.]$/.test(expression)) {
       return;
   }


   try {
       if (!/^[0-9+\-*/.]+$/.test(expression)) {
           throw new Error("Invalid expression");
       }


       let position = 0;


       function skipNumber() {
           const remaining = expression.slice(position);
           const match = remaining.match(
               /^-?(?:\d+\.?\d*|\.\d+)/
           );


           if (!match) {
               throw new Error("Invalid number");
           }


           position += match[0].length;
           return Number(match[0]);
       }


       function parseTerm() {
           let value = skipNumber();


           while (position < expression.length) {
               const op = expression[position];


               if (op !== "*" && op !== "/") {
                   break;
               }


               position++;
               const next = skipNumber();


               if (op === "*") {
                   value *= next;
               } else {
                   if (next === 0) {
                       throw new Error("Division by zero");
                   }
                   value /= next;
               }
           }


           return value;
       }


       function parseExpression() {
           let value = parseTerm();


           while (position < expression.length) {
               const op = expression[position];


               if (op !== "+" && op !== "-") {
                   break;
               }


               position++;
               const next = parseTerm();


               if (op === "+") {
                   value += next;
               } else {
                   value -= next;
               }
           }


           return value;
       }


       const result = parseExpression();


       if (
           position !== expression.length ||
           !Number.isFinite(result)
       ) {
           throw new Error("Invalid result");
       }


       expression = String(Number(result.toPrecision(12)));
       justCalculated = true;


   } catch (error) {
       expression = "Error";
       justCalculated = true;
   }


   updateDisplay();
}


function clearDisplay() {
   expression = "";
   justCalculated = false;
   updateDisplay();
}


function deleteLast() {
   if (expression === "Error") {
       clearDisplay();
       return;
   }


   expression = expression.slice(0, -1);
   justCalculated = false;
   updateDisplay();
}


function percentage() {
   if (!expression || expression === "Error") {
       return;
   }


   const match = expression.match(/(\d+\.?\d*|\.\d+)$/);


   if (!match) return;


   const percent = String(
       Number((Number(match[0]) / 100).toPrecision(12))
   );


   expression =
       expression.slice(0, -match[0].length) + percent;


   justCalculated = false;
   updateDisplay();
}


document.querySelectorAll(".buttons button").forEach(button => {
   button.addEventListener("click", () => {


       if (button.hasAttribute("data-number")) {
           appendNumber(button.dataset.number);
       }


       else if (button.hasAttribute("data-operator")) {
           chooseOperator(button.dataset.operator);
       }


       else if (button.dataset.action === "clear") {
           clearDisplay();
       }


       else if (button.dataset.action === "backspace") {
           deleteLast();
       }


       else if (button.dataset.action === "percent") {
           percentage();
       }


       else if (button.dataset.action === "equals") {
           calculate();
       }
   });
});


document.addEventListener("keydown", function(event) {
   const key = event.key;


   if (/^[0-9]$/.test(key)) {
       appendNumber(key);
   }


   else if (key === ".") {
       appendNumber(".");
   }


   else if (key === "+") {
       chooseOperator("+");
   }


   else if (key === "-") {
       chooseOperator("-");
   }


   else if (key === "*") {
       chooseOperator("*");
   }


   else if (key === "/") {
       event.preventDefault();
       chooseOperator("/");
   }


   else if (key === "Enter" || key === "=") {
       event.preventDefault();
       calculate();
   }


   else if (key === "Backspace") {
       event.preventDefault();
       deleteLast();
   }


   else if (key === "Delete" || key === "Escape") {
       event.preventDefault();
       clearDisplay();
   }


   else if (key === "%") {
       percentage();
   }
});


updateDisplay();
