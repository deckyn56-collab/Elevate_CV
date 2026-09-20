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
            // Kalau user baru & trigger belum jalan, buat manual
            if (error.code === 'PGRST116') {
                await createUserProfile();
            }
            return;
        }
        
        userProfile = data;
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
                        <div class="user-name">${userProfile.full_name || 'User'}</div>
                        <div class="user-email">${userProfile.email}</div>
                    </div>
                    <div class="dropdown-divider"></div>
                    <button onclick="showCreditsInfo()">
                        <i class="fas fa-coins"></i> Kredit: ${userProfile.credits}
                    </button>
                    <button onclick="showBuyCredits()">
                        <i class="fas fa-plus-circle"></i> Beli Kredit
                    </button>
                    <button onclick="showTransactionHistory()">
                        <i class="fas fa-history"></i> Riwayat Transaksi
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
// INIT ON DOM READY
// ============================================
document.addEventListener('DOMContentLoaded', initAuth);