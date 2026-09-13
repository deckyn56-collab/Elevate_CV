// @ts-nocheck
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
    error: '',
    mergeFiles: []
};

// ============================================
// TRANSLATIONS
// ============================================
const translations = {
    id: {
        badge: "Selesai dalam 30 Detik",
        tagline: "30 Detik Jadi! Surat Lamaran, CV Profesional & Merge PDF di Satu Platform.",
        tabCoverTitle: "Lamaran",
tabCVTitle: "CV",
tabMergeTitle: "Gabung PDF",
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
        download: "Unduh PDF",
        downloadPdf: "Unduh PDF",
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
        mergeTitle: "Gabung PDF & Gambar",
        mergeBadge: "Merge Tool",
        mergeInfo: "Upload beberapa file PDF atau gambar, atur urutannya, lalu gabungkan menjadi satu file PDF.",
        mergeUploadTitle: "Klik untuk upload file",
        mergeUploadDesc: "Format: PDF, JPG, PNG (maks. 10MB per file)",
        addMoreFiles: "Tambah File",
        fileList: "Daftar File",
        mergeHint: "💡 Drag untuk mengubah urutan file",
        mergeBtn: "Gabungkan Jadi PDF",
        clearAll: "Hapus Semua",
        mergeProcessing: "Sedang menggabungkan...",
        mergeSuccess: "Berhasil! PDF telah diunduh.",
        mergeError: "Gagal menggabungkan file.",
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
        cvEduDegreePlaceholder: "Jenjang / Jurusan (contoh: SMA IPA, D3 Akuntansi, S1 Teknik Informatika)",
        cvEduSchoolPlaceholder: "Institusi / Sekolah (contoh: SMK Negeri 1, Universitas Indonesia)",
        cvEduDatePlaceholder: "Periode",
        cvEduDetailPlaceholder: "Detail (IPK, dll)",
        seoTitle: "LamaranAI - Solusi Karir Online",
        seoDesc: "LamaranAI adalah platform gratis untuk membantu Anda membuat surat lamaran kerja yang profesional dan CV yang menarik.",
        seoFeature1Title: "Surat Lamaran Profesional",
        seoFeature1Desc: "Generator surat lamaran kerja yang profesional dan personal",
        seoFeature2Title: "CV Ramah ATS",
        seoFeature2Desc: "Template CV modern yang mudah dibaca mesin ATS",
        seoFeature3Title: "Gabung PDF",
        seoFeature3Desc: "Gabungkan PDF dan gambar jadi satu file",
        seoFeature4Title: "Export PDF",
        seoFeature4Desc: "Unduh hasil dalam format PDF siap kirim",
        popular: "Populer:"
    },
    en: {
        badge: "Ready in 30 Seconds",
        tagline: "Ready in 30 Seconds! Cover Letters, Professional CVs & PDF Merge in One Platform.",
        tabCoverTitle: "Cover Letter",
tabCVTitle: "Professional CV",
tabMergeTitle: "Merge PDF",
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
        download: "Download PDF",
        downloadPdf: "Download PDF",
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
        mergeTitle: "Merge PDF & Images",
        mergeBadge: "Merge Tool",
        mergeInfo: "Upload multiple PDF or image files, arrange the order, and merge them into one PDF.",
        mergeUploadTitle: "Click to upload files",
        mergeUploadDesc: "Format: PDF, JPG, PNG (max. 10MB per file)",
        addMoreFiles: "Add More Files",
        fileList: "File List",
        mergeHint: "💡 Drag to reorder files",
        mergeBtn: "Merge into PDF",
        clearAll: "Clear All",
        mergeProcessing: "Merging...",
        mergeSuccess: "Success! PDF downloaded.",
        mergeError: "Failed to merge files.",
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
        cvEduDegreePlaceholder: "Level / Major (e.g., High School, D3 Accounting, Bachelor of IT)",
        cvEduSchoolPlaceholder: "Institution / School (e.g., SMK Negeri 1, University of Indonesia)",
        cvEduDatePlaceholder: "Period",
        cvEduDetailPlaceholder: "Detail (GPA, etc)",
        seoTitle: "LamaranAI - Online Career Solution",
        seoDesc: "LamaranAI is a free platform to help you create professional cover letters and attractive CVs.",
        seoFeature1Title: "Professional Cover Letter",
        seoFeature1Desc: "Professional and personal cover letter generator",
        seoFeature2Title: "ATS-Friendly CV",
        seoFeature2Desc: "Modern CV template that is easy for ATS to read",
        seoFeature3Title: "Merge PDF",
        seoFeature3Desc: "Combine PDF and images into one file",
        seoFeature4Title: "PDF Export",
        seoFeature4Desc: "Download results in ready-to-send PDF format",
        popular: "Popular:"
    }
};

