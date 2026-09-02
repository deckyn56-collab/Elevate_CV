// ============================================
// LAMARANAI - SCRIPT UTAMA
// ============================================

// STATE MANAGEMENT
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
    error: '',
    copyStatus: null,
    photoDataUrl: null
};

// ============================================
// TRANSLATIONS (LENGKAP)
// ============================================
const translations = {
    id: {
        // Header
        badge: "LamaranAI",
        tagline: "Platform AI untuk membuat Surat Lamaran dan CV Profesional.",
        
        // Tabs
        tabCoverTitle: "Surat Lamaran",
        tabCoverDesc: "Generator & Signature",
        tabCVTitle: "CV 2 Kolom",
        tabCVDesc: "Format Profesional",
        
        // Form Cover Letter
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
        signatureInfo: "Tanda tangan akan muncul di sebelah kiri dokumen.",
        generateBtn: "Buat Surat Lamaran AI",
        
        // Placeholders
        namePlaceholder: "Budi Santoso",
        cityPlaceholder: "Jakarta Selatan",
        phonePlaceholder: "081234567890",
        emailPlaceholder: "budi@email.com",
        positionPlaceholder: "Senior Fullstack Dev",
        companyPlaceholder: "PT Tech Innovation",
        addressPlaceholder: "Jl. Depati Hamzah, Semabung Lama, Pangkalpinang",
        jobDescPlaceholder: "Tempel persyaratan pekerjaan di sini...",
        experiencePlaceholder: "Tempel ringkasan pengalaman utama Anda...",
        
        // Preview
        resultTitle: "Hasil Surat Lamaran",
        preview: "Previu",
        edit: "Edit",
        copy: "Salin",
        download: "PDF",
        
        // Quick Actions
        quickActions: "Quick Actions:",
        shorten: "Singkatkan",
        moreFormal: "Lebih Formal",
        leadership: "Kepemimpinan",
        translate: "English",
        
        // Preview Placeholder
        noLetter: "Belum ada surat lamaran",
        noLetterDesc: "Isi formulir di sebelah kiri dan klik 'Buat Surat Lamaran AI' untuk memulai.",
        loading: "Gemini AI sedang menyusun surat lamaran terbaik untuk Anda...",
        
        // CV 2 Column
        cvTitle: "CV 2 Kolom Profesional",
        generator: "Generator",
        editText: "Edit Teks",
        summarize: "Ringkaskan AI",
        uploadPhoto: "Upload Foto",
        choosePhoto: "Klik untuk pilih foto",
        generateCV: "Generate CV AI",
        cvPreview: "CV Preview",
        cvPreviewDesc: "Isi data dan klik Generate untuk melihat CV Anda",
        downloadCV: "Unduh PDF",
        
        // CV Placeholders
        cvNamePlaceholder: "Nama Lengkap",
        cvPhonePlaceholder: "No. Telepon",
        cvEmailPlaceholder: "Email",
        cvAddressPlaceholder: "Alamat",
        cvBirthPlaceholder: "Tanggal Lahir",
        cvSummaryPlaceholder: "Ringkasan Profil",
        cvEduPlaceholder: "Pendidikan",
        cvExpPlaceholder: "Pengalaman Kerja",
        cvOrgPlaceholder: "Pengalaman Organisasi",
        cvSkillsPlaceholder: "Keahlian (pisahkan koma)",
        cvHobbiesPlaceholder: "Hobi (pisahkan koma)",
        
        // SEO Footer
        seoTitle: "LamaranAI - Solusi Karir Online",
        seoDesc: "LamaranAI adalah platform gratis untuk membantu Anda membuat surat lamaran kerja yang profesional dan CV yang menarik. Dengan teknologi AI canggih dari Google Gemini, kami membantu Anda menonjol di antara ribuan pelamar lainnya.",
        seoFeature1Title: "Surat Lamaran AI",
        seoFeature1Desc: "Generator surat lamaran kerja yang profesional dan personal",
        seoFeature2Title: "CV 2 Kolom",
        seoFeature2Desc: "Template CV modern dengan sidebar dan foto",
        seoFeature3Title: "Tanda Tangan Digital",
        seoFeature3Desc: "Tambahkan tanda tangan digital ke surat lamaran",
        seoFeature4Title: "Export PDF",
        seoFeature4Desc: "Unduh hasil dalam format PDF siap kirim",
        popular: "Populer:",
        
        // Errors
        errorRequired: "Posisi yang dilamar dan Nama Perusahaan wajib diisi.",
        errorNameRequired: "Nama wajib diisi.",
        errorApi: "Gagal menghubungi server.",
        errorPhoto: "Mohon upload file gambar.",
        errorPhotoSize: "Ukuran gambar harus kurang dari 5MB."
    },
    en: {
        // Header
        badge: "LamaranAI",
        tagline: "AI Platform to create Professional Cover Letters and CVs.",
        
        // Tabs
        tabCoverTitle: "Cover Letter",
        tabCoverDesc: "Generator & Signature",
        tabCVTitle: "2-Column CV",
        tabCVDesc: "Professional Format",
        
        // Form Cover Letter
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
        signatureInfo: "Signature will appear on the left side of the document.",
        generateBtn: "Generate Cover Letter AI",
        
        // Placeholders
        namePlaceholder: "John Doe",
        cityPlaceholder: "Jakarta Selatan",
        phonePlaceholder: "081234567890",
        emailPlaceholder: "john@email.com",
        positionPlaceholder: "Senior Fullstack Dev",
        companyPlaceholder: "PT Tech Innovation",
        addressPlaceholder: "Jl. Depati Hamzah, Semabung Lama, Pangkalpinang",
        jobDescPlaceholder: "Paste job requirements here...",
        experiencePlaceholder: "Paste your main experience summary...",
        
        // Preview
        resultTitle: "Cover Letter Result",
        preview: "Preview",
        edit: "Edit",
        copy: "Copy",
        download: "PDF",
        
        // Quick Actions
        quickActions: "Quick Actions:",
        shorten: "Shorten",
        moreFormal: "More Formal",
        leadership: "Leadership",
        translate: "Indonesian",
        
        // Preview Placeholder
        noLetter: "No cover letter yet",
        noLetterDesc: "Fill the form on the left and click 'Generate Cover Letter AI' to start.",
        loading: "Gemini AI is crafting the best cover letter for you...",
        
        // CV 2 Column
        cvTitle: "Professional 2-Column CV",
        generator: "Generator",
        editText: "Edit Text",
        summarize: "AI Summarize",
        uploadPhoto: "Upload Photo",
        choosePhoto: "Click to choose photo",
        generateCV: "Generate CV AI",
        cvPreview: "CV Preview",
        cvPreviewDesc: "Fill the data and click Generate to see your CV",
        downloadCV: "Download PDF",
        
        // CV Placeholders
        cvNamePlaceholder: "Full Name",
        cvPhonePlaceholder: "Phone Number",
        cvEmailPlaceholder: "Email",
        cvAddressPlaceholder: "Address",
        cvBirthPlaceholder: "Date of Birth",
        cvSummaryPlaceholder: "Profile Summary",
        cvEduPlaceholder: "Education",
        cvExpPlaceholder: "Work Experience",
        cvOrgPlaceholder: "Organization Experience",
        cvSkillsPlaceholder: "Skills (comma separated)",
        cvHobbiesPlaceholder: "Hobbies (comma separated)",
        
        // SEO Footer
        seoTitle: "LamaranAI - Online Career Solution",
        seoDesc: "LamaranAI is a free platform to help you create professional cover letters and attractive CVs. With advanced AI technology from Google Gemini, we help you stand out among thousands of other applicants.",
        seoFeature1Title: "AI Cover Letter",
        seoFeature1Desc: "Professional and personal cover letter generator",
        seoFeature2Title: "2-Column CV",
        seoFeature2Desc: "Modern CV template with sidebar and photo",
        seoFeature3Title: "Digital Signature",
        seoFeature3Desc: "Add digital signature to your cover letter",
        seoFeature4Title: "PDF Export",
        seoFeature4Desc: "Download results in ready-to-send PDF format",
        popular: "Popular:",
        
        // Errors
        errorRequired: "Target position and Company Name are required.",
        errorNameRequired: "Name is required.",
        errorApi: "Failed to connect to server.",
        errorPhoto: "Please upload an image file.",
        errorPhotoSize: "Image must be less than 5MB."
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
    
    // Update all translated elements (text content)
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
    
    // Update all placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        if (translations[lang][key]) {
            element.placeholder = translations[lang][key];
        }
    });
    
    // Update select options
    document.querySelectorAll('select option[data-i18n]').forEach(option => {
        const key = option.getAttribute('data-i18n');
        if (translations[lang][key]) {
            option.textContent = translations[lang][key];
        }
    });
    
    // Update document title
    document.title = lang === 'id' ? 
        'LamaranAI - Buat Surat Lamaran & CV Profesional dengan AI Gratis' : 
        'LamaranAI - Create Professional Cover Letters & CVs with AI Free';
    
    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
        metaDesc.setAttribute('content', lang === 'id' ? 
            'LamaranAI adalah platform AI gratis untuk membuat surat lamaran kerja profesional, CV 2 kolom yang menarik, dengan teknologi Google Gemini.' : 
            'LamaranAI is a free AI platform to create professional cover letters, attractive 2-column CVs, powered by Google Gemini technology.');
    }
    
    // Update lang attribute
    document.documentElement.lang = lang;
    
    // Save preference
    localStorage.setItem('lamaranai_lang', lang);
}

