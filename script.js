const suspiciousPatterns = [
  /https?:\/\/discord(app)?\.com\/api\/webhooks\//i,
  /os\.system\(["']rm/i,
  /eval\(/i,
  /exec\(/i,
  /import\s+subprocess/i,
  /subprocess\.run/i,
  /subprocess\.Popen/i,
  /base64\.b64decode/i,
  /requests\.get\(/i,
  /token/i,
  /import\s+(os|sys)/i,
  /child_process\.exec/i,
  /netstat/i,
  /bash -i/i,
  /powershell/i,
  /document\.cookie/i,
  /window\.location/i,
  /xmlhttprequest/i,
  /fs\.readFile/i,
  /require\(['"]fs['"]\)/i,
  /require\(['"]child_process['"]\)/i,
  /navigator\.clipboard\.readText/i,
  /document\.createElement\(['"]script['"]\)/i,
  /fetch\(/i,
  /<script.*?>/i,
  /process\.env/i,
  /sh -c/i,
  /%appdata%/i,
  /AutoHotkey/i,
  /import\s+pickle/i,
  /pickle\.loads/i,
  /Marshal\.loads/i,
  /atob\(/i,
  /ctypes/i,
  /system32/i,
  /shellcode/i,
  /wget/i,
  /curl/i,
  /chmod\s\+x/i
];

const textarea = document.getElementById("codeInput");
const languageSelect = document.getElementById("languageSelect");
const resultsBox = document.getElementById("results");

document.getElementById("fileUpload").addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      textarea.value = e.target.result;
      checkCode();
    };
    reader.readAsText(file);
  }
});

textarea.addEventListener("input", checkCode);
languageSelect.addEventListener("change", checkCode);

function checkCode() {
  const code = textarea.value;
  const language = languageSelect.value;
  const matchResults = [];

  // Check for suspicious patterns
  suspiciousPatterns.forEach(pattern => {
    if (pattern.test(code)) {
      matchResults.push(`⚠️ Suspicious match: ${pattern}`);
    }
  });

  // Clear results box
  resultsBox.innerHTML = '';

  // Show check results
  const resultText = document.createElement('div');
  if (matchResults.length > 0) {
    resultText.style.color = '#ff4d4d';
    resultText.textContent = matchResults.join("\n");
  } else {
    resultText.style.color = '#28a745';
    resultText.textContent = "✅ No suspicious patterns found.";
  }
  resultsBox.appendChild(resultText);

  // Show syntax-highlighted code
  const codeBlock = document.createElement('pre');
  const codeElement = document.createElement('code');
  codeElement.className = language;
  codeElement.textContent = code;
  codeBlock.appendChild(codeElement);
  resultsBox.appendChild(codeBlock);
  hljs.highlightElement(codeElement);

  resultsBox.style.display = "block";
}

function toggleSettings() {
  const panel = document.getElementById("settingsPanel");
  panel.style.display = panel.style.display === "block" ? "none" : "block";
}

function applySettings() {
  const dark = document.getElementById("darkModeToggle").checked;
  const fontSize = document.getElementById("fontSizeInput").value;
  const spacing = document.getElementById("lineSpacingInput").value;

  document.body.classList.toggle("dark-mode", dark);
  textarea.style.fontSize = `${fontSize}px`;
  textarea.style.lineHeight = spacing;
}

function resetSettings() {
  document.getElementById("darkModeToggle").checked = false;
  document.getElementById("fontSizeInput").value = 15;
  document.getElementById("lineSpacingInput").value = 1.5;
  applySettings();
}
