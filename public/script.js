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
    error: ''
};

// ============================================
// TRANSLATIONS (LENGKAP DENGAN PLACEHOLDER)
// ============================================
const translations = {
    id: {
        badge: "LamaranAI",
        tagline: "Platform untuk membuat Surat Lamaran dan CV Profesional.",
        tabCoverTitle: "Surat Lamaran",
        tabCoverDesc: "Generator & Tanda Tangan",
        tabCVTitle: "CV Profesional",
        tabCVDesc: "Format Ramah ATS",
        formTitle: "Informasi Pelamar & Pekerjaan",
        step1: "Langkah 1",
        fullName: "Nama Lengkap",
        city: "Kota Domisili",
        phone: "No. HP",
        email: "Email",
        position: "Posisi Target *",
        company: "Nama Perusahaan *",
        companyAddress: "Alamat Perusahaan",
        tone: "Gaya Bahasa Surat",
        toneProfessional: "Profesional & Formal",
        toneConfident: "Percaya Diri & Berorientasi Hasil",
        toneCreative: "Kreatif & Antusias",
        jobDesc: "Deskripsi Pekerjaan",
        experience: "Pengalaman / Poin CV",
        signature: "Tanda Tangan Digital",
        clear: "Hapus",
        signHere: "Tanda Tangan",
        generateBtn: "Buat Surat Lamaran",
        resultTitle: "Hasil Surat Lamaran",
        preview: "Previu",
        edit: "Edit",
        copy: "Salin",
        download: "PDF",
        quickActions: "Perbaikan Cepat:",
        shorten: "Singkatkan",
        moreFormal: "Lebih Formal",
        leadership: "Kepemimpinan",
        noLetter: "Belum ada surat lamaran",
        noLetterDesc: "Isi formulir di sebelah kiri dan klik 'Buat Surat Lamaran' untuk memulai.",
        loading: "Sedang menyusun surat lamaran terbaik untuk Anda...",
        cvTitle: "CV Profesional & Ramah ATS",
        generator: "Generator",
        contactInfo: "Informasi Kontak",
        skills: "Keahlian",
        summary: "Ringkasan Profesional",
        exp1: "Pengalaman Kerja 1",
        exp2: "Pengalaman Kerja 2",
        education: "Pendidikan",
        previewCv: "Lihat & Unduh CV",
        previewPdf: "Preview & Unduh CV",
        close: "Tutup",
        downloadNow: "Unduh Sekarang",
        auto: "Otomatis",
        autoFeature: "Fitur Otomatis:",
        autoFeatureDesc: "Klik tombol 'Otomatis' untuk mengisi Ringkasan dan Tugas.",
        // Placeholder
        namePlaceholder: "Budi Santoso",
        cityPlaceholder: "Jakarta Selatan",
        phonePlaceholder: "081234567890",
        emailPlaceholder: "budi@email.com",
        positionPlaceholder: "Senior Fullstack Dev",
        companyPlaceholder: "PT Tech Innovation",
        addressPlaceholder: "Jl. Depati Hamzah, Pangkalpinang",
        jobDescPlaceholder: "Tempel persyaratan pekerjaan di sini...",
        experiencePlaceholder: "Tempel ringkasan pengalaman utama Anda...",
        cvNamePlaceholder: "Nama Lengkap",
        cvTitlePlaceholder: "Posisi / Spesialisasi",
        cvAddressPlaceholder: "Kota & Negara",
        cvPhonePlaceholder: "No. Telepon",
        cvEmailPlaceholder: "Email",
        cvHardSkillsPlaceholder: "Hard Skills (pisahkan koma)",
        cvSoftSkillsPlaceholder: "Soft Skills (pisahkan koma)",
        cvSummaryPlaceholder: "Tulis ringkasan atau klik Otomatis...",
        cvJobTitlePlaceholder: "Jabatan",
        cvJobCompanyPlaceholder: "Perusahaan",
        cvJobDatePlaceholder: "Periode (Jan 2022 - Sekarang)",
        cvJobBulletsPlaceholder: "Pencapaian & Tugas (1 poin per baris)...",
        cvEduDegreePlaceholder: "Gelar & Jurusan",
        cvEduSchoolPlaceholder: "Universitas",
        cvEduDatePlaceholder: "Periode",
        cvEduDetailPlaceholder: "Detail (IPK, dll)",
        // SEO
        seoTitle: "LamaranAI - Solusi Karir Online",
        seoDesc: "LamaranAI adalah platform gratis untuk membantu Anda membuat surat lamaran kerja yang profesional dan CV yang menarik.",
        seoFeature1Title: "Surat Lamaran Profesional",
        seoFeature1Desc: "Generator surat lamaran kerja yang profesional",
        seoFeature2Title: "CV Ramah ATS",
        seoFeature2Desc: "Template CV modern yang mudah dibaca mesin ATS",
        seoFeature3Title: "Tanda Tangan Digital",
        seoFeature3Desc: "Tambahkan tanda tangan digital ke surat lamaran",
        seoFeature4Title: "Export PDF",
        seoFeature4Desc: "Unduh hasil dalam format PDF siap kirim"
    },
    en: {
        badge: "LamaranAI",
        tagline: "Platform to create Professional Cover Letters and CVs.",
        tabCoverTitle: "Cover Letter",
        tabCoverDesc: "Generator & Signature",
        tabCVTitle: "Professional CV",
        tabCVDesc: "ATS-Friendly Format",
        formTitle: "Applicant & Job Information",
        step1: "Step 1",
        fullName: "Full Name",
        city: "City",
        phone: "Phone Number",
        email: "Email",
        position: "Target Position *",
        company: "Company Name *",
        companyAddress: "Company Address",
        tone: "Letter Tone",
        toneProfessional: "Professional & Formal",
        toneConfident: "Confident & Results-Oriented",
        toneCreative: "Creative & Enthusiastic",
        jobDesc: "Job Description",
        experience: "Experience / CV Points",
        signature: "Digital Signature",
        clear: "Clear",
        signHere: "Signature",
        generateBtn: "Generate Cover Letter",
        resultTitle: "Cover Letter Result",
        preview: "Preview",
        edit: "Edit",
        copy: "Copy",
        download: "PDF",
        quickActions: "Quick Enhancements:",
        shorten: "Shorten",
        moreFormal: "More Formal",
        leadership: "Leadership",
        noLetter: "No cover letter yet",
        noLetterDesc: "Fill the form on the left and click 'Generate Cover Letter' to start.",
        loading: "Crafting the best cover letter for you...",
        cvTitle: "Professional ATS-Friendly CV",
        generator: "Generator",
        contactInfo: "Contact Information",
        skills: "Skills",
        summary: "Professional Summary",
        exp1: "Work Experience 1",
        exp2: "Work Experience 2",
        education: "Education",
        previewCv: "View & Download CV",
        previewPdf: "Preview & Download CV",
        close: "Close",
        downloadNow: "Download Now",
        auto: "Auto",
        autoFeature: "Auto Feature:",
        autoFeatureDesc: "Click 'Auto' button to fill Summary and Tasks.",
        // Placeholder
        namePlaceholder: "John Doe",
        cityPlaceholder: "New York",
        phonePlaceholder: "+1 234 567 890",
        emailPlaceholder: "john@email.com",
        positionPlaceholder: "Senior Fullstack Dev",
        companyPlaceholder: "Tech Innovation Inc.",
        addressPlaceholder: "123 Main Street, New York",
        jobDescPlaceholder: "Paste job requirements here...",
        experiencePlaceholder: "Paste your main experience summary...",
        cvNamePlaceholder: "Full Name",
        cvTitlePlaceholder: "Position / Specialization",
        cvAddressPlaceholder: "City & Country",
        cvPhonePlaceholder: "Phone Number",
        cvEmailPlaceholder: "Email",
        cvHardSkillsPlaceholder: "Hard Skills (comma separated)",
        cvSoftSkillsPlaceholder: "Soft Skills (comma separated)",
        cvSummaryPlaceholder: "Write summary or click Auto...",
        cvJobTitlePlaceholder: "Job Title",
        cvJobCompanyPlaceholder: "Company",
        cvJobDatePlaceholder: "Period (Jan 2022 - Present)",
        cvJobBulletsPlaceholder: "Achievements & Tasks (1 point per line)...",
        cvEduDegreePlaceholder: "Degree & Major",
        cvEduSchoolPlaceholder: "University",
        cvEduDatePlaceholder: "Period",
        cvEduDetailPlaceholder: "Detail (GPA, etc)",
        // SEO
        seoTitle: "LamaranAI - Online Career Solution",
        seoDesc: "LamaranAI is a free platform to help you create professional cover letters and attractive CVs.",
        seoFeature1Title: "Professional Cover Letter",
        seoFeature1Desc: "Professional cover letter generator",
        seoFeature2Title: "ATS-Friendly CV",
        seoFeature2Desc: "Modern CV template that is easy for ATS to read",
        seoFeature3Title: "Digital Signature",
        seoFeature3Desc: "Add digital signature to your cover letter",
        seoFeature4Title: "PDF Export",
        seoFeature4Desc: "Download results in ready-to-send PDF format"
    }
};

