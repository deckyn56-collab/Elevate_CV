// ============================================
// LAMARANAI - AUTHENTICATION & CREDITS
// ============================================

// ============================================
// SUPABASE CONFIG
// ============================================
const SUPABASE_URL = 'https://fukndugvobbwdhtensso.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1a25kdWd2b2Jid2RodGVuc3NvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk4MzA2NDksImV4cCI6MjEwNTQwNjY0OX0.gXXHWSnyBsTHaephTyws03TT9m1NU__0MhcvSfN50ck';

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================
// AUTH STATE
// ============================================
let currentUser = null;
let userProfile = null;

// ============================================
// PAKET KREDIT
// ============================================
const PACKAGES = {
    starter: { name: 'Starter', price: 15000, credits: 10 },
    populer: { name: 'Populer', price: 50000, credits: 40 },
    hemat:   { name: 'Hemat',   price: 100000, credits: 95 },
    jumbo:   { name: 'Jumbo',   price: 250000, credits: 300 }
};

let selectedPackage = null;
let proofDataUrl = null;

// ============================================
// INIT AUTH
// ============================================
async function initAuth() {
    try {
        const { data: { session } } = await supabaseClient.auth.getSession();
        
        if (session) {
            currentUser = session.user;
            await loadUserProfile();
        }
        
        updateAuthUI();
        
        // Listen auth changes
        supabaseClient.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session) {
                currentUser = session.user;
                await loadUserProfile();
            } else if (event === 'SIGNED_OUT') {
                currentUser = null;
                userProfile = null;
            }
            updateAuthUI();
        });
    } catch (err) {
        console.error('Init auth error:', err);
    }
}

// ============================================
// LOAD USER PROFILE
// ============================================
async function loadUserProfile() {
    if (!currentUser) return;
    
    try {
        const { data, error } = await supabaseClient
            .from('users')
            .select('*')
            .eq('id', currentUser.id)
            .single();
        
        if (error) {
            console.error('Load profile error:', error);
            if (error.code === 'PGRST116') {
                await createUserProfile();
            }
            return;
        }
        
        userProfile = data;
        
        // Cek premium status
        await updatePremiumStatus();
        
    } catch (err) {
        console.error('Load profile error:', err);
    }
}

// Buat profile manual kalau trigger tidak jalan
async function createUserProfile() {
    if (!currentUser) return;
    
    try {
        const { data, error } = await supabaseClient
            .from('users')
            .insert({
                id: currentUser.id,
                email: currentUser.email,
                full_name: currentUser.user_metadata?.full_name || 
                           currentUser.user_metadata?.name || 
                           currentUser.email.split('@')[0],
                avatar_url: currentUser.user_metadata?.avatar_url || 
                            currentUser.user_metadata?.picture || null,
                credits: 5
            })
            .select()
            .single();
        
        if (error) {
            console.error('Create profile error:', error);
            return;
        }
        
        userProfile = data;
    } catch (err) {
        console.error('Create profile error:', err);
    }
}

// ============================================
// SIGN IN
// ============================================
async function signInWithGoogle() {
    try {
        const { error } = await supabaseClient.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin
            }
        });
        
        if (error) throw error;
    } catch (err) {
        alert('❌ Gagal login dengan Google: ' + err.message);
    }
}

async function signInWithEmail(email, password) {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password
    });
    
    if (error) throw error;
    return data;
}

async function signUpWithEmail(email, password, fullName) {
    const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName
            }
        }
    });
    
    if (error) throw error;
    return data;
}

async function signOut() {
    if (!confirm('Yakin ingin logout?')) return;
    
    try {
        await supabaseClient.auth.signOut();
        currentUser = null;
        userProfile = null;
        updateAuthUI();
        location.reload();
    } catch (err) {
        alert('Gagal logout: ' + err.message);
    }
}

