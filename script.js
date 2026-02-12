// Sinhala Phonetic Typing Tool
// Script: Rich Text Editor Version - Multi-Page Support

let currentMode = 'uni'; // 'uni', 'sinhala', 'english'

// --- UNI TYPING MAPS (STRICT) ---
const uniConsonants = {
    'q': 'ද්', 'w': 'ව්', 'r': 'ර්', 't': 'ට්', 'y': 'ය්',
    'p': 'ප්', 's': 'ස්', 'd': 'ඩ්', 'f': 'ෆ්', 'g': 'ග්',
    'h': 'හ්', 'j': 'ජ්', 'k': 'ක්', 'l': 'ල්', 'c': 'ක්',
    'v': 'ව්', 'b': 'බ්', 'n': 'න්', 'm': 'ම්',
    'x': 'ං', 'z': 'ෙ',
    'T': 'ඨ්', 'P': 'ඵ්', 'D': 'ඪ්', 'S': 'ෂ්', 'G': 'ඝ්', 'J': 'ඣ්',
    'L': 'ළ්', 'B': 'ඹ්', 'N': 'ණ්', 'X': 'ඞ'
};
const uniVowels = {
    'a': 'අ', 'e': 'එ', 'i': 'ඉ', 'o': 'ඔ', 'u': 'උ',
    'ii': 'ඊ', 'uu': 'ඌ', 'ee': 'ඒ', 'oo': 'ඕ',
    'E': 'ඓ', 'R': 'ඍ'
};
const uniVowelModifiers = {
    'a': '', 'aa': 'ා', 'e': 'ෙ', 'i': 'ි', 'u': 'ු',
    'o': 'ො', 'ii': 'ී', 'uu': 'ූ', 'ee': 'ේ', 'oo': 'ෝ'
};
const uniReplacements = [
    { pattern: 'ඩ්හ්h', replacement: 'ධ්' }, // dhh
    { pattern: 'ට්h', replacement: 'ත්' },   // th
    { pattern: 'බ්h', replacement: 'භ්' },   // bh
    { pattern: 'අa', replacement: 'ආ' },
    { pattern: 'ඉi', replacement: 'ඊ' },
    { pattern: 'උu', replacement: 'ඌ' },
    { pattern: 'එe', replacement: 'ඒ' },
    { pattern: 'ඔo', replacement: 'ඕ' },
    // Vowel Modifiers Replacements (Short Mod + Key -> Long Mod)
    { pattern: 'ෙe', replacement: 'ේ' }, // e + e -> ee (ේ)
    { pattern: 'ිi', replacement: 'ී' }, // i + i -> ii (ී)
    { pattern: 'ුu', replacement: 'ූ' }, // u + u -> uu (ූ)
    { pattern: 'ොo', replacement: 'ෝ' }, // o + o -> oo (ෝ)
    { pattern: 'ඍR', replacement: 'ඎ' }, // R + R -> RR (ඎ)
];

// --- WIJESEKARA MAPS ---
const wijesekaraNormal = {
    'q': 'ු', 'w': 'අ', 'e': 'ැ', 'r': 'ර', 't': 'එ', 'y': 'හ', 'u': 'ම', 'i': 'ස', 'o': 'ද', 'p': 'ච',
    '[': 'ඤ', ']': ';',
    'a': '්', 's': 'ි', 'd': 'ා', 'f': 'ෙ', 'g': 'ට', 'h': 'ය', 'j': 'ව', 'k': 'න', 'l': 'ක',
    ';': 'ත', '\'': '.',
    'z': '\'', 'x': 'ං', 'c': 'ජ', 'v': 'ඩ', 'b': 'ඉ', 'n': 'බ', 'm': 'ප',
    ',': 'ල', '.': 'ග', '/': '/'
};
const wijesekaraShift = {
    'Q': 'ූ', 'W': 'උ', 'E': 'ෑ', 'R': 'ෘ', 'T': 'ඒ', 'Y': 'ශ', 'U': 'ඹ', 'I': 'ෂ', 'O': 'ධ', 'P': 'ඡ',
    '{': 'ඥ', '}': ':',
    'A': '්‍ර', 'S': 'ී', 'D': 'ෘ', 'F': 'ේ', 'G': 'ඨ', 'H': '්‍ය', 'J': 'ළ', 'K': 'ණ', 'L': 'ඛ',
    ':': 'ථ', '"': ',',
    'Z': '"', 'X': 'ඃ', 'C': 'ඣ', 'V': 'ඪ', 'B': 'ඊ', 'N': 'භ', 'M': 'ඵ',
    '<': 'ළ', '>': 'ඝ', '?': '?'
};