// ============================================
// LANGUAGE SETTINGS (DIPERBAIKI)
// ============================================
function setLanguage(lang) {
    state.currentLang = lang;
    
    // Update language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.includes(lang.toUpperCase())) {
            btn.classList.add('active');
        }
    });
    
    // Update text content
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
    
    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        if (translations[lang][key]) {
            element.placeholder = translations[lang][key];
        }
    });
    
    // Update document title
    document.title = lang === 'id' ? 
        'LamaranAI - Buat Surat Lamaran & CV Profesional Gratis' : 
        'LamaranAI - Create Professional Cover Letters & CVs Free';
    
    document.documentElement.lang = lang;
    localStorage.setItem('lamaranai_lang', lang);
}

// ============================================
// THEME SETTINGS
// ============================================
function toggleTheme() {
    const html = document.documentElement;
    const newTheme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    document.getElementById('themeIcon').className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    localStorage.setItem('lamaranai_theme', newTheme);
    state.currentTheme = newTheme;
}

function initTheme() {
    const savedTheme = localStorage.getItem('lamaranai_theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        document.getElementById('themeIcon').className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        state.currentTheme = savedTheme;
    }
}


// ============================================
// THEME SETTINGS
// ============================================
function toggleTheme() {
    const html = document.documentElement;
    const newTheme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    document.getElementById('themeIcon').className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    localStorage.setItem('lamaranai_theme', newTheme);
    state.currentTheme = newTheme;
}