// ============================================
// CREDIT SYSTEM
// ============================================
async function deductCredits(amount, action, metadata = null) {
    if (!currentUser) {
        throw new Error('Anda harus login untuk menggunakan fitur ini.');
    }
    
    try {
        const { data, error } = await supabaseClient.rpc('deduct_credits', {
            p_user_id: currentUser.id,
            p_amount: amount,
            p_action: action,
            p_metadata: metadata
        });
        
        if (error) throw error;
        
        const result = data[0];
        
        if (!result.success) {
            throw new Error(result.message);
        }
        
        // Update local profile
        if (userProfile) {
            userProfile.credits = result.new_credits;
        }
        updateCreditDisplay();
        updateAuthUI();
        
        return result;
    } catch (err) {
        console.error('Deduct credits error:', err);
        throw err;
    }
}

function getCredits() {
    return userProfile ? userProfile.credits : 0;
}

function isLoggedIn() {
    return !!currentUser && !!userProfile;
}

function isAdmin() {
    return userProfile && userProfile.is_admin === true;
}

// ============================================
// UI: HEADER AUTH AREA
// ============================================
function updateAuthUI() {
    const authArea = document.getElementById('authArea');
    if (!authArea) return;
    
    if (currentUser && userProfile) {
        const avatar = userProfile.avatar_url 
            ? `<img src="${userProfile.avatar_url}" alt="Avatar">` 
            : `<i class="fas fa-user"></i>`;
        
        const adminMenu = userProfile.is_admin 
            ? `<button onclick="openAdminPanel()" style="color:#eab308;">
                   <i class="fas fa-shield-alt"></i> Admin Panel
               </button>` 
            : '';
        
        // Badge premium
        const premiumBadge = isPremium() 
            ? `<div class="premium-badge"><i class="fas fa-crown"></i> Premium</div>` 
            : '';
        
        authArea.innerHTML = `
            <div class="user-menu">
                <div class="credit-badge" onclick="showCreditsInfo()" title="Klik untuk info kredit">
                    <i class="fas fa-coins"></i>
                    <span>${userProfile.credits}</span>
                </div>
                <div class="user-avatar" onclick="toggleUserMenu()">
                    ${avatar}
                </div>
                <div class="user-dropdown hidden" id="userDropdown">
                    <div class="user-info">
                        <div class="user-name">${userProfile.full_name || 'User'} ${premiumBadge}</div>
                        <div class="user-email">${userProfile.email}</div>
                    </div>
                    <div class="dropdown-divider"></div>
                    <button onclick="showCreditsInfo()">
                        <i class="fas fa-coins"></i> Kredit: ${userProfile.credits}
                    </button>
                    <button onclick="showBuyCredits()">
                        <i class="fas fa-plus-circle"></i> Beli Kredit
                    </button>
                    <button onclick="showDocumentHistory()">
    <i class="fas fa-file-alt"></i> Riwayat Dokumen
</button>
<button onclick="showTransactionHistory()">
    <i class="fas fa-receipt"></i> Riwayat Transaksi
</button>
                    ${adminMenu}
                    <div class="dropdown-divider"></div>
                    <button onclick="signOut()" class="logout-btn">
                        <i class="fas fa-sign-out-alt"></i> Logout
                    </button>
                </div>
            </div>
        `;
    } else {
        authArea.innerHTML = `
            <button class="btn-login" onclick="showLoginModal()">
                <i class="fas fa-sign-in-alt"></i> Masuk
            </button>
        `;
    }
}

function updateCreditDisplay() {
    const badges = document.querySelectorAll('.credit-badge span');
    badges.forEach(b => {
        if (userProfile) b.textContent = userProfile.credits;
    });
    
    const currentCreditsDisplay = document.getElementById('currentCreditsDisplay');
    if (currentCreditsDisplay && userProfile) {
        currentCreditsDisplay.textContent = userProfile.credits;
    }
}

function toggleUserMenu() {
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) dropdown.classList.toggle('hidden');
}

// Close dropdown kalau klik di luar
document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('userDropdown');
    const avatar = document.querySelector('.user-avatar');
    if (dropdown && !dropdown.classList.contains('hidden') && avatar && !avatar.contains(e.target)) {
        dropdown.classList.add('hidden');
    }
});

// ============================================
// MODAL LOGIN / REGISTER
// ============================================
function showLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) modal.style.display = 'flex';
}

function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) modal.style.display = 'none';
}

