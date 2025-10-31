const urlInput = document.getElementById("urlInput");
const folderSpan = document.getElementById("folder");
const fileSpan = document.getElementById("file");
const resultsDiv = document.getElementById("results");
const extractBtn = document.getElementById("extractBtn");

// Load previous state on popup open
document.addEventListener("DOMContentLoaded", async () => {
  const data = await chrome.storage.local.get(["lastUrl", "folder", "file"]);
  if (data.lastUrl) {
    urlInput.value = data.lastUrl;
    folderSpan.textContent = data.folder || "";
    fileSpan.textContent = data.file || "";
    resultsDiv.style.display = "block";
  }
});

extractBtn.addEventListener("click", async () => {
  const url = urlInput.value.trim();
  if (!url) return;

  const parts = url.split("/").filter(Boolean);
  const folder = parts.find(p => p.includes("environment")) || "N/A";
  const file = parts.find(p => p.endsWith(".yml")) || "N/A";

  folderSpan.textContent = folder;
  fileSpan.textContent = file;
  resultsDiv.style.display = "block";

  // Save to storage
  await chrome.storage.local.set({ lastUrl: url, folder, file });
});

document.querySelectorAll(".copyBtn").forEach(btn => {
  btn.addEventListener("click", async () => {
    const id = btn.getAttribute("data-target");
    const text = document.getElementById(id).textContent;
    await navigator.clipboard.writeText(text);
    btn.textContent = "Copied!";
    setTimeout(() => (btn.textContent = "Copy"), 1000);
  });
});
