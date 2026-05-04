// ── DOM References ───────────────────────────────────────────────────────────
const inputFile   = document.getElementById('input-file');
const dropArea    = document.getElementById('drop-area');
const imgView     = document.getElementById('img-view');
const placeholder = document.getElementById('placeholder');
const counterMsg  = document.getElementById('counter-msg');
const welcomeButton = document.getElementById("welcomeButton");
const logo = document.getElementById("logo");
const correctImg = document.getElementById("correct");
const incorrectImg = document.getElementById("incorrect");

// Audio — plays when the answer is a hot dog
const hotdogSound = new Audio('Hotdog.mp3');

// incorrectCount persists across page navigations using sessionStorage
// so the count doesn't reset when the user comes back from correct/incorrect.html
let incorrectCount = parseInt(sessionStorage.getItem('incorrectCount') || '0');
updateCounter(); // show any existing count when returning to this page

// ── Event Listeners ──────────────────────────────────────────────────────────

inputFile.addEventListener('change', () => {
  if (inputFile.files[0]) handleUpload(inputFile.files[0]);
});

dropArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropArea.classList.add('drag-over');
});

dropArea.addEventListener('dragleave', () => {
  dropArea.classList.remove('drag-over');
});

dropArea.addEventListener('drop', (e) => {
  e.preventDefault();
  dropArea.classList.remove('drag-over');

  const file = e.dataTransfer.files[0];
  if (file) {
    const dt = new DataTransfer();
    dt.items.add(file);
    inputFile.files = dt.files;
    handleUpload(file);
  }
});

// ── Core Upload + API Logic ──────────────────────────────────────────────────

function handleUpload(file) {
  // Show image preview immediately
  const previewUrl = URL.createObjectURL(file);
  imgView.style.backgroundImage = `url(${previewUrl})`;
  imgView.style.backgroundSize = 'cover';
  imgView.style.backgroundPosition = 'center';
  imgView.style.border = 'none';
  placeholder.style.display = 'none';

  counterMsg.textContent = '🔍 Checking...';

  // Read file as base64 using FileReader — the correct browser API for this
  const reader = new FileReader();

  reader.onload = async (e) => {
    // e.target.result looks like: "data:image/jpeg;base64,/9j/4AAQ..."
    const dataUrl = e.target.result;
    const [meta, base64Image] = dataUrl.split(',');
    const mimeType = meta.match(/:(.*?);/)[1]; // e.g. "image/jpeg"

    try {
      // Send to the Cloudflare Pages Function at /check-hotdog
      const response = await fetch('/check-hotdog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base64Image, mimeType })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Server error');
      }

      const data = await response.json();
      const answer = data.result; // "yes" or "no"

      if (answer.includes('yes')) {
        correctImg.style.display = 'block'
        setTimeout(() => {
          correctImg.style.display = 'none'
        }, 4000)
      }else {
        incorrectImg.style.display = 'block'
        setTimeout(() => {
          incorrectImg.style.display = 'none'
        }, 4000)
        // Increment counter, save it, then redirect to the incorrect page
        incorrectCount++;
        sessionStorage.setItem('incorrectCount', incorrectCount);
        updateCounter();
        if (incorrectCount >= 3) {
          alert(`You've submitted ${incorrectCount} images without a hot dog!`);
        }
        window.location.href = 'incorrect.html';
      }

    } catch (err) {
      counterMsg.textContent = '⚠️ Error: ' + err.message;
    }
  };

  reader.onerror = () => {
    counterMsg.textContent = '⚠️ Could not read the file.';
  };

  reader.readAsDataURL(file);
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function updateCounter() {
  if (!counterMsg) return;
  if (incorrectCount === 0) {
    counterMsg.textContent = '';
  } else if (incorrectCount >= 3) {
    counterMsg.textContent = `⚠️ ${incorrectCount} non-hot-dog images submitted. Come on!`;
    counterMsg.classList.add('warning');
  } else {
    counterMsg.textContent =
      `${incorrectCount} non-hot-dog submission${incorrectCount !== 1 ? 's' : ''} so far.`;
  }
}
