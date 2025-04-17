const suspiciousPatterns = [
  /https?:\/\/discord(app)?\.com\/api\/webhooks\//i,
  /os\.system\(["']rm/i,
  /eval\(/i,
  /exec\(/i,
  /import\s+subprocess/i,
  /subprocess\.run/i,
  /token/i
];

const textarea = document.getElementById("codeInput");
const highlighted = document.getElementById("highlightedCode");
const languageSelect = document.getElementById("languageSelect");

document.getElementById("fileUpload").addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      textarea.value = e.target.result;
      updateHighlight();
    };
    reader.readAsText(file);
  }
});

textarea.addEventListener("input", updateHighlight);
languageSelect.addEventListener("change", updateHighlight);

function updateHighlight() {
  const language = languageSelect.value;
  const code = textarea.value;

  highlighted.className = `language-${language}`;
  highlighted.textContent = code;
  Prism.highlightElement(highlighted);
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

  updateHighlight();
}
