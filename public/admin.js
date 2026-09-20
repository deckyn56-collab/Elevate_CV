// @ts-nocheck
// ============================================
// LAMARANAI - ADMIN PANEL
// ============================================

// ============================================
// SUPABASE CONFIG (SAMA dengan auth.js)
// ============================================
const SUPABASE_URL = 'https://fukndugvobbwdhtensso.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1a25kdWd2b2Jid2RodGVuc3NvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk4MzA2NDksImV4cCI6MjEwNTQwNjY0OX0.gXXHWSnyBsTHaephTyws03TT9m1NU__0MhcvSfN50ck';

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================
// STATE
// ============================================
let currentUser = null;
let userProfile = null;
let allTransactions = [];
let currentFilter = 'pending';
let selectedTransaction = null;

// ============================================
// INIT
// ============================================
async function initAdmin() {
    try {
        const { data: { session } } = await supabaseClient.auth.getSession();
        
        if (!session) {
            showScreen('login');
            return;
        }
        
        currentUser = session.user;
        
        // Load user profile
        const { data, error } = await supabaseClient
            .from('users')
            .select('*')
            .eq('id', currentUser.id)
            .single();
        
        if (error || !data) {
            showScreen('login');
            return;
        }
        
        userProfile = data;
        
        // Cek admin
        if (!userProfile.is_admin) {
            showScreen('denied');
            return;
        }
        
        // Admin OK
        showScreen('dashboard');
        renderAdminInfo();
        await loadTransactions();
        
    } catch (err) {
        console.error('Init error:', err);
        showScreen('login');
    }
}

function showScreen(screen) {
    document.getElementById('adminLoginScreen').classList.add('hidden');
    document.getElementById('accessDenied').classList.add('hidden');
    document.getElementById('adminDashboard').classList.add('hidden');
    
    if (screen === 'login') {
        document.getElementById('adminLoginScreen').classList.remove('hidden');
    } else if (screen === 'denied') {
        document.getElementById('accessDenied').classList.remove('hidden');
    } else {
        document.getElementById('adminDashboard').classList.remove('hidden');
    }
}

function renderAdminInfo() {
    const info = document.getElementById('adminInfo');
    if (!info || !userProfile) return;
    
    info.innerHTML = `
        <div class="admin-user-info">
            <i class="fas fa-user-shield"></i>
            <div>
                <div class="admin-name">${userProfile.full_name || 'Admin'}</div>
                <div class="admin-email">${userProfile.email}</div>
            </div>
        </div>
    `;
}

function goToLogin() {
    window.location.href = '/';
}

// ============================================
// LOAD TRANSAKSI
// ============================================
async function loadTransactions() {
    const container = document.getElementById('transactionsList');
    container.innerHTML = `
        <div class="loading-state">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Memuat transaksi...</p>
        </div>
    `;
    
    try {
        const { data, error } = await supabaseClient
            .from('transactions')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(200);
        
        if (error) throw error;
        
        allTransactions = data || [];
        
        // Fetch user info untuk setiap transaksi
        const userIds = [...new Set(allTransactions.map(t => t.user_id))];
        
        if (userIds.length > 0) {
            const { data: users } = await supabaseClient
                .from('users')
                .select('id, full_name, email')
                .in('id', userIds);
            
            if (users) {
                const userMap = {};
                users.forEach(u => userMap[u.id] = u);
                allTransactions = allTransactions.map(t => ({
                    ...t,
                    user: userMap[t.user_id] || null
                }));
            }
        }
        
        renderStats();
        renderTransactions();
        
    } catch (err) {
        console.error('Load error:', err);
        container.innerHTML = `
            <div class="error-state">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Gagal memuat transaksi: ${err.message}</p>
                <button onclick="loadTransactions()">Coba Lagi</button>
            </div>
        `;
    }
}