// UI Elements
const editor = document.getElementById('sinhalaInput'); // It is a DIV now
const btnUni = document.getElementById('modeUni');
const btnSinhala = document.getElementById('modeSinhala');
const btnEnglish = document.getElementById('modeEnglish');
const downloadBtn = document.getElementById('downloadBtn');
const clearBtn = document.getElementById('clearBtn');
const copyBtn = document.getElementById('copyBtn');
const toast = document.getElementById('toast');
const toastMsg = document.getElementById('toastMsg');

// Page Controls
const prevPageBtn = document.getElementById('prevPageBtn');
const nextPageBtn = document.getElementById('nextPageBtn');
const addPageBtn = document.getElementById('addPageBtn');
const deletePageBtn = document.getElementById('deletePageBtn');
const pageIndicator = document.getElementById('pageIndicator');
const previewPageWrapper = document.getElementById('previewPageWrapper'); // Container for pages

// Formatting Buttons
const cmdBold = document.getElementById('cmdBold');
const cmdItalic = document.getElementById('cmdItalic');
const cmdUnderline = document.getElementById('cmdUnderline');
const cmdFontSize = document.getElementById('cmdFontSize');
const cmdColor = document.getElementById('cmdColor');

if (cmdBold) cmdBold.addEventListener('click', () => { document.execCommand('bold'); editor.focus(); });
if (cmdItalic) cmdItalic.addEventListener('click', () => { document.execCommand('italic'); editor.focus(); });
if (cmdUnderline) cmdUnderline.addEventListener('click', () => { document.execCommand('underline'); editor.focus(); });

if (cmdFontSize) {
    cmdFontSize.addEventListener('change', (e) => {
        document.execCommand('fontSize', false, e.target.value);
        editor.focus();
    });
}

if (cmdColor) {
    cmdColor.addEventListener('input', (e) => {
        document.execCommand('foreColor', false, e.target.value);
        editor.focus();
    });
}


// Mode Switching
function setMode(mode) {
    currentMode = mode;
    updateButtonStyle(btnUni, mode === 'uni');
    updateButtonStyle(btnSinhala, mode === 'sinhala');
    updateButtonStyle(btnEnglish, mode === 'english');
    editor.focus();
}

function updateButtonStyle(btn, isActive) {
    if (isActive) {
        btn.className = "px-3 py-1.5 text-sm font-medium rounded-md transition-all text-white bg-indigo-600 shadow-sm";
    } else {
        btn.className = "px-3 py-1.5 text-sm font-medium rounded-md transition-all text-slate-600 hover:bg-slate-100";
    }
}

btnUni.addEventListener('click', () => setMode('uni'));
btnSinhala.addEventListener('click', () => setMode('sinhala'));
btnEnglish.addEventListener('click', () => setMode('english'));


// --- PAGE STATE MANAGEMENT ---
let pages = [
    { id: 1, content: '' } // Integrated first page
];
let currentPageIndex = 0;

function initPages() {
    renderEditor();
    renderPreview();
    updatePageControls();
}

function saveCurrentPage() {
    pages[currentPageIndex].content = editor.innerHTML;
}

function renderEditor() {
    editor.innerHTML = pages[currentPageIndex].content;
    // Restore Placeholder behavior if empty? CSS handles it via :empty
}

function addPage() {
    saveCurrentPage();
    const newId = pages.length > 0 ? Math.max(...pages.map(p => p.id)) + 1 : 1;
    pages.push({ id: newId, content: '' });
    currentPageIndex = pages.length - 1;
    renderEditor();
    renderPreview();
    updatePageControls();
}

function deletePage() {
    if (pages.length <= 1) {
        alert("Cannot delete the only page.");
        return;
    }
    if (confirm("Are you sure you want to delete this page?")) {
        pages.splice(currentPageIndex, 1);
        if (currentPageIndex >= pages.length) {
            currentPageIndex = pages.length - 1;
        }
        renderEditor();
        renderPreview();
        updatePageControls();
    }
}

