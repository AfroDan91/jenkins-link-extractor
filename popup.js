const urlInput = document.getElementById("urlInput");
const folderSpan = document.getElementById("folder");
const fileSpan = document.getElementById("file");
const resultsDiv = document.getElementById("results");
const extractBtn = document.getElementById("extractBtn");

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

  try {
    const parsed = new URL(url);
    const pathParts = parsed.pathname.split("/").filter(Boolean);

    // Find environment-definitions index
    const envIndex = pathParts.findIndex(p =>
      p.toLowerCase().includes("environment-definition")
    );

    let folder = "N/A";
    if (envIndex > 0) {
      // Include the section before + environments + environment-definitions
      folder = pathParts.slice(envIndex - 2, envIndex + 1).join("/");
    }

    // Find the .yml file
    const filePart = pathParts.find(p => p.endsWith(".yml")) || "N/A";

    folderSpan.textContent = folder;
    fileSpan.textContent = filePart;
    resultsDiv.style.display = "block";

    await chrome.storage.local.set({ lastUrl: url, folder, file: filePart });
  } catch (e) {
    alert("Invalid URL format. Please paste a full link (starting with http/https).");
  }
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
