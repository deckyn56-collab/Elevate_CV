"use client";

import React, { useState, useEffect, useRef } from "react";

// --- HELPER PCM TO WAV (Untuk fitur suara) ---
function pcmToWav(pcm16Data: Int16Array, sampleRate: number = 24000): Blob {
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = pcm16Data.length * 2;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  const writeString = (v: DataView, offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      v.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // Raw PCM
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true);

  let offset = 44;
  for (let i = 0; i < pcm16Data.length; i++, offset += 2) {
    view.setInt16(offset, pcm16Data[i], true);
  }

  return new Blob([buffer], { type: 'audio/wav' });
}

export default function ElevateCVApp() {
  // ================================================================
  // 1. STATE UTAMA & NAVIGASI
  // ================================================================
  const [activeTab, setActiveTab] = useState<"cover-letter" | "ats-analyzer" | "interview-prep" | "cv-builder">("cover-letter");

  // ================================================================
  // 2. STATE SURAT LAMARAN & ATS (Lama)
  // ================================================================
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [company, setCompany] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [experience, setExperience] = useState("");
  const [tone, setTone] = useState("Profesional");

  const [outputLetter, setOutputLetter] = useState("");
  const [isGeneratingLetter, setIsGeneratingLetter] = useState(false);
  const [viewMode, setViewMode] = useState<"preview" | "edit">("preview");

  const [atsResult, setAtsResult] = useState<{
    matchScore: number;
    summary: string;
    matchingSkills: string[];
    missingKeywords: string[];
    recommendations: string[];
    strengths: string[];
  } | null>(null);
  const [isAnalyzingAts, setIsAnalyzingAts] = useState(false);

  const [interviewQuestions, setInterviewQuestions] = useState<Array<{
    category: string;
    question: string;
    suggestedAnswer: string;
    tip: string;
  }>>([]);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);

  // --- Canvas Signature ---
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);

  // --- Global Error ---
  const [error, setError] = useState("");
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  // ================================================================
  // 3. STATE CV BUILDER (Dari file CVBuilder.tsx)
  // ================================================================
  // State form CV Builder
  const [cvPersonalInfo, setCvPersonalInfo] = useState({
    name: "",
    jobTitle: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
  });
  const [cvSummary, setCvSummary] = useState("");
  const [cvExperience, setCvExperience] = useState("");
  const [cvEducation, setCvEducation] = useState("");
  const [cvSkills, setCvSkills] = useState("");
  const [cvIsGenerating, setCvIsGenerating] = useState(false);
  const [cvGeneratedCV, setCvGeneratedCV] = useState<string | null>(null);
  const [cvError, setCvError] = useState("");
  const [cvActiveTab, setCvActiveTab] = useState<"form" | "preview">("form");

  // ================================================================
  // 4. EFFECT & SIGNATURE LAMA
  // ================================================================
  useEffect(() => {
    const savedData = localStorage.getItem("elevatecv_data_v2");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.name) setName(parsed.name);
        if (parsed.location) setLocation(parsed.location);
        if (parsed.userAddress) setUserAddress(parsed.userAddress);
        if (parsed.phone) setPhone(parsed.phone);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.company) setCompany(parsed.company);
        if (parsed.companyAddress) setCompanyAddress(parsed.companyAddress);
        if (parsed.jobTitle) setJobTitle(parsed.jobTitle);
        if (parsed.experience) setExperience(parsed.experience);
        if (parsed.jobDescription) setJobDescription(parsed.jobDescription);
      } catch (e) { console.error("Gagal memuat local storage"); }
    }
  }, []);

  useEffect(() => {
    const dataToSave = { name, location, userAddress, phone, email, company, companyAddress, jobTitle, experience, jobDescription };
    localStorage.setItem("elevatecv_data_v2", JSON.stringify(dataToSave));
  }, [name, location, userAddress, phone, email, company, companyAddress, jobTitle, experience, jobDescription]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    let clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    ctx.beginPath();
    ctx.moveTo((clientX - rect.left) * scaleX, (clientY - rect.top) * scaleY);
    setIsDrawing(true);
    setHasSignature(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    let clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#000000";

    ctx.lineTo((clientX - rect.left) * scaleX, (clientY - rect.top) * scaleY);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (canvasRef.current && hasSignature) {
      setSignatureDataUrl(canvasRef.current.toDataURL("image/png"));
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    setSignatureDataUrl(null);
  };

  // ================================================================
  // 5. FUNGSI LAMA (Surat, ATS, Interview)
  // ================================================================
  const handleGenerateCoverLetter = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError("");

    if (!jobTitle.trim() || !company.trim()) {
      setError("Posisi yang dilamar dan Nama Perusahaan wajib diisi.");
      return;
    }

    setIsGeneratingLetter(true);

    try {
      const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
      const promptText = `Anda adalah konsultan karir profesional terbaik. Tulis surat lamaran kerja dalam Bahasa Indonesia yang elegan, meyakinkan, dan relevan.

DATA PELAMAR:
Nama: ${name || "[Nama Anda]"}
Domisili: ${location || "[Kota Anda]"}
Alamat: ${userAddress || "[Alamat Lengkap]"}
No. HP: ${phone || "[Nomor Telepon]"}
Email: ${email || "[Email Anda]"}

DATA PERUSAHAAN:
Perusahaan: ${company}
Alamat Perusahaan: ${companyAddress || "[Alamat Perusahaan]"}
Posisi Dilamar: ${jobTitle}

GAYA BAHASA: ${tone}
DESKRIPSI PEKERJAAN: ${jobDescription || "Sangat relevan dengan kualifikasi standar posisi ini."}
PENGALAMAN CV: ${experience || "Sebutkan motivasi tinggi, antusiasme, dan kemampuan adaptasi cepat."}

ATURAN FORMAT DOKUMEN:
${location || "[Kota]"}, ${today}

Hal: Lamaran Pekerjaan - ${jobTitle}

Yth. Hiring Manager / HRD Team
${company}
${companyAddress || ""}

Dengan hormat,
[Isi surat lamaran dalam 3-4 paragraf yang sangat persuasif...]

Hormat saya,

${name || "[Nama Anda]"}
${phone ? "Telp: " + phone : ""} | ${email ? "Email: " + email : ""}

Kembalikan HANYA teks lengkap surat lamaran tanpa tanda bintang markdown (*), hashtag (#), atau kutipan tambahan.`;

      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          modelEndpoint: "gemini-3.6-flash:generateContent",
          payload: { contents: [{ parts: [{ text: promptText }] }] }
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "Gagal menghubungi Gemini API.");

      const textResult = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      setOutputLetter(textResult);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat membuat surat lamaran.");
    } finally {
      setIsGeneratingLetter(false);
    }
  };

  const handleRefineLetter = async (instruction: string) => {
    if (!outputLetter) return;
    setIsGeneratingLetter(true);
    setError("");

    try {
      const promptText = `Berikut adalah draft surat lamaran kerja:
"""
${outputLetter}
"""

Instruksi perbaikan dari pelamar: "${instruction}".
Pertahankan struktur surat lamaran resmi. Kembalikan teks surat lamaran saja tanpa komentar.`;

      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          modelEndpoint: "gemini-3.6-flash:generateContent",
          payload: { contents: [{ parts: [{ text: promptText }] }] }
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "Gagal memperbarui surat.");

      const updatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      setOutputLetter(updatedText);
    } catch (err: any) {
      setError(err.message || "Gagal memperbarui surat lamaran.");
    } finally {
      setIsGeneratingLetter(false);
    }
  };

  const handleAnalyzeAts = async () => {
    if (!jobDescription.trim() || !experience.trim()) {
      setError("Mohon isi Deskripsi Pekerjaan dan Pengalaman CV Anda terlebih dahulu.");
      return;
    }

    setIsAnalyzingAts(true);
    setError("");

    try {
      const userPrompt = `Lakukan analisis pencocokan ATS antara CV Pelamar dan Deskripsi Pekerjaan berikut.
      
Deskripsi Pekerjaan:
${jobDescription}

Pengalaman / CV Pelamar:
${experience}

Berikan penilaian objektif dalam format JSON yang valid.`;

      const payload = {
        contents: [{ parts: [{ text: userPrompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              matchScore: { type: "NUMBER", description: "Persentase kecocokan dari 0 sampai 100" },
              summary: { type: "STRING", description: "Ringkasan kesimpulan analisis" },
              matchingSkills: { type: "ARRAY", items: { type: "STRING" }, description: "Skill yang sudah sesuai" },
              missingKeywords: { type: "ARRAY", items: { type: "STRING" }, description: "Kata kunci penting yang belum ada di CV" },
              recommendations: { type: "ARRAY", items: { type: "STRING" }, description: "Saran perbaikan konkret" },
              strengths: { type: "ARRAY", items: { type: "STRING" }, description: "Keunggulan utama pelamar" }
            },
            required: ["matchScore", "summary", "matchingSkills", "missingKeywords", "recommendations", "strengths"]
          }
        }
      };

      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          modelEndpoint: "gemini-3.6-flash:generateContent",
          payload
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "Gagal memproses analisis ATS.");

      const jsonString = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (jsonString) setAtsResult(JSON.parse(jsonString));
    } catch (err: any) {
      setError(err.message || "Gagal melakukan analisis ATS.");
    } finally {
      setIsAnalyzingAts(false);
    }
  };

  const handleGenerateInterviewPrep = async () => {
    if (!jobTitle.trim()) {
      setError("Mohon isi Posisi yang Dilamar.");
      return;
    }

    setIsGeneratingQuestions(true);
    setError("");

    try {
      const userPrompt = `Buat 4 pertanyaan wawancara kerja terprediksi untuk posisi "${jobTitle}" di perusahaan "${company || "Perusahaan Target"}".
Deskripsi Pekerjaan: ${jobDescription || "Kualifikasi standar untuk posisi ini."}
Pengalaman Pelamar: ${experience || "Fresh graduate / profesional berpengalaman."}

Kembalikan daftar pertanyaan beserta contoh jawaban ideal dengan metode STAR (Situation, Task, Action, Result) dalam Bahasa Indonesia.`;

      const payload = {
        contents: [{ parts: [{ text: userPrompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                category: { type: "STRING", description: "Teknis / Behavioral / Situasional" },
                question: { type: "STRING", description: "Pertanyaan pewawancara" },
                suggestedAnswer: { type: "STRING", description: "Jawaban ideal format STAR" },
                tip: { type: "STRING", description: "Tips penyampaian" }
              },
              required: ["category", "question", "suggestedAnswer", "tip"]
            }
          }
        }
      };

      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          modelEndpoint: "gemini-3.6-flash:generateContent",
          payload
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "Gagal membuat pertanyaan wawancara.");

      const jsonString = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (jsonString) setInterviewQuestions(JSON.parse(jsonString));
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat memuat simulasi interview.");
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  const exportPDF = async () => {
    if (!outputLetter) return;
    try {
      if (!(window as any).jspdf) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Gagal mengunduh pustaka PDF"));
          document.body.appendChild(script);
        });
      }

      const { jsPDF } = (window as any).jspdf;
      const doc = new jsPDF({ unit: "mm", format: "a4" });

      const validSignatureUrl = (hasSignature && canvasRef.current) 
        ? canvasRef.current.toDataURL("image/png") 
        : signatureDataUrl;

      const marginLeft = 20;
      let cursorY = 25;
      const pageHeight = 297;
      const marginBottom = 20;
      const maxLineWidth = 170;

      doc.setFont("times", "normal");
      doc.setFontSize(11);

      const paragraphs = outputLetter.split("\n");

      for (let i = 0; i < paragraphs.length; i++) {
        const line = paragraphs[i].trim();

        if (line.toLowerCase().includes("hormat saya")) {
          if (cursorY + 45 > pageHeight - marginBottom) {
            doc.addPage();
            cursorY = 25;
          }
          doc.text(line, marginLeft, cursorY);
          cursorY += 8;

          if (validSignatureUrl) {
            doc.addImage(validSignatureUrl, "PNG", marginLeft, cursorY, 42, 18);
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

      const safeFileName = (company || "Lamaran").replace(/[^a-zA-Z0-9]/g, "_");
      doc.save(`Surat_Lamaran_${safeFileName}.pdf`);
    } catch (err: any) {
      console.error(err);
      setError("Gagal membuat PDF: " + err.message);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopyStatus(label);
    setTimeout(() => setCopyStatus(null), 3000);
  };

  const renderFormattedLetter = () => {
    if (!outputLetter) return null;
    const lines = outputLetter.split("\n");
    const formattedElements: React.ReactNode[] = [];
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];
      const trimmed = line.trim();

      if (trimmed.toLowerCase().includes("hormat saya")) {
        formattedElements.push(
          <div key={`closing-${i}`} className="mt-6 mb-2">
            <p className="font-serif">{trimmed}</p>
            {hasSignature && (signatureDataUrl || canvasRef.current) ? (
              <div className="my-2 my-1">
                <img
                  src={signatureDataUrl || (canvasRef.current ? canvasRef.current.toDataURL("image/png") : "")}
                  alt="Tanda Tangan Digital"
                  className="h-16 object-contain border-b border-black/10 pb-1"
                />
              </div>
            ) : (
              <div className="h-14 border-b border-dashed border-neutral-300 w-48 my-2 flex items-center justify-center text-[10px] text-neutral-400 italic">
                (Area Tanda Tangan)
              </div>
            )}
          </div>
        );
        while (i + 1 < lines.length && lines[i + 1].trim() === "") {
          i++;
        }
      } else if (trimmed === "") {
        formattedElements.push(<div key={`blank-${i}`} className="h-3" />);
      } else {
        formattedElements.push(
          <p key={`p-${i}`} className="font-serif text-sm leading-relaxed mb-1">
            {trimmed}
          </p>
        );
      }
      i++;
    }
    return <div className="space-y-1">{formattedElements}</div>;
  };

  // ================================================================
  // 6. FUNGSI CV BUILDER (Dari file CVBuilder.tsx)
  // ================================================================
  const handleCvInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCvPersonalInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerateCV = async () => {
    setCvIsGenerating(true);
    setCvError("");

    try {
      const prompt = `Anda adalah seorang ahli penulis Resume/CV berstandar ATS (Applicant Tracking System).
Tugas Anda adalah merapikan, memoles, dan menyusun data berikut menjadi format CV Markdown yang profesional, kuat, dan menarik.
Gunakan bahasa yang aktif dan berorientasi pada hasil (action-oriented).

DATA PELAMAR:
Nama: ${cvPersonalInfo.name || "[Nama Lengkap]"}
Posisi Target: ${cvPersonalInfo.jobTitle || "[Posisi]"}
Email: ${cvPersonalInfo.email || "[Email]"}
Telepon: ${cvPersonalInfo.phone || "[Telepon]"}
Lokasi: ${cvPersonalInfo.location || "[Lokasi]"}
LinkedIn: ${cvPersonalInfo.linkedin || "Tidak ada"}

RINGKASAN PROFIL:
${cvSummary || "Belum diisi. Buatkan ringkasan singkat berdasarkan peran target."}

PENGALAMAN KERJA:
${cvExperience || "Belum diisi."}

PENDIDIKAN:
${cvEducation || "Belum diisi."}

KEAHLIAN (SKILLS):
${cvSkills || "Belum diisi."}

PENTING:
- Keluarkan HANYA teks Markdown murni (tanpa tag pembungkus seperti \`\`\`markdown).
- Gunakan Heading (# atau ##) untuk memisahkan bagian.
- Buat daftar pengalaman kerja menggunakan bullet points.`;

      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          modelEndpoint: "gemini-1.5-flash:generateContent",
          payload: { contents: [{ parts: [{ text: prompt }] }] }
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal menghubungi API server.");
      }

      const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (aiText) {
        setCvGeneratedCV(aiText);
        setCvActiveTab("preview");
      } else {
        throw new Error("Respon AI kosong.");
      }
    } catch (err: any) {
  console.error("🔥 Error detail:", err);
  
  // Coba ambil pesan error sebenarnya
  let errorMessage = "Terjadi kesalahan saat meng-generate CV.";
  
  if (err?.message) {
    errorMessage = err.message;
  } else if (typeof err === "string") {
    errorMessage = err;
  } else if (err?.error?.message) {
    errorMessage = err.error.message; // Jika error dari API
  } else {
    // Jika err adalah object tanpa message, ubah jadi string agar tidak muncul [object Object]
    try {
      errorMessage = JSON.stringify(err);
    } catch {
      errorMessage = "Terjadi kesalahan yang tidak diketahui.";
    }
  }
  
  setCvError(errorMessage);
} finally {
      setCvIsGenerating(false);
    }
  };

  const exportCVPDF = async () => {
    try {
      if (!(window as any).jspdf) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Gagal memuat library PDF."));
          document.body.appendChild(script);
        });
      }

      const { jsPDF } = (window as any).jspdf;
      const doc = new jsPDF({ unit: "mm", format: "a4" });

      let cursorY = 20;
      const marginLeft = 20;
      const contentWidth = 170;

      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text(cvPersonalInfo.name || "NAMA LENGKAP", marginLeft, cursorY);
      cursorY += 8;

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 100, 100);
      doc.text(cvPersonalInfo.jobTitle || "Posisi Profesional", marginLeft, cursorY);
      cursorY += 6;

      doc.setFontSize(10);
      doc.setTextColor(50, 50, 50);
      const contactInfo = `${cvPersonalInfo.email} | ${cvPersonalInfo.phone} | ${cvPersonalInfo.location}`;
      doc.text(contactInfo, marginLeft, cursorY);
      cursorY += 10;

      doc.setDrawColor(200, 200, 200);
      doc.line(marginLeft, cursorY, 190, cursorY);
      cursorY += 10;

      doc.setTextColor(0, 0, 0);
      const lines = cvGeneratedCV ? cvGeneratedCV.split("\n") : [];
      
      for (const line of lines) {
        if (cursorY > 275) {
          doc.addPage();
          cursorY = 20;
        }

        const trimmedLine = line.trim();
        
        if (trimmedLine.startsWith("# ")) {
          cursorY += 5;
          doc.setFont("helvetica", "bold");
          doc.setFontSize(14);
          doc.text(trimmedLine.replace("# ", ""), marginLeft, cursorY);
          cursorY += 8;
          doc.setFont("helvetica", "normal");
          doc.setFontSize(11);
        } else if (trimmedLine.startsWith("## ")) {
          cursorY += 4;
          doc.setFont("helvetica", "bold");
          doc.setFontSize(12);
          doc.text(trimmedLine.replace("## ", ""), marginLeft, cursorY);
          cursorY += 7;
          doc.setFont("helvetica", "normal");
          doc.setFontSize(11);
        } else if (trimmedLine.startsWith("* ") || trimmedLine.startsWith("- ")) {
          doc.text("•", marginLeft + 2, cursorY);
          const splitText = doc.splitTextToSize(trimmedLine.substring(2), contentWidth - 5);
          doc.text(splitText, marginLeft + 6, cursorY);
          cursorY += splitText.length * 6;
        } else if (trimmedLine !== "") {
          const splitText = doc.splitTextToSize(trimmedLine, contentWidth);
          doc.text(splitText, marginLeft, cursorY);
          cursorY += splitText.length * 6;
        } else {
          cursorY += 3;
        }
      }

      const fileName = cvPersonalInfo.name ? `CV_${cvPersonalInfo.name.replace(/\s+/g, '_')}.pdf` : "CV_Profesional.pdf";
      doc.save(fileName);
    } catch (err: any) {
      alert("Gagal mengekspor PDF: " + err.message);
    }
  };

  // ================================================================
  // 7. RENDER UI CV BUILDER
  // ================================================================
  const renderCVForm = () => (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200">
        <h3 className="text-lg font-bold text-neutral-800 mb-4 border-b pb-2">Informasi Pribadi</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Nama Lengkap</label>
            <input type="text" name="name" value={cvPersonalInfo.name} onChange={handleCvInfoChange} placeholder="John Doe" className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Posisi Target</label>
            <input type="text" name="jobTitle" value={cvPersonalInfo.jobTitle} onChange={handleCvInfoChange} placeholder="Software Engineer" className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Email</label>
            <input type="email" name="email" value={cvPersonalInfo.email} onChange={handleCvInfoChange} placeholder="john@email.com" className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Telepon / WA</label>
            <input type="text" name="phone" value={cvPersonalInfo.phone} onChange={handleCvInfoChange} placeholder="08123456789" className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Lokasi / Kota</label>
            <input type="text" name="location" value={cvPersonalInfo.location} onChange={handleCvInfoChange} placeholder="Jakarta, Indonesia" className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Profil LinkedIn (Opsional)</label>
            <input type="text" name="linkedin" value={cvPersonalInfo.linkedin} onChange={handleCvInfoChange} placeholder="linkedin.com/in/johndoe" className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Ringkasan Profil (Summary)</label>
          <textarea rows={3} value={cvSummary} onChange={(e) => setCvSummary(e.target.value)} placeholder="Tuliskan 2-3 kalimat mengenai keahlian dan fokus karir Anda..." className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none resize-none transition-all" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Pengalaman Kerja</label>
          <textarea rows={4} value={cvExperience} onChange={(e) => setCvExperience(e.target.value)} placeholder="Misal: Senior Developer di PT Tech (2020-2023) - Memimpin tim beranggotakan 5 orang..." className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none resize-none transition-all" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Pendidikan</label>
          <textarea rows={2} value={cvEducation} onChange={(e) => setCvEducation(e.target.value)} placeholder="S1 Teknik Informatika - Universitas Indonesia (2016-2020)" className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none resize-none transition-all" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Keahlian (Skills)</label>
          <input type="text" value={cvSkills} onChange={(e) => setCvSkills(e.target.value)} placeholder="React, Node.js, Project Management, SEO" className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all" />
        </div>
      </div>
    </div>
  );

  const renderCVPreview = () => (
    <div className="bg-white rounded-2xl shadow-lg border border-neutral-200 h-full min-h-[600px] flex flex-col overflow-hidden animate-in fade-in duration-300">
      <div className="bg-neutral-50 border-b border-neutral-200 px-4 py-3 flex justify-between items-center">
        <span className="text-sm font-semibold text-neutral-600">Dokumen CV (Format A4)</span>
        <button 
          onClick={exportCVPDF} 
          disabled={!cvGeneratedCV}
          className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-neutral-300 text-white text-xs font-bold rounded-md transition-colors shadow-sm"
        >
          📥 Unduh PDF
        </button>
      </div>
      
      <div className="flex-1 p-8 overflow-y-auto bg-neutral-100 flex justify-center">
        <div className="bg-white w-full max-w-[210mm] min-h-[297mm] shadow-md p-10 font-serif text-neutral-800 break-words">
          {cvGeneratedCV ? (
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {cvGeneratedCV.split('\n').map((line, i) => {
                if (line.startsWith('# ')) return <h1 key={i} className="text-2xl font-bold mt-4 mb-2">{line.replace('# ', '')}</h1>;
                if (line.startsWith('## ')) return <h2 key={i} className="text-lg font-bold mt-4 mb-2 uppercase border-b border-neutral-300 pb-1">{line.replace('## ', '')}</h2>;
                if (line.startsWith('* ') || line.startsWith('- ')) return <li key={i} className="ml-4 mb-1">{line.substring(2)}</li>;
                if (line.trim() === '') return <br key={i} />;
                return <p key={i} className="mb-1">{line}</p>;
              })}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-neutral-400 space-y-4 pt-32">
              <span className="text-5xl">📄</span>
              <p className="text-sm">Isi formulir dan klik "Generate AI & Format CV" untuk melihat pratinjau.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // ================================================================
  // 8. RENDER UTAMA APP
  // ================================================================
  return (
    <main className="min-h-screen bg-[#050505] text-neutral-100 font-sans pb-16 selection:bg-yellow-500/30">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-yellow-600/10 via-amber-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
        <header className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-medium tracking-wide uppercase">
            <span>✨ LamaranAI</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white font-serif">
            Lamaran<span className="text-yellow-500">AI</span> 
          </h1>
          <p className="text-neutral-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Platform AI untuk membuat Surat Lamaran, CV Profesional & Analisis Skor ATS.
          </p>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-950/50 border border-red-500/50 rounded-xl text-red-200 text-sm flex items-center justify-between">
            <span>⚠️ {error}</span>
            <button onClick={() => setError("")} className="text-xs underline hover:text-white">Tutup</button>
          </div>
        )}

        {/* NAVIGASI TAB */}
        <div className="flex overflow-x-auto gap-2 p-1.5 bg-neutral-900/80 border border-white/10 rounded-2xl mb-8 no-scrollbar backdrop-blur-md">
          {[
            { id: "cover-letter", label: "📝 Surat Lamaran", desc: "Generator & Signature" },
            { id: "ats-analyzer", label: "📊 Analisis ATS", desc: "Skor Kecocokan CV" },
            { id: "interview-prep", label: "🎯 Simulasi Interview", desc: "Pertanyaan STAR" },
            { id: "cv-builder", label: "📄 CV Builder", desc: "AI Format & PDF" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 min-w-[140px] py-3 px-4 rounded-xl text-left transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-yellow-600 via-amber-600 to-yellow-600 text-white font-bold shadow-lg shadow-yellow-600/20"
                  : "text-neutral-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <div className="text-sm font-semibold">{tab.label}</div>
              <div className="text-[11px] opacity-80 font-normal">{tab.desc}</div>
            </button>
          ))}
        </div>

        {/* ========================================================== */}
        {/* TAB SURAT LAMARAN */}
        {/* ========================================================== */}
        {activeTab === "cover-letter" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 space-y-6 bg-neutral-900/40 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
              <h2 className="text-lg font-bold text-white border-b border-white/10 pb-3 flex items-center justify-between">
                <span>Informasi Pelamar & Pekerjaan</span>
                <span className="text-xs font-normal text-yellow-500 bg-yellow-500/10 px-2.5 py-1 rounded-md">Langkah 1</span>
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">Nama Lengkap</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Budi Santoso" className="w-full bg-black/50 border border-neutral-700 rounded-lg p-2.5 text-sm text-white focus:border-yellow-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">Kota Domisili</label>
                    <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Jakarta Selatan" className="w-full bg-black/50 border border-neutral-700 rounded-lg p-2.5 text-sm text-white focus:border-yellow-500 outline-none" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">No. HP / WhatsApp</label>
                    <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="081234567890" className="w-full bg-black/50 border border-neutral-700 rounded-lg p-2.5 text-sm text-white focus:border-yellow-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="budi@email.com" className="w-full bg-black/50 border border-neutral-700 rounded-lg p-2.5 text-sm text-white focus:border-yellow-500 outline-none" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/5">
                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">Posisi Target *</label>
                    <input type="text" required value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="Senior Fullstack Dev" className="w-full bg-black/50 border border-neutral-700 rounded-lg p-2.5 text-sm text-white focus:border-yellow-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">Nama Perusahaan *</label>
                    <input type="text" required value={company} onChange={(e) => setCompany(e.target.value)} placeholder="PT Tech Innovation" className="w-full bg-black/50 border border-neutral-700 rounded-lg p-2.5 text-sm text-white focus:border-yellow-500 outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">Gaya Bahasa Surat</label>
                  <select value={tone} onChange={(e) => setTone(e.target.value)} className="w-full bg-black/50 border border-neutral-700 rounded-lg p-2.5 text-sm text-white focus:border-yellow-500 outline-none cursor-pointer">
                    <option value="Profesional">Profesional & Formal (Sangat direkomendasikan)</option>
                    <option value="Percaya Diri">Percaya Diri & Berorientasi Hasil</option>
                    <option value="Kreatif">Kreatif & Antusias (Startup/Agensi)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">Deskripsi Pekerjaan / Kualifikasi</label>
                  <textarea rows={3} value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} placeholder="Tempel persyaratan pekerjaan di sini..." className="w-full bg-black/50 border border-neutral-700 rounded-lg p-2.5 text-sm text-white focus:border-yellow-500 outline-none resize-none" />
                </div>
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">Pengalaman / Poin CV</label>
                  <textarea rows={3} value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="Tempel ringkasan pengalaman utama Anda..." className="w-full bg-black/50 border border-neutral-700 rounded-lg p-2.5 text-sm text-white focus:border-yellow-500 outline-none resize-none" />
                </div>
                <div className="pt-3 border-t border-white/10">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs text-neutral-300 font-semibold flex items-center gap-1.5">
                      <span>✍️ Tanda Tangan Digital</span>
                      {hasSignature && <span className="text-[10px] text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded">Tersimpan</span>}
                    </label>
                    <button type="button" onClick={clearSignature} className="text-[11px] text-red-400 hover:underline">Hapus Canvas</button>
                  </div>
                  <div className="bg-white rounded-xl overflow-hidden h-[110px] w-full relative touch-none border border-neutral-300">
                    <canvas ref={canvasRef} width={380} height={110} className="w-full h-full cursor-crosshair" onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseLeave={stopDrawing} onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={stopDrawing} />
                    {!hasSignature && <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-neutral-400 text-xs italic">Goreskan tanda tangan Anda di sini</div>}
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-1">Tanda tangan akan otomatis disisipkan di antara "Hormat saya," dan Nama Anda saat PDF dibuat.</p>
                </div>
                <button type="button" onClick={() => handleGenerateCoverLetter()} disabled={isGeneratingLetter} className="w-full py-3.5 bg-gradient-to-r from-yellow-600 via-amber-600 to-yellow-600 hover:from-yellow-500 hover:to-amber-500 text-white font-bold rounded-xl shadow-lg transition-all disabled:opacity-50">
                  {isGeneratingLetter ? "Menganalisis & Menulis Surat..." : "Buat Surat Lamaran AI ✨"}
                </button>
              </div>
            </div>

            <div className="lg:col-span-7 flex flex-col bg-neutral-900/40 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
              <div className="flex flex-wrap justify-between items-center border-b border-white/10 pb-4 mb-4 gap-2">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-bold text-yellow-500 font-serif">Hasil Surat Lamaran</h2>
                  {outputLetter && (
                    <div className="flex bg-neutral-800 rounded-lg p-0.5 text-xs">
                      <button onClick={() => setViewMode("preview")} className={`px-2.5 py-1 rounded-md transition-all ${viewMode === "preview" ? "bg-yellow-600 text-white font-bold" : "text-neutral-400"}`}>👁️ Previu Dokumen</button>
                      <button onClick={() => setViewMode("edit")} className={`px-2.5 py-1 rounded-md transition-all ${viewMode === "edit" ? "bg-yellow-600 text-white font-bold" : "text-neutral-400"}`}>✏️ Edit Teks</button>
                    </div>
                  )}
                </div>
                {outputLetter && (
                  <div className="flex gap-2">
                    <button onClick={() => copyToClipboard(outputLetter, "Surat Lamaran")} className="text-xs bg-neutral-800 hover:bg-neutral-700 px-3 py-1.5 rounded-lg border border-white/10 transition-colors">
                      {copyStatus === "Surat Lamaran" ? "✓ Tersalin" : "📋 Salin Teks"}
                    </button>
                    <button onClick={exportPDF} className="text-xs bg-yellow-600 hover:bg-yellow-500 font-bold px-3 py-1.5 rounded-lg text-white transition-colors flex items-center gap-1">
                      <span>📥 Unduh PDF</span>
                    </button>
                  </div>
                )}
              </div>

              {outputLetter && (
                <div className="mb-4 flex flex-wrap gap-2">
                  <span className="text-xs text-neutral-400 flex items-center mr-1">AI Refiner Quick Actions:</span>
                  {[
                    { label: "⚡ Singkatkan", prompt: "Buat surat ini lebih singkat, ringkas, dan padat tanpa kehilangan poin utama." },
                    { label: "👔 Buat Lebih Formal", prompt: "Ubah nada bahasa menjadi sangat formal dan diplomatis." },
                    { label: "🚀 Tekankan Kepemimpinan", prompt: "Soroti aspek kepemimpinan, inisiatif, dan pencapaian terukur." },
                    { label: "🌐 Translate to English", prompt: "Translate this entire cover letter to high-level professional English." }
                  ].map((btn, idx) => (
                    <button key={idx} disabled={isGeneratingLetter} onClick={() => handleRefineLetter(btn.prompt)} className="text-xs bg-neutral-800 hover:bg-yellow-600/30 text-yellow-300 border border-yellow-500/30 px-2.5 py-1 rounded-full transition-all disabled:opacity-50">
                      {btn.label}
                    </button>
                  ))}
                </div>
              )}

              <div className="flex-1 bg-white rounded-xl p-6 sm:p-8 text-black min-h-[500px] shadow-2xl relative overflow-y-auto">
                {isGeneratingLetter ? (
                  <div className="h-full flex flex-col items-center justify-center space-y-4 text-neutral-500 py-20">
                    <div className="w-8 h-8 border-4 border-yellow-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm font-medium">Sedang menulis surat lamaran profesional yang disesuaikan dengan data Anda...</p>
                  </div>
                ) : outputLetter ? (
                  viewMode === "edit" ? (
                    <textarea value={outputLetter} onChange={(e) => setOutputLetter(e.target.value)} className="w-full h-full min-h-[480px] bg-transparent text-black font-serif text-sm leading-relaxed outline-none resize-none" />
                  ) : (
                    <div className="min-h-[480px]">{renderFormattedLetter()}</div>
                  )
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 text-neutral-400 py-20">
                    <div className="text-4xl mb-3">📄</div>
                    <p className="font-semibold text-neutral-700">Belum ada surat lamaran yang dibuat</p>
                    <p className="text-xs text-neutral-500 max-w-sm mt-1">Isi formulir di sebelah kiri dan klik "Buat Surat Lamaran AI" untuk memulai.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* TAB ATS */}
        {/* ========================================================== */}
        {activeTab === "ats-analyzer" && (
          <div className="space-y-6">
            <div className="bg-neutral-900/40 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white font-serif">Analisis Kecocokan ATS & Kata Kunci CV</h2>
                  <p className="text-xs text-neutral-400">Pemeriksaan instan kualifikasi CV Anda terhadap Deskripsi Pekerjaan target menggunakan analisis AI cerdas.</p>
                </div>
                <button onClick={handleAnalyzeAts} disabled={isAnalyzingAts} className="py-2.5 px-6 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 font-bold text-white text-sm rounded-xl transition-all shadow-lg disabled:opacity-50">
                  {isAnalyzingAts ? "Menganalisis Kualifikasi..." : "Jalankan Analisis ATS 📊"}
                </button>
              </div>

              {atsResult ? (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  <div className="md:col-span-4 bg-black/60 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                    <div className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-2">Skor Kecocokan ATS</div>
                    <div className="relative w-36 h-36 flex items-center justify-center my-2">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <path className="text-neutral-800" strokeWidth="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <path className={atsResult.matchScore >= 75 ? "text-green-500" : atsResult.matchScore >= 50 ? "text-yellow-500" : "text-red-500"} strokeDasharray={`${atsResult.matchScore}, 100`} strokeWidth="3.5" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      </svg>
                      <span className="absolute text-3xl font-extrabold text-white font-serif">{atsResult.matchScore}%</span>
                    </div>
                    <p className="text-xs text-neutral-300 mt-2 leading-relaxed">{atsResult.summary}</p>
                  </div>

                  <div className="md:col-span-8 space-y-4">
                    <div className="bg-black/40 border border-green-500/20 rounded-xl p-4">
                      <h4 className="text-xs font-bold text-green-400 uppercase tracking-wider mb-2 flex items-center gap-2"><span>✓ Skill & Kata Kunci Sesuai</span></h4>
                      <div className="flex flex-wrap gap-2">{atsResult.matchingSkills.map((sk, i) => <span key={i} className="text-xs bg-green-950/60 text-green-300 border border-green-500/30 px-2.5 py-1 rounded-md">{sk}</span>)}</div>
                    </div>
                    <div className="bg-black/40 border border-red-500/20 rounded-xl p-4">
                      <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider mb-2 flex items-center gap-2"><span>⚠️ Kata Kunci Kunci yang Belum Terdeteksi</span></h4>
                      <div className="flex flex-wrap gap-2">{atsResult.missingKeywords.map((mk, i) => <span key={i} className="text-xs bg-red-950/60 text-red-300 border border-red-500/30 px-2.5 py-1 rounded-md">+ {mk}</span>)}</div>
                    </div>
                    <div className="bg-black/40 border border-yellow-500/20 rounded-xl p-4">
                      <h4 className="text-xs font-bold text-yellow-400 uppercase tracking-wider mb-2">💡 Rekomendasi Optimasi CV</h4>
                      <ul className="space-y-1.5 text-xs text-neutral-300 list-disc list-inside">{atsResult.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}</ul>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-neutral-500 border border-dashed border-neutral-800 rounded-xl"><p className="text-sm font-medium">Klik "Jalankan Analisis ATS" untuk membandingkan CV Anda dengan kualifikasi target.</p></div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* TAB INTERVIEW */}
        {/* ========================================================== */}
        {activeTab === "interview-prep" && (
          <div className="space-y-6">
            <div className="bg-neutral-900/40 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white font-serif">Simulasi Wawancara Kerja & Panduan STAR</h2>
                  <p className="text-xs text-neutral-400">Pertanyaan terprediksi berdasarkan posisi {jobTitle || "[Posisi Target]"} dan jawaban ideal berformat STAR.</p>
                </div>
                <button onClick={handleGenerateInterviewPrep} disabled={isGeneratingQuestions} className="py-2.5 px-6 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 font-bold text-white text-sm rounded-xl transition-all shadow-lg disabled:opacity-50">
                  {isGeneratingQuestions ? "Menyiapkan Pertanyaan..." : "Buat Simulasi Wawancara 🎯"}
                </button>
              </div>

              {interviewQuestions.length > 0 ? (
                <div className="space-y-4">
                  {interviewQuestions.map((q, idx) => (
                    <div key={idx} className="bg-black/50 border border-white/10 rounded-xl p-5 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-yellow-500 bg-yellow-500/10 px-2.5 py-1 rounded-md border border-yellow-500/20">{q.category}</span>
                        <span className="text-xs text-neutral-500">Pertanyaan #{idx + 1}</span>
                      </div>
                      <h3 className="text-base font-bold text-white">{q.question}</h3>
                      <div className="bg-neutral-900/80 rounded-lg p-3.5 border border-white/5 space-y-2">
                        <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Contoh Jawaban Ideal (Format STAR):</div>
                        <p className="text-xs text-neutral-200 leading-relaxed font-serif whitespace-pre-line">{q.suggestedAnswer}</p>
                      </div>
                      <div className="text-xs text-amber-300/90 italic flex items-center gap-1.5">
                        <span>💡 Tips:</span>
                        <span>{q.tip}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-neutral-500 border border-dashed border-neutral-800 rounded-xl"><p className="text-sm font-medium">Klik "Buat Simulasi Wawancara" untuk memprediksi pertanyaan wawancara spesifik.</p></div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* TAB CV BUILDER (Gabungan Langsung) */}
        {/* ========================================================== */}
        {activeTab === "cv-builder" && (
          <div className="w-full animate-in fade-in duration-300">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 font-sans text-neutral-800 bg-neutral-900/40 border border-white/10 rounded-2xl backdrop-blur-xl">
              {/* Header CV Builder */}
              <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-indigo-900 tracking-tight">AI CV Builder Pro</h1>
                <p className="text-neutral-500 mt-1">Susun resume profesional dengan bantuan AI Gemini dan langsung ekspor ke PDF berstandar ATS.</p>
              </div>

              {cvError && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-lg">
                  <strong>Peringatan:</strong> {cvError}
                </div>
              )}

              {/* Grid Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                <div className="lg:col-span-5 flex flex-col space-y-6">
                  <div className="flex bg-neutral-200/50 p-1 rounded-xl">
                    <button 
                      onClick={() => setCvActiveTab("form")}
                      className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${cvActiveTab === "form" ? "bg-white text-indigo-700 shadow-sm" : "text-neutral-500 hover:text-neutral-700"}`}
                    >
                      📝 Isi Data
                    </button>
                    <button 
                      onClick={() => setCvActiveTab("preview")}
                      className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all lg:hidden ${cvActiveTab === "preview" ? "bg-white text-indigo-700 shadow-sm" : "text-neutral-500 hover:text-neutral-700"}`}
                    >
                      👁️ Lihat Hasil
                    </button>
                  </div>

                  <div className={cvActiveTab === "form" ? "block" : "hidden lg:block"}>
                    {renderCVForm()}
                    <div className="mt-6">
                      <button
                        onClick={handleGenerateCV}
                        disabled={cvIsGenerating || !cvPersonalInfo.name || !cvPersonalInfo.jobTitle}
                        className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
                      >
                        {cvIsGenerating ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Memproses dengan AI...
                          </>
                        ) : (
                          <>
                            ✨ Generate AI & Format CV
                          </>
                        )}
                      </button>
                      <p className="text-xs text-center text-neutral-400 mt-2">Pastikan Nama dan Posisi Target sudah terisi.</p>
                    </div>
                  </div>
                </div>

                <div className={`lg:col-span-7 ${cvActiveTab === "preview" ? "block" : "hidden lg:block"}`}>
                  {renderCVPreview()}
                </div>

              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}