function switchLoginTab(tab) {
    document.querySelectorAll('.login-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.login-form').forEach(f => f.classList.add('hidden'));
    
    const activeTab = document.querySelector(`.login-tab[data-tab="${tab}"]`);
    if (activeTab) activeTab.classList.add('active');
    
    const form = document.getElementById(tab + 'Form');
    if (form) form.classList.remove('hidden');
}

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const btn = e.target.querySelector('button[type="submit"]');
    
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses...';
    
    try {
        await signInWithEmail(email, password);
        closeLoginModal();
        e.target.reset();
    } catch (error) {
        let msg = error.message;
        if (msg.includes('Invalid login credentials')) {
            msg = 'Email atau password salah';
        } else if (msg.includes('Email not confirmed')) {
            msg = 'Email belum diverifikasi. Cek inbox email Anda.';
        }
        alert('❌ Login gagal: ' + msg);
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Masuk';
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const fullName = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const btn = e.target.querySelector('button[type="submit"]');
    
    if (password.length < 6) {
        alert('❌ Password minimal 6 karakter');
        return;
    }
    
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses...';
    
    try {
        await signUpWithEmail(email, password, fullName);
        alert(
            '✅ Pendaftaran berhasil!\n\n' +
            '📧 Cek email Anda untuk verifikasi.\n' +
            '🎁 Anda akan mendapat 5 kredit gratis setelah login.'
        );
        closeLoginModal();
        e.target.reset();
    } catch (error) {
        let msg = error.message;
        if (msg.includes('already registered')) {
            msg = 'Email sudah terdaftar. Silakan login.';
        } else if (msg.includes('valid email')) {
            msg = 'Format email tidak valid.';
        } else if (msg.includes('Password')) {
            msg = 'Password minimal 6 karakter.';
        }
        alert('❌ Register gagal: ' + msg);
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-user-plus"></i> Daftar';
    }
}

// ============================================
// INFO KREDIT
// ============================================
function showCreditsInfo() {
    if (!userProfile) return;
    
    alert(
        `💎 KREDIT ANDA: ${userProfile.credits}\n\n` +
        `Setiap aksi memakai kredit:\n` +
        `• Buat Surat Lamaran = 1 kredit\n` +
        `• Buat CV = 1 kredit\n` +
        `• Perbaiki Surat = 0.5 kredit\n` +
        `• Gabung PDF = 0.5 kredit\n` +
        `• Auto Summary/Tugas = 0.5 kredit\n\n` +
        `Klik "Beli Kredit" untuk menambah kredit.`
    );
}

// ============================================
// MODAL PRICING
// ============================================
function showBuyCredits() {
    if (!currentUser) {
        showLoginModal();
        return;
    }
    
    const creditsDisplay = document.getElementById('currentCreditsDisplay');
    if (creditsDisplay && userProfile) {
        creditsDisplay.textContent = userProfile.credits;
    }
    
    const modal = document.getElementById('pricingModal');
    if (modal) modal.style.display = 'flex';
}

function closePricingModal() {
    const modal = document.getElementById('pricingModal');
    if (modal) modal.style.display = 'none';
}

// ============================================
// PILIH PAKET & MODAL PAYMENT
// ============================================
function buyPackage(packageId) {
    if (!currentUser) { showLoginModal(); return; }
    
    selectedPackage = PACKAGES[packageId];
    if (!selectedPackage) return;
    
    document.getElementById('paymentPackage').textContent = selectedPackage.name;
    document.getElementById('paymentCredits').textContent = selectedPackage.credits + ' kredit';
    
    const formattedPrice = 'Rp ' + selectedPackage.price.toLocaleString('id-ID');
    document.getElementById('paymentAmount').textContent = formattedPrice;
    
    const amountCopy = document.getElementById('paymentAmountCopy');
    if (amountCopy) amountCopy.textContent = formattedPrice;
    
    removeProof();
    
    closePricingModal();
    const paymentModal = document.getElementById('paymentModal');
    if (paymentModal) paymentModal.style.display = 'flex';
}

function closePaymentModal() {
    const modal = document.getElementById('paymentModal');
    if (modal) modal.style.display = 'none';
    selectedPackage = null;
    removeProof();
}