function nextPage() {
    if (currentPageIndex < pages.length - 1) {
        saveCurrentPage();
        currentPageIndex++;
        renderEditor();
        updatePageControls();
    }
}

function prevPage() {
    if (currentPageIndex > 0) {
        saveCurrentPage();
        currentPageIndex--;
        renderEditor();
        updatePageControls();
    }
}

function updatePageControls() {
    pageIndicator.innerText = `${currentPageIndex + 1} / ${pages.length}`;
    prevPageBtn.disabled = currentPageIndex === 0;
    nextPageBtn.disabled = currentPageIndex === pages.length - 1;
}

// Event Listeners for Page Controls
if (addPageBtn) addPageBtn.addEventListener('click', addPage);
if (deletePageBtn) deletePageBtn.addEventListener('click', deletePage);
if (prevPageBtn) prevPageBtn.addEventListener('click', prevPage);
if (nextPageBtn) nextPageBtn.addEventListener('click', nextPage);

// --- INPUT HANDLER (RICH TEXT) ---
editor.addEventListener('input', function (e) {
    saveCurrentPage(); // Save logic
    syncContent();     // Update preview immediately

    if (e.inputType === 'deleteContentBackward') return;
    if (e.inputType === 'insertParagraph') return;
    if (e.inputType === 'historyUndo' || e.inputType === 'historyRedo') return;

    if (currentMode === 'english') return;

    // We need the current Text Node and Offset
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    const range = selection.getRangeAt(0);
    const node = range.startContainer;

    // Only process TEXT NODES
    if (node.nodeType !== Node.TEXT_NODE) return;

    if (currentMode === 'uni') {
        handleUniTyping(node, range.startOffset, e);
    } else if (currentMode === 'sinhala') {
        handleWijesekaraTyping(node, range.startOffset, e);
    }
});


// --- UNI LOGIC & WIJESEKARA LOGIC (UNCHANGED) ---
function handleUniTyping(node, offset, e) {
    const text = node.textContent;
    const preText = text.substring(0, offset);

    // 1. Suffix Replacements
    for (let r of uniReplacements) {
        if (preText.endsWith(r.pattern)) {
            let newVal = r.replacement;
            let cutLen = r.pattern.length;
            let newPre = preText.slice(0, -cutLen) + newVal;
            let tail = text.substring(offset);
            node.textContent = newPre + tail;
            setCursor(node, newPre.length);
            return;
        }
    }

    // Rakaranshaya Logic
    if (preText.endsWith('r')) {
        let beforeR = preText.substring(0, preText.length - 1);
        if (beforeR.length > 0) {
            let lastChar = beforeR.charAt(beforeR.length - 1);
            if (lastChar === '\u0DCA') {
                let replacement = '\u200D\u0DBB';
                let newPre = beforeR + replacement;
                let tail = text.substring(offset);
                node.textContent = newPre + tail;
                setCursor(node, newPre.length);
                return;
            }
        }
    }

    // 2. Vowel Modifiers
    const potentialVowels = ['aa', 'ee', 'ii', 'uu', 'oo', 'a', 'e', 'i', 'u', 'o'];
    for (let vKey of potentialVowels) {
        if (preText.endsWith(vKey)) {
            let beforeVowel = preText.substring(0, preText.length - vKey.length);
            if (beforeVowel.length >= 2) {
                let halMark = beforeVowel.charAt(beforeVowel.length - 1);
                let base = beforeVowel.charAt(beforeVowel.length - 2);

                if (halMark === '\u0DCA') {
                    let mod = uniVowelModifiers[vKey];
                    if (mod !== undefined) {
                        let newVal = base + mod;
                        let newPre = beforeVowel.slice(0, -2) + newVal;
                        let tail = text.substring(offset);

                        node.textContent = newPre + tail;
                        setCursor(node, newPre.length);
                        return;
                    }
                }
            }
            // Alive Consonant + 'a'
            if (vKey === 'a' && beforeVowel.length >= 1) {
                let base = beforeVowel.charAt(beforeVowel.length - 1);
                if (base >= '\u0D80' && base <= '\u0DFF') {
                    let newVal = base + 'ා';
                    let newPre = beforeVowel.slice(0, -1) + newVal;
                    let tail = text.substring(offset);

                    node.textContent = newPre + tail;
                    setCursor(node, newPre.length);
                    return;
                }
            }
        }
    }

    // 3. Single Char Mapping
    let key = preText.charAt(preText.length - 1);

    if (uniConsonants[key]) {
        let replacement = uniConsonants[key];
        let newPre = preText.slice(0, -1) + replacement;
        let tail = text.substring(offset);
        node.textContent = newPre + tail;
        setCursor(node, newPre.length);
    } else if (uniVowels[key]) {
        let replacement = uniVowels[key];
        let newPre = preText.slice(0, -1) + replacement;
        let tail = text.substring(offset);
        node.textContent = newPre + tail;
        setCursor(node, newPre.length);
    }
}