// ============================================
// LANGUAGE SETTINGS
// ============================================
function setLanguage(lang) {
    state.currentLang = lang;
    
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.includes(lang.toUpperCase())) {
            btn.classList.add('active');
        }
    });
    
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
    
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        if (translations[lang][key]) {
            element.placeholder = translations[lang][key];
        }
    });
    
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
// TAB NAVIGATION
// ============================================
function switchTab(tabId) {
    state.activeTab = tabId;
    
    document.querySelectorAll('.tab-button').forEach(btn => {
        const isActive = btn.dataset.tab === tabId;
        const iconSpan = btn.querySelector('span:first-child');
        const titleSpan = btn.querySelector('span:last-child');
        
        if (isActive) {
            // Style tab AKTIF
            btn.style.background = 'linear-gradient(135deg, #ca8a04, #d97706)';
            btn.style.color = '#ffffff';
            btn.style.fontWeight = '700';
            if (iconSpan) {
                iconSpan.style.background = 'rgba(255,255,255,0.25)';
                iconSpan.style.color = '#ffffff';
            }
            btn.classList.add('active');
        } else {
            // Style tab TIDAK AKTIF
            btn.style.background = 'transparent';
            btn.style.color = 'var(--text-secondary)';
            btn.style.fontWeight = '600';
            if (iconSpan) {
                iconSpan.style.background = 'var(--bg-secondary)';
                iconSpan.style.color = 'var(--text-secondary)';
            }
            btn.classList.remove('active');
        }
    });
    
    document.querySelectorAll('.tab-content').forEach(content => content.classList.add('hidden'));
    const tabContent = document.getElementById(tabId);
    if (tabContent) tabContent.classList.remove('hidden');
    
    if (tabId === 'merge-pdf') {
        detectAndroidAndShowGuide();
    }
}

// ============================================
// ERROR HANDLING
// ============================================
function showError(message) {
    state.error = message;
    const errorBox = document.getElementById('errorBox');
    const errorText = document.getElementById('errorText');
    errorText.innerHTML = '<i class="fas fa-exclamation-triangle"></i> ' + message;
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
    if (isDrawing && canvas) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        let hasContent = false;
        for (let i = 3; i < data.length; i += 4) {
            if (data[i] > 0) { hasContent = true; break; }
        }
        if (hasContent) {
            state.signatureDataUrl = canvas.toDataURL('image/png');
        }
    }
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
// API CALL
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
        const useIndonesian = state.currentLang === 'id';

        const promptText = 'You are a professional career consultant. Write an elegant, convincing cover letter. ' + langInstruction + '.\n\n' +
            'APPLICANT DATA:\n' +
            'Name: ' + (name || "[Your Name]") + '\n' +
            'Location: ' + (location || "[Your City]") + '\n' +
            'Phone: ' + (phone || "[Phone Number]") + '\n' +
            'Email: ' + (email || "[Your Email]") + '\n\n' +
            'COMPANY DATA:\n' +
            'Company: ' + company + '\n' +
            'Company Address: ' + (companyAddress || "[Company Address]") + '\n' +
            'Position Applied: ' + jobTitle + '\n\n' +
            'TONE: ' + tone + '\n' +
            'JOB DESCRIPTION: ' + (jobDescription || "Highly relevant to standard qualifications for this position.") + '\n' +
            'CV EXPERIENCE: ' + (experience || "Mention high motivation, enthusiasm, and quick adaptability.") + '\n\n' +
            'FORMAT REQUIREMENTS:\n' +
            (location || "[City]") + ', ' + today + '\n\n' +
            (useIndonesian ? 'Hal: Lamaran Pekerjaan - ' : 'Subject: Job Application - ') + jobTitle + '\n\n' +
            (useIndonesian ? 'Yth. Hiring Manager / HRD Team\n' : 'Dear Hiring Manager / HRD Team\n') +
            company + '\n' +
            (companyAddress || "") + '\n\n' +
            (useIndonesian ? 'Dengan hormat,\n' : 'Dear Sir/Madam,\n') +
            (useIndonesian ? '[Tulis surat lamaran dalam 3-4 paragraf persuasif...]\n\n' : '[Write cover letter in 3-4 persuasive paragraphs...]\n\n') +
            (useIndonesian ? 'Hormat saya,\n\n' : 'Sincerely,\n\n') +
            (name || "[Your Name]") + '\n' +
            (phone ? "Phone: " + phone : "") + ' | ' + (email ? "Email: " + email : "") + '\n\n' +
            'IMPORTANT RULES:\n' +
            '- Return ONLY the cover letter text\n' +
            '- Do NOT use markdown symbols, hashtags, or quotes\n' +
            '- Do NOT add extra hyphens in compound words\n' +
            '- Use proper spacing between words\n' +
            '- No extra characters or symbols';

        const result = await callGeminiAPI(promptText, "You are a professional career consultant.");
        state.outputLetter = result;
        renderLetterPreview();
        document.getElementById('quickActions').classList.remove('hidden');
        document.getElementById('letterActions').style.display = 'flex';
        document.getElementById('letterDownloadSection').style.display = 'block';
        
    } catch (error) {
        showError(error.message || 'Gagal menghubungi server.');
    } finally {
        state.isGeneratingLetter = false;
        loadingScreen.classList.add('hidden');
        previewContainer.classList.remove('hidden');
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-wand-magic-sparkles"></i> ' + translations[state.currentLang].generateBtn;
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
        previewContainer.innerHTML = '<textarea class="editor-textarea" id="letterEditor">' + state.outputLetter + '</textarea>';
        const editor = document.getElementById('letterEditor');
        editor.addEventListener('input', (e) => { state.outputLetter = e.target.value; });
    }
}