// ============================================
// UPLOAD BUKTI TRANSFER
// ============================================
function handleProofUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
        alert('❌ File harus berupa gambar (JPG, PNG)');
        return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
        alert('❌ File terlalu besar (maks 5MB)');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
        proofDataUrl = e.target.result;
        document.getElementById('proofImage').src = proofDataUrl;
        document.getElementById('proofPreview').classList.remove('hidden');
    };
    reader.readAsDataURL(file);
}

function removeProof() {
    proofDataUrl = null;
    const fileInput = document.getElementById('proofFile');
    if (fileInput) fileInput.value = '';
    const preview = document.getElementById('proofPreview');
    if (preview) preview.classList.add('hidden');
    const img = document.getElementById('proofImage');
    if (img) img.src = '';
}

function copyText(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            alert('✅ Disalin: ' + text);
        }).catch(() => {
            fallbackCopy(text);
        });
    } else {
        fallbackCopy(text);
    }
}

function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    try {
        document.execCommand('copy');
        alert('✅ Disalin: ' + text);
    } catch (err) {
        alert('❌ Gagal menyalin');
    }
    document.body.removeChild(textarea);
}

function copyAmount() {
    if (!selectedPackage) return;
    copyText(selectedPackage.price.toString());
}

// ============================================
// SUBMIT PEMBAYARAN
// ============================================
async function submitPayment() {
    if (!currentUser) { showLoginModal(); return; }
    if (!selectedPackage) { alert('❌ Pilih paket terlebih dahulu'); return; }
    if (!proofDataUrl) { alert('❌ Upload bukti transfer terlebih dahulu'); return; }
    
    const btn = document.getElementById('btnSubmitPayment');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
    
    try {
        // Upload bukti ke Supabase Storage
        const fileName = `proof_${currentUser.id}_${Date.now()}.jpg`;
        const base64Data = proofDataUrl.split(',')[1];
        const binaryData = atob(base64Data);
        const bytes = new Uint8Array(binaryData.length);
        for (let i = 0; i < binaryData.length; i++) {
            bytes[i] = binaryData.charCodeAt(i);
        }
        
        const { error: uploadError } = await supabaseClient
            .storage
            .from('payment-proofs')
            .upload(fileName, bytes, {
                contentType: 'image/jpeg',
                upsert: false
            });
        
        if (uploadError) {
            console.error('Upload error:', uploadError);
            throw new Error('Gagal upload bukti: ' + uploadError.message);
        }
        
        // Ambil public URL
        const { data: urlData } = supabaseClient
            .storage
            .from('payment-proofs')
            .getPublicUrl(fileName);
        
        const proofUrl = urlData.publicUrl;
        
        // Simpan transaksi ke database
        const { error: insertError } = await supabaseClient
            .from('transactions')
            .insert({
                user_id: currentUser.id,
                package_id: selectedPackage.name.toLowerCase(),
                package_name: selectedPackage.name,
                amount: selectedPackage.price,
                credits_added: selectedPackage.credits,
                status: 'pending',
                payment_method: 'manual_transfer',
                proof_url: proofUrl
            });
        
        if (insertError) throw insertError;
        
        alert(
            '✅ Bukti transfer berhasil dikirim!\n\n' +
            '📦 Paket: ' + selectedPackage.name + '\n' +
            '💰 Total: Rp ' + selectedPackage.price.toLocaleString('id-ID') + '\n' +
            '🪙 Kredit: ' + selectedPackage.credits + '\n\n' +
            '⏰ Admin akan verifikasi maks. 1x24 jam.\n' +
            'Kredit otomatis masuk setelah diverifikasi.'
        );
        
        closePaymentModal();
        
    } catch (error) {
        console.error('Submit payment error:', error);
        alert('❌ Gagal mengirim bukti: ' + error.message);
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-paper-plane"></i> Kirim Bukti Transfer';
    }
}

