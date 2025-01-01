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
    i: {
        type: 'A', x: 0, y: -5
    },
    a: {
        type: 'A', x: 0, y: -10
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
    updateSVG();
    return;
  }

  // Handle space
  if (keyIdentifier === " ") {
    outputDiv.textContent += " ";
    userInput.push(' ');
    return;
  }

  // Handle vowels with conditional cycling
  if (vowelCycle[keyIdentifier]) {
    userInput.push(keyIdentifier);
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
        console.log('Character: ' + cycle[nextIndex])
      }
    } else {
      // Add the unaccented vowel if it's not already present
      outputDiv.textContent += vowelCycle[keyIdentifier][0];
    }
  }

  // Handle consonants and special characters
  if (event.shiftKey && event.key.length === 1) {
    keyIdentifier = `Shift+${event.key.toUpperCase()}`; // Handle shifted keys
  }

  const greggsChar = mapping[keyIdentifier];
  if (greggsChar) {
    userInput.push(greggsChar);
    outputDiv.textContent += greggsChar;
  }

  updateSVG();
});

function updateSVG() {
    console.log('User input: ' + userInput);
    let pathData = `M ${baseX} ${baseY}`; // Start the path
    let x = baseX, y = baseY; // Track the current position
    let furthestX = baseX;

    for (const char of userInput) {
      const mapping = greggsMapping[char];
      if (char === ' '){
        x = furthestX + 10;
        y = baseY;
        pathData += ` M ${x} ${y}`
        continue
      } else if (!mapping) continue; // Skip unsupported characters

      if (mapping.type === 'Q') {
        pathData += ` Q ${x + mapping.xControl} ${y + mapping.yControl} ${x + mapping.x} ${y + mapping.y}`;
        x += mapping.x;
        y += mapping.y;
      } else if (mapping.type === 'L') {
        pathData += ` L ${x + mapping.x} ${y + mapping.y}`;
        x += mapping.x;
        y += mapping.y;
      } else if (mapping.type === 'A') {
        pathData += ` A 1 1 0 0 0 ${x + mapping.x} ${y + mapping.y} A 1 1 0 0 0 ${x} ${y}`;
        x += mapping.x;
        y += mapping.y;
      }

      if (mapping.x > 0){
        furthestX = x;
      }
    }

    document.getElementById("greggsPath").setAttribute("d", pathData);
}