function initTheme() {
    const savedTheme = localStorage.getItem('lamaranai_theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        document.getElementById('themeIcon').className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        state.currentTheme = savedTheme;
    }
}

// ============================================
// TAB NAVIGATION
// ============================================
function switchTab(tabId) {
    state.activeTab = tabId;
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tabId) btn.classList.add('active');
    });
    document.querySelectorAll('.tab-content').forEach(content => content.classList.add('hidden'));
    const tabContent = document.getElementById(tabId);
    if (tabContent) tabContent.classList.remove('hidden');
}

// ============================================
// ERROR HANDLING
// ============================================
function showError(message) {
    state.error = message;
    const errorBox = document.getElementById('errorBox');
    const errorText = document.getElementById('errorText');
    errorText.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
    errorBox.classList.remove('hidden');
    setTimeout(() => closeError(), 5000);
}

function closeError() {
    document.getElementById('errorBox').classList.add('hidden');
    state.error = '';
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
    return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
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
    const placeholder = document.getElementById('signaturePlaceholder');
    if (placeholder) placeholder.style.display = 'none';
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
    const placeholder = document.getElementById('signaturePlaceholder');
    if (placeholder) placeholder.style.display = 'flex';
}

// ============================================
// API CALL (Serverless Vercel)
// ============================================
async function callGeminiAPI(prompt, systemPrompt = "") {
    try {
        const response = await fetch('/api/gemini', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt, systemPrompt })
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'API Error');
        }
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
    const name = document.getElementById('name').value;
    const location = document.getElementById('location').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const jobTitle = document.getElementById('jobTitle').value;
    const company = document.getElementById('company').value;
    const companyAddress = document.getElementById('companyAddress').value;
    const tone = document.getElementById('tone').value;
    const jobDescription = document.getElementById('jobDescription').value;
    const experience = document.getElementById('experience').value;
    
    if (!jobTitle.trim() || !company.trim()) {
        showError('Posisi dan Perusahaan wajib diisi.');
        return;
    }
    
    state.isGeneratingLetter = true;
    const btn = document.getElementById('generateLetterBtn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses...';
    
    const loadingScreen = document.getElementById('loadingScreen');
    const previewContainer = document.getElementById('letterPreview');
    loadingScreen.classList.remove('hidden');
    previewContainer.classList.add('hidden');
    
    try {
        const today = new Date().toLocaleDateString(state.currentLang === 'id' ? 'id-ID' : 'en-US', { 
            day: 'numeric', month: 'long', year: 'numeric' 
        });
        
        const langInstruction = state.currentLang === 'id' ? 'Tulis dalam Bahasa Indonesia' : 'Write in English';
        
        const promptText = `You are a professional career consultant. Write an elegant, convincing cover letter. ${langInstruction}.

APPLICANT DATA:
Name: ${name || "[Your Name]"}
Location: ${location || "[Your City]"}
Phone: ${phone || "[Phone Number]"}
Email: ${email || "[Your Email]"}

COMPANY DATA:
Company: ${company}
Company Address: ${companyAddress || "[Company Address]"}
Position Applied: ${jobTitle}

TONE: ${tone}
JOB DESCRIPTION: ${jobDescription || "Highly relevant to standard qualifications for this position."}
CV EXPERIENCE: ${experience || "Mention high motivation, enthusiasm, and quick adaptability."}

FORMAT REQUIREMENTS:
${location || "[City]"}, ${today}

Subject: Job Application - ${jobTitle}

Dear Hiring Manager / HRD Team
${company}
${companyAddress || ""}

Dear Sir/Madam,
[Write cover letter in 3-4 persuasive paragraphs...]

Sincerely,

${name || "[Your Name]"}
${phone ? "Phone: " + phone : ""} | ${email ? "Email: " + email : ""}

Return ONLY the complete cover letter text without markdown symbols (*), hashtags (#), or additional quotes.`;

        const result = await callGeminiAPI(promptText, "You are a professional career consultant.");
        state.outputLetter = result;
        renderLetterPreview();
        document.getElementById('quickActions').classList.remove('hidden');
        document.getElementById('letterActions').style.display = 'flex';
        
    } catch (error) {
        showError(error.message || 'Gagal menghubungi server.');
    } finally {
        state.isGeneratingLetter = false;
        loadingScreen.classList.add('hidden');
        previewContainer.classList.remove('hidden');
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-wand-magic-sparkles"></i> Buat Surat Lamaran';
    }
}