function formatLetterHTML(text) {
    if (!text) return '';
    
    const cleanText = text
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n')
        .replace(/[\u200B-\u200D\uFEFF]/g, '')
        .replace(/\u00A0/g, ' ')
        .replace(/ {2,}/g, ' ')
        .trim();
    
    const lines = cleanText.split('\n');
    let html = '<div class="letter-content">';
    let i = 0;
    
    while (i < lines.length) {
        const line = lines[i];
        const trimmed = line.trim();
        const lowerLine = trimmed.toLowerCase();
        
        if (lowerLine.includes('sincerely') || lowerLine.includes('hormat saya')) {
            html += '<div class="letter-signature"><p>' + trimmed + '</p>';
            if (state.hasSignature && state.signatureDataUrl) {
                html += '<img src="' + state.signatureDataUrl + '" alt="Digital Signature" class="signature-image">';
            } else {
                html += '<div class="signature-placeholder-box">(' + translations[state.currentLang].signHere + ')</div>';
            }
            html += '</div>';
            while (i + 1 < lines.length && lines[i + 1].trim() === '') i++;
        } else if (trimmed === '') {
            html += '<div class="blank-line"></div>';
        } else {
            html += '<p class="letter-paragraph">' + trimmed + '</p>';
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
        const promptText = 'Here is a draft cover letter:\n"""\n' + state.outputLetter + '\n"""\n\nRefinement instruction: "' + instruction + '".\nMaintain professional cover letter structure. Return only the refined letter text.';
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
        setTimeout(() => { copyBtn.innerHTML = '<i class="fas fa-copy"></i> ' + translations[state.currentLang].copy; }, 2000);
    });
}

// ============================================
// EXPORT PDF SURAT
// ============================================
async function exportPDF() {
    if (!state.outputLetter) {
        alert('Belum ada surat lamaran untuk diunduh.');
        return;
    }
    
    try {
        if (!window.jspdf) {
            await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
        }
        
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ unit: "mm", format: "a4" });
        
        const marginLeft = 20;
        const marginTop = 20;
        const pageHeight = 297;
        const pageWidth = 210;
        const marginBottom = 20;
        const maxLineWidth = pageWidth - (marginLeft * 2);
        
        let cursorY = marginTop;
        
        doc.setFont("times", "normal");
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        
        let cleanText = state.outputLetter
            .replace(/\r\n/g, '\n')
            .replace(/\r/g, '\n')
            .replace(/[\u200B-\u200D\uFEFF]/g, '')
            .replace(/\u00A0/g, ' ')
            .trim();
        
        const paragraphs = cleanText.split("\n");
        
        for (let i = 0; i < paragraphs.length; i++) {
            let line = paragraphs[i].trim();
            const lowerLine = line.toLowerCase();
            
            if (lowerLine.includes("sincerely") || lowerLine.includes("hormat saya")) {
                if (cursorY + 50 > pageHeight - marginBottom) {
                    doc.addPage();
                    cursorY = marginTop;
                }
                doc.text(line, marginLeft, cursorY);
                cursorY += 10;
                
                if (state.hasSignature && state.signatureDataUrl) {
                    try {
                        doc.addImage(state.signatureDataUrl, "PNG", marginLeft, cursorY, 45, 20);
                        cursorY += 23;
                    } catch (e) {
                        console.error('Gagal menambahkan tanda tangan:', e);
                        cursorY += 20;
                    }
                } else {
                    cursorY += 20;
                }
                
                while (i + 1 < paragraphs.length && paragraphs[i + 1].trim() === "") i++;
                continue;
            }
            
            if (line === "") {
                cursorY += 5;
                continue;
            }
            
            if (cursorY + 8 > pageHeight - marginBottom) {
                doc.addPage();
                cursorY = marginTop;
            }
            
            const splitText = doc.splitTextToSize(line, maxLineWidth);
            for (let j = 0; j < splitText.length; j++) {
                if (cursorY + 7 > pageHeight - marginBottom) {
                    doc.addPage();
                    cursorY = marginTop;
                }
                doc.text(splitText[j], marginLeft, cursorY);
                cursorY += 6;
            }
        }
        
        const company = document.getElementById('company').value || 'Lamaran';
        const safeFileName = company.replace(/[^a-zA-Z0-9]/g, "_");
        doc.save('Surat_Lamaran_' + safeFileName + '.pdf');
        
    } catch (error) {
        console.error('PDF Error:', error);
        showError('Gagal membuat PDF: ' + error.message);
    }
}