// ============================================
// THEME SETTINGS
// ============================================
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    
    // Update icon
    const themeIcon = document.getElementById('themeIcon');
    themeIcon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    
    // Save preference
    localStorage.setItem('lamaranai_theme', newTheme);
    
    state.currentTheme = newTheme;
}

function initTheme() {
    const savedTheme = localStorage.getItem('lamaranai_theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        const themeIcon = document.getElementById('themeIcon');
        themeIcon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        state.currentTheme = savedTheme;
    }
}

// ============================================
// TAB NAVIGATION
// ============================================
function switchTab(tabId) {
    state.activeTab = tabId;
    
    // Update tab buttons
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tabId) {
            btn.classList.add('active');
        }
    });
    
    // Show/hide tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.add('hidden');
    });
    
    const tabContent = document.getElementById(tabId);
    if (tabContent) {
        tabContent.classList.remove('hidden');
    }
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
    
    // Auto hide after 5 seconds
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
    
    // Set canvas dimensions
    canvas.width = 400;
    canvas.height = 120;
    
    // Drawing events
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);
    
    // Touch events
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
    
    // Hide placeholder
    const placeholder = document.getElementById('signaturePlaceholder');
    if (placeholder) {
        placeholder.style.display = 'none';
    }
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
        state.signatureDataUrl = canvas.toDataURL('image/png');
    }
    isDrawing = false;
}

