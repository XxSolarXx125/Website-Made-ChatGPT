const suspiciousPatterns = [
  /https?:\/\/discord(app)?\.com\/api\/webhooks\//i,
  /os\.system\(["']rm/i,
  /eval\(/i,
  /exec\(/i,
  /import\s+subprocess/i,
  /subprocess\.run/i,
  /token/i,
  /open\(["'][^'"]*\.py["']\)/i,  // Checking for file access attempts
  /import\s+(os|sys)/i,  // Dangerous imports
  /subprocess\.Popen/i   // Another dangerous subprocess call
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
  const lines = textarea.value.split("\n").length;
  let lineNumbersText = "";
  for (let i = 1; i <= lines; i++) {
    lineNumbersText += i + "\n";
  }
  lineNumbers.textContent = lineNumbersText;
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
