// Add thousands of suspicious pattern checks
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
  /chmod\s\+x/i,
  // Add more here...
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
  let results = [];

  // Clear previous highlighting
  document.querySelectorAll('pre code').forEach(el => el.textContent = '');

  suspiciousPatterns.forEach(pattern => {
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

  highlightCode();
}

function highlightCode() {
  const code = textarea.value;
  const language = languageSelect.value;
  const codeBlock = document.createElement('pre');
  const codeElement = document.createElement('code');

  codeElement.textContent = code;
  codeElement.className = language;
  codeBlock.appendChild(codeElement);

  document.getElementById("results").appendChild(codeBlock);
  hljs.highlightElement(codeElement);
}

function toggleSettings() {
  const settingsPanel = document.getElementById("settingsPanel");
  settingsPanel.style.display = settingsPanel.style.display === "block" ? "none" : "block";
}

function applySettings() {
  const darkModeToggle = document.getElementById("darkModeToggle").checked;
  const fontSize = document.getElementById("fontSizeInput").value;
  const lineSpacing = document.getElementById("lineSpacingInput").value;

  document.body.classList.toggle("dark-mode", darkModeToggle);
  textarea.style.fontSize = `${fontSize}px`;
  textarea.style.lineHeight = `${lineSpacing}`;
}

function resetSettings() {
  document.getElementById("darkModeToggle").checked = false;
  document.getElementById("fontSizeInput").value = 15;
  document.getElementById("lineSpacingInput").value = 1.5;
  applySettings();
}
