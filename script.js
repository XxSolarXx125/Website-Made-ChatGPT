const suspiciousPatterns = [
  /https?:\/\/discord(app)?\.com\/api\/webhooks\//i,
  /os\.system\(["']rm/i,
  /eval\(/i,
  /exec\(/i,
  /import\s+subprocess/i,
  /subprocess\.run/i,
  /token/i,
  /open\(["'][^'"]*\.py["']\)/i,
  /import\s+(os|sys)/i,
  /subprocess\.Popen/i,
  /base64\.b64decode/i,  // Base64 decoding (suspicious)
  /requests\.get\(/i,     // Suspicious network requests
  /open\(['"][^'"]*\.(exe|sh|bat)['"]\)/i // Suspicious file operations
];

const textarea = document.getElementById("codeInput");
const lineNumbers = document.getElementById("lineNumbers");
const languageSelect = document.getElementById("languageSelect");

document.getElementById("fileUpload").addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      textarea.value = e.target.result;
      updateLineNumbers();
      checkCode();
    };
    reader.readAsText(file);
  }
});

textarea.addEventListener("input", function () {
  updateLineNumbers();
  checkCode();
});

languageSelect.addEventListener("change", function () {
  updateLineNumbers();
  checkCode();
});

function updateLineNumbers() {
  const lines = textarea.value.split("\n");
  let lineNumbersText = "";
  let totalHeight = 0;

  // Calculate total height of textarea content to adjust dynamically
  lines.forEach((line, index) => {
    lineNumbersText += `${index + 1}.\n`;  // Format the line numbers
    totalHeight += getLineHeight(line);     // Sum of the height of each line (based on line length)
  });

  lineNumbers.textContent = lineNumbersText;
  textarea.style.height = `${Math.max(totalHeight, 250)}px`;  // Adjust textarea height dynamically (min height 250px)
}

function getLineHeight(line) {
  const baseHeight = 20;  // Base height for each line (adjust as necessary)
  const extraHeight = line.length > 80 ? (line.length - 80) / 5 : 0;  // Adjust height for long lines
  return baseHeight + extraHeight;
}

function checkCode() {
  const code = textarea.value;
  const resultsBox = document.getElementById("results");
  let results = [];

  suspiciousPatterns.forEach((pattern) => {
    if (pattern.test(code)) {
      results.push(`⚠️ Suspicious code matched: ${pattern}`);
    }
  });

  if (results.length > 0) {
    resultsBox.style.display = "block";
    resultsBox.style.borderLeft = "4px solid #ff6b6b";
    resultsBox.style.backgroundColor = "#ffecec";
    resultsBox.innerText = results.join("\n");
  } else {
    resultsBox.style.display = "block";
    resultsBox.style.borderLeft = "4px solid #6bcf63";
    resultsBox.style.backgroundColor = "#eaffec";
    resultsBox.innerText = "✅ No suspicious patterns found!";
  }
}

function toggleSettings() {
  const settingsPanel = document.getElementById("settingsPanel");
  settingsPanel.style.display = settingsPanel.style.display === "block" ? "none" : "block";
}

function applySettings() {
  const darkModeToggle = document.getElementById("darkModeToggle").checked;
  const fontSize = document.getElementById("fontSizeInput").value;

  // Apply dark mode
  if (darkModeToggle) {
    document.body.classList.add("dark-mode");
    document.body.style.color = 'white'; // Change text color to white
  } else {
    document.body.classList.remove("dark-mode");
    document.body.style.color = 'black'; // Change text color to black
  }

  // Apply font size
  textarea.style.fontSize = `${fontSize}px`;
}

function resetSettings() {
  document.getElementById("darkModeToggle").checked = false;
  document.getElementById("fontSizeInput").value = 15;
  applySettings();
}