function handleWijesekaraTyping(node, offset, e) {
    const text = node.textContent;
    let typedChar = text.charAt(offset - 1);

    if (!typedChar) return;

    // Logic: Look Up map
    let replacement = null;
    if (wijesekaraNormal[typedChar]) replacement = wijesekaraNormal[typedChar];
    else if (wijesekaraShift[typedChar]) replacement = wijesekaraShift[typedChar];

    if (!replacement) return;

    let preText = text.substring(0, offset - 1);
    let postText = text.substring(offset);

    // REORDERING (Visual -> Unicode)
    let prevChar = preText.charAt(preText.length - 1);
    const preModifiers = ['\u0DD9', '\u0DDA', '\u0DDB']; // ෙ, ේ, ෛ

    if (preModifiers.includes(prevChar)) {
        let visualPrev = prevChar;
        let visualNew = replacement; // This is the consonant
        let newPre = preText.slice(0, -1) + visualNew + visualPrev;
        node.textContent = newPre + postText;
        setCursor(node, newPre.length);
    } else {
        let newPre = preText + replacement;
        node.textContent = newPre + postText;
        setCursor(node, newPre.length);
    }
}

function setCursor(node, pos) {
    const range = document.createRange();
    const sel = window.getSelection();
    if (pos > node.textContent.length) pos = node.textContent.length;
    range.setStart(node, pos);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
}


// Copy / Clear
if (clearBtn) {
    clearBtn.addEventListener('click', () => {
        if (confirm('Clear all text on this page?')) {
            editor.innerHTML = '';
            saveCurrentPage();
            renderPreview(); // Sync blank
            editor.focus();
        }
    });
}
if (copyBtn) {
    copyBtn.addEventListener('click', () => {
        const textToCopy = editor.innerText;
        navigator.clipboard.writeText(textToCopy).then(() => {
            showToast('Copied page text!');
        });
    });
}
function showToast(message) {
    if (toastMsg) toastMsg.innerText = message;
    toast.classList.remove('translate-y-20', 'opacity-0');
    setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0');
    }, 3000);
}


// --- SETTINGS & EXPORT LOGIC ---

// Default Settings
let currentSettings = {
    titleText: '',
    titleAlign: 'center',
    format: 'a4',
    orientation: 'portrait',
    marginTop: 20,
    marginRight: 20,
    marginBottom: 20,
    marginLeft: 20,
    fontSize: 12,
    lineHeight: 1.5,
    textColor: '#0f172a',
    bgColor: '#ffffff'
};

// Elements
const settingsBtn = document.getElementById('settingsBtn');
const settingsModal = document.getElementById('settingsModal');
const closeSettingsBtn = document.getElementById('closeSettingsBtn');
const cancelSettingsBtn = document.getElementById('cancelSettingsBtn');
const applySettingsBtn = document.getElementById('applySettingsBtn');
const wordCount = document.getElementById('wordCount');

// Inputs
const setTitleText = document.getElementById('setTitleText');
const setTitleAlign = document.getElementById('setTitleAlign');
const alignButtons = document.querySelectorAll('.options-align');

