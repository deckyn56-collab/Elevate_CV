// ============================================
// LAMARANAI - SCRIPT UTAMA
// ============================================

const state = {
    activeTab: 'cover-letter',
    currentLang: 'id',
    currentTheme: 'dark',
    outputLetter: '',
    isGeneratingLetter: false,
    viewMode: 'preview',
    hasSignature: false,
    signatureDataUrl: null,
    cv2Result: null,
    isGenCv2: false,
    isEditingCv2: false,
    error: ''
};

// ============================================
// TRANSLATIONS
// ============================================
const translations = {
    id: { badge: "LamaranAI", tagline: "Platform untuk membuat Surat Lamaran dan CV Profesional." },
    en: { badge: "LamaranAI", tagline: "Platform to create Professional Cover Letters and CVs." }
};

// ============================================
// LANGUAGE SETTINGS
// ============================================
function setLanguage(lang) {
    state.currentLang = lang;
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.includes(lang.toUpperCase())) btn.classList.add('active');
    });
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang][key]) element.textContent = translations[lang][key];
    });
    localStorage.setItem('lamaranai_lang', lang);
}

// ============================================
// THEME
// ============================================
function toggleTheme() {
    const html = document.documentElement;
    const newTheme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    document.getElementById('themeIcon').className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    localStorage.setItem('lamaranai_theme', newTheme);
}