// ============================================
// CV PREVIEW & DOWNLOAD
// ============================================

function formatCVBullets(text) {
    if (!text || !text.trim()) return '';
    const lines = text.split('\n')
        .filter(line => {
            const trimmed = line.trim();
            return trimmed !== '' && 
                   trimmed.toLowerCase() !== 'belum diisi' && 
                   trimmed.toLowerCase() !== 'not filled yet';
        });
    if (lines.length === 0) return '';
    return lines.map(line => '<li>' + line.replace(/^[\*\-]\s*/, '') + '</li>').join('');
}

function applyPreviewScale() {
    const container = document.getElementById('cvPdfPreviewContainer');
    if (!container) return;
    
    const windowWidth = window.innerWidth;
    let scale = 1;
    
    if (windowWidth < 500) scale = 0.42;
    else if (windowWidth < 900) scale = 0.65;
    else scale = 1;
    
    container.style.transform = 'scale(' + scale + ')';
    container.style.transformOrigin = 'top center';
    container.style.marginBottom = '-' + ((1 - scale) * 50) + '%';
}

function openCvPreview() {
    const getValue = (id, fallback = '') => {
        const val = document.getElementById(id).value.trim();
        return val || fallback;
    };

    const name = getValue('cv2Name', 'Nama Anda');
    const title = getValue('cv2Title', 'Posisi / Spesialisasi');
    const address = getValue('cv2Address');
    const phone = getValue('cv2Phone');
    const email = getValue('cv2Email');
    const summary = getValue('cv2Summary', 'Ringkasan belum diisi');
    
    const job1Title = getValue('cv2Job1Title');
    const job1Company = getValue('cv2Job1Company');
    const job1Date = getValue('cv2Job1Date');
    const job1BulletsRaw = getValue('cv2Job1Bullets');
    const job1Bullets = formatCVBullets(job1BulletsRaw);
    
    const job2Title = getValue('cv2Job2Title');
    const job2Company = getValue('cv2Job2Company');
    const job2Date = getValue('cv2Job2Date');
    const job2BulletsRaw = getValue('cv2Job2Bullets');
    const job2Bullets = formatCVBullets(job2BulletsRaw);
    
    const eduDegree = getValue('cv2EduDegree');
    const eduSchool = getValue('cv2EduSchool');
    const eduDate = getValue('cv2EduDate');
    const eduDetail = getValue('cv2EduDetail');
    
    const hardSkills = getValue('cv2HardSkills');
    const softSkills = getValue('cv2SoftSkills');

    const ICON_COLOR = '#4b5563';

    const iconPin = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="' + ICON_COLOR + '" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:5px;display:inline-block;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>';
    
    const iconPhone = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="' + ICON_COLOR + '" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:5px;display:inline-block;"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>';
    
    const iconMail = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="' + ICON_COLOR + '" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:5px;display:inline-block;"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>';
    
    const iconBadge = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="' + ICON_COLOR + '" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:6px;display:inline-block;"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>';
    
    const iconUser = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="' + ICON_COLOR + '" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:6px;display:inline-block;"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>';
    
    const iconBriefcase = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="' + ICON_COLOR + '" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:6px;display:inline-block;"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>';
    
    const iconGraduation = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="' + ICON_COLOR + '" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:6px;display:inline-block;"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>';
    
    const iconStar = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="' + ICON_COLOR + '" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:6px;display:inline-block;"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>';

    let experienceHTML = '';
    if (job1Title || job2Title) {
        experienceHTML = '<div class="cv-section-heading">' + iconBriefcase + ' PENGALAMAN KERJA</div>';
        if (job1Title) {
            experienceHTML += '<div class="job-item"><div class="job-header"><span class="job-role">' + job1Title + '</span><span class="job-date">' + job1Date + '</span></div>' + (job1Company ? '<div class="job-company">' + job1Company + '</div>' : '') + (job1BulletsRaw ? '<ul class="cv-bullets">' + job1Bullets + '</ul>' : '') + '</div>';
        }
        if (job2Title) {
            experienceHTML += '<div class="job-item"><div class="job-header"><span class="job-role">' + job2Title + '</span><span class="job-date">' + job2Date + '</span></div>' + (job2Company ? '<div class="job-company">' + job2Company + '</div>' : '') + (job2BulletsRaw ? '<ul class="cv-bullets">' + job2Bullets + '</ul>' : '') + '</div>';
        }
    }

    let educationHTML = '';
    if (eduDegree || eduSchool) {
        educationHTML = '<div class="cv-section-heading">' + iconGraduation + ' PENDIDIKAN</div>' +
            '<div class="job-item"><div class="job-header"><span class="job-role">' + eduDegree + '</span><span class="job-date">' + eduDate + '</span></div>' + (eduSchool ? '<div class="job-company">' + eduSchool + '</div>' : '') + (eduDetail ? '<div class="cv-text" style="margin-top:4px;">' + eduDetail + '</div>' : '') + '</div>';
    }

    let skillsHTML = '';
    if (hardSkills || softSkills) {
        skillsHTML = '<div class="cv-section-heading">' + iconStar + ' KEAHLIAN</div>';
        if (hardSkills) skillsHTML += '<div class="skill-group"><strong>Hard Skills:</strong> ' + hardSkills + '</div>';
        if (softSkills) skillsHTML += '<div class="skill-group"><strong>Soft Skills:</strong> ' + softSkills + '</div>';
    }

    const cvHTML = '<div class="cv-paper">' +
        '<div class="cv-header">' +
            '<div class="cv-name">' + name + '</div>' +
            '<div class="cv-title">' + iconBadge + ' ' + title + '</div>' +
            '<div class="cv-contact">' +
                (address ? '<span>' + iconPin + ' ' + address + '</span>' : '') +
                (phone ? '<span>' + iconPhone + ' ' + phone + '</span>' : '') +
                (email ? '<span>' + iconMail + ' ' + email + '</span>' : '') +
            '</div>' +
        '</div>' +
        (summary ? '<div class="cv-section-heading">' + iconUser + ' RINGKASAN PROFESIONAL</div><p class="cv-text">' + summary + '</p>' : '') +
        experienceHTML +
        educationHTML +
        skillsHTML +
        '</div>';

    const previewContainer = document.getElementById('cvPdfPreviewContainer');
    previewContainer.innerHTML = cvHTML;

    document.getElementById('cvPdfModal').style.display = 'flex';
    
    applyPreviewScale();

    document.getElementById('btnDownloadCvPdf').disabled = false;
    document.getElementById('btnDownloadCvPdf').innerHTML = '<i class="fas fa-cloud-arrow-down"></i> ' + translations[state.currentLang].downloadNow;
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
        const originalTransform = container.style.transform;
        const originalMargin = container.style.marginBottom;
        
        container.style.transform = 'none';
        container.style.marginBottom = '0';
        
        if (typeof html2pdf === 'undefined') {
            await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js');
        }

        const clone = element.cloneNode(true);
        clone.style.transform = 'none';
        clone.style.margin = '0';
        clone.style.boxShadow = 'none';
        
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'fixed';
        tempContainer.style.left = '-9999px';
        tempContainer.style.top = '0';
        tempContainer.style.width = '210mm';
        tempContainer.style.background = 'white';
        tempContainer.appendChild(clone);
        document.body.appendChild(tempContainer);

        const opt = {
            margin: 0,
            filename: filename,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { 
                scale: 2, 
                useCORS: true, 
                logging: false,
                letterRendering: true,
                width: 794,
                height: clone.scrollHeight,
                windowWidth: 794,
                scrollX: 0,
                scrollY: 0
            },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        };

        await html2pdf().set(opt).from(clone).save();
        
        document.body.removeChild(tempContainer);
        
        container.style.transform = originalTransform;
        container.style.marginBottom = originalMargin;
        
    } catch (error) {
        console.error('PDF Error:', error);
        alert('Gagal membuat PDF: ' + error.message);
    } finally {
        applyPreviewScale();
        downloadBtn.disabled = false;
        downloadBtn.innerHTML = '<i class="fas fa-cloud-arrow-down"></i> ' + translations[state.currentLang].downloadNow;
    }
}

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
    
    const prompt = 'Buat ringkasan profil profesional untuk posisi "' + title + '" dalam Bahasa Indonesia. Langsung tulis hasilnya saja, JANGAN berikan tips, pengantar, atau penjelasan.\n\n' +
        'DATA:\nPosisi: ' + title + '\nHard Skills: ' + hard + '\nSoft Skills: ' + soft + '\n\n' +
        'FORMAT OUTPUT:\n- Maksimal 3-4 kalimat\n- Langsung ke poin\n- Fokus pada keahlian dan nilai tambah\n- Gunakan bahasa yang profesional dan menjual';
    
    const button = document.querySelector('.form-section-title .btn-ai');
    callGeminiAPI_CV(prompt, button, 'cv2Summary');
}