const setFormat = document.getElementById('setFormat');
const setOrientation = document.getElementById('setOrientation');
const setMarginTop = document.getElementById('setMarginTop');
const setMarginRight = document.getElementById('setMarginRight');
const setMarginBottom = document.getElementById('setMarginBottom');
const setMarginLeft = document.getElementById('setMarginLeft');
const setFontSize = document.getElementById('setFontSize');
const setLineHeight = document.getElementById('setLineHeight');
const setTextColor = document.getElementById('setTextColor');
const setBgColor = document.getElementById('setBgColor');

// Placeholder Content for Empty Pages
const placeholderContent = `
    <div class="flex items-center justify-center h-full text-slate-300 flex-col min-h-[inherit]">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        <p class="text-lg font-medium">No Content</p>
        <p class="text-sm">Page <span class="page-num-placeholder"></span></p>
    </div>
`;

// Sync Content & Render Preview
function syncContent() {
    // Word Count (Current Page)
    const content = editor.innerText.trim();
    const words = content === '' ? 0 : content.split(/\s+/).length;
    const chars = content.length;
    if (wordCount) wordCount.innerText = `Words: ${words} | Characters: ${chars}`;

    // Update the specific Preview Page for the current page
    renderPreview();
}

function renderPreview() {
    if (!previewPageWrapper) return;
    previewPageWrapper.innerHTML = ''; // Clear

    // Iterate all pages
    pages.forEach((page, index) => {
        // Create Page Container
        const pageEl = document.createElement('div');
        pageEl.className = "preview-page bg-white shadow-lg transition-all duration-300 break-words whitespace-pre-wrap relative";

        // Settings Apply
        applyPageStyles(pageEl);

        // Content
        if (page.content.trim() === '' || page.content.trim() === '<br>') {
            let ph = placeholderContent.replace('<span class="page-num-placeholder"></span>', index + 1);
            pageEl.innerHTML = ph;
        } else {
            pageEl.innerHTML = page.content;

            // Document Title (Only on Page 1)
            if (index === 0 && currentSettings.titleText && currentSettings.titleText.trim() !== "") {
                const titleEl = document.createElement('h1');
                titleEl.className = 'text-3xl font-bold mb-6 font-sinhala leading-normal';
                titleEl.textContent = currentSettings.titleText;
                titleEl.style.textAlign = currentSettings.titleAlign;
                titleEl.style.color = currentSettings.textColor;
                pageEl.prepend(titleEl);
            }
        }

        // Highlight active page in preview
        if (index === currentPageIndex) {
            pageEl.classList.add('ring-2', 'ring-indigo-500', 'ring-offset-2');
        }

        previewPageWrapper.appendChild(pageEl);
    });
}

function applyPageStyles(el) {
    // Dimensions
    let pageW = 210;
    let pageH = 297;

    if (currentSettings.format === 'letter') { pageW = 215.9; pageH = 279.4; }
    if (currentSettings.format === 'legal') { pageW = 215.9; pageH = 355.6; }

    if (currentSettings.orientation === 'landscape') {
        [pageW, pageH] = [pageH, pageW];
    }

    el.style.width = pageW + 'mm';
    el.style.minHeight = pageH + 'mm';

    // Margins -> Padding
    el.style.paddingTop = currentSettings.marginTop + 'mm';
    el.style.paddingRight = currentSettings.marginRight + 'mm';
    el.style.paddingBottom = currentSettings.marginBottom + 'mm';
    el.style.paddingLeft = currentSettings.marginLeft + 'mm';

    // Aesthetics
    el.style.backgroundColor = currentSettings.bgColor;
    el.style.color = currentSettings.textColor;
    el.style.lineHeight = currentSettings.lineHeight;
    el.style.fontSize = currentSettings.fontSize + 'pt';
    el.style.fontFamily = '"Noto Sans Sinhala", sans-serif';
}


// Alignment UI Handler
alignButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        alignButtons.forEach(b => {
            b.classList.remove('bg-indigo-50', 'text-indigo-600', 'border-indigo-500');
            b.classList.add('text-slate-600', 'border-slate-300');
        });
        btn.classList.add('bg-indigo-50', 'text-indigo-600', 'border-indigo-500');
        btn.classList.remove('text-slate-600', 'border-slate-300');
        setTitleAlign.value = btn.dataset.align;
    });
});

function updateAlignUI(align) {
    alignButtons.forEach(btn => {
        if (btn.dataset.align === align) {
            btn.click();
        }
    });
}


