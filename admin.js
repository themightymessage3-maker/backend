// Admin Panel JavaScript
class AdminPanel {
    constructor() {
        this.currentSection = 'dashboard';
        this.products = [];
        this.users = [];
        this.orders = [];
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadDashboardData();
        this.loadProducts();
        this.loadUsers();
        this.loadOrders();
    }

    bindEvents() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.currentTarget.dataset.section;
                this.showSection(section);
            });
        });

        // Sidebar toggle
        document.getElementById('sidebar-toggle').addEventListener('click', () => {
            document.querySelector('.admin-sidebar').classList.toggle('open');
        });

        // Add product button
        document.getElementById('add-product-btn').addEventListener('click', () => {
            this.showModal('add-product-modal');
        });

        // Add user button
        document.getElementById('add-user-btn').addEventListener('click', () => {
            this.showModal('add-user-modal');
        });

        // Form submissions
        document.getElementById('add-product-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addProduct();
        });

        document.getElementById('add-user-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addUser();
        });

        // Content save
        document.getElementById('save-content-btn').addEventListener('click', () => {
            this.saveContent();
        });

        // Settings save
        document.getElementById('save-settings-btn').addEventListener('click', () => {
            this.saveSettings();
        });

        // Modal close buttons
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => {
                this.hideAllModals();
            });
        });

        // Logout
        document.getElementById('logout-btn').addEventListener('click', (e) => {
            e.preventDefault();
            this.logout();
        });

        // Close modals when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.hideAllModals();
            }
        });
    }

    showSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });

        // Show selected section
        document.getElementById(sectionName).classList.add('active');

        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

        // Update page title
        document.getElementById('page-title').textContent = this.getSectionTitle(sectionName);

        this.currentSection = sectionName;
    }

    getSectionTitle(section) {
        const titles = {
            'dashboard': 'Dashboard',
            'products': 'Products Management',
            'users': 'User Management',
            'content': 'Site Content',
            'orders': 'Order Management',
            'settings': 'Admin Settings'
        };
        return titles[section] || 'Dashboard';
    }

    showModal(modalId) {
        document.getElementById(modalId).classList.add('active');
    }

    hideAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
    }

    loadDashboardData() {
        // Load statistics
        this.updateStats();
        
        // Load recent activity
        this.loadRecentActivity();
    }

    updateStats() {
        // These would normally come from a database
        document.getElementById('total-users').textContent = this.users.length;
        document.getElementById('total-products').textContent = this.products.length;
        document.getElementById('total-orders').textContent = this.orders.length;
        
        // Calculate revenue
        const revenue = this.orders.reduce((total, order) => total + order.total, 0);
        document.getElementById('total-revenue').textContent = `$${revenue.toFixed(2)}`;
    }

    loadRecentActivity() {
        const activityContainer = document.getElementById('recent-activity');
        const activities = [
            { type: 'user', text: 'New user registered', time: '2 minutes ago' },
            { type: 'order', text: 'Order #1234 completed', time: '15 minutes ago' },
            { type: 'product', text: 'New product added', time: '1 hour ago' },
            { type: 'user', text: 'User profile updated', time: '2 hours ago' }
        ];

        activityContainer.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon ${activity.type}">
                    <i class="fas fa-${this.getActivityIcon(activity.type)}"></i>
                </div>
                <div class="activity-content">
                    <p>${activity.text}</p>
                    <span class="activity-time">${activity.time}</span>
                </div>
            </div>
        `).join('');
    }

    getActivityIcon(type) {
        const icons = {
            'user': 'user',
            'order': 'shopping-cart',
            'product': 'box',
            'system': 'cog'
        };
        return icons[type] || 'info-circle';
    }

    loadProducts() {
        // Sample products - in real app, this would come from database
        this.products = [
            {
                id: 1,
                name: 'Grade A Passports',
                category: 'documents',
                price: 1250,
                image: 'sideimage.jpg'
            },
            {
                id: 2,
                name: 'Premium Clone Card',
                category: 'clone-cards',
                price: 1500,
                image: 'logo.png'
            },
            {
                id: 3,
                name: 'US Dollar Bills',
                category: 'counterfeit-notes',
                price: 200,
                image: 'sideimage.jpg'
            }
        ];

        this.renderProducts();
    }

    renderProducts() {
        const container = document.getElementById('products-grid');
        container.innerHTML = this.products.map(product => `
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                    <div class="product-category">${product.category}</div>
                    <div class="product-actions">
                        <button class="btn btn-secondary" onclick="adminPanel.editProduct(${product.id})">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-secondary" onclick="adminPanel.deleteProduct(${product.id})">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    addProduct() {
        const form = document.getElementById('add-product-form');
        const formData = new FormData(form);
        
        const product = {
            id: Date.now(),
            name: formData.get('name'),
            category: formData.get('category'),
            price: parseFloat(formData.get('price')),
            description: formData.get('description'),
            image: 'sideimage.jpg' // In real app, handle file upload
        };

        this.products.push(product);
        this.renderProducts();
        this.updateStats();
        this.hideAllModals();
        form.reset();
        
        this.showNotification('Product added successfully!', 'success');
    }

    editProduct(id) {
        const product = this.products.find(p => p.id === id);
        if (product) {
            // Populate edit form (you can create an edit modal)
            this.showNotification('Edit functionality coming soon!', 'info');
        }
    }

    deleteProduct(id) {
        if (confirm('Are you sure you want to delete this product?')) {
            this.products = this.products.filter(p => p.id !== id);
            this.renderProducts();
            this.updateStats();
            this.showNotification('Product deleted successfully!', 'success');
        }
    }

    loadUsers() {
        // Sample users - in real app, this would come from database
        this.users = [
            {
                id: 1,
                username: 'admin',
                email: 'admin@docushop.com',
                role: 'admin',
                status: 'active'
            },
            {
                id: 2,
                username: 'john_doe',
                email: 'john@example.com',
                role: 'user',
                status: 'active'
            },
            {
                id: 3,
                username: 'jane_smith',
                email: 'jane@example.com',
                role: 'user',
                status: 'inactive'
            }
        ];

        this.renderUsers();
    }

    renderUsers() {
        const tbody = document.getElementById('users-tbody');
        tbody.innerHTML = this.users.map(user => `
            <tr>
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td><span class="role-badge ${user.role}">${user.role}</span></td>
                <td><span class="status-badge ${user.status}">${user.status}</span></td>
                <td>
                    <button class="btn btn-secondary" onclick="adminPanel.editUser(${user.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-secondary" onclick="adminPanel.deleteUser(${user.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    addUser() {
        const form = document.getElementById('add-user-form');
        const formData = new FormData(form);
        
        const user = {
            id: Date.now(),
            username: formData.get('username'),
            email: formData.get('email'),
            role: formData.get('role'),
            status: 'active'
        };

        this.users.push(user);
        this.renderUsers();
        this.updateStats();
        this.hideAllModals();
        form.reset();
        
        this.showNotification('User added successfully!', 'success');
    }

    editUser(id) {
        const user = this.users.find(u => u.id === id);
        if (user) {
            this.showNotification('Edit functionality coming soon!', 'info');
        }
    }

    deleteUser(id) {
        if (confirm('Are you sure you want to delete this user?')) {
            this.users = this.users.filter(u => u.id !== id);
            this.renderUsers();
            this.updateStats();
            this.showNotification('User deleted successfully!', 'success');
        }
    }

    loadOrders() {
        // Sample orders - in real app, this would come from database
        this.orders = [
            {
                id: 'ORD-001',
                customer: 'john_doe',
                products: ['Grade A Passports', 'Premium Clone Card'],
                total: 2750,
                status: 'completed',
                date: '2024-01-15'
            },
            {
                id: 'ORD-002',
                customer: 'jane_smith',
                products: ['US Dollar Bills'],
                total: 200,
                status: 'pending',
                date: '2024-01-14'
            }
        ];

        this.renderOrders();
    }

    renderOrders() {
        const tbody = document.getElementById('orders-tbody');
        tbody.innerHTML = this.orders.map(order => `
            <tr>
                <td>${order.id}</td>
                <td>${order.customer}</td>
                <td>${order.products.join(', ')}</td>
                <td>$${order.total.toFixed(2)}</td>
                <td><span class="status-badge ${order.status}">${order.status}</span></td>
                <td>${order.date}</td>
                <td>
                    <button class="btn btn-secondary" onclick="adminPanel.viewOrder('${order.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    viewOrder(id) {
        const order = this.orders.find(o => o.id === id);
        if (order) {
            this.showNotification(`Viewing order ${id}`, 'info');
        }
    }

    saveContent() {
        const heroTitle = document.getElementById('hero-title').value;
        const heroDescription = document.getElementById('hero-description').value;
        const heroButton = document.getElementById('hero-button').value;
        const siteTitle = document.getElementById('site-title').value;
        const siteDescription = document.getElementById('site-description').value;

        // In real app, save to database and update live site
        const contentData = {
            hero: { title: heroTitle, description: heroDescription, button: heroButton },
            site: { title: siteTitle, description: siteDescription }
        };

        localStorage.setItem('docushop_content', JSON.stringify(contentData));
        this.showNotification('Content saved successfully!', 'success');
    }

    saveSettings() {
        const adminEmail = document.getElementById('admin-email').value;
        const maintenanceMode = document.getElementById('maintenance-mode').value;
        const defaultCurrency = document.getElementById('default-currency').value;

        // In real app, save to database
        const settings = {
            adminEmail,
            maintenanceMode: maintenanceMode === 'true',
            defaultCurrency
        };

        localStorage.setItem('docushop_settings', JSON.stringify(settings));
        this.showNotification('Settings saved successfully!', 'success');
    }

    logout() {
        if (confirm('Are you sure you want to logout?')) {
            // Clear session
            sessionStorage.removeItem('docushop_session');
            // Redirect to home page
            window.location.href = 'index.html';
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${this.getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);

        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);

        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        });
    }

    getNotificationIcon(type) {
        const icons = {
            'success': 'check-circle',
            'error': 'exclamation-circle',
            'warning': 'exclamation-triangle',
            'info': 'info-circle'
        };
        return icons[type] || 'info-circle';
    }
}