// ============================================
// RENDER LETTER PREVIEW
// ============================================
function renderLetterPreview() {
    const previewContainer = document.getElementById('letterPreview');
    if (state.viewMode === 'preview') {
        previewContainer.innerHTML = formatLetterHTML(state.outputLetter);
    } else {
        previewContainer.innerHTML = `<textarea class="editor-textarea" id="letterEditor">${state.outputLetter}</textarea>`;
        const editor = document.getElementById('letterEditor');
        editor.addEventListener('input', (e) => { state.outputLetter = e.target.value; });
    }
}

function formatLetterHTML(text) {
    if (!text) return '';
    const lines = text.split('\n');
    let html = '<div class="letter-content">';
    let i = 0;
    while (i < lines.length) {
        const line = lines[i];
        const trimmed = line.trim();
        if (trimmed.toLowerCase().includes('sincerely') || trimmed.toLowerCase().includes('hormat saya')) {
            html += `<div class="letter-signature"><p>${trimmed}</p>`;
            if (state.hasSignature && state.signatureDataUrl) {
                html += `<img src="${state.signatureDataUrl}" alt="Digital Signature" class="signature-image">`;
            } else {
                html += `<div class="signature-placeholder-box">(Tanda Tangan)</div>`;
            }
            html += `</div>`;
            while (i + 1 < lines.length && lines[i + 1].trim() === '') i++;
        } else if (trimmed === '') {
            html += '<div class="blank-line"></div>';
        } else {
            html += `<p class="letter-paragraph">${trimmed}</p>`;
        }
        i++;
    }
    html += '</div>';
    return html;
}