// Open Modal
if (settingsBtn) {
    settingsBtn.addEventListener('click', () => {
        // Load settings
        setTitleText.value = currentSettings.titleText;
        updateAlignUI(currentSettings.titleAlign || 'center');

        setFormat.value = currentSettings.format;
        setOrientation.value = currentSettings.orientation;
        setMarginTop.value = currentSettings.marginTop;
        setMarginRight.value = currentSettings.marginRight;
        setMarginBottom.value = currentSettings.marginBottom;
        setMarginLeft.value = currentSettings.marginLeft;
        setFontSize.value = currentSettings.fontSize;
        setLineHeight.value = currentSettings.lineHeight;
        setTextColor.value = currentSettings.textColor;
        setBgColor.value = currentSettings.bgColor;

        settingsModal.classList.remove('hidden');
        settingsModal.classList.add('flex');
    });
}

// Close Modal
function closeSettings() {
    settingsModal.classList.add('hidden');
    settingsModal.classList.remove('flex');
}
if (closeSettingsBtn) closeSettingsBtn.addEventListener('click', closeSettings);
if (cancelSettingsBtn) cancelSettingsBtn.addEventListener('click', closeSettings);

// Apply Settings
if (applySettingsBtn) {
    applySettingsBtn.addEventListener('click', () => {
        // Save Settings
        currentSettings = {
            titleText: setTitleText.value,
            titleAlign: setTitleAlign.value,
            format: setFormat.value,
            orientation: setOrientation.value,
            marginTop: parseInt(setMarginTop.value) || 0,
            marginRight: parseInt(setMarginRight.value) || 0,
            marginBottom: parseInt(setMarginBottom.value) || 0,
            marginLeft: parseInt(setMarginLeft.value) || 0,
            fontSize: parseInt(setFontSize.value) || 12,
            lineHeight: parseFloat(setLineHeight.value) || 1.5,
            textColor: setTextColor.value,
            bgColor: setBgColor.value
        };

        applyVisualSettings();
        renderPreview(); // Re-render with new settings
        closeSettings();
        showToast('Settings Applied!');
    });
}

function applyVisualSettings() {
    // Editor Styles (Formatting only)
    editor.style.lineHeight = currentSettings.lineHeight;
    editor.style.fontSize = currentSettings.fontSize + 'pt';
    editor.style.color = currentSettings.textColor;
}

// PDF Export (From Preview)
downloadBtn.addEventListener('click', async () => {
    const { jsPDF } = window.jspdf;

    // Ensure content is saved
    saveCurrentPage();
    renderPreview(); // Ensure pure state

    const pdf = new jsPDF({
        orientation: currentSettings.orientation,
        unit: 'mm',
        format: currentSettings.format
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // We need to capture EACH page div
    const pageElements = document.querySelectorAll('.preview-page');

    // Temporarily remove Ring (Highlight) class for clean export
    pageElements.forEach(el => el.classList.remove('ring-2', 'ring-indigo-500', 'ring-offset-2'));

    // Loading Toast?
    showToast('Generating PDF...');

    for (let i = 0; i < pageElements.length; i++) {
        if (i > 0) pdf.addPage();

        const pageEl = pageElements[i];

        // Clone to Body for capture (to ensure visibility/cleanliness)
        const captureEl = pageEl.cloneNode(true);
        captureEl.style.width = pageEl.style.width;
        captureEl.style.minHeight = pageEl.style.minHeight; // Important
        captureEl.style.position = 'fixed';
        captureEl.style.top = '0';
        captureEl.style.left = '-9999px';
        captureEl.style.zIndex = '-1';
        document.body.appendChild(captureEl);

        try {
            const canvas = await html2canvas(captureEl, { scale: 2, useCORS: true });
            const imgData = canvas.toDataURL('image/jpeg', 1.0);
            const imgProps = pdf.getImageProperties(imgData);
            const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, imgHeight);
        } catch (err) {
            console.error(err);
        } finally {
            document.body.removeChild(captureEl);
        }
    }

    // Restore Highlight
    renderPreview();

    pdf.save('Sinhala_Doc_MultiPage.pdf');
    showToast('PDF Downloaded!');
});

// Init
initPages();
applyVisualSettings();
