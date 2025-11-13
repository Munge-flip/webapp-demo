document.addEventListener('DOMContentLoaded', function() {
    // ==================== INITIALIZE DATA ====================
    
    // Initialize orders from localStorage or defaults
    let orders = localStorage.getItem('hoyoAdminOrders')
        ? JSON.parse(localStorage.getItem('hoyoAdminOrders'))
        : [
            {
                id: '1002',
                game: 'Genshin Impact',
                service: 'Exploration',
                user: 'U***nh',
                agent: 'DarkBeam',
                status: 'in-progress',
                amount: '₱500',
                date: '2025-11-10'
            },
            {
                id: '1001',
                game: 'Honkai Star Rail',
                service: 'Memory of Chaos',
                user: 'R***23',
                agent: 'Cola',
                status: 'in-progress',
                amount: '₱350',
                date: '2025-11-09'
            },
            {
                id: '1000',
                game: 'Zenless Zone Zero',
                service: 'Events',
                user: 'J***xx',
                agent: 'Unassigned',
                status: 'pending',
                amount: '₱300',
                date: '2025-11-08'
            }
        ];

    // Initialize agents from localStorage or defaults
    let agents = localStorage.getItem('hoyoAdminAgents')
        ? JSON.parse(localStorage.getItem('hoyoAdminAgents'))
        : [
            {
                id: '1234',
                name: 'DarkBeam',
                email: 'darkbeam@hoyopiloting.com',
                ordersHandling: 1,
                completionRate: '0/1',
                status: 'active'
            },
            {
                id: '1222',
                name: 'Cola',
                email: 'cola@hoyopiloting.com',
                ordersHandling: 1,
                completionRate: '0/1',
                status: 'active'
            },
            {
                id: '1212',
                name: 'Jinxx',
                email: 'jinxx@hoyopiloting.com',
                ordersHandling: 0,
                completionRate: '0/0',
                status: 'active'
            }
        ];

    // Initialize users from localStorage or defaults
    let users = localStorage.getItem('hoyoAdminUsers')
        ? JSON.parse(localStorage.getItem('hoyoAdminUsers'))
        : [
            {
                username: 'reyeah23',
                email: 'ggonzalesa@ssct.edu.ph',
                mobile: '09123456789',
                dateCreated: '2025-09-01'
            },
            {
                username: 'darkbeam99',
                email: 'darkbeam@ssct.edu.ph',
                mobile: '09234567890',
                dateCreated: '2025-09-02'
            },
            {
                username: 'jinxxgamer',
                email: 'jinxx@ssct.edu.ph',
                mobile: '09345678901',
                dateCreated: '2025-09-03'
            }
        ];

    // Save functions
    function saveOrders() {
        localStorage.setItem('hoyoAdminOrders', JSON.stringify(orders));
    }

    function saveAgents() {
        localStorage.setItem('hoyoAdminAgents', JSON.stringify(agents));
    }

    function saveUsers() {
        localStorage.setItem('hoyoAdminUsers', JSON.stringify(users));
    }

    // Save initial data if not already saved
    if (!localStorage.getItem('hoyoAdminOrders')) saveOrders();
    if (!localStorage.getItem('hoyoAdminAgents')) saveAgents();
    if (!localStorage.getItem('hoyoAdminUsers')) saveUsers();

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
                
                // Load section data
                if (targetSection === 'orders') loadOrders();
                else if (targetSection === 'agents') loadAgents();
                else if (targetSection === 'users') loadUsers();
                else if (targetSection === 'overview') updateOverview();
            }
        });
    });

    // ==================== MODAL MANAGEMENT ====================
    
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.style.display = 'block';
    }

    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.style.display = 'none';
    }

    // Close modal handlers
    document.querySelectorAll('.close-modal, .btn-secondary[data-modal]').forEach(btn => {
        btn.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal');
            if (modalId) closeModal(modalId);
        });
    });

    // Close modal on outside click
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });

    // ==================== OVERVIEW / STATS ====================
    
    function updateOverview() {
        const totalOrders = orders.length;
        const totalAgents = agents.length;
        const totalUsers = users.length;
        const activeOrders = orders.filter(o => o.status === 'in-progress').length;
        
        // Calculate revenue from completed orders
        const revenue = orders
            .filter(o => o.status === 'completed')
            .reduce((sum, o) => {
                const amount = parseInt(o.amount.replace(/[^\d]/g, ''));
                return sum + amount;
            }, 0);

        document.getElementById('totalOrders').textContent = totalOrders;
        document.getElementById('totalAgents').textContent = totalAgents;
        document.getElementById('totalUsers').textContent = totalUsers;
        document.getElementById('totalRevenue').textContent = `₱${revenue.toLocaleString()}`;
        document.getElementById('activeOrders').textContent = `${activeOrders} orders in progress`;
    }

    // ==================== ORDERS MANAGEMENT ====================
    
    function loadOrders() {
        const tbody = document.getElementById('ordersTableBody');
        
        if (orders.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align: center; padding: 40px; color: #888;">
                        No orders found
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = orders.map((order, index) => `
            <tr data-order-index="${index}">
                <td>${order.id}</td>
                <td>${order.game}</td>
                <td>${order.service}</td>
                <td>${order.user}</td>
                <td>${order.agent}</td>
                <td><span class="badge ${order.status}">${formatStatus(order.status)}</span></td>
                <td>${order.amount}</td>
                <td>
                    <button class="action-link view-order-btn">View</button>
                    ${order.status === 'pending' && order.agent === 'Unassigned' ? 
                        '<button class="action-link primary assign-order-btn">Assign</button>' : ''}
                    <button class="action-link delete delete-order-btn">Delete</button>
                </td>
            </tr>
        `).join('');

        attachOrderEventListeners();
    }

    function attachOrderEventListeners() {
        // View Order
        document.querySelectorAll('.view-order-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = this.closest('tr').getAttribute('data-order-index');
                showOrderDetails(orders[index]);
            });
        });

        // Assign Agent
        document.querySelectorAll('.assign-order-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = this.closest('tr').getAttribute('data-order-index');
                showAssignAgentModal(orders[index].id);
            });
        });

        // Delete Order
        document.querySelectorAll('.delete-order-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = this.closest('tr').getAttribute('data-order-index');
                if (confirm(`Delete order ${orders[index].id}?`)) {
                    orders.splice(index, 1);
                    saveOrders();
                    loadOrders();
                    updateOverview();
                    showNotification('Order deleted successfully');
                }
            });
        });
    }

    function showOrderDetails(order) {
        const content = document.getElementById('orderDetailsContent');
        
        content.innerHTML = `
            <div style="padding: 30px;">
                <div style="margin-bottom: 25px;">
                    <h3 style="font-size: 20px; color: #333; margin-bottom: 10px;">Order ${order.id}</h3>
                    <span class="badge ${order.status}" style="font-size: 14px; padding: 8px 16px;">${formatStatus(order.status)}</span>
                </div>
                
                <div style="display: grid; gap: 20px;">
                    <div style="display: flex; justify-content: space-between; padding: 15px; background: #f9f9f9; border-radius: 10px;">
                        <span style="color: #888; font-weight: 500;">Game:</span>
                        <strong style="color: #333;">${order.game}</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 15px; background: #f9f9f9; border-radius: 10px;">
                        <span style="color: #888; font-weight: 500;">Service:</span>
                        <strong style="color: #333;">${order.service}</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 15px; background: #f9f9f9; border-radius: 10px;">
                        <span style="color: #888; font-weight: 500;">Customer:</span>
                        <strong style="color: #333;">${order.user}</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 15px; background: #f9f9f9; border-radius: 10px;">
                        <span style="color: #888; font-weight: 500;">Assigned Agent:</span>
                        <strong style="color: #333;">${order.agent}</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 15px; background: #f9f9f9; border-radius: 10px;">
                        <span style="color: #888; font-weight: 500;">Amount:</span>
                        <strong style="color: #667eea; font-size: 18px;">${order.amount}</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 15px; background: #f9f9f9; border-radius: 10px;">
                        <span style="color: #888; font-weight: 500;">Date:</span>
                        <strong style="color: #333;">${formatDate(order.date)}</strong>
                    </div>
                </div>
                
                <div style="margin-top: 30px;">
                    <button class="btn-primary" style="width: 100%;" onclick="document.getElementById('viewOrderModal').style.display='none'">Close</button>
                </div>
            </div>
        `;
        
        openModal('viewOrderModal');
    }

    function showAssignAgentModal(orderId) {
        document.getElementById('assignOrderId').value = orderId;
        
        const select = document.getElementById('assignAgentSelect');
        select.innerHTML = '<option value="">Choose an agent...</option>' +
            agents
                .filter(a => a.status === 'active')
                .map(a => `<option value="${a.name}">${a.name} (${a.ordersHandling} active)</option>`)
                .join('');
        
        openModal('assignAgentModal');
    }

    document.getElementById('assignAgentForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const orderId = document.getElementById('assignOrderId').value;
        const agentName = document.getElementById('assignAgentSelect').value;
        
        const orderIndex = orders.findIndex(o => o.id === orderId);
        if (orderIndex !== -1) {
            orders[orderIndex].agent = agentName;
            orders[orderIndex].status = 'in-progress';
            
            const agentIndex = agents.findIndex(a => a.name === agentName);
            if (agentIndex !== -1) {
                agents[agentIndex].ordersHandling++;
            }
            
            saveOrders();
            saveAgents();
            loadOrders();
            updateOverview();
            closeModal('assignAgentModal');
            showNotification(`Order ${orderId} assigned to ${agentName}`);
        }
    });

    // ==================== AGENTS MANAGEMENT ====================
    
    function loadAgents() {
        const grid = document.getElementById('agentsGrid');
        
        if (agents.length === 0) {
            grid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 60px; color: #888;">
                    <p style="font-size: 18px; font-weight: 600;">No agents yet</p>
                    <p style="font-size: 14px;">Click "Add Agent" to get started</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = agents.map((agent, index) => {
            const initials = agent.name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
            
            return `
                <div class="agent-card" data-agent-index="${index}">
                    <div class="agent-header">
                        <div class="agent-avatar">${initials}</div>
                        <div class="agent-info">
                            <h3>${agent.name}</h3>
                            <p class="agent-id">ID: ${agent.id}</p>
                        </div>
                        <div class="agent-stats">
                            <span class="stat-badge">${agent.ordersHandling} active</span>
                        </div>
                    </div>
                    <div class="agent-details">
                        <div class="detail-item">
                            <span>Orders Handling:</span>
                            <strong>${agent.ordersHandling}</strong>
                        </div>
                        <div class="detail-item">
                            <span>Completion Rate:</span>
                            <strong>${agent.completionRate}</strong>
                        </div>
                        <div class="detail-item">
                            <span>Status:</span>
                            <span class="badge in-progress">${agent.status}</span>
                        </div>
                    </div>
                    <div class="agent-actions">
                        <button class="btn-secondary view-agent-orders-btn">View Orders</button>
                        <button class="btn-danger remove-agent-btn">Remove</button>
                    </div>
                </div>
            `;
        }).join('');

        attachAgentEventListeners();
    }

    function attachAgentEventListeners() {
        // View Agent Orders
        document.querySelectorAll('.view-agent-orders-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = this.closest('.agent-card').getAttribute('data-agent-index');
                showAgentOrders(agents[index]);
            });
        });

        // Remove Agent
        document.querySelectorAll('.remove-agent-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = this.closest('.agent-card').getAttribute('data-agent-index');
                const agent = agents[index];
                
                if (confirm(`Remove agent ${agent.name}?\n\nNote: Their assigned orders will be unassigned.`)) {
                    // Unassign orders
                    orders.forEach(order => {
                        if (order.agent === agent.name) {
                            order.agent = 'Unassigned';
                            order.status = 'pending';
                        }
                    });
                    
                    agents.splice(index, 1);
                    saveAgents();
                    saveOrders();
                    loadAgents();
                    updateOverview();
                    showNotification(`Agent ${agent.name} removed`);
                }
            });
        });
    }

    function showAgentOrders(agent) {
        const agentOrders = orders.filter(o => o.agent === agent.name);
        const content = document.getElementById('agentOrdersContent');
        
        content.innerHTML = `
            <div style="padding: 30px;">
                <h3 style="font-size: 20px; color: #333; margin-bottom: 20px;">Orders for ${agent.name}</h3>
                
                ${agentOrders.length === 0 ? `
                    <div style="text-align: center; padding: 40px; color: #888;">
                        <p>No orders assigned to this agent</p>
                    </div>
                ` : `
                    <div style="display: grid; gap: 15px;">
                        ${agentOrders.map(order => `
                            <div style="padding: 20px; background: #f9f9f9; border-radius: 10px; border-left: 4px solid #667eea;">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                    <strong style="color: #333;">${order.id}</strong>
                                    <span class="badge ${order.status}">${formatStatus(order.status)}</span>
                                </div>
                                <div style="display: grid; gap: 8px; color: #666; font-size: 14px;">
                                    <div><strong>Game:</strong> ${order.game}</div>
                                    <div><strong>Service:</strong> ${order.service}</div>
                                    <div><strong>Customer:</strong> ${order.user}</div>
                                    <div><strong>Amount:</strong> <span style="color: #667eea; font-weight: 600;">${order.amount}</span></div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `}
                
                <div style="margin-top: 25px;">
                    <button class="btn-primary" style="width: 100%;" onclick="document.getElementById('viewAgentOrdersModal').style.display='none'">Close</button>
                </div>
            </div>
        `;
        
        openModal('viewAgentOrdersModal');
    }

    // Add Agent
    document.getElementById('addAgentBtn').addEventListener('click', function() {
        document.getElementById('addAgentForm').reset();
        openModal('addAgentModal');
    });

    document.getElementById('addAgentForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('agentName').value.trim();
        const email = document.getElementById('agentEmail').value.trim();
        
        const newAgent = {
            id: 'AG' + String(agents.length + 1).padStart(3, '0'),
            name: name,
            email: email,
            ordersHandling: 0,
            completionRate: '0/0',
            status: 'active'
        };
        
        agents.push(newAgent);
        saveAgents();
        loadAgents();
        updateOverview();
        closeModal('addAgentModal');
        showNotification(`Agent ${name} added successfully`);
    });

    // ==================== USERS MANAGEMENT ====================
    
    function loadUsers() {
        const tbody = document.getElementById('usersTableBody');
        
        if (users.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; padding: 40px; color: #888;">
                        No users found
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = users.map((user, index) => `
            <tr data-user-index="${index}">
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${user.mobile}</td>
                <td>${formatDate(user.dateCreated)}</td>
                <td>
                    <button class="action-link edit-user-btn">Edit</button>
                    <button class="action-link delete delete-user-btn">Delete</button>
                </td>
            </tr>
        `).join('');

        attachUserEventListeners();
    }

    function attachUserEventListeners() {
        // Edit User
        document.querySelectorAll('.edit-user-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = this.closest('tr').getAttribute('data-user-index');
                showEditUserModal(users[index], index);
            });
        });

        // Delete User
        document.querySelectorAll('.delete-user-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = this.closest('tr').getAttribute('data-user-index');
                if (confirm(`Delete user ${users[index].username}?`)) {
                    users.splice(index, 1);
                    saveUsers();
                    loadUsers();
                    updateOverview();
                    showNotification('User deleted successfully');
                }
            });
        });
    }

    function showEditUserModal(user, index) {
        document.getElementById('editUserId').value = index;
        document.getElementById('editUsername').value = user.username;
        document.getElementById('editUserEmail').value = user.email;
        document.getElementById('editUserMobile').value = user.mobile;
        
        openModal('editUserModal');
    }

    document.getElementById('editUserForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const index = document.getElementById('editUserId').value;
        const username = document.getElementById('editUsername').value.trim();
        const email = document.getElementById('editUserEmail').value.trim();
        const mobile = document.getElementById('editUserMobile').value.trim();
        
        users[index].username = username;
        users[index].email = email;
        users[index].mobile = mobile;
        
        saveUsers();
        loadUsers();
        closeModal('editUserModal');
        showNotification('User updated successfully');
    });

    // ==================== SEARCH FUNCTIONALITY ====================
    
    document.getElementById('searchOrders')?.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const rows = document.querySelectorAll('#ordersTableBody tr');
        
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    });

    document.getElementById('searchUsers')?.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const rows = document.querySelectorAll('#usersTableBody tr');
        
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    });

    // ==================== UTILITY FUNCTIONS ====================
    
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
                from { transform: translateX(400px); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
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

    // ==================== INITIAL LOAD ====================
    
    updateOverview();
    loadOrders();
});