function initTheme() {
    const savedTheme = localStorage.getItem('lamaranai_theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        document.getElementById('themeIcon').className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

// ============================================
// TAB NAVIGATION
// ============================================
function switchTab(tabId) {
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.tab-button[data-tab="${tabId}"]`).classList.add('active');
    document.querySelectorAll('.tab-content').forEach(content => content.classList.add('hidden'));
    document.getElementById(tabId).classList.remove('hidden');
}

// ============================================
// ERROR HANDLING
// ============================================
function showError(message) {
    const errorBox = document.getElementById('errorBox');
    document.getElementById('errorText').innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
    errorBox.classList.remove('hidden');
    setTimeout(() => closeError(), 5000);
}

function closeError() {
    document.getElementById('errorBox').classList.add('hidden');
}

// ============================================
// SIGNATURE DRAWING
// ============================================
let isDrawing = false;
let canvas = null;
let ctx = null;

function initSignature() {
    canvas = document.getElementById('signatureCanvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    canvas.width = 400;
    canvas.height = 120;
    
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);
    canvas.addEventListener('touchstart', startDrawing, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    canvas.addEventListener('touchend', stopDrawing);
}

function getCanvasPosition(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    let clientX, clientY;
    if (e.touches) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }
    return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY
    };
}

function startDrawing(e) {
    e.preventDefault();
    if (!ctx) return;
    const pos = getCanvasPosition(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000000';
    isDrawing = true;
    state.hasSignature = true;
    document.getElementById('signaturePlaceholder').style.display = 'none';
}

function draw(e) {
    e.preventDefault();
    if (!isDrawing || !ctx) return;
    const pos = getCanvasPosition(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
}

function stopDrawing() {
    if (isDrawing && canvas) state.signatureDataUrl = canvas.toDataURL('image/png');
    isDrawing = false;
}

function clearSignature() {
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    state.hasSignature = false;
    state.signatureDataUrl = null;
    document.getElementById('signaturePlaceholder').style.display = 'flex';
}

// ============================================
// API CALL
// ============================================
async function callGeminiAPI(prompt, systemPrompt = "") {
    try {
        const response = await fetch('/api/gemini', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt, systemPrompt })
        });
        if (!response.ok) throw new Error('API Error');
        const data = await response.json();
        return data.content;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// ============================================
// GENERATE COVER LETTER
// ============================================
async function generateCoverLetter() {
    const jobTitle = document.getElementById('jobTitle').value;
    const company = document.getElementById('company').value;
    
    if (!jobTitle.trim() || !company.trim()) {
        showError('Posisi dan Perusahaan wajib diisi.');
        return;
    }
    
    state.isGeneratingLetter = true;
    const btn = document.getElementById('generateLetterBtn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses...';
    
    document.getElementById('loadingScreen').classList.remove('hidden');
    document.getElementById('letterPreview').classList.add('hidden');
    
    try {
        const name = document.getElementById('name').value;
        const location = document.getElementById('location').value;
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;
        const tone = document.getElementById('tone').value;
        
        const promptText = `Buat surat lamaran kerja profesional untuk posisi ${jobTitle} di ${company}. Nama: ${name}, Lokasi: ${location}, Telepon: ${phone}, Email: ${email}. Gaya: ${tone}.`;
        
        const result = await callGeminiAPI(promptText, "Anda adalah konsultan karir profesional.");
        state.outputLetter = result;
        renderLetterPreview();
        document.getElementById('quickActions').classList.remove('hidden');
        document.getElementById('letterActions').style.display = 'flex';
    } catch (error) {
        showError(error.message);
    } finally {
        state.isGeneratingLetter = false;
        document.getElementById('loadingScreen').classList.add('hidden');
        document.getElementById('letterPreview').classList.remove('hidden');
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-wand-magic-sparkles"></i> Buat Surat Lamaran';
    }
}

// ============================================
// RENDER LETTER
// ============================================
function renderLetterPreview() {
    const container = document.getElementById('letterPreview');
    if (state.viewMode === 'preview') {
        container.innerHTML = formatLetterHTML(state.outputLetter);
    } else {
        container.innerHTML = `<textarea class="editor-textarea" id="letterEditor">${state.outputLetter}</textarea>`;
        document.getElementById('letterEditor').addEventListener('input', (e) => {
            state.outputLetter = e.target.value;
        });
    }
}

function formatLetterHTML(text) {
    return `<div class="letter-content">${text.replace(/\n/g, '<br>')}</div>`;
}

// ============================================
// VIEW MODE
// ============================================
function setViewMode(mode) {
    state.viewMode = mode;
    document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
    if (mode === 'preview') {
        document.querySelectorAll('.view-btn')[0].classList.add('active');
    } else {
        document.querySelectorAll('.view-btn')[1].classList.add('active');
    }
    if (state.outputLetter) renderLetterPreview();
}

// ============================================
// REFINE LETTER
// ============================================
async function refineLetter(instruction) {
    if (!state.outputLetter) return;
    try {
        const result = await callGeminiAPI(`Perbaiki surat ini: ${instruction}\n\n${state.outputLetter}`);
        state.outputLetter = result;
        renderLetterPreview();
    } catch (error) {
        showError(error.message);
    }
}

// ============================================
// COPY TO CLIPBOARD
// ============================================
function copyToClipboard() {
    if (!state.outputLetter) return;
    navigator.clipboard.writeText(state.outputLetter).then(() => {
        document.querySelector('.copy-btn').innerHTML = '<i class="fas fa-check"></i> Tersalin!';
        setTimeout(() => {
            document.querySelector('.copy-btn').innerHTML = '<i class="fas fa-copy"></i> Salin';
        }, 2000);
    });
}

// ============================================
// EXPORT PDF SURAT
// ============================================
async function exportPDF() {
    if (!state.outputLetter) return;
    try {
        if (!window.jspdf) await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ unit: "mm", format: "a4" });
        
        const marginLeft = 20;
        let cursorY = 25;
        const pageHeight = 297;
        const marginBottom = 20;
        const maxLineWidth = 170;
        
        doc.setFont("times", "normal");
        doc.setFontSize(11);
        
        const paragraphs = state.outputLetter.split("\n");
        
        for (let i = 0; i < paragraphs.length; i++) {
            const line = paragraphs[i].trim();
            if (line === "") { cursorY += 4; continue; }
            const splitText = doc.splitTextToSize(line, maxLineWidth);
            for (let j = 0; j < splitText.length; j++) {
                if (cursorY + 7 > pageHeight - marginBottom) {
                    doc.addPage();
                    cursorY = 25;
                }
                doc.text(splitText[j], marginLeft, cursorY);
                cursorY += 6;
            }
        }
        
        doc.save('Surat_Lamaran.pdf');
    } catch (error) {
        showError('Gagal membuat PDF: ' + error.message);
    }
}

// ============================================
// CV PREVIEW & DOWNLOAD (FIXED A4)
// ============================================

function updateCVPreview() {
    document.getElementById('view-cv2-name').innerText = document.getElementById('cv2Name').value || 'Nama Anda';
    document.getElementById('view-cv2-title').innerText = document.getElementById('cv2Title').value || 'Posisi';
    document.getElementById('view-cv2-address').innerText = '📍 ' + document.getElementById('cv2Address').value;
    document.getElementById('view-cv2-phone').innerText = '📞 ' + document.getElementById('cv2Phone').value;
    document.getElementById('view-cv2-email').innerText = '✉️ ' + document.getElementById('cv2Email').value;
    document.getElementById('view-cv2-summary').innerText = document.getElementById('cv2Summary').value;
    
    document.getElementById('view-cv2-job1-title').innerText = document.getElementById('cv2Job1Title').value;
    document.getElementById('view-cv2-job1-company').innerText = document.getElementById('cv2Job1Company').value;
    document.getElementById('view-cv2-job1-date').innerText = document.getElementById('cv2Job1Date').value;
    formatCVBullets('cv2Job1Bullets', 'view-cv2-job1-bullets');
    
    document.getElementById('view-cv2-job2-title').innerText = document.getElementById('cv2Job2Title').value;
    document.getElementById('view-cv2-job2-company').innerText = document.getElementById('cv2Job2Company').value;
    document.getElementById('view-cv2-job2-date').innerText = document.getElementById('cv2Job2Date').value;
    formatCVBullets('cv2Job2Bullets', 'view-cv2-job2-bullets');
    
    document.getElementById('view-cv2-edu-degree').innerText = document.getElementById('cv2EduDegree').value;
    document.getElementById('view-cv2-edu-school').innerText = document.getElementById('cv2EduSchool').value;
    document.getElementById('view-cv2-edu-date').innerText = document.getElementById('cv2EduDate').value;
    document.getElementById('view-cv2-edu-detail').innerText = document.getElementById('cv2EduDetail').value;
    
    document.getElementById('view-cv2-hard-skills').innerText = document.getElementById('cv2HardSkills').value;
    document.getElementById('view-cv2-soft-skills').innerText = document.getElementById('cv2SoftSkills').value;
}

function formatCVBullets(inputId, viewId) {
    const text = document.getElementById(inputId).value;
    const ul = document.getElementById(viewId);
    ul.innerHTML = '';
    const lines = text.split('\n').filter(line => line.trim() !== '');
    lines.forEach(line => {
        const li = document.createElement('li');
        li.innerText = line.replace(/^[\*\-]\s*/, '');
        ul.appendChild(li);
    });
}

// ============================================
// PREVIEW MODAL (FIXED A4)
// ============================================

function applyPreviewScale() {
    const container = document.getElementById('cvPdfPreviewContainer');
    if (!container) return;
    
    const windowWidth = window.innerWidth;
    let scale = 1;
    
    if (windowWidth < 500) {
        scale = 0.5;
    } else if (windowWidth < 900) {
        scale = 0.75;
    } else {
        scale = 1;
    }
    
    container.style.transform = `scale(${scale})`;
    container.style.transformOrigin = 'top center';
    container.style.marginBottom = `-${(1 - scale) * 100}%`;
}

function openCvPreview() {
    const cvElement = document.getElementById('cv2-paper');
    const previewContainer = document.getElementById('cvPdfPreviewContainer');
    
    const clone = cvElement.cloneNode(true);
    clone.style.transform = 'none';
    clone.style.margin = '0';
    clone.style.boxShadow = 'none';
    clone.style.width = '210mm';
    clone.style.minHeight = '297mm';
    clone.style.padding = '20mm 18mm';
    
    previewContainer.innerHTML = '';
    previewContainer.appendChild(clone);
    
    document.getElementById('cvPdfModal').style.display = 'flex';
    
    applyPreviewScale();
    
    document.getElementById('btnDownloadCvPdf').disabled = false;
    document.getElementById('btnDownloadCvPdf').innerHTML = '<i class="fas fa-file-arrow-down"></i> Unduh Sekarang';
}

function closeCvPreview() {
    document.getElementById('cvPdfModal').style.display = 'none';
    document.getElementById('cvPdfPreviewContainer').innerHTML = '';
}

async function downloadCvFromPreview() {
    const container = document.getElementById('cvPdfPreviewContainer');
    const element = container.firstElementChild;
    if (!element) {
        alert('CV tidak ditemukan.');
        return;
    }

    const name = document.getElementById('cv2Name').value || 'CV';
    const filename = 'CV_' + name.replace(/\s+/g, '_') + '.pdf';
    
    const downloadBtn = document.getElementById('btnDownloadCvPdf');
    downloadBtn.disabled = true;
    downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses...';

    try {
        // Hapus transform agar html2pdf menangkap ukuran asli
        container.style.transform = 'none';
        container.style.marginBottom = '0';
        element.style.transform = 'none';
        element.style.width = '210mm';
        element.style.minHeight = '297mm';
        element.style.padding = '20mm 18mm';
        
        // Pastikan library dimuat
        if (typeof html2pdf === 'undefined') {
            await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js');
        }

        const opt = {
            margin: 0,
            filename: filename,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { 
                scale: 2, 
                useCORS: true, 
                logging: false,
                letterRendering: true,
                width: element.scrollWidth,
                height: element.scrollHeight
            },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        await html2pdf().set(opt).from(element).save();
        
    } catch (error) {
        console.error('PDF Error:', error);
        alert('Gagal membuat PDF: ' + error.message);
    } finally {
        applyPreviewScale();
        downloadBtn.disabled = false;
        downloadBtn.innerHTML = '<i class="fas fa-file-arrow-down"></i> Unduh Sekarang';
    }
}

// ============================================
// FUNGSI AI UNTUK CV
// ============================================
async function callGeminiAPI_CV(prompt, button, inputId) {
    const originalText = button.innerText;
    button.innerText = "⏳ Memproses...";
    button.disabled = true;

    try {
        const response = await fetch('/api/gemini', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prompt,
                systemPrompt: "Anda adalah penulis CV profesional."
            })
        });

        if (!response.ok) throw new Error('API Error');
        const data = await response.json();
        const cleanedText = data.content.replace(/\*\*/g, '').replace(/^#+\s*/gm, '');

        document.getElementById(inputId).value = cleanedText.trim();
        updateCVPreview();

    } catch (error) {
        alert("Terjadi kesalahan: " + error.message);
    } finally {
        button.innerText = originalText;
        button.disabled = false;
    }
}

function generateSummary() {
    const title = document.getElementById('cv2Title').value;
    const hard = document.getElementById('cv2HardSkills').value;
    const soft = document.getElementById('cv2SoftSkills').value;
    
    const prompt = `Buat ringkasan profil untuk posisi "${title}". Skill: ${hard}, ${soft}.`;
    const button = document.querySelector('.form-section-title .btn-ai');
    callGeminiAPI_CV(prompt, button, 'cv2Summary');
}

function generateJob(jobIndex) {
    const title = document.getElementById(`cv2Job${jobIndex}Title`).value;
    const company = document.getElementById(`cv2Job${jobIndex}Company`).value;
    
    const prompt = `Buat 3 poin pencapaian untuk ${title} di ${company}.`;
    const button = document.querySelector(`.form-section-title:nth-of-type(${jobIndex + 3}) .btn-ai`);
    callGeminiAPI_CV(prompt, button, `cv2Job${jobIndex}Bullets`);
}

// ============================================
// UTILITY
// ============================================
function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
    });
}

function showLoading(show) {
    const loadingScreen = document.getElementById('loadingScreen');
    const previewContainer = document.getElementById('letterPreview');
    if (show) {
        loadingScreen.classList.remove('hidden');
        previewContainer.classList.add('hidden');
    } else {
        loadingScreen.classList.add('hidden');
        previewContainer.classList.remove('hidden');
    }
}

// ============================================
// AUTO-SAVE
// ============================================
function initLocalStorage() {
    const savedData = localStorage.getItem('elevatecv_data_v2');
    if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed.name) document.getElementById('name').value = parsed.name;
        if (parsed.location) document.getElementById('location').value = parsed.location;
        if (parsed.phone) document.getElementById('phone').value = parsed.phone;
        if (parsed.email) document.getElementById('email').value = parsed.email;
        if (parsed.company) document.getElementById('company').value = parsed.company;
        if (parsed.jobTitle) document.getElementById('jobTitle').value = parsed.jobTitle;
    }
}

function saveToLocalStorage() {
    localStorage.setItem('elevatecv_data_v2', JSON.stringify({
        name: document.getElementById('name').value,
        location: document.getElementById('location').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        company: document.getElementById('company').value,
        jobTitle: document.getElementById('jobTitle').value
    }));
}

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    const savedLang = localStorage.getItem('lamaranai_lang');
    if (savedLang) setLanguage(savedLang);
    else setLanguage('id');
    initSignature();
    initLocalStorage();
    switchTab('cover-letter');
    updateCVPreview();
    
    const cvInputs = ['cv2Name', 'cv2Title', 'cv2Address', 'cv2Phone', 'cv2Email', 
                      'cv2HardSkills', 'cv2SoftSkills', 'cv2Summary', 
                      'cv2Job1Title', 'cv2Job1Company', 'cv2Job1Date', 'cv2Job1Bullets',
                      'cv2Job2Title', 'cv2Job2Company', 'cv2Job2Date', 'cv2Job2Bullets',
                      'cv2EduDegree', 'cv2EduSchool', 'cv2EduDate', 'cv2EduDetail'];
    
    cvInputs.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.addEventListener('input', updateCVPreview);
    });
    
    window.addEventListener('resize', () => {
        if (document.getElementById('cvPdfModal').style.display === 'flex') {
            applyPreviewScale();
        }
    });
});