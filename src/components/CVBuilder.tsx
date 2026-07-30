"use client";

import React, { useState, useRef } from "react";

export default function CVBuilder() {
  // State untuk form input data CV
  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    jobTitle: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
  });

  const [summary, setSummary] = useState("");
  const [experience, setExperience] = useState("");
  const [education, setEducation] = useState("");
  const [skills, setSkills] = useState("");

  // State untuk proses dan hasil
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCV, setGeneratedCV] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"form" | "preview">("form");

  // Fungsi untuk memoles dan memformat CV menggunakan Gemini API Proxy
  const handleGenerateAI = async () => {
    setIsGenerating(true);
    setError("");

    try {
      const prompt = `Anda adalah seorang ahli penulis Resume/CV berstandar ATS (Applicant Tracking System).
Tugas Anda adalah merapikan, memoles, dan menyusun data berikut menjadi format CV Markdown yang profesional, kuat, dan menarik.
Gunakan bahasa yang aktif dan berorientasi pada hasil (action-oriented).

DATA PELAMAR:
Nama: ${personalInfo.name || "[Nama Lengkap]"}
Posisi Target: ${personalInfo.jobTitle || "[Posisi]"}
Email: ${personalInfo.email || "[Email]"}
Telepon: ${personalInfo.phone || "[Telepon]"}
Lokasi: ${personalInfo.location || "[Lokasi]"}
LinkedIn: ${personalInfo.linkedin || "Tidak ada"}

RINGKASAN PROFIL:
${summary || "Belum diisi. Buatkan ringkasan singkat berdasarkan peran target."}

PENGALAMAN KERJA:
${experience || "Belum diisi."}

PENDIDIKAN:
${education || "Belum diisi."}

KEAHLIAN (SKILLS):
${skills || "Belum diisi."}

PENTING:
- Keluarkan HANYA teks Markdown murni (tanpa tag pembungkus seperti \`\`\`markdown).
- Gunakan Heading (# atau ##) untuk memisahkan bagian.
- Buat daftar pengalaman kerja menggunakan bullet points.`;

      // Memanggil endpoint Proxy API yang Anda buat (src/app/api/gemini/route.ts)
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          modelEndpoint: "gemini-1.5-flash:generateContent", // Anda bisa mengubah model jika perlu
          payload: {
            contents: [{ parts: [{ text: prompt }] }]
          }
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal menghubungi API server.");
      }

      const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (aiText) {
        setGeneratedCV(aiText);
        setActiveTab("preview"); // Otomatis pindah ke tab preview
      } else {
        throw new Error("Respon AI kosong.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Terjadi kesalahan saat meng-generate CV.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Fungsi untuk membuat PDF dari hasil CV
  const exportPDF = async () => {
    try {
      // Load jsPDF secara dinamis untuk menghindari masalah SSR di Next.js
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

      // Render Header CV (Info Pribadi)
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text(personalInfo.name || "NAMA LENGKAP", marginLeft, cursorY);
      cursorY += 8;

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 100, 100);
      doc.text(personalInfo.jobTitle || "Posisi Profesional", marginLeft, cursorY);
      cursorY += 6;

      doc.setFontSize(10);
      doc.setTextColor(50, 50, 50);
      const contactInfo = `${personalInfo.email} | ${personalInfo.phone} | ${personalInfo.location}`;
      doc.text(contactInfo, marginLeft, cursorY);
      cursorY += 10;

      // Garis pembatas
      doc.setDrawColor(200, 200, 200);
      doc.line(marginLeft, cursorY, 190, cursorY);
      cursorY += 10;

      // Render Konten (Markdown Parsing Sederhana)
      doc.setTextColor(0, 0, 0);
      const lines = generatedCV ? generatedCV.split("\n") : [];
      
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
          cursorY += 3; // Jarak antar paragraf
        }
      }

      const fileName = personalInfo.name ? `CV_${personalInfo.name.replace(/\s+/g, '_')}.pdf` : "CV_Profesional.pdf";
      doc.save(fileName);
    } catch (err: any) {
      alert("Gagal mengekspor PDF: " + err.message);
    }
  };

  const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonalInfo((prev) => ({ ...prev, [name]: value }));
  };

  const renderForm = () => (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200">
        <h3 className="text-lg font-bold text-neutral-800 mb-4 border-b pb-2">Informasi Pribadi</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Nama Lengkap</label>
            <input type="text" name="name" value={personalInfo.name} onChange={handleInfoChange} placeholder="John Doe" className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Posisi Target</label>
            <input type="text" name="jobTitle" value={personalInfo.jobTitle} onChange={handleInfoChange} placeholder="Software Engineer" className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Email</label>
            <input type="email" name="email" value={personalInfo.email} onChange={handleInfoChange} placeholder="john@email.com" className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Telepon / WA</label>
            <input type="text" name="phone" value={personalInfo.phone} onChange={handleInfoChange} placeholder="08123456789" className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Lokasi / Kota</label>
            <input type="text" name="location" value={personalInfo.location} onChange={handleInfoChange} placeholder="Jakarta, Indonesia" className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Profil LinkedIn (Opsional)</label>
            <input type="text" name="linkedin" value={personalInfo.linkedin} onChange={handleInfoChange} placeholder="linkedin.com/in/johndoe" className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Ringkasan Profil (Summary)</label>
          <textarea rows={3} value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Tuliskan 2-3 kalimat mengenai keahlian dan fokus karir Anda..." className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none resize-none transition-all" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Pengalaman Kerja</label>
          <textarea rows={4} value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="Misal: Senior Developer di PT Tech (2020-2023) - Memimpin tim beranggotakan 5 orang..." className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none resize-none transition-all" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Pendidikan</label>
          <textarea rows={2} value={education} onChange={(e) => setEducation(e.target.value)} placeholder="S1 Teknik Informatika - Universitas Indonesia (2016-2020)" className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none resize-none transition-all" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Keahlian (Skills)</label>
          <input type="text" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="React, Node.js, Project Management, SEO" className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all" />
        </div>
      </div>
    </div>
  );

  const renderPreview = () => (
    <div className="bg-white rounded-2xl shadow-lg border border-neutral-200 h-full min-h-[600px] flex flex-col overflow-hidden animate-in fade-in duration-300">
      {/* Header Preview Toolbar */}
      <div className="bg-neutral-50 border-b border-neutral-200 px-4 py-3 flex justify-between items-center">
        <span className="text-sm font-semibold text-neutral-600">Dokumen CV (Format A4)</span>
        <button 
          onClick={exportPDF} 
          disabled={!generatedCV}
          className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-neutral-300 text-white text-xs font-bold rounded-md transition-colors shadow-sm"
        >
          📥 Unduh PDF
        </button>
      </div>
      
      {/* Kertas Preview */}
      <div className="flex-1 p-8 overflow-y-auto bg-neutral-100 flex justify-center">
        <div className="bg-white w-full max-w-[210mm] min-h-[297mm] shadow-md p-10 font-serif text-neutral-800 break-words">
          {generatedCV ? (
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {/* Basic Markdown Rendering for Preview */}
              {generatedCV.split('\n').map((line, i) => {
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

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 font-sans text-neutral-800">
      {/* Header Aplikasi */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-indigo-900 tracking-tight">AI CV Builder Pro</h1>
        <p className="text-neutral-500 mt-1">Susun resume profesional dengan bantuan AI Gemini dan langsung ekspor ke PDF berstandar ATS.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-lg">
          <strong>Peringatan:</strong> {error}
        </div>
      )}

      {/* Grid Layout untuk Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Kolom Kiri: Navigasi dan Form */}
        <div className="lg:col-span-5 flex flex-col space-y-6">
          {/* Tabs untuk Mobile/Medium Screen */}
          <div className="flex bg-neutral-200/50 p-1 rounded-xl">
            <button 
              onClick={() => setActiveTab("form")}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === "form" ? "bg-white text-indigo-700 shadow-sm" : "text-neutral-500 hover:text-neutral-700"}`}
            >
              📝 Isi Data
            </button>
            <button 
              onClick={() => setActiveTab("preview")}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all lg:hidden ${activeTab === "preview" ? "bg-white text-indigo-700 shadow-sm" : "text-neutral-500 hover:text-neutral-700"}`}
            >
              👁️ Lihat Hasil
            </button>
          </div>

          <div className={activeTab === "form" ? "block" : "hidden lg:block"}>
            {renderForm()}
            
            {/* Tombol Aksi Generate */}
            <div className="mt-6">
              <button
                onClick={handleGenerateAI}
                disabled={isGenerating || !personalInfo.name || !personalInfo.jobTitle}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
              >
                {isGenerating ? (
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

        {/* Kolom Kanan: Preview CV (Selalu terlihat di desktop, menggunakan tab di mobile) */}
        <div className={`lg:col-span-7 ${activeTab === "preview" ? "block" : "hidden lg:block"}`}>
          {renderPreview()}
        </div>

      </div>
    </div>
  );
}
