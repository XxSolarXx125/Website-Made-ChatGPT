const suspiciousPatterns = [
  /https?:\/\/discord(app)?\.com\/api\/webhooks\//i,
  /os\.system\(["']rm/i,
  /eval\(/i,
  /exec\(/i,
  /import\s+subprocess/i,
  /subprocess\.run/i,
  /token/i,
  /open\(/i,  // Suspicious use of open()
  /import\s+requests/i,  // Potentially suspicious import
  /input\(/i,  // Check for dangerous use of input()
  /__import__/i,  // Dangerous dynamic import
  /shutil\.rmtree\(/i,  // Dangerous deletion with shutil
  /subprocess\.Popen\(/i,  // Potentially dangerous subprocess call
  /socket\.socket\(/i,  // Suspicious use of socket
  /base64\.b64decode\(/i  // Potentially dangerous base64 decoding
];

const textarea = document.getElementById("codeInput");
const lineNumbersDiv = document.getElementById("lineNumbers");
const resultsBox = document.getElementById("results");

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

textarea.addEventListener("input", function() {
  updateLineNumbers();
  checkCode();
});

function updateLineNumbers() {
  const lines = textarea.value.split("\n").length;
  let lineNumbers = '';
  for (let i = 1; i <= lines; i++) {
    lineNumbers += i + '\n';
  }
  lineNumbersDiv.textContent = lineNumbers;
}

function checkCode() {
  const code = textarea.value;
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