function generateJob(jobIndex) {
    const title = document.getElementById('cv2Job' + jobIndex + 'Title').value;
    const company = document.getElementById('cv2Job' + jobIndex + 'Company').value;
    
    const prompt = 'Buat 3 poin pencapaian kerja untuk posisi "' + title + '" di perusahaan "' + company + '" dalam Bahasa Indonesia. Langsung tulis hasilnya saja, JANGAN berikan tips, pengantar, atau penjelasan.\n\n' +
        'DATA:\nJabatan: ' + title + '\nPerusahaan: ' + company + '\n\n' +
        'FORMAT OUTPUT:\n- 3 poin terpisah (satu poin per baris)\n- Setiap poin fokus pada hasil (impact) dan pencapaian\n- Gunakan angka atau persentase\n- Jangan gunakan format markdown, bullet, atau angka urutan';
    
    const button = document.querySelector('.form-section-title:nth-of-type(' + (jobIndex + 3) + ') .btn-ai');
    callGeminiAPI_CV(prompt, button, 'cv2Job' + jobIndex + 'Bullets');
}

// ============================================
// MERGE PDF & GAMBAR
// ============================================

function handleMergeFiles(event) {
    const files = Array.from(event.target.files);
    const maxSize = 10 * 1024 * 1024;
    
    files.forEach(file => {
        const fileName = file.name.toLowerCase();
        const isPDF = file.type === 'application/pdf' || fileName.endsWith('.pdf');
        const isImage = file.type.startsWith('image/') || 
                        fileName.endsWith('.jpg') || 
                        fileName.endsWith('.jpeg') || 
                        fileName.endsWith('.png') || 
                        fileName.endsWith('.webp') ||
                        fileName.endsWith('.gif');
        
        if (!isPDF && !isImage) {
            showError('Format file tidak didukung: ' + file.name + '. Hanya PDF, JPG, PNG.');
            return;
        }
        
        if (file.size > maxSize) {
            showError('File terlalu besar: ' + file.name + ' (maks 10MB)');
            return;
        }
        
        const isDuplicate = state.mergeFiles.some(f => 
            f.file.name === file.name && f.file.size === file.size
        );
        if (isDuplicate) {
            showError('File sudah ada: ' + file.name);
            return;
        }
        
        state.mergeFiles.push({
            file: file,
            id: 'file_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            type: isPDF ? 'pdf' : 'image'
        });
    });
    
    renderMergeFiles();
    event.target.value = '';
}