function clearSignature() {
    if (!ctx || !canvas) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    state.hasSignature = false;
    state.signatureDataUrl = null;
    
    // Show placeholder
    const placeholder = document.getElementById('signaturePlaceholder');
    if (placeholder) {
        placeholder.style.display = 'flex';
    }
}

// ============================================
// API CALL (AMAN - Vercel Serverless)
// ============================================
async function callGeminiAPI(prompt, systemPrompt = "") {
    try {
        const response = await fetch('/api/gemini', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt,
                systemPrompt
            })
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
    // Get form values
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
    
    // Validate required fields
    if (!jobTitle.trim() || !company.trim()) {
        showError(translations[state.currentLang].errorRequired);
        return;
    }
    
    // Show loading
    state.isGeneratingLetter = true;
    const generateBtn = document.getElementById('generateLetterBtn');
    generateBtn.disabled = true;
    generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
    
    const loadingScreen = document.getElementById('loadingScreen');
    const previewContainer = document.getElementById('letterPreview');
    loadingScreen.classList.remove('hidden');
    previewContainer.classList.add('hidden');
    
    try {
        const today = new Date().toLocaleDateString(state.currentLang === 'id' ? 'id-ID' : 'en-US', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
        });
        
        const langInstruction = state.currentLang === 'id' ? 
            'Tulis dalam Bahasa Indonesia' : 
            'Write in English';
        
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

        // Call API
        const result = await callGeminiAPI(promptText, "You are a professional career consultant. Write cover letters in the specified language.");
        
        // Set output
        state.outputLetter = result;
        renderLetterPreview();
        
        // Show quick actions
        document.getElementById('quickActions').classList.remove('hidden');
        document.getElementById('letterActions').style.display = 'flex';
        
    } catch (error) {
        showError(error.message || translations[state.currentLang].errorApi);
    } finally {
        // Hide loading
        state.isGeneratingLetter = false;
        loadingScreen.classList.add('hidden');
        previewContainer.classList.remove('hidden');
        
        // Reset button
        generateBtn.disabled = false;
        generateBtn.innerHTML = '<i class="fas fa-wand-magic-sparkles"></i> ' + translations[state.currentLang].generateBtn;
    }
}

