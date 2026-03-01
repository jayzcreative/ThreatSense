 /**
 * THREATSENSE - MAIN INTERFACE LOGIC
 * Optimized Dashboard Version
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initHeroTabs();
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
        const heroResult = document.getElementById('hero-result');

        const activeClasses = ['bg-slate-900/60', 'border-t', 'border-x', 'border-slate-700', 'text-white'];
        const inactiveClasses = ['text-slate-400'];

        if (heroResult) heroResult.classList.add('hidden');

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

/* 3. FAQ ACCORDION */
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('#help .group');
    faqItems.forEach(item => {
        const button = item.querySelector('button');
        const content = item.querySelector('.px-6.pb-6');
        if (content && !content.classList.contains('active-faq')) content.classList.add('hidden');

        button?.addEventListener('click', (e) => {
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

/* 4. SCAN BUTTONS - DASHBOARD OPTIMIZED */
function initScanButtons() {
    const heroBtn = document.querySelector('#home button.bg-gradient-to-r');
    const heroInput = document.getElementById('scan-input');
    if (heroBtn && heroInput) {
        heroBtn.addEventListener('click', () => {
            const content = heroInput.value;
            if (!content) return alert("Please enter something to scan.");
            const type = heroInput.placeholder.includes("URL") ? 'url' : 'email';
            heroBtn.innerHTML = `<span class="animate-pulse">ANALYZING...</span>`;
            heroBtn.disabled = true;
            simulateAnalysis(type, content, 'hero', () => {
                heroBtn.innerHTML = "Scan Now";
                heroBtn.disabled = false;
                heroInput.value = ""; 
            });
        });
    }

    const urlSectionBtn = document.getElementById('url-scan-btn');
    const urlSectionInput = document.getElementById('url-scan-input');
    if (urlSectionBtn && urlSectionInput) {
        urlSectionBtn.addEventListener('click', () => {
            const content = urlSectionInput.value;
            if (!content) return;
            urlSectionBtn.innerText = "SCANNING...";
            urlSectionBtn.disabled = true;
            simulateAnalysis('url', content, 'url-section', () => {
                urlSectionBtn.innerText = "Run Deep Scan";
                urlSectionBtn.disabled = false;
                urlSectionInput.value = "";
            });
        });
    }

    const emailSectionBtn = document.querySelector('#emailscanner button.bg-indigo-600');
    const emailSectionInput = document.querySelector('#emailscanner input[type="email"]');
    if (emailSectionBtn && emailSectionInput) {
        emailSectionBtn.addEventListener('click', () => {
            const content = emailSectionInput.value;
            if (!content) return;
            emailSectionBtn.innerText = "ANALYZING...";
            emailSectionBtn.disabled = true;
            simulateAnalysis('email', content, 'email-section', () => {
                emailSectionBtn.innerText = "Analyze Email Security";
                emailSectionBtn.disabled = false;
                emailSectionInput.value = "";
            });
        });
    }
}

/* 5. SIMULATION ENGINE */
function simulateAnalysis(type, content, context, callback) {
    const redFlags = ['login', 'verify', 'bank', 'password', 'prize', 'win', 'update', 'secure', 'bit.ly', 'click', 'account'];
    const lowerContent = content.toLowerCase();
    let riskScore = Math.floor(Math.random() * 20); 

    redFlags.forEach(flag => {
        if (lowerContent.includes(flag)) riskScore += 18;
    });

    const data = {
        result: riskScore > 50 ? (type === 'url' ? 'Phishing' : 'Fraudulent') : (type === 'url' ? 'Safe' : 'Legitimate'),
        risk_score: Math.min(riskScore, 99),
        type: type.toUpperCase(),
        content: content,
        preview: content.length > 25 ? content.substring(0, 25) + "..." : content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setTimeout(() => {
        updateUIWithResults(data, context);
        addToHistory(data, context);
        if (callback) callback();
    }, 1500); 
}

/* 6. HISTORY UI - DASHBOARD STYLE (FIXED HERO PREFIX) */
function addToHistory(data, context) {
    const historyId = context === 'hero' ? 'hero-history' : (context === 'url-section' ? 'url-section-history' : 'email-section-history');
    const container = document.getElementById(historyId);
    if (!container) return;

    if (container.querySelector('p.italic')) container.innerHTML = '';

    const item = document.createElement('div');
    item.className = "flex flex-col border-b border-white/5 pb-2 mb-2 last:border-0 animate-fade-in";
    
    const colorClass = data.risk_score > 50 ? 'text-red-400' : 'text-green-400';

    // Logic: Only add https:// if we are specifically in the URL Console section
    const prefix = (context === 'url-section') ? 'https://' : '';

    item.innerHTML = `
        <div class="flex justify-between items-center mb-1">
            <span class="text-slate-500 text-[9px] font-mono">${data.timestamp}</span>
            <span class="${colorClass} text-[9px] font-black uppercase tracking-widest">${data.result}</span>
        </div>
        <span class="text-slate-300 text-[11px] truncate block w-full font-mono">${prefix}${data.preview}</span>
    `;

    if (container.children.length >= 4) container.removeChild(container.lastChild);
    container.prepend(item);
}

/* 7. UI UPDATE - CONSOLE & SIDEBAR */
function updateUIWithResults(data, context) {
    const isThreat = data.risk_score > 50;

    if (context === 'hero') {
        const heroResult = document.getElementById('hero-result');
        if (heroResult) {
            heroResult.classList.remove('hidden');
            heroResult.className = `mt-6 w-full p-4 rounded-xl border flex flex-col md:flex-row items-center justify-between gap-4 animate-fade-in ${isThreat ? 'border-red-500/50 bg-red-500/10' : 'border-green-500/50 bg-green-500/10'}`;
            document.getElementById('hero-result-text').innerText = `${data.type} is ${isThreat ? 'Fraudulent' : 'Safe'} (${Math.round(data.risk_score)}% threat).`;
            const badge = document.getElementById('hero-result-badge');
            badge.innerText = data.result;
            badge.className = `px-3 py-1 rounded-full text-xs font-black uppercase ${isThreat ? 'bg-red-500' : 'bg-green-500'} text-white`;
        }
    }

    if (context === 'url-section') {
        const scoreText = document.getElementById('threat-score-text');
        const ring = document.getElementById('threat-ring');
        const banner = document.getElementById('url-result-banner');
        const desc = document.getElementById('threat-description');
        
        if (scoreText) {
            scoreText.innerText = `${Math.round(data.risk_score)}%`;
            scoreText.className = `text-3xl font-bold transition-colors duration-500 ${isThreat ? 'text-red-500' : 'text-cyan-400'}`;
        }
        if (ring) {
            ring.className = `absolute inset-0 border-8 rounded-full transition-all duration-1000 ${isThreat ? 'border-red-500' : 'border-cyan-500'} clip-path-half`;
        }
        if (desc) {
            desc.innerText = isThreat ? "High Risk: Navigation Dangerous" : "Verified: No Threats Found";
            desc.className = `text-center text-[10px] mt-4 uppercase tracking-tighter ${isThreat ? 'text-red-400' : 'text-slate-500'}`;
        }

        if (banner) {
            banner.classList.remove('hidden');
            banner.className = `mt-6 p-4 rounded-xl border backdrop-blur-md flex items-center justify-between animate-fade-in ${isThreat ? 'border-red-500/30 bg-red-500/10' : 'border-green-500/30 bg-green-500/10'}`;
            document.getElementById('url-status-text').innerText = isThreat ? "Phishing Threat Detected" : "URL Verified Secure";
            const badge = document.getElementById('url-status-badge');
            badge.innerText = data.result;
            badge.className = `px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white ${isThreat ? 'bg-red-500' : 'bg-green-500'}`;
            
            const iconContainer = document.getElementById('url-status-icon');
            iconContainer.innerHTML = isThreat 
                ? `<svg class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"/></svg>`
                : `<svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293l-4 4a1 1 0 01-1.414 0l-2-2a1 1 0 111.414-1.414L9 10.586l3.293-3.293a1 1 0 111.414 1.414z"/></svg>`;
        }
    }

    if (context === 'email-section') {
        const emailResult = document.getElementById('email-result');
        if (emailResult) {
            emailResult.classList.remove('hidden');
            document.getElementById('email-result-text').innerText = isThreat ? `Fraudulent patterns found.` : `Legitimate content verified.`;
            const badge = document.getElementById('email-badge');
            badge.innerText = data.result.toUpperCase();
            badge.className = `px-2 py-1 rounded text-[10px] font-bold ${isThreat ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}`;
        }
    }
}