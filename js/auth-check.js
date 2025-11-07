// auth-check.js - Add this script to protect pages
// Include this at the TOP of your HTML pages (before other scripts)

(function() {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userRole = localStorage.getItem('userRole');
    const currentPage = window.location.pathname.split('/').pop();

    // If not logged in, redirect to login
    if (isLoggedIn !== 'true') {
        window.location.href = 'login.html';
        return;
    }

    // Role-based access control
    const roleAccess = {
        'profile.html': ['user', 'agent', 'admin'], // Everyone can access
        'agent-dashboard.html': ['agent', 'admin'], // Only agents and admin
        'admin-dashboard.html': ['admin'] // Only admin
    };

    // Check if user has access to this page
    if (roleAccess[currentPage] && !roleAccess[currentPage].includes(userRole)) {
        alert('Access denied! You do not have permission to view this page.');
        
        // Redirect to appropriate page based on role
        if (userRole === 'admin') {
            window.location.href = 'admin-dashboard.html';
        } else if (userRole === 'agent') {
            window.location.href = 'agent-dashboard.html';
        } else {
            window.location.href = 'profile.html';
        }
    }
})();

// Logout function (call this from logout button)
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        // Clear all stored data
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        
        // Redirect to login
        window.location.href = 'login.html';
    }
}

// Get current user info
function getCurrentUser() {
    return {
        name: localStorage.getItem('userName'),
        email: localStorage.getItem('userEmail'),
        role: localStorage.getItem('userRole')
    };
}