// ============================================
// RENDER LETTER PREVIEW
// ============================================
function renderLetterPreview() {
    const previewContainer = document.getElementById('letterPreview');
    
    if (state.viewMode === 'preview') {
        // Format letter HTML
        const letterHtml = formatLetterHTML(state.outputLetter);
        previewContainer.innerHTML = letterHtml;
    } else {
        // Edit mode
        previewContainer.innerHTML = `<textarea class="editor-textarea" id="letterEditor">${state.outputLetter}</textarea>`;
        
        // Add event listener to save edits
        const editor = document.getElementById('letterEditor');
        editor.addEventListener('input', (e) => {
            state.outputLetter = e.target.value;
        });
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
        
        // Check for signature section
        if (trimmed.toLowerCase().includes('sincerely') || trimmed.toLowerCase().includes('hormat saya')) {
            html += `<div class="letter-signature">
                <p>${trimmed}</p>`;
            
            // Add signature if available
            if (state.hasSignature && state.signatureDataUrl) {
                html += `<img src="${state.signatureDataUrl}" alt="Digital Signature" class="signature-image">`;
            } else {
                html += `<div class="signature-placeholder-box">(${translations[state.currentLang].signHere})</div>`;
            }
            
            html += `</div>`;
            
            // Skip empty lines after signature
            while (i + 1 < lines.length && lines[i + 1].trim() === '') {
                i++;
            }
        } else if (trimmed === '') {
            // Empty line
            html += '<div class="blank-line"></div>';
        } else {
            // Regular paragraph
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
    
    // Update buttons
    const viewBtns = document.querySelectorAll('.view-btn');
    viewBtns.forEach(btn => btn.classList.remove('active'));
    
    if (mode === 'preview') {
        viewBtns[0].classList.add('active');
    } else {
        viewBtns[1].classList.add('active');
    }
    
    // Re-render
    if (state.outputLetter) {
        renderLetterPreview();
    }
}

// ============================================
// REFINE LETTER
// ============================================
async function refineLetter(instruction) {
    if (!state.outputLetter) return;
    
    state.isGeneratingLetter = true;
    showLoading(true);
    
    try {
        const promptText = `Here is a draft cover letter:
"""
${state.outputLetter}
"""

Refinement instruction: "${instruction}".
Maintain professional cover letter structure. Return only the refined letter text.`;

        const result = await callGeminiAPI(promptText, "You are a professional editor. Refine and adjust cover letters according to instructions.");
        
        state.outputLetter = result;
        renderLetterPreview();
        
    } catch (error) {
        showError(error.message || translations[state.currentLang].errorApi);
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
        copyBtn.innerHTML = '<i class="fas fa-check"></i> ' + (state.currentLang === 'id' ? 'Tersalin!' : 'Copied!');
        
        setTimeout(() => {
            copyBtn.innerHTML = '<i class="fas fa-copy"></i> ' + translations[state.currentLang].copy;
        }, 2000);
    }).catch(err => {
        showError('Failed to copy text: ' + err.message);
    });
}

// ============================================
// EXPORT PDF SURAT
// ============================================
async function exportPDF() {
    if (!state.outputLetter) return;
    
    try {
        // Load jsPDF library
        if (!window.jspdf) {
            await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
        }
        
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
                if (cursorY + 45 > pageHeight - marginBottom) {
                    doc.addPage();
                    cursorY = 25;
                }
                
                doc.text(line, marginLeft, cursorY);
                cursorY += 8;
                
                if (state.hasSignature && state.signatureDataUrl) {
                    doc.addImage(state.signatureDataUrl, "PNG", marginLeft, cursorY, 42, 18);
                    cursorY += 21;
                } else {
                    cursorY += 16;
                }
                
                while (i + 1 < paragraphs.length && paragraphs[i + 1].trim() === "") {
                    i++;
                }
                continue;
            }
            
            if (line === "") {
                cursorY += 4;
                continue;
            }
            
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
        
        const company = document.getElementById('company').value || 'Lamaran';
        const safeFileName = company.replace(/[^a-zA-Z0-9]/g, "_");
        doc.save(`Cover_Letter_${safeFileName}.pdf`);
        
    } catch (error) {
        console.error(error);
        showError('Failed to create PDF: ' + error.message);
    }
}

