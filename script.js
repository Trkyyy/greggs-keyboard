// Global vars for path management
let userInput = [];
let baseX = 0;
let baseY = 0;


// Select the output area
const outputDiv = document.getElementById('output');

// Define the Greggs shorthand vowel mappings
const vowelCycle = {
  a: ["a", "á", "ā"],
  e: ["e", "é", "ē"],
  o: ["o", "ó", "ō"],
  u: ["u", "ú", "ū"],
};

// Map consonants and special characters
const mapping = {
  k: "k", g: "g", b: "b", p: "p", f: "f", v: "v",
  r: "r", l: "l", s: "s", t: "t", d: "d",
  m: "m", n: "n", i: "i", j: "j",

  // Special consonants
  "Shift+C": "ch", "Shift+T": "th", 
  "Shift+N": "ng", "Shift+K": "nk",

  // Space
  " ": " "
};

const accents = {
    dot: { move: { x: 3, y: 10 }, x: 0, y: -2},
    dash: { move: { x: 1, y: 10 }, x: 7, y: -4}
}

const greggsMapping = {
    r: {
        type: 'Q', xControl: 15, yControl: 15, x: 30, y: 0
    },
    l: {
        type: 'Q', xControl: 30, yControl: 15, x: 60, y: 0
    },
    k: {
        type: 'Q', xControl: 15, yControl: -15, x: 30, y: 0
    },
    g: {
        type: 'Q', xControl: 30, yControl: -15, x: 30, y: 0
    },
    b: {
        type: 'Q', xControl: -15, yControl: 15, x: -15, y: 30
    },
    p: {
        type: 'Q', xControl: -15, yControl: 15, x: -15, y: 60
    },
    s: {
        type: 'Q', xControl: 0, yControl: 8, x: -8, y: 15
    },
    f: {
        type: 'Q', xControl: 0, yControl: 15, x: -15, y: 30
    },
    f: {
        type: 'Q', xControl: 0, yControl: 15, x: -15, y: 60
    },
    u: {
        type: 'Q', xControl: 3, yControl: 10, x: 9, y: 0
    },
    ú: {
        type: 'X', character: {
            type: 'Q', xControl: 3, yControl: 10, x: 9, y: 0
        },
        accent: 'dot'
    },
    ū: {
        type: 'X', character: {
            type: 'Q', xControl: 3, yControl: 10, x: 9, y: 0
        },
        accent: 'dash'
    },
    o: {
        type: 'Q', xControl: 3, yControl: -10, x: 9, y: 0
    },
    ó: {
        type: 'X', character: {
            type: 'Q', xControl: 3, yControl: -10, x: 9, y: 0
        },
        accent: 'dot'
    },
    ō: {
        type: 'X', character: {
            type: 'Q', xControl: 3, yControl: -10, x: 9, y: 0
        },
        accent: 'dash'
    },
    n: {
        type: 'L', x: 30, y: 0
    },
    m: {
        type: 'L', x: 60, y: 0
    },
    t: {
        type: 'L', x: 30, y: -30
    },
    d: {
        type: 'L', x: 45, y: -60
    },
    j: {
        type: 'L', x: -15, y: 15
    },
    ch: {
        type: 'L', x: -45, y: 45
    },
    ng: {
        type: 'L', x: 30, y: 5
    },
    nk: {
        type: 'L', x: 60, y: 10
    },
    th: {
        type: 'Q', xControl: 3, yControl: -12, x: 15, y: -15
    },
    e: {
        type: 'A', x: 0, y: -5
    },
    é: {
        type: 'X', character: {
            type: 'A', x: 0, y: -5
        },
        accent: 'dot'
    },
    ē: {
        type: 'X', character: {
            type: 'A', x: 0, y: -5
        },
        accent: 'dash'
    },
    a: {
        type: 'A', x: 0, y: -10
    },
    á: {
        type: 'X', character: {
            type: 'A', x: 0, y: -10
        },
        accent: 'dot'
    },
    ā: {
        type: 'X', character: {
            type: 'A', x: 0, y: -10
        },
        accent: 'dash'
    }
};