// ============================================
// VIEW MODE
// ============================================
function setViewMode(mode) {
    state.viewMode = mode;
    const viewBtns = document.querySelectorAll('.view-btn');
    viewBtns.forEach(btn => btn.classList.remove('active'));
    if (mode === 'preview') viewBtns[0].classList.add('active');
    else viewBtns[1].classList.add('active');
    if (state.outputLetter) renderLetterPreview();
}

// ============================================
// REFINE LETTER
// ============================================
async function refineLetter(instruction) {
    if (!state.outputLetter) return;
    state.isGeneratingLetter = true;
    showLoading(true);
    try {
        const promptText = `Here is a draft cover letter:\n"""\n${state.outputLetter}\n"""\n\nRefinement instruction: "${instruction}".\nMaintain professional cover letter structure. Return only the refined letter text.`;
        const result = await callGeminiAPI(promptText, "You are a professional editor.");
        state.outputLetter = result;
        renderLetterPreview();
    } catch (error) {
        showError(error.message || 'Gagal memperbarui surat.');
    } finally {
        state.isGeneratingLetter = false;
        showLoading(false);
    }
}

// ============================================
// COPY TO CLIPBOARD
// ============================================
function copyToClipboard() {
    if (!state.outputLetter) return;
    navigator.clipboard.writeText(state.outputLetter).then(() => {
        const copyBtn = document.querySelector('.copy-btn');
        copyBtn.innerHTML = '<i class="fas fa-check"></i> Tersalin!';
        setTimeout(() => { copyBtn.innerHTML = '<i class="fas fa-copy"></i> Salin'; }, 2000);
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
            if (line.toLowerCase().includes("sincerely") || line.toLowerCase().includes("hormat saya")) {
                if (cursorY + 45 > pageHeight - marginBottom) { doc.addPage(); cursorY = 25; }
                doc.text(line, marginLeft, cursorY);
                cursorY += 8;
                if (state.hasSignature && state.signatureDataUrl) {
                    doc.addImage(state.signatureDataUrl, "PNG", marginLeft, cursorY, 42, 18);
                    cursorY += 21;
                } else { cursorY += 16; }
                while (i + 1 < paragraphs.length && paragraphs[i + 1].trim() === "") i++;
                continue;
            }
            if (line === "") { cursorY += 4; continue; }
            const splitText = doc.splitTextToSize(line, maxLineWidth);
            for (let j = 0; j < splitText.length; j++) {
                if (cursorY + 7 > pageHeight - marginBottom) { doc.addPage(); cursorY = 25; }
                doc.text(splitText[j], marginLeft, cursorY);
                cursorY += 6;
            }
        }
        const company = document.getElementById('company').value || 'Lamaran';
        const safeFileName = company.replace(/[^a-zA-Z0-9]/g, "_");
        doc.save(`Surat_Lamaran_${safeFileName}.pdf`);
    } catch (error) {
        showError('Gagal membuat PDF: ' + error.message);
    }
}

// ============================================
// CV PREVIEW & DOWNLOAD (FIXED - TIDAK TERPOTONG)
// ============================================

function formatCVBullets(text) {
    if (!text) return '<li>Belum diisi</li>';
    const lines = text.split('\n').filter(line => line.trim() !== '');
    return lines.map(line => `<li>${line.replace(/^[\*\-]\s*/, '')}</li>`).join('');
}

