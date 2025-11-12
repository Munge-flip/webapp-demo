document.addEventListener('DOMContentLoaded', function() {
    // ==================== INITIALIZE DATA ====================
    
    // Initialize agent data from localStorage or defaults
    let agentData = localStorage.getItem('hoyoAgentData') 
        ? JSON.parse(localStorage.getItem('hoyoAgentData'))
        : {
            username: 'Reyeal',  // ← CHANGE THIS to whatever you want
            email: 'rere@example.com',  // ← CHANGE THIS
            mobile: '09123456789',  // ← CHANGE THIS
            password: 'agent123',
            passwordLastUpdated: '11/12/2025'
        };
    
    // Debug: Check what data we loaded
    console.log('Loaded agent data:', agentData);

    // Initialize orders from localStorage or defaults
    let orders = localStorage.getItem('hoyoAgentOrders')
        ? JSON.parse(localStorage.getItem('hoyoAgentOrders'))
        : [
        {
            id: 'Order #1002',
            date: '2025-11-10',
            game: 'Genshin Impact',
            service: '100% Fontaine Area',
            customer: 'U***nh',
            status: 'pending',
            amount: '₱500',
            details: {
                region: 'Fontaine',
                completionTarget: '100%',
                payment: '₱500 - Paid',
                credentials: 'Provided',
                notes: 'Please complete all waypoints and open all chests. Focus on exploration percentage first.'
            }
        },
        {
            id: 'HP0Order #1001',
            date: '2025-11-09',
            game: 'Honkai Star Rail',
            service: 'Memory of Chaos',
            customer: 'R***23',
            status: 'in-progress',
            amount: '₱350',
            details: {
                region: 'Herta Space Station',
                completionTarget: 'Clear all floors',
                payment: '₱350 - Paid',
                credentials: 'Provided',
                notes: 'Try to get 3 stars on each floor. Use the provided team builds.'
            }
        },
        {
            id: 'Order #1000',
            date: '2025-11-05',
            game: 'Zenless Zone Zero',
            service: 'Shiyu Defense',
            customer: 'J***xx',
            status: 'completed',
            amount: '₱300',
            details: {
                region: 'Combat Zone',
                completionTarget: 'Complete all stages',
                payment: '₱300 - Paid',
                credentials: 'Provided',
                notes: 'All stages cleared with max score. Customer satisfied.'
            }
        }
    ];

    // Save initial data only if not already saved
    if (!localStorage.getItem('hoyoAgentData')) {
        saveAgentData();
    }
    if (!localStorage.getItem('hoyoAgentOrders')) {
        saveOrders();
    }

    // ==================== LOAD AGENT DATA ====================
    
    function loadAgentData() {
        // Update all display elements
        const displayName = document.getElementById('displayName');
        const displayUsername = document.getElementById('displayUsername');
        const displayEmail = document.getElementById('displayEmail');
        const displayMobile = document.getElementById('displayMobile');
        const passwordLastUpdated = document.getElementById('passwordLastUpdated');
        
        if (displayName) displayName.textContent = agentData.username;
        if (displayUsername) displayUsername.textContent = agentData.username;
        if (displayEmail) displayEmail.textContent = agentData.email;
        if (displayMobile) displayMobile.textContent = agentData.mobile;
        if (passwordLastUpdated) passwordLastUpdated.textContent = agentData.passwordLastUpdated;
        
        updateStats();
    }

    function saveAgentData() {
        localStorage.setItem('hoyoAgentData', JSON.stringify(agentData));
    }

    function saveOrders() {
        localStorage.setItem('hoyoAgentOrders', JSON.stringify(orders));
    }

    function updateStats() {
        const total = orders.length;
        const completed = orders.filter(o => o.status === 'completed').length;
        const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

        document.getElementById('ordersHandling').textContent = total;
        document.getElementById('ordersCompleted').textContent = completed;
        document.getElementById('completionRate').textContent = rate + '%';
    }

    // Load agent data on page load
    loadAgentData();
    
    // Also load orders immediately
    loadOrders();

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
        document.getElementById('editUsername').value = agentData.username;
        document.getElementById('editEmail').value = agentData.email;
        document.getElementById('editMobile').value = agentData.mobile;
        
        openModal('editPersonalInfoModal');
    });

    document.getElementById('editPersonalInfoForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newUsername = document.getElementById('editUsername').value.trim();
        const newEmail = document.getElementById('editEmail').value.trim();
        const newMobile = document.getElementById('editMobile').value.trim();

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

        agentData.username = newUsername;
        agentData.email = newEmail;
        agentData.mobile = newMobile;

        saveAgentData();
        loadAgentData();
        closeModal('editPersonalInfoModal');

        showNotification('Personal information updated successfully!');
    });

    // ==================== CHANGE PASSWORD ====================
    
    document.getElementById('editPasswordBtn').addEventListener('click', function() {
        document.getElementById('editPasswordForm').reset();
        openModal('editPasswordModal');
    });

    document.getElementById('editPasswordForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (currentPassword !== agentData.password) {
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

        agentData.password = newPassword;
        agentData.passwordLastUpdated = new Date().toLocaleDateString('en-US');

        saveAgentData();
        loadAgentData();
        closeModal('editPasswordModal');

        showNotification('Password updated successfully!');
    });

    // ==================== ORDERS HANDLING ====================
    
    function loadOrders() {
        const ordersContainer = document.getElementById('ordersContainer');
        
        if (orders.length === 0) {
            ordersContainer.innerHTML = `
                <div style="text-align: center; padding: 60px 20px; color: #888;">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 20px;">
                        <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"></path>
                    </svg>
                    <p style="font-size: 18px; font-weight: 600; margin-bottom: 5px;">No Orders Assigned</p>
                    <span style="font-size: 14px;">You don't have any orders to handle yet</span>
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
                    <div class="status-dropdown">
                        <select class="status-select ${order.status}" ${order.status === 'completed' ? 'disabled' : ''}>
                            <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                            <option value="in-progress" ${order.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
                            <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>Completed</option>
                        </select>
                    </div>
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
                        <span class="label">Customer:</span>
                        <span>${order.customer}</span>
                    </div>
                </div>
                <div class="order-actions">
                    <button class="action-btn primary view-order-btn">View Details</button>
                    ${order.status !== 'completed' ? '<button class="action-btn success mark-complete-btn">Mark Complete</button>' : ''}
                    <button class="action-btn secondary chat-customer-btn">Chat with User</button>
                </div>
            </div>
        `).join('');

        attachOrderEventListeners();
    }

    function attachOrderEventListeners() {
        // Status change handlers
        document.querySelectorAll('.status-select').forEach(select => {
            select.addEventListener('change', function() {
                const orderCard = this.closest('.order-card');
                const orderId = orderCard.getAttribute('data-order-id');
                const newStatus = this.value;
                
                updateOrderStatus(orderId, newStatus);
            });
        });

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

        // Mark Complete
        document.querySelectorAll('.mark-complete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const orderCard = this.closest('.order-card');
                const orderId = orderCard.getAttribute('data-order-id');
                
                if (confirm(`Mark order ${orderId} as completed?`)) {
                    updateOrderStatus(orderId, 'completed');
                }
            });
        });

        // Chat with Customer
        document.querySelectorAll('.chat-customer-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                switchToChat();
            });
        });
    }

    function updateOrderStatus(orderId, newStatus) {
        const orderIndex = orders.findIndex(o => o.id === orderId);
        
        if (orderIndex !== -1) {
            orders[orderIndex].status = newStatus;
            saveOrders();
            loadOrders();
            updateStats();
            
            showNotification(`Order ${orderId} status updated to ${formatStatus(newStatus)}`);
        }
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
                    <div style="display: flex; gap: 10px; align-items: center;">
                        <span class="status-badge ${order.status}" style="font-size: 16px; padding: 8px 20px;">${formatStatus(order.status)}</span>
                    </div>
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
                            <span style="color: #888; font-weight: 500;">Customer:</span>
                            <span style="color: #333; font-weight: 600;">${order.customer}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: #888; font-weight: 500;">Payment:</span>
                            <span style="color: #667eea; font-weight: 700; font-size: 18px;">${order.amount}</span>
                        </div>
                    </div>
                </div>

                <div style="background: #f9f9f9; border-radius: 12px; padding: 25px; margin-bottom: 25px;">
                    <h4 style="font-size: 18px; color: #333; margin-bottom: 15px;">Order Information</h4>
                    <div style="display: grid; gap: 15px;">
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: #888; font-weight: 500;">Region/Area:</span>
                            <span style="color: #333; font-weight: 600;">${order.details.region}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: #888; font-weight: 500;">Target:</span>
                            <span style="color: #333; font-weight: 600;">${order.details.completionTarget}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: #888; font-weight: 500;">Credentials:</span>
                            <span style="color: #333; font-weight: 600;">${order.details.credentials}</span>
                        </div>
                    </div>
                </div>

                <div style="background: #fff3cd; border-left: 4px solid #ffc107; border-radius: 12px; padding: 20px; margin-bottom: 25px;">
                    <h4 style="font-size: 16px; color: #856404; margin-bottom: 10px;">📝 Customer Notes:</h4>
                    <p style="color: #856404; line-height: 1.6; margin: 0;">${order.details.notes}</p>
                </div>

                ${order.status !== 'completed' ? `
                <div style="display: flex; gap: 15px; margin-top: 25px;">
                    <button class="action-btn secondary" style="flex: 1;" onclick="document.getElementById('viewOrderModal').style.display='none'">Close</button>
                    <button class="action-btn success" style="flex: 1;" onclick="markCompleteFromModal('${order.id}')">Mark Complete</button>
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

    // Make markCompleteFromModal globally accessible
    window.markCompleteFromModal = function(orderId) {
        if (confirm(`Mark order ${orderId} as completed?`)) {
            updateOrderStatus(orderId, 'completed');
            closeModal('viewOrderModal');
        }
    };

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
        messageElement.className = 'message agent-message';
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
            const customerMessage = document.createElement('div');
            customerMessage.className = 'message customer-message';
            customerMessage.innerHTML = `
                <div style="background: #f0f0f0;
                    color: #333;
                    padding: 12px 18px;
                    border-radius: 18px 18px 18px 4px;
                    max-width: 70%;
                    margin-right: auto;
                    margin-bottom: 10px;
                    word-wrap: break-word;">
                    Thank you! I'll wait for updates.
                </div>
            `;
            chatMessages.appendChild(customerMessage);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1000);
    }

    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
    }

    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    function switchToChat() {
        menuButtons.forEach(btn => btn.classList.remove('active'));
        contentSections.forEach(section => section.classList.remove('active'));
        
        const chatMenuBtn = document.querySelector('[data-section="chat"]');
        const chatSection = document.getElementById('chat-section');
        
        if (chatMenuBtn) chatMenuBtn.classList.add('active');
        if (chatSection) chatSection.classList.add('active');
        
        setTimeout(() => {
            if (chatInput) chatInput.focus();
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