function renderMergeFiles() {
    const container = document.getElementById('mergeFilesContainer');
    const fileList = document.getElementById('mergeFileList');
    const actionSection = document.getElementById('mergeActionSection');
    const fileCount = document.getElementById('fileCount');
    
    if (state.mergeFiles.length === 0) {
        fileList.classList.add('hidden');
        actionSection.classList.add('hidden');
        container.innerHTML = '';
        return;
    }
    
    fileList.classList.remove('hidden');
    actionSection.classList.remove('hidden');
    fileCount.textContent = state.mergeFiles.length;
    
    container.innerHTML = '';
    
    state.mergeFiles.forEach((item, index) => {
        const fileDiv = document.createElement('div');
        fileDiv.className = 'merge-file-item';
        fileDiv.draggable = true;
        fileDiv.dataset.index = index;
        
        const icon = item.type === 'pdf' ? 'fa-file-pdf' : 'fa-file-image';
        const iconColor = item.type === 'pdf' ? '#ef4444' : '#3b82f6';
        const size = (item.file.size / 1024).toFixed(0);
        
        fileDiv.innerHTML = 
            '<div class="merge-file-drag"><i class="fas fa-grip-vertical"></i></div>' +
            '<div class="merge-file-number">' + (index + 1) + '</div>' +
            '<div class="merge-file-icon" style="color: ' + iconColor + ';"><i class="fas ' + icon + '"></i></div>' +
            '<div class="merge-file-info">' +
                '<div class="merge-file-name">' + item.file.name + '</div>' +
                '<div class="merge-file-size">' + size + ' KB · ' + item.type.toUpperCase() + '</div>' +
            '</div>' +
            '<button class="merge-file-remove" onclick="removeMergeFile(\'' + item.id + '\')" title="Hapus">' +
                '<i class="fas fa-times"></i>' +
            '</button>';
        
        fileDiv.addEventListener('dragstart', handleDragStart);
        fileDiv.addEventListener('dragover', handleDragOver);
        fileDiv.addEventListener('drop', handleDrop);
        fileDiv.addEventListener('dragend', handleDragEnd);
        
        container.appendChild(fileDiv);
    });
}

function removeMergeFile(id) {
    state.mergeFiles = state.mergeFiles.filter(f => f.id !== id);
    renderMergeFiles();
}

function clearMergeFiles() {
    if (state.mergeFiles.length === 0) return;
    if (!confirm('Hapus semua file?')) return;
    state.mergeFiles = [];
    renderMergeFiles();
}

let dragSrcIndex = null;

function handleDragStart(e) {
    dragSrcIndex = parseInt(e.currentTarget.dataset.index);
    e.currentTarget.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const dropIndex = parseInt(e.currentTarget.dataset.index);
    if (dragSrcIndex === null || dragSrcIndex === dropIndex) return;
    
    const movedItem = state.mergeFiles.splice(dragSrcIndex, 1)[0];
    state.mergeFiles.splice(dropIndex, 0, movedItem);
    
    dragSrcIndex = null;
    renderMergeFiles();
}