// ============================================
// PHOTO UPLOAD
// ============================================
function triggerPhotoUpload() {
    document.getElementById('cv2PhotoUpload').click();
}

function handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
        showError(translations[state.currentLang].errorPhoto);
        return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        showError(translations[state.currentLang].errorPhotoSize);
        return;
    }
    
    // Read file
    const reader = new FileReader();
    reader.onload = (e) => {
        state.photoDataUrl = e.target.result;
        
        // Update preview
        const photoPreview = document.getElementById('photoPreview');
        photoPreview.innerHTML = `<img src="${state.photoDataUrl}" alt="CV Photo">`;
        
        // Show remove button
        document.querySelector('.btn-remove-photo').style.display = 'flex';
        
        // Update render
        if (state.cv2Result) {
            renderCvPreview();
        }
    };
    reader.readAsDataURL(file);
}

function removePhoto() {
    state.photoDataUrl = null;
    
    // Reset preview
    const photoPreview = document.getElementById('photoPreview');
    photoPreview.innerHTML = `<i class="fas fa-image"></i><span>${translations[state.currentLang].choosePhoto}</span>`;
    
    // Hide remove button
    document.querySelector('.btn-remove-photo').style.display = 'none';
    
    // Reset file input
    document.getElementById('cv2PhotoUpload').value = '';
    
    // Update render
    if (state.cv2Result) {
        renderCvPreview();
    }
}

// ============================================
// CV 2 KOLOM
// ============================================
async function generateCV() {
    const cv2Name = document.getElementById('cv2Name').value;
    
    if (!cv2Name.trim()) {
        showError(translations[state.currentLang].errorNameRequired);
        return;
    }
    
    state.isGenCv2 = true;
    
    try {
        const cv2Edu = document.getElementById('cv2Edu').value;
        const cv2Exp = document.getElementById('cv2Exp').value;
        const cv2Skills = document.getElementById('cv2Skills').value;
        
        const langInstruction = state.currentLang === 'id' ? 
            'Tulis dalam Bahasa Indonesia' : 
            'Write in English';
        
        const prompt = `You are a professional CV writer. Your task is to write a "Profile Summary" (3-4 strong sentences) for an applicant named ${cv2Name}. ${langInstruction}.

DATA:
Education: ${cv2Edu}
Experience: ${cv2Exp}
Skills: ${cv2Skills}

Write an engaging, professional, and results-oriented summary. DO NOT write other sections like Education or Experience. Return ONLY the summary text.`;

        const result = await callGeminiAPI(prompt, "You are a professional CV writer. Your task is to write strong 'Profile Summaries'.");
        
        state.cv2Result = result;
        renderCvPreview();
        
    } catch (error) {
        showError(error.message || translations[state.currentLang].errorApi);
    } finally {
        state.isGenCv2 = false;
    }
}

