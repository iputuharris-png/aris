// ===========================
// GARASI MODIF - JavaScript Module
// ===========================

const WA_NUMBER = '6285956423009';

// ===== WHATSAPP INTEGRATION =====
function pesanWA(namaProduk) {
    const pesan = `Halo Garasi Modif, saya ingin membeli: *${namaProduk}*. Apakah stok masih tersedia?`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(pesan)}`, '_blank');
    if (typeof showToast === 'function') showToast('success', `Membuka WhatsApp untuk "${namaProduk}"...`);
}

function cekStok(namaProduk, harga) {
    const pesan = `Halo Garasi Modif, saya ingin cek stok:\n\n🛒 *${namaProduk}*\n💰 ${harga}\n\nApakah masih ready? Terima kasih!`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(pesan)}`, '_blank');
    if (typeof showToast === 'function') showToast('success', `Cek stok "${namaProduk}" via WhatsApp...`);
}

// ===== HAMBURGER MENU =====
function toggleMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const overlay = document.getElementById('navOverlay');
    
    if (hamburger) hamburger.classList.toggle('active');
    if (navMenu) navMenu.classList.toggle('open');
    if (overlay) overlay.classList.toggle('active');
    document.body.style.overflow = (navMenu && navMenu.classList.contains('open')) ? 'hidden' : '';
}

// ===== TOAST NOTIFICATIONS =====
function showToast(type, message) {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        container.id = 'toastContainer';
        document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icons = { success: '✅', info: 'ℹ️', warning: '⚠️' };
    
    toast.innerHTML = `
        <span class="toast-icon">${icons[type] || '📢'}</span>
        <span class="toast-message">${message}</span>
        <button class="toast-close" onclick="this.parentElement.remove()">✕</button>
    `;
    
    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 350);
    }, 4000);
}

// ===== CART SYSTEM =====
let cart = JSON.parse(localStorage.getItem('garasimodif_cart') || '[]');

function updateBadges() {
    const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
    const cartBadge = document.getElementById('cartBadge');
    if (cartBadge) cartBadge.textContent = cartCount;

    const wishlist = JSON.parse(localStorage.getItem('garasimodif_wishlist') || '[]');
    const wishlistBadge = document.getElementById('wishlistBadge');
    if (wishlistBadge) wishlistBadge.textContent = wishlist.length;
}

function addToCart(name, price, priceStr, img) {
    const existing = cart.find(item => item.name === name);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ name, price, priceStr, img, qty: 1 });
    }
    localStorage.setItem('garasimodif_cart', JSON.stringify(cart));
    updateBadges();
    showToast('success', `"${name}" masuk ke keranjang belanja 🛒`);
}

function changeCartQty(name, delta) {
    const item = cart.find(i => i.name === name);
    if (item) {
        item.qty += delta;
        if (item.qty <= 0) {
            cart = cart.filter(i => i.name !== name);
        }
        localStorage.setItem('garasimodif_cart', JSON.stringify(cart));
        updateBadges();
        if (typeof renderCart === 'function') renderCart();
    }
}

function removeFromCart(name) {
    cart = cart.filter(i => i.name !== name);
    localStorage.setItem('garasimodif_cart', JSON.stringify(cart));
    updateBadges();
    if (typeof renderCart === 'function') renderCart();
    showToast('info', `"${name}" dihapus dari keranjang`);
}

function clearCart() {
    if (confirm('Kosongkan semua barang di keranjang?')) {
        cart = [];
        localStorage.setItem('garasimodif_cart', JSON.stringify(cart));
        updateBadges();
        if (typeof renderCart === 'function') renderCart();
        showToast('info', 'Keranjang belanja telah dikosongkan');
    }
}