function handleDragEnd(e) {
    e.currentTarget.classList.remove('dragging');
}

// ============================================
// FUNGSI BACA FILE — MULTI-FALLBACK UNTUK HP ANDROID
// ============================================
async function readFileAsArrayBufferRobust(file) {
    // Metode 1: FileReader.readAsArrayBuffer()
    try {
        const result = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = () => reject(new Error('readAsArrayBuffer gagal'));
            reader.readAsArrayBuffer(file);
        });
        if (result && result.byteLength > 0) {
            return result;
        }
    } catch (e) {
        console.warn('⚠️ Metode 1 gagal:', e.message);
    }

    // Metode 2: FileReader.readAsDataURL() → konversi base64
    try {
        const dataUrl = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = () => reject(new Error('readAsDataURL gagal'));
            reader.readAsDataURL(file);
        });
        
        const base64 = dataUrl.split(',')[1];
        const binaryString = atob(base64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        if (bytes.byteLength > 0) {
            return bytes.buffer;
        }
    } catch (e) {
        console.warn('⚠️ Metode 2 gagal:', e.message);
    }

    // Metode 3: File.stream()
    try {
        if (file.stream) {
            const reader = file.stream().getReader();
            const chunks = [];
            let totalLength = 0;
            
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                chunks.push(value);
                totalLength += value.length;
            }
            
            const combined = new Uint8Array(totalLength);
            let offset = 0;
            for (const chunk of chunks) {
                combined.set(chunk, offset);
                offset += chunk.length;
            }
            if (combined.byteLength > 0) {
                return combined.buffer;
            }
        }
    } catch (e) {
        console.warn('⚠️ Metode 3 gagal:', e.message);
    }

    throw new Error('Semua metode baca file gagal. Coba pindahkan file ke folder Documents atau gunakan browser lain.');
}

function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = () => reject(new Error('Gagal baca file'));
        reader.readAsDataURL(file);
    });
}

function getImageDimensions(dataUrl) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve({ width: img.width, height: img.height });
        img.onerror = () => reject(new Error('Gagal load gambar'));
        img.src = dataUrl;
    });
}