// Handle keypresses
document.addEventListener("keydown", (event) => {
  let keyIdentifier = event.key;
  console.log('Character entered: ' + keyIdentifier)

  // Prevent default behavior for handled keys
  if (keyIdentifier.length === 1 || keyIdentifier === "Backspace" || keyIdentifier === " ") {
    event.preventDefault();
  }

  // Handle backspace
  if (keyIdentifier === "Backspace") {
    const currentText = outputDiv.textContent;
    outputDiv.textContent = currentText.slice(0, currentText.length-1); // Remove the last character
    userInput.splice(-1);
  }

  // Handle space
  if (keyIdentifier === " ") {
    outputDiv.textContent += " ";
    userInput.push(' ');
  }

  // Handle consonants and special characters
  if (event.shiftKey && event.key.length === 1) {
    keyIdentifier = `Shift+${event.key.toUpperCase()}`; // Handle shifted keys
  }

  // Handle vowels with conditional cycling
  if (vowelCycle[keyIdentifier]) {
    console.log('Vowel character entered: ' + keyIdentifier)
    const currentText = outputDiv.textContent;
    const lastChar = currentText.slice(currentText.length-1);

    if (lastChar && vowelCycle[keyIdentifier].includes(lastChar)) {
      // Cycle through accents if the last character matches the current vowel
      const cycle = vowelCycle[keyIdentifier];
      console.log('Vowel character cycle: ' + cycle)
      if (cycle.indexOf(lastChar) != 2) {
        const nextIndex = cycle.indexOf(lastChar) + 1;
        outputDiv.textContent = currentText.slice(0, currentText.length-1) + cycle[nextIndex];
        userInput.pop();
        userInput.push(cycle[nextIndex])
        console.log('Character: ' + cycle[nextIndex])
      }
    } else {
      // Add the unaccented vowel if it's not already present
      userInput.push(vowelCycle[keyIdentifier][0]);
      outputDiv.textContent += vowelCycle[keyIdentifier][0];
    }
  } else {
    if (mapping[keyIdentifier]){
        const greggsChar = mapping[keyIdentifier];
        userInput.push(greggsChar);
        outputDiv.textContent += greggsChar;
    }
  }
  handleIterations();
});

function handleIterations() {
    updateSVGFirstIteration();
}

function handleMapping(state, mapping){
    console.log(`BEFORE: pathdata: ${state.pathData}, x: ${state.x}, y: ${state.y}, mapping: ${mapping}`);
    if (mapping.type === 'Q') {
        state.pathData += ` Q ${state.x + mapping.xControl} ${state.y + mapping.yControl} ${state.x + mapping.x} ${state.y + mapping.y}`;
        state.x += mapping.x;
        state.y += mapping.y;
      } else if (mapping.type === 'L') {
        state.pathData += ` L ${state.x + mapping.x} ${state.y + mapping.y}`;
        state.x += mapping.x;
        state.y += mapping.y;
      } else if (mapping.type === 'A') {
        state.pathData += ` A 1 1 0 0 0 ${state.x + mapping.x} ${state.y + mapping.y} A 1 1 0 0 0 ${state.x} ${state.y}`;
        // state.x += mapping.x;
        // state.y += mapping.y;
      } else if (mapping.type === 'X') {
        console.log(JSON.stringify(mapping));
        let tempX = state.x;
        let tempY = state.y;
        handleMapping(state, mapping.character);
        if(mapping.accent == 'dot'){
            tempX += accents.dot.move.x;
            tempY += accents.dot.move.y;
            state.pathData += ` M ${tempX} ${tempY}`
            state.pathData += ` A 1 1 0 0 0 ${tempX + accents.dot.x} ${tempY + accents.dot.y} A 1 1 0 0 0 ${tempX} ${tempY}`; 
        } else if(mapping.accent == 'dash'){
            tempX += accents.dash.move.x;
            tempY += accents.dash.move.y;
            state.pathData += ` M ${tempX} ${tempY}`
            state.pathData += ` L ${tempX + accents.dash.x} ${tempY + accents.dash.y}`;
        }

        state.pathData += ` M ${state.x} ${state.y}`;
    }
      console.log(`AFTER: pathdata: ${state.pathData}, x: ${state.x}, y: ${state.y}, mapping: ${mapping}`);
}

function updateSVGFirstIteration() {
    console.log('User input: ' + userInput);
    const state = { 
        pathData: `M ${baseX} ${baseY}`, // Start the path
        x: baseX, 
        y: baseY 
    };
    let furthestX = baseX;

    for (const char of userInput) {
      const mapping = greggsMapping[char];
      if (char === ' '){
        state.x = furthestX + 10;
        state.y = baseY;
        state.pathData += ` M ${state.x} ${state.y}`
        continue
      } else if (!mapping) continue; // Skip unsupported characters

      handleMapping(state, mapping);

      if (mapping.x > 0){
        furthestX = state.x;
      }
    }

    document.getElementById("greggsPathFirst").setAttribute("d", state.pathData);
}
