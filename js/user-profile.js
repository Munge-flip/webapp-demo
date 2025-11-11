document.addEventListener('DOMContentLoaded', function() {
    // ==================== INITIALIZE DATA ====================
    
    // Initialize user data from localStorage or defaults
    let userData = JSON.parse(localStorage.getItem('hoyoUserData')) || {
        username: 'U***nh',
        email: 'gg******2@ssct.edu.ph',
        mobile: '999****99',
        password: 'password123', // In real app, this would be hashed
        passwordLastUpdated: '07/10/2025'
    };

    // Initialize orders from localStorage or defaults
    let orders = JSON.parse(localStorage.getItem('hoyoOrders')) || [
        {
            id: '1002',
            date: '2025-10-15',
            game: 'Genshin Impact',
            service: 'Spiral Abyss',
            status: 'completed',
            amount: '₱250.00',
            details: {
                description: 'Level 45 to 60 Adventure Rank boost',
                startDate: '2025-10-15',
                completionDate: '2025-10-20',
                pilot: 'Darkbeam'
            }
        },
        {
            id: '1001',
            date: '2025-10-25',
            game: 'Honkai: Star Rail',
            service: 'Story Completion',
            status: 'in-progress',
            amount: '₱250.00',
            details: {
                description: 'Complete main story Chapter 1-3',
                startDate: '2025-10-25',
                estimatedCompletion: '2025-11-02',
                pilot: 'Reyeal'
            }
        },
        {
            id: '1000',
            date: '2025-11-01',
            game: 'Zenless Zone Zero',
            service: 'Weeklies',
            status: 'pending',
            amount: '₱250.00',
            details: {
                description: 'Farm materials for character ascension',
                startDate: 'Pending confirmation',
                estimatedDuration: '3-5 days',
                pilot: 'To be assigned'
            }
        }
    ];

    // Save initial data
    saveUserData();
    saveOrders();

    // ==================== LOAD USER DATA ====================
    
    function loadUserData() {
        // Display on account section
        document.getElementById('displayName').textContent = userData.username;
        document.getElementById('displayUsername').textContent = userData.username;
        document.getElementById('displayEmail').textContent = userData.email;
        document.getElementById('displayMobile').textContent = userData.mobile;
        document.getElementById('passwordLastUpdated').textContent = userData.passwordLastUpdated;
    }

    function saveUserData() {
        localStorage.setItem('hoyoUserData', JSON.stringify(userData));
    }

    function saveOrders() {
        localStorage.setItem('hoyoOrders', JSON.stringify(orders));
    }

    // Load user data on page load
    loadUserData();

    // ==================== MENU NAVIGATION ====================
    
    const menuButtons = document.querySelectorAll('.menu-btn');
    const contentSections = document.querySelectorAll('.content-section');

    menuButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetSection = this.dataset.section;
            
            menuButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            contentSections.forEach(section => section.classList.remove('active'));
            
            const sectionToShow = document.getElementById(`${targetSection}-section`);
            if (sectionToShow) {
                sectionToShow.classList.add('active');
                
                // Load orders when switching to orders section
                if (targetSection === 'orders') {
                    loadOrders();
                }
            }
        });
    });

    // ==================== MODAL MANAGEMENT ====================
    
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
        }
    }

    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        }
    }

    // Close modal handlers
    document.querySelectorAll('.close-modal, .btn-secondary').forEach(btn => {
        btn.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal');
            if (modalId) {
                closeModal(modalId);
            }
        });
    });

    // Close modal on outside click
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });

    // ==================== EDIT PERSONAL INFO ====================
    
    document.getElementById('editPersonalInfoBtn').addEventListener('click', function() {
        // Pre-fill form with current data
        document.getElementById('editUsername').value = userData.username;
        document.getElementById('editEmail').value = userData.email;
        document.getElementById('editMobile').value = userData.mobile;
        
        openModal('editPersonalInfoModal');
    });

    document.getElementById('editPersonalInfoForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newUsername = document.getElementById('editUsername').value.trim();
        const newEmail = document.getElementById('editEmail').value.trim();
        const newMobile = document.getElementById('editMobile').value.trim();

        // Validation
        if (!newUsername || !newEmail || !newMobile) {
            alert('Please fill in all fields');
            return;
        }

        if (!validateEmail(newEmail)) {
            alert('Please enter a valid email address');
            return;
        }

        if (!validateMobile(newMobile)) {
            alert('Please enter a valid mobile number');
            return;
        }

        // Update user data
        userData.username = newUsername;
        userData.email = newEmail;
        userData.mobile = newMobile;

        saveUserData();
        loadUserData();
        closeModal('editPersonalInfoModal');

        showNotification('Personal information updated successfully!');
    });

    // ==================== CHANGE PASSWORD ====================
    
    document.getElementById('editPasswordBtn').addEventListener('click', function() {
        // Clear form
        document.getElementById('editPasswordForm').reset();
        openModal('editPasswordModal');
    });

    document.getElementById('editPasswordForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Validation
        if (currentPassword !== userData.password) {
            alert('Current password is incorrect');
            return;
        }

        if (newPassword.length < 6) {
            alert('New password must be at least 6 characters long');
            return;
        }

        if (newPassword !== confirmPassword) {
            alert('New passwords do not match');
            return;
        }

        if (newPassword === currentPassword) {
            alert('New password must be different from current password');
            return;
        }

        // Update password
        userData.password = newPassword;
        userData.passwordLastUpdated = new Date().toLocaleDateString('en-US');

        saveUserData();
        loadUserData();
        closeModal('editPasswordModal');

        showNotification('Password updated successfully!');
    });

    // ==================== ORDER HISTORY ====================
    
    function loadOrders() {
        const ordersContainer = document.getElementById('ordersContainer');
        
        if (orders.length === 0) {
            ordersContainer.innerHTML = `
                <div style="text-align: center; padding: 60px 20px; color: #888;">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 20px;">
                        <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"></path>
                    </svg>
                    <p style="font-size: 18px; font-weight: 600; margin-bottom: 5px;">No Orders Yet</p>
                    <span style="font-size: 14px;">Your order history will appear here</span>
                </div>
            `;
            return;
        }

        ordersContainer.innerHTML = orders.map(order => `
            <div class="order-card" data-order-id="${order.id}">
                <div class="order-header">
                    <div class="order-id">
                        <strong>${order.id}</strong>
                        <span class="order-date">${formatDate(order.date)}</span>
                    </div>
                    <span class="status-badge ${order.status}">${formatStatus(order.status)}</span>
                </div>
                <div class="order-details">
                    <div class="detail-row">
                        <span class="label">Game:</span>
                        <span>${order.game}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Service:</span>
                        <span>${order.service}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Amount:</span>
                        <span>${order.amount}</span>
                    </div>
                </div>
                <div class="order-actions">
                    <button class="action-btn primary view-order-btn">View Details</button>
                    ${order.status === 'pending' ? '<button class="action-btn secondary cancel-order-btn">Cancel Order</button>' : ''}
                    <button class="action-btn secondary chat-agent-btn">Chat with Agent</button>
                </div>
            </div>
        `).join('');

        // Attach event listeners to new buttons
        attachOrderEventListeners();
    }

    function attachOrderEventListeners() {
        // View Order Details
        document.querySelectorAll('.view-order-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const orderCard = this.closest('.order-card');
                const orderId = orderCard.getAttribute('data-order-id');
                const order = orders.find(o => o.id === orderId);
                
                if (order) {
                    showOrderDetails(order);
                }
            });
        });

        // Cancel Order
        document.querySelectorAll('.cancel-order-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const orderCard = this.closest('.order-card');
                const orderId = orderCard.getAttribute('data-order-id');
                
                if (confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
                    cancelOrder(orderId);
                }
            });
        });

        // Chat with Agent
        document.querySelectorAll('.chat-agent-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                switchToChat();
            });
        });
    }

    function showOrderDetails(order) {
        const detailsContent = document.getElementById('orderDetailsContent');
        
        detailsContent.innerHTML = `
            <div style="padding: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; padding-bottom: 20px; border-bottom: 2px solid #f0f0f0;">
                    <div>
                        <h3 style="font-size: 24px; color: #333; margin-bottom: 5px;">Order ${order.id}</h3>
                        <p style="color: #888; font-size: 14px;">${formatDate(order.date)}</p>
                    </div>
                    <span class="status-badge ${order.status}" style="font-size: 16px; padding: 8px 20px;">${formatStatus(order.status)}</span>
                </div>

                <div style="background: #f9f9f9; border-radius: 12px; padding: 25px; margin-bottom: 25px;">
                    <h4 style="font-size: 18px; color: #333; margin-bottom: 15px;">Service Details</h4>
                    <div style="display: grid; gap: 15px;">
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: #888; font-weight: 500;">Game:</span>
                            <span style="color: #333; font-weight: 600;">${order.game}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: #888; font-weight: 500;">Service Type:</span>
                            <span style="color: #333; font-weight: 600;">${order.service}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: #888; font-weight: 500;">Description:</span>
                            <span style="color: #333; font-weight: 600; text-align: right; max-width: 60%;">${order.details.description}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: #888; font-weight: 500;">Amount Paid:</span>
                            <span style="color: #667eea; font-weight: 700; font-size: 18px;">${order.amount}</span>
                        </div>
                    </div>
                </div>

                <div style="background: #f9f9f9; border-radius: 12px; padding: 25px; margin-bottom: 25px;">
                    <h4 style="font-size: 18px; color: #333; margin-bottom: 15px;">Timeline</h4>
                    <div style="display: grid; gap: 15px;">
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: #888; font-weight: 500;">Order Placed:</span>
                            <span style="color: #333; font-weight: 600;">${formatDate(order.date)}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: #888; font-weight: 500;">${order.status === 'completed' ? 'Completed On:' : 'Started On:'}</span>
                            <span style="color: #333; font-weight: 600;">${order.details.completionDate || order.details.startDate}</span>
                        </div>
                        ${order.details.estimatedCompletion ? `
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: #888; font-weight: 500;">Est. Completion:</span>
                            <span style="color: #333; font-weight: 600;">${order.details.estimatedCompletion}</span>
                        </div>
                        ` : ''}
                        ${order.details.estimatedDuration ? `
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: #888; font-weight: 500;">Est. Duration:</span>
                            <span style="color: #333; font-weight: 600;">${order.details.estimatedDuration}</span>
                        </div>
                        ` : ''}
                    </div>
                </div>

                <div style="background: #f9f9f9; border-radius: 12px; padding: 25px; margin-bottom: 25px;">
                    <h4 style="font-size: 18px; color: #333; margin-bottom: 15px;">Assigned Pilot</h4>
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: #888; font-weight: 500;">Pilot ID:</span>
                        <span style="color: #333; font-weight: 600;">${order.details.pilot}</span>
                    </div>
                </div>

                ${order.status === 'pending' ? `
                <div style="display: flex; gap: 15px; margin-top: 25px;">
                    <button class="action-btn secondary" style="flex: 1;" onclick="document.getElementById('viewOrderModal').style.display='none'">Close</button>
                    <button class="action-btn primary" style="flex: 1; background: #dc3545;" onclick="cancelOrderFromModal('${order.id}')">Cancel Order</button>
                </div>
                ` : `
                <div style="margin-top: 25px;">
                    <button class="action-btn primary" style="width: 100%;" onclick="document.getElementById('viewOrderModal').style.display='none'">Close</button>
                </div>
                `}
            </div>
        `;

        openModal('viewOrderModal');
    }

    // Make cancelOrderFromModal globally accessible
    window.cancelOrderFromModal = function(orderId) {
        if (confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
            cancelOrder(orderId);
            closeModal('viewOrderModal');
        }
    };

    function cancelOrder(orderId) {
        const orderIndex = orders.findIndex(o => o.id === orderId);
        
        if (orderIndex !== -1) {
            orders.splice(orderIndex, 1);
            saveOrders();
            loadOrders();
            showNotification('Order cancelled successfully');
        }
    }

    // ==================== CHAT FUNCTIONALITY ====================
    
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');
    const chatMessages = document.getElementById('chatMessages');

    function sendMessage() {
        const message = chatInput.value.trim();
        if (message === '') return;

        const emptyState = chatMessages.querySelector('.chat-empty');
        if (emptyState) {
            emptyState.remove();
        }

        const messageElement = document.createElement('div');
        messageElement.className = 'message user-message';
        messageElement.innerHTML = `
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 12px 18px;
                border-radius: 18px 18px 4px 18px;
                max-width: 70%;
                margin-left: auto;
                margin-bottom: 10px;
                word-wrap: break-word;">
                ${escapeHtml(message)}
            </div>
        `;
        chatMessages.appendChild(messageElement);

        chatInput.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;

        setTimeout(() => {
            const agentMessage = document.createElement('div');
            agentMessage.className = 'message agent-message';
            agentMessage.innerHTML = `
                <div style="background: #f0f0f0;
                    color: #333;
                    padding: 12px 18px;
                    border-radius: 18px 18px 18px 4px;
                    max-width: 70%;
                    margin-right: auto;
                    margin-bottom: 10px;
                    word-wrap: break-word;">
                    Thank you for your message! Our support team will respond shortly.
                </div>
            `;
            chatMessages.appendChild(agentMessage);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1000);
    }

    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    function switchToChat() {
        menuButtons.forEach(btn => btn.classList.remove('active'));
        contentSections.forEach(section => section.classList.remove('active'));
        
        const chatMenuBtn = document.querySelector('[data-section="chat"]');
        const chatSection = document.getElementById('chat-section');
        
        if (chatMenuBtn) chatMenuBtn.classList.add('active');
        if (chatSection) chatSection.classList.add('active');
        
        setTimeout(() => {
            chatInput.focus();
        }, 300);
    }

    // ==================== UTILITY FUNCTIONS ====================
    
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function validateMobile(mobile) {
        const re = /^\d{10,}$/;
        return re.test(mobile.replace(/[\s\-\(\)]/g, ''));
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    }

    function formatStatus(status) {
        const statusMap = {
            'pending': 'Pending',
            'in-progress': 'In Progress',
            'completed': 'Completed'
        };
        return statusMap[status] || status;
    }

    function escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

    function showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 16px 24px;
            border-radius: 10px;
            box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
            z-index: 10001;
            font-family: 'Syne', sans-serif;
            font-weight: 600;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;

        // Add animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => {
                notification.remove();
                style.remove();
            }, 300);
        }, 3000);
    }

    // Load orders on initial page load
    loadOrders();
});