// ============================================
// MERGE UTAMA
// ============================================
async function mergeAllFiles() {
    if (state.mergeFiles.length === 0) {
        showError('Belum ada file untuk digabungkan.');
        return;
    }
    
    const btn = document.getElementById('btnMergePdf');
    const originalHTML = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menggabungkan...';
    
    try {
        // Load jsPDF
        if (!window.jspdf) {
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memuat jsPDF...';
            await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
        }
        
        // Load PDF.js (dengan fallback CDN)
        if (typeof pdfjsLib === 'undefined') {
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memuat PDF.js...';
            try {
                await loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js');
            } catch (e) {
                await loadScript('https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.min.js');
            }
        }
        
        if (typeof pdfjsLib !== 'undefined') {
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        }
        
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait', compress: true });
        
        const pageWidth = 210;
        const pageHeight = 297;
        const margin = 10;
        
        let isFirstPage = true;
        let successCount = 0;
        let failedFiles = [];
        let readErrors = 0;
        
        for (let i = 0; i < state.mergeFiles.length; i++) {
            const item = state.mergeFiles[i];
            
            try {
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses ' + (i + 1) + '/' + state.mergeFiles.length + '...';
                
                if (item.type === 'pdf') {
                    const arrayBuffer = await readFileAsArrayBufferRobust(item.file);
                    
                    if (arrayBuffer.byteLength < 10) {
                        throw new Error('File kosong atau tidak lengkap');
                    }
                    
                    const headerBytes = new Uint8Array(arrayBuffer.slice(0, 5));
                    const header = String.fromCharCode.apply(null, headerBytes);
                    
                    if (!header.startsWith('%PDF-')) {
                        throw new Error('Bukan file PDF valid');
                    }
                    
                    const uint8Array = new Uint8Array(arrayBuffer);
                    
                    const loadingTask = pdfjsLib.getDocument({
                        data: uint8Array,
                        disableAutoFetch: true,
                        disableStream: true,
                        disableRange: true,
                        useWorkerFetch: false,
                        isEvalSupported: false
                    });
                    
                    const pdf = await loadingTask.promise;
                    const numPages = pdf.numPages;
                    
                    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
                        const page = await pdf.getPage(pageNum);
                        const viewport = page.getViewport({ scale: 2 });
                        
                        const canvas = document.createElement('canvas');
                        canvas.width = viewport.width;
                        canvas.height = viewport.height;
                        const context = canvas.getContext('2d');
                        
                        context.fillStyle = '#ffffff';
                        context.fillRect(0, 0, canvas.width, canvas.height);
                        
                        await page.render({
                            canvasContext: context,
                            viewport: viewport
                        }).promise;
                        
                        const imgData = canvas.toDataURL('image/jpeg', 0.92);
                        
                        const imgWidth = pageWidth - (margin * 2);
                        const imgHeight = (viewport.height / viewport.width) * imgWidth;
                        
                        if (!isFirstPage) doc.addPage();
                        isFirstPage = false;
                        
                        if (imgHeight > pageHeight - (margin * 2)) {
                            const ratio = (pageHeight - (margin * 2)) / imgHeight;
                            const scaledWidth = imgWidth * ratio;
                            const scaledHeight = imgHeight * ratio;
                            const x = (pageWidth - scaledWidth) / 2;
                            doc.addImage(imgData, 'JPEG', x, margin, scaledWidth, scaledHeight);
                        } else {
                            doc.addImage(imgData, 'JPEG', margin, margin, imgWidth, imgHeight);
                        }
                    }
                    
                    successCount++;
                    
                } else {
                    const imgData = await readFileAsDataUrl(item.file);
                    const dims = await getImageDimensions(imgData);
                    
                    const imgWidth = pageWidth - (margin * 2);
                    const imgHeight = (dims.height / dims.width) * imgWidth;
                    
                    if (!isFirstPage) doc.addPage();
                    isFirstPage = false;
                    
                    if (imgHeight > pageHeight - (margin * 2)) {
                        const ratio = (pageHeight - (margin * 2)) / imgHeight;
                        const scaledWidth = imgWidth * ratio;
                        const scaledHeight = imgHeight * ratio;
                        const x = (pageWidth - scaledWidth) / 2;
                        doc.addImage(imgData, 'JPEG', x, margin, scaledWidth, scaledHeight);
                    } else {
                        doc.addImage(imgData, 'JPEG', margin, margin, imgWidth, imgHeight);
                    }
                    
                    successCount++;
                }
                
            } catch (fileError) {
                console.error('❌ Error:', item.file.name, fileError);
                const errMsg = fileError.message || 'Unknown error';
                failedFiles.push(item.file.name + ' → ' + errMsg);
                
                if (errMsg.includes('baca file') || errMsg.includes('baca gagal')) {
                    readErrors++;
                }
            }
        }
        
        // ====== JIKA SEMUA FILE GAGAL ======
        if (successCount === 0) {
            if (readErrors > 0) {
                showAndroidGuide();
                throw new Error(
                    '❌ File tidak bisa dibaca dari penyimpanan HP.\n\n' +
                    '⚠️ INI BUKAN BUG APLIKASI.\n' +
                    'Sistem Android membatasi akses file ke browser.\n\n' +
                    '✅ SOLUSI:\n' +
                    '1. Upload file ke Google Drive\n' +
                    '2. Upload dari Google Drive (bukan Downloads)\n' +
                    '3. Atau gunakan laptop/PC'
                );
            }
            
            throw new Error('Tidak ada file yang berhasil diproses.\n\n⚠️ Detail:\n' + failedFiles.join('\n'));
        }
        
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menyimpan...';
        doc.save('Gabungan_' + new Date().getTime() + '.pdf');
        
        let successMsg = '✅ Berhasil! ' + successCount + ' file digabungkan.';
        if (failedFiles.length > 0) {
            successMsg += '\n\n⚠️ ' + failedFiles.length + ' file gagal:\n' + failedFiles.join('\n');
        }
        alert(successMsg);
        
    } catch (error) {
        console.error('Merge Error:', error);
        
        if (error.message.includes('penyimpanan HP') || error.message.includes('Android')) {
            showAndroidGuide();
        }
        
        alert(error.message);
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalHTML;
    }
}

// ============================================
// DETEKSI ANDROID & PANDUAN
// ============================================
function detectAndroidAndShowGuide() {
    const isAndroid = /Android/i.test(navigator.userAgent);
    const guideBox = document.getElementById('androidGuideBox');
    
    if (isAndroid && guideBox) {
        guideBox.style.display = 'flex';
    }
}

function showAndroidGuide() {
    const isAndroid = /Android/i.test(navigator.userAgent);
    if (!isAndroid) return;
    
    setTimeout(() => {
        const goToDrive = confirm(
            '📱 PANDUAN UNTUK HP ANDROID\n\n' +
            'File PDF dari penyimpanan HP tidak bisa dibaca karena sistem Android membatasi akses.\n\n' +
            '✅ CARA YANG BERHASIL:\n' +
            '1. Upload PDF ke Google Drive\n' +
            '2. Buka aplikasi ini lagi\n' +
            '3. Klik "Tambah File" → pilih "Drive"\n' +
            '4. Pilih PDF dari Google Drive\n\n' +
            'Klik OK untuk membuka Google Drive sekarang.'
        );
        
        if (goToDrive) {
            window.open('https://drive.google.com', '_blank');
        }
    }, 500);
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