 /**
 * THREATSENSE - MAIN INTERFACE LOGIC
 * Integrated with FastAPI Backend
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initHeroTabs();
    initDragAndDrop();
    initFaqAccordion();
    initScanButtons(); // Updated to connect to Python
});

/* 1. NAVIGATION & MOBILE MENU */
function initNavigation() {
    const btn = document.getElementById('hamburger-btn');
    const menu = document.getElementById('mobile-menu');
    const hamburgerIcon = document.getElementById('hamburger-icon');
    const closeIcon = document.getElementById('close-icon');

    if (!btn) return;

    const toggleMenu = () => {
        const isHidden = menu.classList.toggle('hidden');
        hamburgerIcon.classList.toggle('hidden', !isHidden);
        closeIcon.classList.toggle('hidden', isHidden);
    };

    btn.addEventListener('click', toggleMenu);

    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.add('hidden');
            hamburgerIcon.classList.remove('hidden');
            closeIcon.classList.add('hidden');
        });
    });
}

/* 2. HERO SECTION TAB SWITCHER */
function initHeroTabs() {
    window.toggleScanner = (mode) => {
        const urlBtn = document.getElementById('url-btn');
        const emailBtn = document.getElementById('email-btn');
        const inputField = document.getElementById('scan-input');

        const activeClasses = ['bg-slate-900/60', 'border-t', 'border-x', 'border-slate-700', 'text-white'];
        const inactiveClasses = ['text-slate-400'];

        if (mode === 'url') {
            urlBtn.classList.add(...activeClasses);
            urlBtn.classList.remove(...inactiveClasses);
            emailBtn.classList.remove(...activeClasses);
            emailBtn.classList.add(...inactiveClasses);
            inputField.placeholder = "Enter website URL";
        } else {
            emailBtn.classList.add(...activeClasses);
            emailBtn.classList.remove(...inactiveClasses);
            urlBtn.classList.remove(...activeClasses);
            urlBtn.classList.add(...inactiveClasses);
            inputField.placeholder = "Enter email content";
        }
    };
}

/* 3. EMAIL FILE DRAG & DROP */
function initDragAndDrop() {
    const dropZone = document.querySelector('#emailscanner .border-dashed');
    const dropText = dropZone?.querySelector('p');
    
    const hiddenInput = document.createElement('input');
    hiddenInput.type = 'file';
    hiddenInput.accept = '.eml,.msg,.txt';
    hiddenInput.className = 'hidden';
    document.body.appendChild(hiddenInput);

    if (!dropZone) return;

    dropZone.style.cursor = 'pointer';
    dropZone.addEventListener('click', () => hiddenInput.click());

    hiddenInput.addEventListener('change', (e) => handleFiles(e.target.files));

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, e => {
            e.preventDefault();
            e.stopPropagation();
        }, false);
    });

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
            dropZone.classList.add('border-indigo-500', 'bg-indigo-500/10', 'scale-[1.01]');
        });
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
            dropZone.classList.remove('border-indigo-500', 'bg-indigo-500/10', 'scale-[1.01]');
        });
    });

    dropZone.addEventListener('drop', (e) => handleFiles(e.dataTransfer.files));

    function handleFiles(files) {
        if (files.length > 0) {
            const file = files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                // Store file content to be scanned
                dropZone.dataset.fileContent = e.target.result;
                dropText.innerHTML = `<span class="text-green-400 font-medium">Loaded: ${file.name}</span>`;
            };
            reader.readAsText(file);
        }
    }
}

/* 4. FAQ ACCORDION */
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('#help .group');
    faqItems.forEach(item => {
        const button = item.querySelector('button');
        const content = item.querySelector('.px-6.pb-6');
        content.classList.add('hidden');

        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const isHidden = content.classList.contains('hidden');
            faqItems.forEach(other => {
                other.querySelector('.px-6.pb-6').classList.add('hidden');
                other.querySelector('svg').style.transform = 'rotate(0deg)';
            });
            if (isHidden) {
                content.classList.remove('hidden');
                button.querySelector('svg').style.transform = 'rotate(180deg)';
            }
        });
    });
}

/* ---------------------------------------------------------
   5. BACKEND CONNECTION LOGIC (The "Bridge")
   --------------------------------------------------------- */

function initScanButtons() {
    // A. HERO SECTION BUTTON
    const heroBtn = document.querySelector('#home button.bg-gradient-to-r');
    const heroInput = document.getElementById('scan-input');
    if (heroBtn) {
        heroBtn.addEventListener('click', () => {
            const mode = heroInput.placeholder.includes("URL") ? 'url' : 'email';
            performScan(mode, heroInput.value);
        });
    }

    // B. URL SECTION BUTTON (Deep Scan)
    const urlSectionBtn = document.querySelector('#urlscanner button.bg-cyan-600');
    const urlSectionInput = document.querySelector('#urlscanner input');
    if (urlSectionBtn) {
        urlSectionBtn.addEventListener('click', () => {
            performScan('url', urlSectionInput.value);
        });
    }

    // C. EMAIL SECTION BUTTON (Integrity Guard)
    const emailSectionBtn = document.querySelector('#emailscanner button.bg-indigo-600');
    const emailSectionInput = document.querySelector('#emailscanner input[type="email"]');
    if (emailSectionBtn) {
        emailSectionBtn.addEventListener('click', () => {
            const dropZone = document.querySelector('#emailscanner .border-dashed');
            // Prioritize file content if uploaded, otherwise use text input
            const content = dropZone.dataset.fileContent || emailSectionInput.value;
            performScan('email', content);
        });
    }
}

async function performScan(type, content) {
    if (!content || content.trim() === "") {
        alert("Please provide a URL or Email content to analyze.");
        return;
    }

    const endpoint = type === 'url' ? '/scan-url' : '/scan-email';
    
    // Show a basic loading state
    console.log(`Scanning ${type}...`);

    try {
        const response = await fetch(`http://localhost:8000${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: content })
        });

        if (!response.ok) throw new Error("Backend server error");

        const data = await response.json();
        updateUIWithResults(data);

    } catch (error) {
        console.error("Connection Error:", error);
        alert("Could not connect to the AI Engine. Please ensure app.py is running on localhost:8000");
    }
}

function updateUIWithResults(data) {
    // This function updates the "Threat Level" circle in your UI
    const threatScoreElement = document.querySelector('#urlscanner .text-3xl.font-bold');
    const threatCircle = document.querySelector('#urlscanner .animate-spin-slow');

    if (threatScoreElement) {
        threatScoreElement.innerText = `${data.risk_score}%`;
        
        // Change color based on risk
        if (data.risk_score > 70) {
            threatScoreElement.classList.add('text-red-500');
            threatCircle?.classList.replace('border-cyan-500', 'border-red-500');
        } else {
            threatScoreElement.classList.remove('text-red-500');
            threatCircle?.classList.replace('border-red-500', 'border-cyan-500');
        }
    }

    // Show a final alert with details
    alert(`
        SCAN RESULT: ${data.result}
        Threat Level: ${data.risk_score}%
        Type: ${data.type}
    `);
}