/**
 * THREATSENSE - MAIN INTERFACE LOGIC
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initHeroTabs();
    initDragAndDrop();
    initFaqAccordion();
    initScanButtons();
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
            inputField.placeholder = "Enter email address";
        }
    };
}
/* ---------------------------------------------------------
   3. EMAIL FILE DRAG & DROP (Enhanced)
   --------------------------------------------------------- */
function initDragAndDrop() {
    // Target the specific container from your image
    const dropZone = document.querySelector('#emailscanner .border-dashed');
    const dropText = dropZone?.querySelector('p');
    
    // Create a hidden file input so users can also click to upload
    const hiddenInput = document.createElement('input');
    hiddenInput.type = 'file';
    hiddenInput.accept = '.eml,.msg';
    hiddenInput.className = 'hidden';
    document.body.appendChild(hiddenInput);

    if (!dropZone) return;

    // Trigger file dialog when clicking the zone
    dropZone.style.cursor = 'pointer';
    dropZone.addEventListener('click', () => hiddenInput.click());

    // Handle file selection via dialog
    hiddenInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });

    // Prevent default behaviors for drag events
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, e => {
            e.preventDefault();
            e.stopPropagation();
        }, false);
    });

    // Visual feedback when dragging over
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

    // Handle dropped files
    dropZone.addEventListener('drop', (e) => {
        const files = e.dataTransfer.files;
        handleFiles(files);
    });

    function handleFiles(files) {
        if (files.length > 0) {
            const file = files[0];
            const fileName = file.name.toLowerCase();
            
            if (fileName.endsWith('.eml') || fileName.endsWith('.msg')) {
                // Update UI to show success
                dropText.innerHTML = `
                    <span class="flex flex-col items-center gap-2">
                        <svg class="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span class="text-white font-medium">Ready: ${file.name}</span>
                        <span class="text-xs text-slate-400">Click the analyze button below</span>
                    </span>`;
                
                // Store file data for the "Analyze" button to use
                dropZone.dataset.fileReady = "true";
            } else {
                dropText.innerHTML = `<span class="text-red-400 font-bold">Invalid file type!</span><br><span class="text-xs text-slate-400">Please use .eml or .msg files</span>`;
            }
        }
    }
}
/* 4. FAQ ACCORDION (Clean Toggle) */
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('#help .group');
    
    faqItems.forEach(item => {
        const button = item.querySelector('button');
        const content = item.querySelector('.px-6.pb-6');
        
        // Ensure content is hidden by default
        content.classList.add('hidden');

        button.addEventListener('click', (e) => {
            // Stop this click from triggering any other listeners
            e.stopPropagation();

            const isCurrentlyHidden = content.classList.contains('hidden');
            
            // Close all other FAQ items first
            faqItems.forEach(otherItem => {
                otherItem.querySelector('.px-6.pb-6').classList.add('hidden');
                otherItem.querySelector('svg').style.transform = 'rotate(0deg)';
            });
            
            // Toggle the clicked one
            if (isCurrentlyHidden) {
                content.classList.remove('hidden');
                button.querySelector('svg').style.transform = 'rotate(180deg)';
            } else {
                content.classList.add('hidden');
                button.querySelector('svg').style.transform = 'rotate(0deg)';
            }
        });
    });
}

/* 5. SCAN BUTTON SIMULATION (Targeted Only) */
function initScanButtons() {
    // We only target buttons that are actually meant to perform a scan/analysis
    // and are NOT part of the FAQ/Help section.
    const actionButtons = document.querySelectorAll('button:not(#help button):not(#hamburger-btn)');
    
    actionButtons.forEach(btn => {
        const text = btn.innerText.toLowerCase();
        if (text.includes('scan') || text.includes('analyze')) {
            btn.addEventListener('click', function() {
                const originalContent = this.innerHTML;
                this.disabled = true;
                this.innerHTML = `
                    <span class="flex items-center justify-center gap-2">
                        <svg class="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                    </span>`;
                
                setTimeout(() => {
                    this.innerHTML = originalContent;
                    this.disabled = false;
                    alert("Model Analysis Complete.\nReady to connect to backend.");
                }, 1500);
            });
        }
    });
}