function applyPreviewScale() {
    const container = document.getElementById('cvPdfPreviewContainer');
    if (!container) return;
    
    const windowWidth = window.innerWidth;
    let scale = 1;
    
    if (windowWidth < 500) {
        scale = 0.42;
    } else if (windowWidth < 900) {
        scale = 0.65;
    } else {
        scale = 1;
    }
    
    container.style.transform = `scale(${scale})`;
    container.style.transformOrigin = 'top center';
    container.style.marginBottom = `-${(1 - scale) * 50}%`;
}

function openCvPreview() {
    // Ambil data dari input form
    const name = document.getElementById('cv2Name').value || 'Nama Anda';
    const title = document.getElementById('cv2Title').value || 'Posisi / Spesialisasi';
    const address = document.getElementById('cv2Address').value;
    const phone = document.getElementById('cv2Phone').value;
    const email = document.getElementById('cv2Email').value;
    const summary = document.getElementById('cv2Summary').value || 'Ringkasan belum diisi';
    
    const job1Title = document.getElementById('cv2Job1Title').value;
    const job1Company = document.getElementById('cv2Job1Company').value;
    const job1Date = document.getElementById('cv2Job1Date').value;
    const job1Bullets = formatCVBullets(document.getElementById('cv2Job1Bullets').value);
    
    const job2Title = document.getElementById('cv2Job2Title').value;
    const job2Company = document.getElementById('cv2Job2Company').value;
    const job2Date = document.getElementById('cv2Job2Date').value;
    const job2Bullets = formatCVBullets(document.getElementById('cv2Job2Bullets').value);
    
    const eduDegree = document.getElementById('cv2EduDegree').value;
    const eduSchool = document.getElementById('cv2EduSchool').value;
    const eduDate = document.getElementById('cv2EduDate').value;
    const eduDetail = document.getElementById('cv2EduDetail').value;
    
    const hardSkills = document.getElementById('cv2HardSkills').value;
    const softSkills = document.getElementById('cv2SoftSkills').value;

    const cvHTML = `
        <div class="cv-paper">
            <div class="cv-header">
                <div class="cv-name">${name}</div>
                <div class="cv-title">${title}</div>
                <div class="cv-contact">
                    <span>📍 ${address}</span>
                    <span>📞 ${phone}</span>
                    <span>✉️ ${email}</span>
                </div>
            </div>
            
            <div class="cv-section-heading">Ringkasan Profesional</div>
            <p class="cv-text">${summary}</p>
            
            <div class="cv-section-heading">Pengalaman Kerja</div>
            <div class="job-item">
                <div class="job-header">
                    <span class="job-role">${job1Title}</span>
                    <span class="job-date">${job1Date}</span>
                </div>
                <div class="job-company">${job1Company}</div>
                <ul class="cv-bullets">${job1Bullets}</ul>
            </div>
            <div class="job-item">
                <div class="job-header">
                    <span class="job-role">${job2Title}</span>
                    <span class="job-date">${job2Date}</span>
                </div>
                <div class="job-company">${job2Company}</div>
                <ul class="cv-bullets">${job2Bullets}</ul>
            </div>
            
            <div class="cv-section-heading">Pendidikan</div>
            <div class="job-item">
                <div class="job-header">
                    <span class="job-role">${eduDegree}</span>
                    <span class="job-date">${eduDate}</span>
                </div>
                <div class="job-company">${eduSchool}</div>
                <div class="cv-text" style="margin-top:4px;">${eduDetail}</div>
            </div>
            
            <div class="cv-section-heading">Keahlian</div>
            <div class="skill-group"><strong>Hard Skills:</strong> ${hardSkills}</div>
            <div class="skill-group"><strong>Soft Skills:</strong> ${softSkills}</div>
        </div>
    `;

    const previewContainer = document.getElementById('cvPdfPreviewContainer');
    previewContainer.innerHTML = cvHTML;

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
                height: element.scrollHeight,
                windowWidth: element.scrollWidth
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

// Resize listener untuk menyesuaikan preview
window.addEventListener('resize', () => {
    const modal = document.getElementById('cvPdfModal');
    if (modal && modal.style.display === 'flex') {
        applyPreviewScale();
    }
});

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
                systemPrompt: "Anda adalah penulis CV profesional. Tugas Anda HANYA menulis teks hasil akhir sesuai permintaan. JANGAN memberikan tips, saran, pengantar, atau penjelasan. Langsung tulis hasilnya tanpa basa-basi."
            })
        });

        if (!response.ok) throw new Error('API Error');
        const data = await response.json();
        const cleanedText = data.content.replace(/\*\*/g, '').replace(/^#+\s*/gm, '');

        document.getElementById(inputId).value = cleanedText.trim();

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
    
    const prompt = `Buat ringkasan profil profesional untuk posisi "${title}" dalam Bahasa Indonesia. Langsung tulis hasilnya saja, JANGAN berikan tips, pengantar, atau penjelasan.

DATA:
Posisi: ${title}
Hard Skills: ${hard}
Soft Skills: ${soft}

FORMAT OUTPUT:
- Maksimal 3-4 kalimat
- Langsung ke poin
- Fokus pada keahlian dan nilai tambah
- Gunakan bahasa yang profesional dan menjual`;
    
    const button = document.querySelector('.form-section-title .btn-ai');
    callGeminiAPI_CV(prompt, button, 'cv2Summary');
}