// ============================================
// STATISTIK
// ============================================
function renderStats() {
    const pending = allTransactions.filter(t => t.status === 'pending').length;
    const verified = allTransactions.filter(t => t.status === 'verified');
    const rejected = allTransactions.filter(t => t.status === 'rejected').length;
    const revenue = verified.reduce((sum, t) => sum + (t.amount || 0), 0);
    
    document.getElementById('statPending').textContent = pending;
    document.getElementById('statVerified').textContent = verified.length;
    document.getElementById('statRejected').textContent = rejected;
    document.getElementById('statRevenue').textContent = 'Rp ' + revenue.toLocaleString('id-ID');
}

// ============================================
// FILTER
// ============================================
function filterTransactions(filter) {
    currentFilter = filter;
    
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.filter === filter) tab.classList.add('active');
    });
    
    renderTransactions();
}

// ============================================
// RENDER TRANSAKSI
// ============================================
function renderTransactions() {
    const container = document.getElementById('transactionsList');
    
    let filtered = allTransactions;
    if (currentFilter !== 'all') {
        filtered = allTransactions.filter(t => t.status === currentFilter);
    }
    
    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <p>Tidak ada transaksi ${currentFilter === 'all' ? '' : currentFilter}</p>
            </div>
        `;
        return;
    }
    
    const html = filtered.map(t => {
        const statusMap = {
            'pending': { label: 'Menunggu', icon: 'fa-clock', class: 'pending' },
            'verified': { label: 'Terverifikasi', icon: 'fa-check-circle', class: 'verified' },
            'rejected': { label: 'Ditolak', icon: 'fa-times-circle', class: 'rejected' }
        };
        const s = statusMap[t.status] || { label: t.status, icon: 'fa-question', class: '' };
        
        const date = new Date(t.created_at).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
        
        return `
            <div class="transaction-card" data-id="${t.id}">
                <div class="transaction-header">
                    <div class="transaction-user">
                        <i class="fas fa-user-circle"></i>
                        <div>
                            <div class="user-name">${t.user?.full_name || 'User'}</div>
                            <div class="user-email">${t.user?.email || t.user_id.slice(0, 8) + '...'}</div>
                        </div>
                    </div>
                    <span class="status-badge ${s.class}">
                        <i class="fas ${s.icon}"></i> ${s.label}
                    </span>
                </div>
                
                <div class="transaction-details">
                    <div class="detail-row">
                        <span><i class="fas fa-box"></i> Paket:</span>
                        <strong>${t.package_name || t.package_id}</strong>
                    </div>
                    <div class="detail-row">
                        <span><i class="fas fa-money-bill"></i> Jumlah:</span>
                        <strong>Rp ${(t.amount || 0).toLocaleString('id-ID')}</strong>
                    </div>
                    <div class="detail-row">
                        <span><i class="fas fa-coins"></i> Kredit:</span>
                        <strong>${t.credits_added} kredit</strong>
                    </div>
                    <div class="detail-row">
                        <span><i class="fas fa-calendar"></i> Tanggal:</span>
                        <strong>${date}</strong>
                    </div>
                    ${t.notes ? `<div class="detail-row"><span><i class="fas fa-comment"></i> Catatan:</span><strong>${t.notes}</strong></div>` : ''}
                </div>
                
                <div class="transaction-actions">
                    ${t.proof_url ? `
                        <button class="btn-action btn-view" onclick="viewProof('${t.proof_url}')">
                            <i class="fas fa-image"></i> Lihat Bukti
                        </button>
                    ` : ''}
                    ${t.status === 'pending' ? `
                        <button class="btn-action btn-review" onclick="openVerifyModal(${t.id})">
                            <i class="fas fa-gavel"></i> Proses
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = html;
}

// ============================================
// LIHAT BUKTI
// ============================================
function viewProof(url) {
    document.getElementById('proofFullImage').src = url;
    document.getElementById('proofModal').style.display = 'flex';
}

function closeProofModal() {
    document.getElementById('proofModal').style.display = 'none';
}

// ============================================
// MODAL VERIFIKASI
// ============================================
function openVerifyModal(transactionId) {
    const t = allTransactions.find(x => x.id === transactionId);
    if (!t) return;
    
    selectedTransaction = t;
    
    const date = new Date(t.created_at).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
    
    const detail = document.getElementById('verifyDetail');
    detail.innerHTML = `
        <div class="verify-info">
            <div class="verify-user">
                <i class="fas fa-user-circle"></i>
                <div>
                    <div class="user-name">${t.user?.full_name || 'User'}</div>
                    <div class="user-email">${t.user?.email || t.user_id}</div>
                </div>
            </div>
            
            <div class="verify-details-grid">
                <div class="verify-detail-item">
                    <span>Paket</span>
                    <strong>${t.package_name || t.package_id}</strong>
                </div>
                <div class="verify-detail-item">
                    <span>Jumlah Bayar</span>
                    <strong class="highlight">Rp ${(t.amount || 0).toLocaleString('id-ID')}</strong>
                </div>
                <div class="verify-detail-item">
                    <span>Kredit</span>
                    <strong class="highlight">+${t.credits_added} kredit</strong>
                </div>
                <div class="verify-detail-item">
                    <span>Tanggal</span>
                    <strong>${date}</strong>
                </div>
            </div>
            
            ${t.proof_url ? `
                <div class="verify-proof-preview" onclick="viewProof('${t.proof_url}')">
                    <img src="${t.proof_url}" alt="Bukti Transfer">
                    <div class="proof-overlay">
                        <i class="fas fa-search-plus"></i> Klik untuk memperbesar
                    </div>
                </div>
            ` : '<p style="color:#ef4444;text-align:center;padding:20px;">⚠️ Bukti transfer tidak tersedia</p>'}
            
            <div class="verify-note">
                <label><i class="fas fa-comment-alt"></i> Catatan (opsional)</label>
                <textarea id="verifyNotes" rows="2" placeholder="Contoh: Bukti valid, kredit ditambahkan."></textarea>
            </div>
        </div>
    `;
    
    document.getElementById('verifyModal').style.display = 'flex';
}

function closeVerifyModal() {
    document.getElementById('verifyModal').style.display = 'none';
    selectedTransaction = null;
}

// ============================================
// VERIFIKASI TRANSAKSI
// ============================================
async function approveTransaction() {
    if (!selectedTransaction) return;
    
    if (!confirm(`Verifikasi transaksi ini?\n\nKredit ${selectedTransaction.credits_added} akan ditambahkan ke user: ${selectedTransaction.user?.email}`)) {
        return;
    }
    
    const notes = document.getElementById('verifyNotes').value.trim() || 'Terverifikasi';
    
    try {
        const { data, error } = await supabaseClient.rpc('verify_transaction', {
            p_transaction_id: selectedTransaction.id,
            p_admin_id: currentUser.id,
            p_approved: true,
            p_notes: notes
        });
        
        if (error) throw error;
        
        const result = data[0];
        if (!result.success) throw new Error(result.message);
        
        alert('✅ ' + result.message);
        closeVerifyModal();
        await loadTransactions();
        
    } catch (err) {
        console.error('Verify error:', err);
        alert('❌ Gagal verifikasi: ' + err.message);
    }
}

async function rejectTransaction() {
    if (!selectedTransaction) return;
    
    const notes = document.getElementById('verifyNotes').value.trim() || 'Ditolak oleh admin';
    
    if (!confirm(`Tolak transaksi ini?\n\nCatatan: ${notes}`)) return;
    
    try {
        const { data, error } = await supabaseClient.rpc('verify_transaction', {
            p_transaction_id: selectedTransaction.id,
            p_admin_id: currentUser.id,
            p_approved: false,
            p_notes: notes
        });
        
        if (error) throw error;
        
        const result = data[0];
        if (!result.success) throw new Error(result.message);
        
        alert('✅ ' + result.message);
        closeVerifyModal();
        await loadTransactions();
        
    } catch (err) {
        console.error('Reject error:', err);
        alert('❌ Gagal menolak: ' + err.message);
    }
}

// ============================================
// INIT
// ============================================
document.addEventListener('DOMContentLoaded', initAdmin);