// Initialize admin panel when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    window.adminPanel = new AdminPanel();
});

// Add notification styles
const notificationStyles = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        border-radius: 8px;
        padding: 16px 20px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        display: flex;
        align-items: center;
        gap: 12px;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        z-index: 10000;
        max-width: 400px;
    }

    .notification.show {
        transform: translateX(0);
    }

    .notification-success {
        border-left: 4px solid #059669;
        color: #059669;
    }

    .notification-error {
        border-left: 4px solid #dc2626;
        color: #dc2626;
    }

    .notification-warning {
        border-left: 4px solid #d97706;
        color: #d97706;
    }

    .notification-info {
        border-left: 4px solid #3b82f6;
        color: #3b82f6;
    }

    .notification-close {
        background: none;
        border: none;
        font-size: 1.2rem;
        color: inherit;
        cursor: pointer;
        margin-left: auto;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background 0.3s ease;
    }

    .notification-close:hover {
        background: rgba(0, 0, 0, 0.1);
    }

    .role-badge, .status-badge {
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: 500;
        text-transform: capitalize;
    }

    .role-badge.admin {
        background: #fef3c7;
        color: #92400e;
    }

    .role-badge.user {
        background: #dbeafe;
        color: #1e40af;
    }

    .status-badge.active {
        background: #d1fae5;
        color: #065f46;
    }

    .status-badge.inactive {
        background: #fee2e2;
        color: #991b1b;
    }

    .status-badge.completed {
        background: #d1fae5;
        color: #065f46;
    }

    .status-badge.pending {
        background: #fef3c7;
        color: #92400e;
    }
`;

// Inject notification styles
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);