// ============================================
// RIWAYAT TRANSAKSI
// ============================================
async function showTransactionHistory() {
    if (!currentUser) { showLoginModal(); return; }
    
    try {
        const { data, error } = await supabaseClient
            .from('transactions')
            .select('*')
            .eq('user_id', currentUser.id)
            .order('created_at', { ascending: false })
            .limit(20);
        
        if (error) throw error;
        
        if (!data || data.length === 0) {
            alert('📭 Belum ada transaksi.\n\nKlik "Beli Kredit" untuk memulai.');
            return;
        }
        
        let list = '📋 RIWAYAT TRANSAKSI (20 terakhir)\n\n';
        data.forEach((t, i) => {
            const statusMap = {
                'pending': '⏳ Menunggu',
                'verified': '✅ Terverifikasi',
                'rejected': '❌ Ditolak',
                'expired': '⌛ Expired'
            };
            const status = statusMap[t.status] || t.status;
            
            const date = new Date(t.created_at).toLocaleDateString('id-ID', {
                day: 'numeric', month: 'short', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
            });
            
            list += `${i+1}. ${t.package_name || t.package_id}\n`;
            list += `   💰 Rp ${t.amount.toLocaleString('id-ID')} · 🪙 ${t.credits_added} kredit\n`;
            list += `   ${status} · ${date}\n\n`;
        });
        
        alert(list);
        
    } catch (error) {
        console.error('History error:', error);
        alert('❌ Gagal memuat riwayat: ' + error.message);
    }
}

// ============================================
// ADMIN PANEL (placeholder — akan dibuat di Part C)
// ============================================
function openAdminPanel() {
    if (!isAdmin()) {
        alert('❌ Anda bukan admin');
        return;
    }
    window.location.href = '/admin.html';
}
    
// ============================================
// CEK PREMIUM STATUS
// ============================================
async function checkPremiumStatus() {
    if (!currentUser) return false;
    
    try {
        const { data, error } = await supabaseClient
            .from('transactions')
            .select('id')
            .eq('user_id', currentUser.id)
            .eq('status', 'verified')
            .limit(1);
        
        if (error) throw error;
        
        return data && data.length > 0;
    } catch (err) {
        console.error('Check premium error:', err);
        return false;
    }
}

// Cache premium status
let isPremiumUser = false;

async function updatePremiumStatus() {
    isPremiumUser = await checkPremiumStatus();
    return isPremiumUser;
}

function isPremium() {
    return isPremiumUser;
}

// ============================================
// RIWAYAT DOKUMEN
// ============================================
let allDocuments = [];
let currentFilter = 'all';
let currentDocument = null;

// Simpan dokumen ke database
async function saveDocument(type, title, content, data) {
    if (!currentUser) return null;
    
    try {
        const { data: result, error } = await supabaseClient
            .from('documents')
            .insert({
                user_id: currentUser.id,
                type: type,
                title: title,
                content: content || null,
                data: data || null
            })
            .select()
            .single();
        
        if (error) throw error;
        
        return result;
    } catch (err) {
        console.error('Save document error:', err);
        return null;
    }
}

// Buka modal riwayat
async function showDocumentHistory() {
    if (!currentUser) { showLoginModal(); return; }
    
    const modal = document.getElementById('historyModal');
    if (modal) modal.style.display = 'flex';
    
    await loadDocuments();
}

function closeHistoryModal() {
    const modal = document.getElementById('historyModal');
    if (modal) modal.style.display = 'none';
}

// Load dokumen dari database
async function loadDocuments() {
    const container = document.getElementById('historyList');
    container.innerHTML = `
        <div class="loading-state">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Memuat riwayat...</p>
        </div>
    `;
    
    try {
        let query = supabaseClient
            .from('documents')
            .select('*')
            .eq('user_id', currentUser.id)
            .order('created_at', { ascending: false })
            .limit(100);
        
        if (currentFilter !== 'all') {
            query = query.eq('type', currentFilter);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        allDocuments = data || [];
        renderDocuments();
        
    } catch (err) {
        console.error('Load documents error:', err);
        container.innerHTML = `
            <div class="error-state">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Gagal memuat riwayat: ${err.message}</p>
            </div>
        `;
    }
}

function filterHistory(filter) {
    currentFilter = filter;
    
    document.querySelectorAll('.history-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.filter === filter) tab.classList.add('active');
    });
    
    loadDocuments();
}

