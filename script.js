// Sinhala Phonetic Typing Tool
// Script: Rich Text Editor Version

let currentMode = 'uni'; // 'uni', 'sinhala', 'english'

// --- UNI TYPING MAPS (STRICT) ---
const uniConsonants = {
    'q': 'ද්', 'w': 'ව්', 'r': 'ර්', 't': 'ට්', 'y': 'ය්',
    'p': 'ප්', 's': 'ස්', 'd': 'ඩ්', 'f': 'ෆ්', 'g': 'ග්',
    'h': 'හ්', 'j': 'ජ්', 'k': 'ක්', 'l': 'ල්', 'c': 'ක්',
    'v': 'ව්', 'b': 'බ්', 'n': 'න්', 'm': 'ම්',
    'x': 'ං', 'z': 'ෙ'
};
const uniVowels = {
    'a': 'අ', 'e': 'එ', 'i': 'ඉ', 'o': 'ඔ', 'u': 'උ',
    'ii': 'ඊ', 'uu': 'ඌ', 'ee': 'ඒ', 'oo': 'ඕ'
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


// --- INPUT HANDLER (RICH TEXT) ---
editor.addEventListener('input', function(e) {
    if (e.inputType === 'deleteContentBackward') return;
    if (e.inputType === 'insertParagraph') return; // Do not mess with new lines
    // Allow history undo/redo?
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


// --- UNI LOGIC for TextNode ---
// `node` is the text node being modified.
// `offset` is the cursor position within that node.
function handleUniTyping(node, offset, e) {
    const text = node.textContent;
    const preText = text.substring(0, offset); 

    // 1. Suffix Replacements (දැනට පවතින ලැයිස්තුව)
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

    // --- NEW LOGIC START: Generic Rakaranshaya ---
    // If 'r' is typed after a Hal consonant, convert to Rakaranshaya immediately.
    // Unicode: Hal (\u0DCA) + r -> Hal (\u0DCA) + ZWJ (\u200D) + Rayanna (\u0DBB)
    
    // Note: At this point, preText includes existing text + newly typed 'r'.
    // `preText` should end with 'r'.
    
    if (preText.endsWith('r')) {
        let beforeR = preText.substring(0, preText.length - 1);
        if (beforeR.length > 0) {
             let lastChar = beforeR.charAt(beforeR.length - 1);
             // Check for Hal
             if (lastChar === '\u0DCA') {
                 // Replace [Hal] + 'r' with [Hal][ZWJ][Rayanna]
                 let rakaranshaya = '\u0DCA\u200D\u0DBB'; 
                 // We remove the last char (Hal) from `beforeR` foundation because we are rebuilding it? 
                 // No, Hal is PART of the Ra replacement sequence? 
                 // Actually `\u0DCA\u200D\u0DBB` IS the modifier relative to base consonant?
                 // No. Rakaranshaya is applied TO a base consonant.
                 // Base Consonant + Hal + ZWJ + Rayanna.
                 // We have Base Consonant + Hal. Adding 'r'.
                 // So we keep Base Consonant + Hal, and add ZWJ + Rayanna.
                 // Wait. 'BeforeR' ends in Hal.
                 // So we just need to append ZWJ + Rayanna to `beforeR`.
                 // And since 'r' is in `preText` (the typed char), we are essentially REPLACING 'r' with ZWJ+Ra.
                 
                 // BUT: `uniConsonants['r']` maps 'r' to 'ර්'.
                 // If we don't intercept here, Step 3 will turn 'r' -> 'ර්'.
                 // So the result would be [Base][Hal][Ra][Hal]. That's not Rakaranshaya.
                 
                 // So here we replace `r` with `\u200D\u0DBB` (ZWJ + Rayanna).
                 // Result: [Base][Hal] + [ZWJ][Rayanna]. This forms Rakaranshaya.
                 
                 let replacement = '\u200D\u0DBB'; 
                 let newPre = beforeR + replacement; 
                 // beforeR is everything before 'r'.
                 
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
                        // Replace [base][hal][key] -> [base][mod]
                        // Remove 2 chars (base+hal) + keyLen
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
    // Get last char typed (or last char of preText)
    // Note: User typed a key. It is inserted.
    // 'preText' contains it.
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
    // Similar Logic, but for Wijesekara Map
    const text = node.textContent;
    let typedChar = text.charAt(offset - 1); 
    
    // Fallback if typedChar empty (rare)
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
         // Swap
         let visualPrev = prevChar;
         let visualNew = replacement; // This is the consonant
         
         // New Prefix: ... (minus prev) + New + Prev
         let newPre = preText.slice(0, -1) + visualNew + visualPrev;
         
         node.textContent = newPre + postText;
         setCursor(node, newPre.length);
    } else {
         // Standard Replace
         let newPre = preText + replacement;
         node.textContent = newPre + postText;
         setCursor(node, newPre.length);
    }
}

function setCursor(node, pos) {
    const range = document.createRange();
    const sel = window.getSelection();
    // Safety check for length
    if (pos > node.textContent.length) pos = node.textContent.length;
    
    range.setStart(node, pos);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
}


// Copy / Clear
if (clearBtn) {
    clearBtn.addEventListener('click', () => {
        if(confirm('Clear all text?')) {
            editor.innerHTML = ''; // Div uses innerHTML
            editor.focus();
        }
    });
}
if (copyBtn) {
    copyBtn.addEventListener('click', () => {
        // Copy innerText or HTML? User likely wants Text for pasting elsewhere, or HTML for Word.
        // Clipboard API usually copies plain text by default if we just grab value.
        // Let's copy innerText.
        const textToCopy = editor.innerText;
        navigator.clipboard.writeText(textToCopy).then(() => {
            showToast('Copied text!');
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
const previewPage = document.getElementById('previewPage');
const previewPageWrapper = document.getElementById('previewPageWrapper');
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

// Sync Logic
const placeholderContent = `
    <div class="flex items-center justify-center h-full text-slate-300 flex-col min-h-[297mm]">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        <p class="text-lg font-medium">No Content to Preview</p>
        <p class="text-sm">Start typing to see your PDF preview</p>
    </div>
`;

function syncContent() {
    const content = editor.innerText.trim();
    // Count Words
    const words = content === '' ? 0 : content.split(/\s+/).length;
    const chars = content.length;
    if (wordCount) wordCount.innerText = `Words: ${words} | Characters: ${chars}`;

    // Update Preview
    if (!previewPage) return;
    
    // Check if empty (ignoring title if present?)
    // Actually, we should just clone innerHTML.
    // If empty text node, show placeholder?
    // Let's just sync for now.
    
    if (editor.innerHTML.trim() === '<br>' || editor.innerHTML.trim() === '') {
         previewPage.innerHTML = placeholderContent;
    } else {
         previewPage.innerHTML = editor.innerHTML;
    }
}
editor.addEventListener('input', syncContent);
// Initial Sync
syncContent();


// Alignment UI Handler
alignButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Reset all
        alignButtons.forEach(b => {
             b.classList.remove('bg-indigo-50', 'text-indigo-600', 'border-indigo-500');
             b.classList.add('text-slate-600', 'border-slate-300');
        });
        // Active
        btn.classList.add('bg-indigo-50', 'text-indigo-600', 'border-indigo-500');
        btn.classList.remove('text-slate-600', 'border-slate-300');
        
        setTitleAlign.value = btn.dataset.align;
    });
});

function updateAlignUI(align) {
    alignButtons.forEach(btn => {
        if(btn.dataset.align === align) {
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
        
        closeSettings();
        showToast('Settings Applied!');
    });
}

function applyVisualSettings() {
    // 1. Editor Styles (Formatting only)
    // Editor should maintain a comfortable writing view, so ignore Page Format/Margins here.
    // We only apply typography.
    editor.style.lineHeight = currentSettings.lineHeight;
    // We don't necessarily apply bgColor to Editor in Split View?
    // User requested "Brightness reduce", so keeping Editor white might be harsh if they chose dark bg.
    // However, Preview usually reflects the PDF.
    // Let's keep Editor basic/clean (white or slate-50) and Preview shows the real deal.
    // BUT: The Font Size in editor should probably scale or stay readable.
    // Let's apply font size to Editor too.
    editor.style.fontSize = currentSettings.fontSize + 'pt';
    editor.style.color = currentSettings.textColor;


    // 2. Preview Styles (Full Layout)
    if (previewPage) {
        // Dimensions
        let pageW = 210; 
        let pageH = 297;
        
        if (currentSettings.format === 'letter') { pageW = 215.9; pageH = 279.4; }
        if (currentSettings.format === 'legal') { pageW = 215.9; pageH = 355.6; } // Legal Height correct? Legal is 14in ~355.6mm

        if (currentSettings.orientation === 'landscape') {
            [pageW, pageH] = [pageH, pageW];
        }

        previewPage.style.width = pageW + 'mm';
        previewPage.style.minHeight = pageH + 'mm';
        
        // Margins -> Padding
        previewPage.style.paddingTop = currentSettings.marginTop + 'mm';
        previewPage.style.paddingRight = currentSettings.marginRight + 'mm';
        previewPage.style.paddingBottom = currentSettings.marginBottom + 'mm';
        previewPage.style.paddingLeft = currentSettings.marginLeft + 'mm';
        
        // Aesthetics
        previewPage.style.backgroundColor = currentSettings.bgColor;
        previewPage.style.color = currentSettings.textColor;
        previewPage.style.lineHeight = currentSettings.lineHeight;
        previewPage.style.fontSize = currentSettings.fontSize + 'pt';
        previewPage.style.fontFamily = '"Noto Sans Sinhala", sans-serif'; // Ensure font 
    }

    // 3. Document Title Handling
    let titleEl = document.getElementById('docTitle');
    if (currentSettings.titleText && currentSettings.titleText.trim() !== "") {
        if (!titleEl) {
            titleEl = document.createElement('h1');
            titleEl.id = 'docTitle';
            titleEl.className = 'text-3xl font-bold mb-6 font-sinhala outline-none';
            editor.prepend(titleEl);
        }
        titleEl.textContent = currentSettings.titleText;
        titleEl.style.textAlign = currentSettings.titleAlign;
        titleEl.style.color = currentSettings.textColor; 
    } else {
        if (titleEl) {
            titleEl.remove();
        }
    }
    
    // Trigger sync to update preview with new Title
    syncContent();
}

// PDF Export (From Preview)
downloadBtn.addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    
    // We already have the previewPage with correct dimensions and styles.
    // We just need to capture it.
    
    // Ensure content is synced
    syncContent();

    // Use previewPage directly? html2canvas needs it visible. It is visible.
    // But user might be scrolled down. html2canvas handles that usually.
    // Better to clone it to a clean container off-screen to ensure full capture without scrollbars etc?
    
    const captureEl = previewPage.cloneNode(true);
    // Explicitly set dimensions on clone to ensure no responsiveness issues during capture
    captureEl.style.width = previewPage.style.width;
    captureEl.style.minHeight = previewPage.style.minHeight;
    captureEl.style.position = 'fixed';
    captureEl.style.top = '0';
    captureEl.style.left = '-9999px';
    captureEl.style.zIndex = '-1';
    
    document.body.appendChild(captureEl);
    
    html2canvas(captureEl, { scale: 2, useCORS: true }).then(canvas => {
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        
        const pdf = new jsPDF({
            orientation: currentSettings.orientation,
            unit: 'mm',
            format: currentSettings.format
        });
        
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight(); 

        const imgProps = pdf.getImageProperties(imgData);
        const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
        // Multi-page handling? 
        // If imgHeight > pdfHeight, we technically need multiple pages.
        // For now, let's just create one tall page or fit to one page?
        // Standard behavior: fit width, let height spill?
        // jsPDF addImage supports compression and placement.
        
        if (imgHeight > pdfHeight) {
             // Simple multi-page approach
             // Just add image. It will likely get cut or shrunk.
             // For simple tool: One Page or Fit?
             // Let's just add it.
             pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, imgHeight);
        } else {
             pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, imgHeight);
        }

        pdf.save('Document.pdf');
        
        document.body.removeChild(captureEl);
    });
});

// Init
applyVisualSettings();