function renderCvPreview() {
    const container = document.getElementById('cv2Preview');
    const cv2Name = document.getElementById('cv2Name').value;
    const cv2Phone = document.getElementById('cv2Phone').value;
    const cv2Email = document.getElementById('cv2Email').value;
    const cv2Address = document.getElementById('cv2Address').value;
    const cv2Birth = document.getElementById('cv2Birth').value;
    const cv2Edu = document.getElementById('cv2Edu').value;
    const cv2Exp = document.getElementById('cv2Exp').value;
    const cv2Org = document.getElementById('cv2Org').value;
    const cv2Skills = document.getElementById('cv2Skills').value;
    const cv2Hobbies = document.getElementById('cv2Hobbies').value;
    
    const photoHtml = state.photoDataUrl ? 
        `<img src="${state.photoDataUrl}" alt="Photo">` : 
        '<div class="cv-photo-placeholder"><i class="fas fa-user"></i></div>';
    
    // Language-specific labels
    const labels = translations[state.currentLang];
    
    container.innerHTML = `
        <div class="cv-flex">
            <div class="cv-sidebar">
                <div class="cv-photo">
                    ${photoHtml}
                </div>
                <h3 class="cv-name-sidebar">${cv2Name || "Your Name"}</h3>
                <div class="cv-contact-list">
                    <div class="cv-contact-item"><i class="fas fa-user"></i> ${cv2Name || "-"}</div>
                    <div class="cv-contact-item"><i class="fas fa-envelope"></i> ${cv2Email || "-"}</div>
                    <div class="cv-contact-item"><i class="fas fa-phone"></i> ${cv2Phone || "-"}</div>
                    <div class="cv-contact-item"><i class="fas fa-map-marker-alt"></i> ${cv2Address || "-"}</div>
                    <div class="cv-contact-item"><i class="fas fa-calendar-alt"></i> ${cv2Birth || "-"}</div>
                </div>
                
                <div class="cv-section">
                    <div class="cv-section-title">${labels.shortSkills || "Skills"}</div>
                    <div class="cv-skills-list">
                        ${cv2Skills.split(',').filter(s => s.trim()).map(skill => `
                            <div class="cv-skill-item">
                                <span>${skill.trim()}</span>
                                <div class="cv-skill-dots">
                                    ${[...Array(5)].map((_, i) => 
                                        `<div class="cv-dot ${i < 3 ? 'cv-dot-filled' : 'cv-dot-empty'}"></div>`
                                    ).join('')}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="cv-section">
                    <div class="cv-section-title">${labels.hobbies || "Hobbies"}</div>
                    <div class="cv-skills-list">
                        ${cv2Hobbies.split(',').filter(s => s.trim()).map(hobby => `
                            <div class="cv-contact-item">
                                <i class="fas fa-heart"></i> ${hobby.trim()}
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
            
            <div class="cv-main">
                <h1 class="cv-name-main">${cv2Name || "Your Name"}</h1>
                <p class="cv-summary">${state.cv2Result || "Profile summary will appear here..."}</p>
                
                <div class="cv-main-section">
                    <h3 class="cv-main-section-title"><i class="fas fa-graduation-cap"></i> ${labels.shortEducation || "Education"}</h3>
                    <p class="cv-main-section-content">${cv2Edu || "Not filled yet"}</p>
                </div>
                
                <div class="cv-main-section">
                    <h3 class="cv-main-section-title"><i class="fas fa-briefcase"></i> ${labels.shortExperience || "Work Experience"}</h3>
                    <p class="cv-main-section-content">${cv2Exp || "Not filled yet"}</p>
                </div>
                
                <div class="cv-main-section">
                    <h3 class="cv-main-section-title"><i class="fas fa-users"></i> ${labels.shortOrganization || "Organization"}</h3>
                    <p class="cv-main-section-content">${cv2Org || "Not filled yet"}</p>
                </div>
            </div>
        </div>
    `;
}

// ============================================
// CV EDIT & SUMMARY
// ============================================
function toggleEditCV() {
    state.isEditingCv2 = !state.isEditingCv2;
    
    // Update button text
    const btn = document.querySelector('.btn-blue');
    btn.innerHTML = state.isEditingCv2 ? 
        '<i class="fas fa-check"></i> ' + (state.currentLang === 'id' ? 'Selesai Edit' : 'Done Editing') : 
        '<i class="fas fa-edit"></i> ' + translations[state.currentLang].editText;
}

async function summarizeCV() {
    if (!state.cv2Result) {
        showError('Generate CV first before summarizing.');
        return;
    }
    
    state.isGenCv2 = true;
    
    try {
        const langInstruction = state.currentLang === 'id' ? 
            'Ringkaskan dalam Bahasa Indonesia' : 
            'Summarize in English';
        
        const prompt = `You are a professional CV editor. Summarize the following CV text to be more concise, compact, and professional (max 200 words), while maintaining all important information (name, education, experience, skills). ${langInstruction}.

CURRENT CV TEXT:
"""
${state.cv2Result}
"""

Return ONLY the summarized text.`;

        const result = await callGeminiAPI(prompt, "You are a professional CV editor. Summarize CV texts to be more concise and professional.");
        
        state.cv2Result = result;
        renderCvPreview();
        
    } catch (error) {
        showError(error.message || translations[state.currentLang].errorApi);
    } finally {
        state.isGenCv2 = false;
    }
}

// ============================================
// EXPORT CV PDF
// ============================================
async function exportCVPDF() {
    if (!state.cv2Result) return;
    
    try {
        // Load html2pdf library
        if (!window.html2pdf) {
            await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js');
        }
        
        const element = document.getElementById('cv2Preview');
        
        const opt = {
            margin:       0,
            filename:     `CV_${document.getElementById('cv2Name').value || 'Professional'}.pdf`,
            image:        { type: 'jpeg', quality: 0.95 },
            html2canvas:  { 
                scale: 2,
                useCORS: true,
                letterRendering: true
            },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        await window.html2pdf().set(opt).from(element).save();
        
    } catch (error) {
        console.error("PDF Error:", error);
        showError('Failed to export PDF: ' + error.message);
    }
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
    // Load saved data
    const savedData = localStorage.getItem('elevatecv_data_v2');
    if (savedData) {
        try {
            const parsed = JSON.parse(savedData);
            
            // Restore all form fields
            if (parsed.name) document.getElementById('name').value = parsed.name;
            if (parsed.location) document.getElementById('location').value = parsed.location;
            if (parsed.phone) document.getElementById('phone').value = parsed.phone;
            if (parsed.email) document.getElementById('email').value = parsed.email;
            if (parsed.company) document.getElementById('company').value = parsed.company;
            if (parsed.companyAddress) document.getElementById('companyAddress').value = parsed.companyAddress;
            if (parsed.jobTitle) document.getElementById('jobTitle').value = parsed.jobTitle;
            if (parsed.jobDescription) document.getElementById('jobDescription').value = parsed.jobDescription;
            if (parsed.experience) document.getElementById('experience').value = parsed.experience;
            
        } catch (e) {
            console.error('Failed to load local storage');
        }
    }
    
    // Save on input change
    const inputs = ['name', 'location', 'phone', 'email', 'company', 'companyAddress', 'jobTitle', 'jobDescription', 'experience'];
    
    inputs.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('input', saveToLocalStorage);
        }
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
    // Initialize theme
    initTheme();
    
    // Initialize language
    const savedLang = localStorage.getItem('lamaranai_lang');
    if (savedLang) {
        setLanguage(savedLang);
    } else {
        setLanguage('id'); // Default to Indonesian
    }
    
    // Initialize signature canvas
    initSignature();
    
    // Initialize local storage
    initLocalStorage();
    
    // Set default view
    switchTab('cover-letter');
});