function generateJob(jobIndex) {
    const title = document.getElementById(`cv2Job${jobIndex}Title`).value;
    const company = document.getElementById(`cv2Job${jobIndex}Company`).value;
    
    const prompt = `Buat 3 poin pencapaian kerja untuk posisi "${title}" di perusahaan "${company}" dalam Bahasa Indonesia. Langsung tulis hasilnya saja, JANGAN berikan tips, pengantar, atau penjelasan.

DATA:
Jabatan: ${title}
Perusahaan: ${company}

FORMAT OUTPUT:
- 3 poin terpisah (satu poin per baris)
- Setiap poin fokus pada hasil (impact) dan pencapaian
- Gunakan angka atau persentase untuk membuatnya lebih meyakinkan
- Jangan gunakan format markdown (**), bullet (-), atau angka urutan
- Contoh format: "Meningkatkan penjualan sebesar 30% dalam 6 bulan pertama"`;
    
    const button = document.querySelector(`.form-section-title:nth-of-type(${jobIndex + 3}) .btn-ai`);
    callGeminiAPI_CV(prompt, button, `cv2Job${jobIndex}Bullets`);
}

// ============================================
// UTILITY FUNCTIONS
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
// AUTO-SAVE LOCALSTORAGE
// ============================================
function initLocalStorage() {
    const savedData = localStorage.getItem('elevatecv_data_v2');
    if (savedData) {
        try {
            const parsed = JSON.parse(savedData);
            if (parsed.name) document.getElementById('name').value = parsed.name;
            if (parsed.location) document.getElementById('location').value = parsed.location;
            if (parsed.phone) document.getElementById('phone').value = parsed.phone;
            if (parsed.email) document.getElementById('email').value = parsed.email;
            if (parsed.company) document.getElementById('company').value = parsed.company;
            if (parsed.companyAddress) document.getElementById('companyAddress').value = parsed.companyAddress;
            if (parsed.jobTitle) document.getElementById('jobTitle').value = parsed.jobTitle;
            if (parsed.jobDescription) document.getElementById('jobDescription').value = parsed.jobDescription;
            if (parsed.experience) document.getElementById('experience').value = parsed.experience;
        } catch (e) { console.error('Gagal memuat local storage'); }
    }
    const inputs = ['name', 'location', 'phone', 'email', 'company', 'companyAddress', 'jobTitle', 'jobDescription', 'experience'];
    inputs.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.addEventListener('input', saveToLocalStorage);
    });
}

function saveToLocalStorage() {
    const dataToSave = {
        name: document.getElementById('name').value,
        location: document.getElementById('location').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        company: document.getElementById('company').value,
        companyAddress: document.getElementById('companyAddress').value,
        jobTitle: document.getElementById('jobTitle').value,
        jobDescription: document.getElementById('jobDescription').value,
        experience: document.getElementById('experience').value
    };
    localStorage.setItem('elevatecv_data_v2', JSON.stringify(dataToSave));
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
});