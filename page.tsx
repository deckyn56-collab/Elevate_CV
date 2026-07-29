"use client";

import React, { useState, useEffect, useRef } from "react";

// Helper to convert base64 PCM16 audio data into a playable WAV Blob URL
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
  // Navigation active tab
  const [activeTab, setActiveTab] = useState<"cover-letter" | "ats-analyzer" | "interview-prep" | "pitch-tts" | "ai-avatar">("cover-letter");

  // User Profile & Company Inputs
  const [apiKey, setApiKey] = useState("");
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

  // Output states for features
  const [outputLetter, setOutputLetter] = useState("");
  const [isGeneratingLetter, setIsGeneratingLetter] = useState(false);

  // ATS State
  const [atsResult, setAtsResult] = useState<{
    matchScore: number;
    summary: string;
    matchingSkills: string[];
    missingKeywords: string[];
    recommendations: string[];
    strengths: string[];
  } | null>(null);
  const [isAnalyzingAts, setIsAnalyzingAts] = useState(false);

  // Interview Prep State
  const [interviewQuestions, setInterviewQuestions] = useState<Array<{
    category: string;
    question: string;
    suggestedAnswer: string;
    tip: string;
  }>>([]);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);

  // TTS State
  const [pitchScript, setPitchScript] = useState("");
  const [isGeneratingPitch, setIsGeneratingPitch] = useState(false);
  const [voice, setVoice] = useState("Zephyr");
  const [isSynthesizingSpeech, setIsSynthesizingSpeech] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  // AI Avatar State
  const [avatarPrompt, setAvatarPrompt] = useState("Professional corporate headshot of a friendly candidate in business attire, modern office background, studio lighting, highly detailed");
  const [generatedAvatar, setGeneratedAvatar] = useState<string | null>(null);
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);

  // Global Error & Status
  const [error, setError] = useState("");
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  // Canvas Ref for Signature
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem("elevatecv_data_v2");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.apiKey) setApiKey(parsed.apiKey);
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
      } catch (e) {
        console.error("Gagal memuat local storage");
      }
    }
  }, []);

  useEffect(() => {
    const dataToSave = {
      apiKey, name, location, userAddress, phone, email, company, companyAddress, jobTitle, experience, jobDescription
    };
    localStorage.setItem("elevatecv_data_v2", JSON.stringify(dataToSave));
  }, [apiKey, name, location, userAddress, phone, email, company, companyAddress, jobTitle, experience, jobDescription]);

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
  };

  const stopDrawing = () => setIsDrawing(false);

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

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

      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: promptText }] }] })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error?.message || "Gagal menghubungi Gemini API.");
      }

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
Pertahankan struktur surat lamaran resmi (tanggal, tujuan, salam pembuka, isi, salam penutup, nama). Kembalikan teks surat lamaran saja tanpa komentar.`;

      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: promptText }] }] })
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
      setError("Mohon isi Deskripsi Pekerjaan dan Pengalaman CV Anda terlebih dahulu untuk analisis ATS.");
      return;
    }

    setIsAnalyzingAts(true);
    setError("");

    try {
      const userPrompt = `Lakukan analisis pencocokan ATS (Applicant Tracking System) antara CV Pelamar dan Deskripsi Pekerjaan berikut.
      
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

      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "Gagal memproses analisis ATS.");

      const jsonString = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (jsonString) {
        setAtsResult(JSON.parse(jsonString));
      }
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

      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "Gagal membuat pertanyaan wawancara.");

      const jsonString = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (jsonString) {
        setInterviewQuestions(JSON.parse(jsonString));
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat memuat simulasi interview.");
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  const handleGeneratePitch = async () => {
    setIsGeneratingPitch(true);
    setError("");

    try {
      const promptText = `Buat naskah Elevator Pitch (perkenalan singkat 30-45 detik) yang sangat berbobot dan percaya diri untuk pelamar bernama ${name || "Pelamar"} yang melamar posisi ${jobTitle || "Posisi Target"} di ${company || "Perusahaan"}.
Pengalaman/Keahlian: ${experience || "Memiliki keterampilan relevan dan semangat tinggi."}

Tuliskan dalam Bahasa Indonesia yang natural untuk diucapkan secara lisan saat interview atau networking. Panjang sekitar 70-100 kata. Kembalikan naskah saja.`;

      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: promptText }] }] })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "Gagal membuat pitch.");

      const script = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      setPitchScript(script);
    } catch (err: any) {
      setError(err.message || "Gagal membuat naskah pitch.");
    } finally {
      setIsGeneratingPitch(false);
    }
  };

  const handleSynthesizePitchSpeech = async () => {
    if (!pitchScript.trim()) {
      setError("Buat atau ketik naskah pitch terlebih dahulu.");
      return;
    }

    setIsSynthesizingSpeech(true);
    setError("");
    setAudioUrl(null);

    try {
      const payload = {
        contents: [{
          parts: [{ text: `Bacakan naskah perkenalan diri ini dengan nada percaya diri, hangat, dan jelas:\n\n${pitchScript}` }]
        }],
        generationConfig: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: voice }
            }
          }
        }
      };

      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "Gagal melakukan sintesis suara TTS.");

      const part = data.candidates?.[0]?.content?.parts?.[0];
      const base64Audio = part?.inlineData?.data;
      const mimeType = part?.inlineData?.mimeType || "";

      if (base64Audio) {
        // Decode base64 to binary
        const binaryStr = window.atob(base64Audio);
        const len = binaryStr.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryStr.charCodeAt(i);
        }

        // Convert Int16 PCM array to WAV Blob
        const pcm16 = new Int16Array(bytes.buffer);
        const matchRate = mimeType.match(/rate=(\d+)/);
        const sampleRate = matchRate ? parseInt(matchRate[1], 10) : 24000;

        const wavBlob = pcmToWav(pcm16, sampleRate);
        const url = URL.createObjectURL(wavBlob);
        setAudioUrl(url);
      } else {
        throw new Error("Respon audio dari Gemini TTS kosong.");
      }
    } catch (err: any) {
      setError(err.message || "Terjadi masalah saat menghasilkan suara audio.");
    } finally {
      setIsSynthesizingSpeech(false);
    }
  };

  const handleGenerateAvatar = async () => {
    if (!avatarPrompt.trim()) return;
    setIsGeneratingAvatar(true);
    setError("");

    try {
      const payload = {
        instances: [{ prompt: avatarPrompt }],
        parameters: { sampleCount: 1 }
      };

      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${apiKey}`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "Gagal membuat foto profil AI.");

      const base64Data = data.predictions?.[0]?.bytesBase64Encoded;
      if (base64Data) {
        setGeneratedAvatar(`data:image/png;base64,${base64Data}`);
      } else {
        throw new Error("Format gambar dari server tidak ditemukan.");
      }
    } catch (err: any) {
      setError(err.message || "Gagal memproses gambar AI.");
    } finally {
      setIsGeneratingAvatar(false);
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

      const signatureDataUrl = canvasRef.current ? canvasRef.current.toDataURL("image/png") : null;

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

        // Check if line contains "Hormat saya"
        if (line.toLowerCase().includes("hormat saya")) {
          if (cursorY + 35 > pageHeight - marginBottom) {
            doc.addPage();
            cursorY = 25;
          }

          doc.text(line, marginLeft, cursorY);
          cursorY += 5;

          if (signatureDataUrl) {
            doc.addImage(signatureDataUrl, "PNG", marginLeft, cursorY, 40, 18);
            cursorY += 20;
          } else {
            cursorY += 15;
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

  return (
    <main className="min-h-screen bg-[#050505] text-neutral-100 font-sans pb-16 selection:bg-yellow-500/30">
      
      {/* Background Lighting Accent */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-yellow-600/10 via-amber-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
        
        {/* App Header */}
        <header className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-medium tracking-wide uppercase">
            <span>✨ Generative AI Career Suite</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white font-serif">
            Elevate<span className="text-yellow-500">CV</span> Pro
          </h1>
          <p className="text-neutral-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Asisten AI Karir Serba Ada: Generator Surat Lamaran, Analisis Skor ATS, Prep Interview STAR, Pitch Suara TTS & Foto Profil AI.
          </p>
        </header>

        {/* API Key Banner */}
        <div className="bg-gradient-to-r from-yellow-950/40 via-neutral-900/60 to-yellow-950/40 border border-yellow-600/30 rounded-2xl p-4 sm:p-5 mb-8 shadow-xl backdrop-blur-md">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center text-yellow-400 shrink-0 font-bold">
                🔑
              </div>
              <div>
                <h3 className="text-sm font-bold text-yellow-400 uppercase tracking-wider">Google Gemini API Key</h3>
                <p className="text-xs text-neutral-400">Dimasukkan lokal di browser Anda. Mendukung model `gemini-3-flash`, `gemini-2.5-flash-tts` & `imagen-4.0`.</p>
              </div>
            </div>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Masukkan API Key (AIzaSy...)"
              className="w-full sm:w-80 bg-black/70 border border-neutral-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all placeholder:text-neutral-600"
            />
          </div>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="mb-6 p-4 bg-red-950/50 border border-red-500/50 rounded-xl text-red-200 text-sm flex items-center justify-between">
            <span>⚠️ {error}</span>
            <button onClick={() => setError("")} className="text-xs underline hover:text-white">Tutup</button>
          </div>
        )}

        <div className="flex overflow-x-auto gap-2 p-1.5 bg-neutral-900/80 border border-white/10 rounded-2xl mb-8 no-scrollbar backdrop-blur-md">
          {[
            { id: "cover-letter", label: "📝 Surat Lamaran", desc: "Generator & Refiner" },
            { id: "ats-analyzer", label: "📊 Analisis ATS", desc: "Skor Kecocokan CV" },
            { id: "interview-prep", label: "🎯 Simulasi Interview", desc: "Pertanyaan STAR" },
            { id: "pitch-tts", label: "🎙️ Elevator Pitch & TTS", desc: "Suara AI Gemini" },
            { id: "ai-avatar", label: "👤 Foto Profil AI", desc: "Imagen 4.0 Studio" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 min-w-[170px] py-3 px-4 rounded-xl text-left transition-all duration-200 ${
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

        {activeTab === "cover-letter" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Input Form Column */}
            <div className="lg:col-span-5 space-y-6 bg-neutral-900/40 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
              <h2 className="text-lg font-bold text-white border-b border-white/10 pb-3 flex items-center justify-between">
                <span>Informasi Pelamar & Pekerjaan</span>
                <span className="text-xs font-normal text-yellow-500 bg-yellow-500/10 px-2.5 py-1 rounded-md">Langkah 1</span>
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">Nama Lengkap</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Budi Santoso"
                      className="w-full bg-black/50 border border-neutral-700 rounded-lg p-2.5 text-sm text-white focus:border-yellow-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">Kota Domisili</label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Jakarta Selatan"
                      className="w-full bg-black/50 border border-neutral-700 rounded-lg p-2.5 text-sm text-white focus:border-yellow-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">No. HP / WhatsApp</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="081234567890"
                      className="w-full bg-black/50 border border-neutral-700 rounded-lg p-2.5 text-sm text-white focus:border-yellow-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="budi@email.com"
                      className="w-full bg-black/50 border border-neutral-700 rounded-lg p-2.5 text-sm text-white focus:border-yellow-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/5">
                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">Posisi Target *</label>
                    <input
                      type="text"
                      required
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder="Senior Fullstack Dev"
                      className="w-full bg-black/50 border border-neutral-700 rounded-lg p-2.5 text-sm text-white focus:border-yellow-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">Nama Perusahaan *</label>
                    <input
                      type="text"
                      required
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="PT Tech Innovation"
                      className="w-full bg-black/50 border border-neutral-700 rounded-lg p-2.5 text-sm text-white focus:border-yellow-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-neutral-400 mb-1">Gaya Bahasa Surat</label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full bg-black/50 border border-neutral-700 rounded-lg p-2.5 text-sm text-white focus:border-yellow-500 outline-none cursor-pointer"
                  >
                    <option value="Profesional">Profesional & Formal (Sangat direkomendasikan)</option>
                    <option value="Percaya Diri">Percaya Diri & Berorientasi Hasil</option>
                    <option value="Kreatif">Kreatif & Antusias (Startup/Agensi)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-neutral-400 mb-1">Deskripsi Pekerjaan / Kualifikasi</label>
                  <textarea
                    rows={3}
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Tempel persyaratan pekerjaan di sini..."
                    className="w-full bg-black/50 border border-neutral-700 rounded-lg p-2.5 text-sm text-white focus:border-yellow-500 outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs text-neutral-400 mb-1">Pengalaman / Poin CV</label>
                  <textarea
                    rows={3}
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    placeholder="Tempel ringkasan pengalaman utama Anda..."
                    className="w-full bg-black/50 border border-neutral-700 rounded-lg p-2.5 text-sm text-white focus:border-yellow-500 outline-none resize-none"
                  />
                </div>

                <div className="pt-3 border-t border-white/10">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs text-neutral-300 font-semibold">Tanda Tangan Digital (Diikutsertakan di PDF)</label>
                    <button
                      type="button"
                      onClick={clearSignature}
                      className="text-[11px] text-red-400 hover:underline"
                    >
                      Hapus
                    </button>
                  </div>
                  <div className="bg-white rounded-xl overflow-hidden h-[110px] w-full relative touch-none border border-neutral-300">
                    <canvas
                      ref={canvasRef}
                      width={380}
                      height={110}
                      className="w-full h-full cursor-crosshair"
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={draw}
                      onTouchEnd={stopDrawing}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleGenerateCoverLetter()}
                  disabled={isGeneratingLetter}
                  className="w-full py-3.5 bg-gradient-to-r from-yellow-600 via-amber-600 to-yellow-600 hover:from-yellow-500 hover:to-amber-500 text-white font-bold rounded-xl shadow-lg transition-all disabled:opacity-50"
                >
                  {isGeneratingLetter ? "Menganalisis & Menulis Surat..." : "Buat Surat Lamaran AI ✨"}
                </button>
              </div>
            </div>

            {/* Output Column */}
            <div className="lg:col-span-7 flex flex-col bg-neutral-900/40 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
              <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-4">
                <h2 className="text-lg font-bold text-yellow-500 font-serif">Hasil Surat Lamaran</h2>
                {outputLetter && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyToClipboard(outputLetter, "Surat Lamaran")}
                      className="text-xs bg-neutral-800 hover:bg-neutral-700 px-3 py-1.5 rounded-lg border border-white/10 transition-colors"
                    >
                      {copyStatus === "Surat Lamaran" ? "✓ Tersalin" : "📋 Salin Teks"}
                    </button>
                    <button
                      onClick={exportPDF}
                      className="text-xs bg-yellow-600 hover:bg-yellow-500 font-bold px-3 py-1.5 rounded-lg text-white transition-colors"
                    >
                      📥 Unduh PDF
                    </button>
                  </div>
                )}
              </div>

              {/* Polish Buttons */}
              {outputLetter && (
                <div className="mb-4 flex flex-wrap gap-2">
                  <span className="text-xs text-neutral-400 flex items-center mr-1">AI Refiner Quick Actions:</span>
                  {[
                    { label: "⚡ Singkatkan", prompt: "Buat surat ini lebih singkat, ringkas, dan padat tanpa kehilangan poin utama." },
                    { label: "👔 Buat Lebih Formal", prompt: "Ubah nada bahasa menjadi sangat formal dan diplomatis." },
                    { label: "🚀 Tekankan Kepemimpinan", prompt: "Soroti aspek kepemimpinan, inisiatif, dan pencapaian terukur." },
                    { label: "🌐 Translate to English", prompt: "Translate this entire cover letter to high-level professional English." }
                  ].map((btn, idx) => (
                    <button
                      key={idx}
                      disabled={isGeneratingLetter}
                      onClick={() => handleRefineLetter(btn.prompt)}
                      className="text-xs bg-neutral-800 hover:bg-yellow-600/30 text-yellow-300 border border-yellow-500/30 px-2.5 py-1 rounded-full transition-all disabled:opacity-50"
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              )}

              <div className="flex-1 bg-white rounded-xl p-6 text-black min-h-[500px]">
                {isGeneratingLetter ? (
                  <div className="h-full flex flex-col items-center justify-center space-y-4 text-neutral-500">
                    <div className="w-8 h-8 border-4 border-yellow-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm font-medium">Gemini 3 Flash sedang menyusun surat lamaran terbaik untuk Anda...</p>
                  </div>
                ) : outputLetter ? (
                  <textarea
                    value={outputLetter}
                    onChange={(e) => setOutputLetter(e.target.value)}
                    className="w-full h-full min-h-[480px] bg-transparent text-black font-serif text-sm leading-relaxed outline-none resize-y"
                  />
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 text-neutral-400">
                    <div className="text-4xl mb-3">📄</div>
                    <p className="font-semibold text-neutral-700">Belum ada surat lamaran yang dibuat</p>
                    <p className="text-xs text-neutral-500 max-w-sm mt-1">Isi formulir di sebelah kiri dan klik "Buat Surat Lamaran AI" untuk memulai.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "ats-analyzer" && (
          <div className="space-y-6">
            <div className="bg-neutral-900/40 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white font-serif">Analisis Kecocokan ATS & Kata Kunci CV</h2>
                  <p className="text-xs text-neutral-400">Pemeriksaan instan kualifikasi CV Anda terhadap Deskripsi Pekerjaan target menggunakan `gemini-3-flash-preview` Structured JSON.</p>
                </div>
                <button
                  onClick={handleAnalyzeAts}
                  disabled={isAnalyzingAts}
                  className="py-2.5 px-6 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 font-bold text-white text-sm rounded-xl transition-all shadow-lg disabled:opacity-50"
                >
                  {isAnalyzingAts ? "Menganalisis Kualifikasi..." : "Jalankan Analisis ATS 📊"}
                </button>
              </div>

              {atsResult ? (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  
                  {/* Score Meter Card */}
                  <div className="md:col-span-4 bg-black/60 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                    <div className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-2">Skor Kecocokan ATS</div>
                    <div className="relative w-36 h-36 flex items-center justify-center my-2">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-neutral-800"
                          strokeWidth="3.5"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className={atsResult.matchScore >= 75 ? "text-green-500" : atsResult.matchScore >= 50 ? "text-yellow-500" : "text-red-500"}
                          strokeDasharray={`${atsResult.matchScore}, 100`}
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <span className="absolute text-3xl font-extrabold text-white font-serif">{atsResult.matchScore}%</span>
                    </div>
                    <p className="text-xs text-neutral-300 mt-2 leading-relaxed">{atsResult.summary}</p>
                  </div>

                  {/* Skills & Recommendation breakdown */}
                  <div className="md:col-span-8 space-y-4">
                    
                    {/* Matching Skills */}
                    <div className="bg-black/40 border border-green-500/20 rounded-xl p-4">
                      <h4 className="text-xs font-bold text-green-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <span>✓ Skill & Kata Kunci Sesuai</span>
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {atsResult.matchingSkills.map((sk, i) => (
                          <span key={i} className="text-xs bg-green-950/60 text-green-300 border border-green-500/30 px-2.5 py-1 rounded-md">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Missing Keywords */}
                    <div className="bg-black/40 border border-red-500/20 rounded-xl p-4">
                      <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <span>⚠️ Kata Kunci Kunci yang Belum Terdeteksi</span>
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {atsResult.missingKeywords.map((mk, i) => (
                          <span key={i} className="text-xs bg-red-950/60 text-red-300 border border-red-500/30 px-2.5 py-1 rounded-md">
                            + {mk}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actionable Recommendations */}
                    <div className="bg-black/40 border border-yellow-500/20 rounded-xl p-4">
                      <h4 className="text-xs font-bold text-yellow-400 uppercase tracking-wider mb-2">💡 Rekomendasi Optimasi CV</h4>
                      <ul className="space-y-1.5 text-xs text-neutral-300 list-disc list-inside">
                        {atsResult.recommendations.map((rec, i) => (
                          <li key={i}>{rec}</li>
                        ))}
                      </ul>
                    </div>

                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-neutral-500 border border-dashed border-neutral-800 rounded-xl">
                  <p className="text-sm font-medium">Klik "Jalankan Analisis ATS" untuk membandingkan CV Anda dengan kualifikasi target.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "interview-prep" && (
          <div className="space-y-6">
            <div className="bg-neutral-900/40 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white font-serif">Simulasi Wawancara Kerja & Panduan STAR</h2>
                  <p className="text-xs text-neutral-400">Pertanyaan terprediksi berdasarkan posisi {jobTitle || "[Posisi Target]"} dan jawaban ideal berformat STAR.</p>
                </div>
                <button
                  onClick={handleGenerateInterviewPrep}
                  disabled={isGeneratingQuestions}
                  className="py-2.5 px-6 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 font-bold text-white text-sm rounded-xl transition-all shadow-lg disabled:opacity-50"
                >
                  {isGeneratingQuestions ? "Menyiapkan Pertanyaan..." : "Buat Simulasi Wawancara 🎯"}
                </button>
              </div>

              {interviewQuestions.length > 0 ? (
                <div className="space-y-4">
                  {interviewQuestions.map((q, idx) => (
                    <div key={idx} className="bg-black/50 border border-white/10 rounded-xl p-5 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-yellow-500 bg-yellow-500/10 px-2.5 py-1 rounded-md border border-yellow-500/20">
                          {q.category}
                        </span>
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
                <div className="text-center py-12 text-neutral-500 border border-dashed border-neutral-800 rounded-xl">
                  <p className="text-sm font-medium">Klik "Buat Simulasi Wawancara" untuk memprediksi pertanyaan wawancara spesifik.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "pitch-tts" && (
          <div className="space-y-6">
            <div className="bg-neutral-900/40 border border-white/10 rounded-2xl p-6 backdrop-blur-xl space-y-6">
              <div className="border-b border-white/10 pb-4">
                <h2 className="text-xl font-bold text-white font-serif">Elevator Pitch & Sintesis Suara Gemini TTS</h2>
                <p className="text-xs text-neutral-400">Gunakan `gemini-2.5-flash-preview-tts` untuk mendengarkan pelafalan perkenalan diri Anda secara lisan dalam berbagai karakter suara AI.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Script Generator Column */}
                <div className="md:col-span-7 space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider">Naskah Elevator Pitch (30-45 Detik)</label>
                    <button
                      onClick={handleGeneratePitch}
                      disabled={isGeneratingPitch}
                      className="text-xs text-yellow-400 hover:underline flex items-center gap-1"
                    >
                      {isGeneratingPitch ? "Menyusun..." : "✨ Buatkan Naskah AI"}
                    </button>
                  </div>
                  <textarea
                    rows={7}
                    value={pitchScript}
                    onChange={(e) => setPitchScript(e.target.value)}
                    placeholder="Tuliskan naskah perkenalan diri di sini atau klik 'Buatkan Naskah AI'..."
                    className="w-full bg-black/60 border border-neutral-700 rounded-xl p-4 text-sm text-white focus:border-yellow-500 outline-none resize-none leading-relaxed"
                  />
                </div>

                {/* Voice & Synthesis Controls */}
                <div className="md:col-span-5 bg-black/40 border border-white/10 rounded-xl p-5 space-y-5 flex flex-col justify-between">
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-yellow-400 border-b border-white/10 pb-2">Pilih Suara Narator AI</h3>
                    
                    <div>
                      <label className="block text-xs text-neutral-400 mb-1.5">Model Suara Gemini Prebuilt</label>
                      <select
                        value={voice}
                        onChange={(e) => setVoice(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2.5 text-sm text-white focus:border-yellow-500 outline-none cursor-pointer"
                      >
                        <option value="Zephyr">Zephyr (Cerah & Jelas)</option>
                        <option value="Puck">Puck (Energik & Antusias)</option>
                        <option value="Kore">Kore (Tegas & Profesional)</option>
                        <option value="Fenrir">Fenrir (Kuat & Berwibawa)</option>
                        <option value="Aoede">Aoede (Hangat & Ramah)</option>
                      </select>
                    </div>

                    <button
                      onClick={handleSynthesizePitchSpeech}
                      disabled={isSynthesizingSpeech || !pitchScript.trim()}
                      className="w-full py-3 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 font-bold text-white text-sm rounded-xl transition-all shadow-md disabled:opacity-50"
                    >
                      {isSynthesizingSpeech ? "Mengonversi ke Suara..." : "🔊 Sintesis Suara Pitch"}
                    </button>
                  </div>

                  {/* Audio Player Container */}
                  {audioUrl && (
                    <div className="pt-3 border-t border-white/10 space-y-2">
                      <span className="text-xs font-semibold text-green-400 flex items-center gap-1">
                        ✓ Audio Siap Diputar:
                      </span>
                      <audio controls src={audioUrl} className="w-full h-10 rounded-lg" />
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>
        )}

        {activeTab === "ai-avatar" && (
          <div className="space-y-6">
            <div className="bg-neutral-900/40 border border-white/10 rounded-2xl p-6 backdrop-blur-xl space-y-6">
              <div className="border-b border-white/10 pb-4">
                <h2 className="text-xl font-bold text-white font-serif">Foto Profil Karir Studio AI (Imagen 4.0)</h2>
                <p className="text-xs text-neutral-400">Buat foto headshot profesional studio menggunakan model `imagen-4.0-generate-001` untuk CV atau LinkedIn Anda.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                
                {/* Prompt Controls */}
                <div className="md:col-span-7 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">Prompt Deskripsi Foto Studio</label>
                    <textarea
                      rows={4}
                      value={avatarPrompt}
                      onChange={(e) => setAvatarPrompt(e.target.value)}
                      className="w-full bg-black/60 border border-neutral-700 rounded-xl p-3.5 text-sm text-white focus:border-yellow-500 outline-none resize-none"
                    />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs text-neutral-500">Preset Prompt:</span>
                    {[
                      "Executive Corporate Male Headshot, black suit, studio neutral background",
                      "Professional Corporate Female Headshot, blazer, soft studio lighting",
                      "Tech Startup Founder headshot, modern office background, casual blazer"
                    ].map((p, i) => (
                      <button
                        key={i}
                        onClick={() => setAvatarPrompt(p)}
                        className="text-[11px] bg-neutral-800 hover:bg-neutral-700 text-neutral-300 px-2.5 py-1 rounded-md transition-colors"
                      >
                        Preset #{i + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleGenerateAvatar}
                    disabled={isGeneratingAvatar}
                    className="w-full py-3 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 font-bold text-white text-sm rounded-xl transition-all shadow-md disabled:opacity-50"
                  >
                    {isGeneratingAvatar ? "Membuat Foto Studio AI..." : "🎨 Hasilkan Foto Studio AI"}
                  </button>
                </div>

                {/* Avatar Preview */}
                <div className="md:col-span-5 flex flex-col items-center justify-center">
                  <div className="w-64 h-64 rounded-2xl bg-black/60 border-2 border-dashed border-neutral-800 flex items-center justify-center overflow-hidden relative shadow-2xl">
                    {isGeneratingAvatar ? (
                      <div className="flex flex-col items-center space-y-2 text-yellow-500">
                        <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
                        <span className="text-xs font-medium">Memproses Render Imagen...</span>
                      </div>
                    ) : generatedAvatar ? (
                      <img src={generatedAvatar} alt="AI Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center p-4 text-neutral-500">
                        <span className="text-3xl block mb-1">🖼️</span>
                        <span className="text-xs">Foto profil AI akan muncul di sini</span>
                      </div>
                    )}
                  </div>
                  {generatedAvatar && (
                    <a
                      href={generatedAvatar}
                      download="Foto_Profil_ElevateCV.png"
                      className="mt-3 text-xs text-yellow-400 hover:underline font-semibold flex items-center gap-1"
                    >
                      📥 Unduh Foto Profil
                    </a>
                  )}
                </div>

              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}