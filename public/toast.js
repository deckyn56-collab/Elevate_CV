// ============================================
// LAMARANAI - TOAST NOTIFICATION SYSTEM
// ============================================

// ============================================
// SHOW TOAST
// ============================================
function showToast(options) {
    const {
        type = 'info',
        title = '',
        message = '',
        duration = 4000,
        icon = null,
        action = null
    } = options;
    
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    // Icon default per tipe
    const iconMap = {
        success: 'fa-check',
        error: 'fa-times',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info'
    };
    
    const iconClass = icon || iconMap[type] || 'fa-info';
    const toastId = 'toast_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    // Action button HTML
    const actionHTML = action ? `
        <button class="toast-action" onclick="handleToastAction('${toastId}')">
            ${action.icon ? `<i class="fas ${action.icon}"></i>` : ''}
            ${action.label || 'Klik'}
        </button>
    ` : '';
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.id = toastId;
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fas ${iconClass}"></i>
        </div>
        <div class="toast-content">
            ${title ? `<div class="toast-title">${title}</div>` : ''}
            ${message ? `<div class="toast-message">${message}</div>` : ''}
            ${actionHTML}
        </div>
        <button class="toast-close" onclick="removeToast('${toastId}')">
            <i class="fas fa-times"></i>
        </button>
        ${duration > 0 ? `<div class="toast-progress" style="animation-duration: ${duration}ms;"></div>` : ''}
    `;
    
    // Store action callback
    if (action && typeof action.onClick === 'function') {
        toast._actionCallback = action.onClick;
    }
    
    container.appendChild(toast);
    
    // Auto remove
    if (duration > 0) {
        setTimeout(() => removeToast(toastId), duration);
    }
    
    return toastId;
}

// ============================================
// REMOVE TOAST
// ============================================
function removeToast(toastId) {
    const toast = document.getElementById(toastId);
    if (!toast) return;
    
    toast.classList.add('toast-exit');
    setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
}

// ============================================
// HANDLE TOAST ACTION
// ============================================
function handleToastAction(toastId) {
    const toast = document.getElementById(toastId);
    if (!toast) return;
    
    if (typeof toast._actionCallback === 'function') {
        toast._actionCallback();
    }
    removeToast(toastId);
}

// ============================================
// SHORTCUT FUNCTIONS
// ============================================
function toastSuccess(title, message = '', options = {}) {
    return showToast({ type: 'success', title, message, ...options });
}

function toastError(title, message = '', options = {}) {
    return showToast({ type: 'error', title, message, duration: 5000, ...options });
}

function toastWarning(title, message = '', options = {}) {
    return showToast({ type: 'warning', title, message, duration: 5000, ...options });
}

function toastInfo(title, message = '', options = {}) {
    return showToast({ type: 'info', title, message, ...options });
}

// ============================================
// CONFIRM DIALOG (replace confirm())
// ============================================
function showConfirm(options) {
    return new Promise((resolve) => {
        const {
            title = 'Konfirmasi',
            message = '',
            yesLabel = 'Ya',
            noLabel = 'Batal',
            danger = false
        } = options;
        
        const container = document.getElementById('toastContainer');
        if (!container) { resolve(false); return; }
        
        const toastId = 'confirm_' + Date.now();
        
        const toast = document.createElement('div');
        toast.className = 'toast toast-confirm';
        toast.id = toastId;
        toast.innerHTML = `
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                ${message ? `<div class="toast-message">${message}</div>` : ''}
                <div class="toast-confirm-actions">
                    <button class="toast-confirm-no" onclick="resolveConfirm('${toastId}', false)">
                        ${noLabel}
                    </button>
                    <button class="toast-confirm-yes ${danger ? 'danger' : ''}" onclick="resolveConfirm('${toastId}', true)">
                        ${yesLabel}
                    </button>
                </div>
            </div>
        `;
        
        toast._resolve = resolve;
        container.appendChild(toast);
    });
}

function resolveConfirm(toastId, result) {
    const toast = document.getElementById(toastId);
    if (!toast) return;
    
    if (typeof toast._resolve === 'function') {
        toast._resolve(result);
    }
    
    toast.classList.add('toast-exit');
    setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
}

// ============================================
// LOADING TOAST
// ============================================
function showLoadingToast(message = 'Memuat...') {
    const container = document.getElementById('toastContainer');
    if (!container) return null;
    
    const toastId = 'loading_' + Date.now();
    
    const toast = document.createElement('div');
    toast.className = 'toast toast-info';
    toast.id = toastId;
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fas fa-spinner fa-spin"></i>
        </div>
        <div class="toast-content">
            <div class="toast-message">${message}</div>
        </div>
    `;
    
    container.appendChild(toast);
    return toastId;
}