function renderDocuments() {
    const container = document.getElementById('historyList');
    
    if (allDocuments.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <p>Belum ada dokumen tersimpan</p>
                <small style="color: var(--text-muted); font-size: 0.75rem;">
                    Setiap surat lamaran & CV yang Anda buat akan otomatis tersimpan di sini.
                </small>
            </div>
        `;
        return;
    }
    
    const html = allDocuments.map(doc => {
        const isLetter = doc.type === 'cover_letter';
        const icon = isLetter ? 'fa-file-signature' : 'fa-id-card';
        const label = isLetter ? 'Surat Lamaran' : 'CV';
        const color = isLetter ? '#3b82f6' : '#8b5cf6';
        
        const date = new Date(doc.created_at).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
        
        return `
            <div class="history-item" onclick="openDocumentDetail(${doc.id})">
                <div class="history-icon" style="background: ${color}20; color: ${color};">
                    <i class="fas ${icon}"></i>
                </div>
                <div class="history-info">
                    <div class="history-title">${doc.title || 'Dokumen'}</div>
                    <div class="history-meta">
                        <span class="history-type" style="color: ${color};">${label}</span>
                        <span class="history-date">${date}</span>
                    </div>
                </div>
                <div class="history-arrow">
                    <i class="fas fa-chevron-right"></i>
                </div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = html;
}

function openDocumentDetail(docId) {
    const doc = allDocuments.find(d => d.id === docId);
    if (!doc) return;
    
    currentDocument = doc;
    
    const isLetter = doc.type === 'cover_letter';
    const label = isLetter ? 'Surat Lamaran' : 'CV';
    const color = isLetter ? '#3b82f6' : '#8b5cf6';
    
    const date = new Date(doc.created_at).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
    
    document.getElementById('detailTitle').textContent = doc.title || 'Dokumen';
    document.getElementById('detailDate').textContent = date;
    
    const badge = document.getElementById('detailTypeBadge');
    badge.textContent = label;
    badge.style.background = color + '20';
    badge.style.color = color;
    
    const content = document.getElementById('detailContent');
    
    if (isLetter && doc.content) {
        content.innerHTML = `<div class="letter-content">${doc.content.replace(/\n/g, '<br>')}</div>`;
    } else if (!isLetter && doc.data) {
        // Render CV preview
        content.innerHTML = renderCvPreviewFromData(doc.data);
    } else {
        content.innerHTML = '<p style="color: var(--text-muted);">Isi dokumen tidak tersedia</p>';
    }
    
    document.getElementById('documentDetailModal').style.display = 'flex';
}

function closeDocumentDetail() {
    document.getElementById('documentDetailModal').style.display = 'none';
    currentDocument = null;
}

function renderCvPreviewFromData(data) {
    if (!data) return '<p style="color: var(--text-muted);">Data tidak tersedia</p>';
    
    return `
        <div class="cv-detail-preview">
            <h2>${data.cv2Name || 'Nama Anda'}</h2>
            <p style="color: #666;">${data.cv2Title || ''}</p>
            <p style="font-size: 0.8rem; color: #999;">
                📍 ${data.cv2Address || '-'} · 📞 ${data.cv2Phone || '-'} · ✉️ ${data.cv2Email || '-'}
            </p>
            
            ${data.cv2Summary ? `
                <h3>Ringkasan Profesional</h3>
                <p>${data.cv2Summary}</p>
            ` : ''}
            
            ${data.cv2Job1Title ? `
                <h3>Pengalaman Kerja</h3>
                <p><strong>${data.cv2Job1Title}</strong> - ${data.cv2Job1Company || ''}</p>
                <p style="font-size: 0.75rem; color: #999;">${data.cv2Job1Date || ''}</p>
                <p style="white-space: pre-line;">${data.cv2Job1Bullets || ''}</p>
                ${data.cv2Job2Title ? `
                    <p><strong>${data.cv2Job2Title}</strong> - ${data.cv2Job2Company || ''}</p>
                    <p style="font-size: 0.75rem; color: #999;">${data.cv2Job2Date || ''}</p>
                    <p style="white-space: pre-line;">${data.cv2Job2Bullets || ''}</p>
                ` : ''}
            ` : ''}
            
            ${data.cv2EduDegree ? `
                <h3>Pendidikan</h3>
                <p><strong>${data.cv2EduDegree}</strong></p>
                <p>${data.cv2EduSchool || ''} · ${data.cv2EduDate || ''}</p>
            ` : ''}
            
            ${data.cv2HardSkills ? `
                <h3>Keahlian</h3>
                <p><strong>Hard Skills:</strong> ${data.cv2HardSkills}</p>
                ${data.cv2SoftSkills ? `<p><strong>Soft Skills:</strong> ${data.cv2SoftSkills}</p>` : ''}
            ` : ''}
        </div>
    `;
}

async function deleteCurrentDocument() {
    if (!currentDocument) return;
    
    if (!confirm(`Hapus dokumen "${currentDocument.title}"?\n\nTindakan ini tidak bisa dibatalkan.`)) return;
    
    try {
        const { error } = await supabaseClient
            .from('documents')
            .delete()
            .eq('id', currentDocument.id)
            .eq('user_id', currentUser.id);
        
        if (error) throw error;
        
        alert('✅ Dokumen dihapus');
        closeDocumentDetail();
        await loadDocuments();
        
    } catch (err) {
        console.error('Delete error:', err);
        alert('❌ Gagal menghapus: ' + err.message);
    }
}

async function downloadCurrentDocument() {
    if (!currentDocument) return;
    
    const doc = currentDocument;
    
    if (doc.type === 'cover_letter') {
        // Download surat sebagai PDF
        try {
            if (!window.jspdf) {
                await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
            }
            
            const { jsPDF } = window.jspdf;
            const docPdf = new jsPDF({ unit: "mm", format: "a4" });
            
            const marginLeft = 20;
            let cursorY = 20;
            const pageHeight = 297;
            const marginBottom = 20;
            const maxLineWidth = 170;
            
            docPdf.setFont("times", "normal");
            docPdf.setFontSize(11);
            
            const cleanText = (doc.content || '').replace(/\r\n/g, '\n');
            const paragraphs = cleanText.split("\n");
            
            for (let i = 0; i < paragraphs.length; i++) {
                const line = paragraphs[i].trim();
                if (line === "") { cursorY += 5; continue; }
                if (cursorY + 8 > pageHeight - marginBottom) { docPdf.addPage(); cursorY = 20; }
                const splitText = docPdf.splitTextToSize(line, maxLineWidth);
                for (let j = 0; j < splitText.length; j++) {
                    if (cursorY + 7 > pageHeight - marginBottom) { docPdf.addPage(); cursorY = 20; }
                    docPdf.text(splitText[j], marginLeft, cursorY);
                    cursorY += 6;
                }
            }
            
            // Watermark jika gratis
            if (typeof isPremium === 'function' && !isPremium()) {
                const totalPages = docPdf.internal.getNumberOfPages();
                for (let p = 1; p <= totalPages; p++) {
                    docPdf.setPage(p);
                    docPdf.setFontSize(8);
                    docPdf.setTextColor(180, 180, 180);
                    docPdf.setFont("helvetica", "italic");
                    docPdf.text("Dibuat dengan LamaranAI - lamaranai.com", 105, 289, { align: 'center' });
                    docPdf.setTextColor(0, 0, 0);
                    docPdf.setFont("times", "normal");
                }
            }
            
            docPdf.save(`Surat_Lamaran_${doc.id}.pdf`);
            
        } catch (err) {
            console.error('Download error:', err);
            alert('❌ Gagal download: ' + err.message);
        }
    } else {
        // Untuk CV — load data ke form & buka preview
        if (doc.data) {
            // Isi form dengan data tersimpan
            Object.keys(doc.data).forEach(key => {
                const el = document.getElementById(key);
                if (el) el.value = doc.data[key] || '';
            });
            
            closeDocumentDetail();
            closeHistoryModal();
            
            alert('📝 Data CV telah dimuat ke form.\n\nSilakan buka tab CV untuk preview dan download ulang.');
        }
    }
}

// Helper: loadScript
function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
    });
}

// ============================================
// INIT ON DOM READY
// ============================================
document.addEventListener('DOMContentLoaded', initAuth);