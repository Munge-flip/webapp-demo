// Demo accounts (hardcoded)
const DEMO_ACCOUNTS = {
    'user@example.com': {
        password: 'password',
        role: 'user',
        name: 'Demo User',
        redirect: 'user-profile.html'
    },
    'agent@example.com': {
        password: 'password',
        role: 'agent',
        name: 'Demo Agent',
        redirect: 'agent-dashboard.html'
    },
    'admin@example.com': {
        password: 'password',
        role: 'admin',
        name: 'Demo Admin',
        redirect: 'admin-dashboard.html'
    }
};

let isSignUp = false;

document.addEventListener('DOMContentLoaded', function() {
    const toggleBtn = document.getElementById('toggleBtn');
    const promoTitle = document.getElementById('promoTitle');
    const promoText = document.getElementById('promoText');
    const formTitle = document.getElementById('formTitle');
    const signupForm = document.getElementById('signupForm');
    const signinForm = document.getElementById('signinForm');

    // Toggle between Sign In and Sign Up
    toggleBtn.addEventListener('click', function() {
        isSignUp = !isSignUp;
        
        if (isSignUp) {
            promoTitle.textContent = 'ALREADY HAVE AN ACCOUNT?';
            promoText.textContent = 'Sign in to our account and enjoy your service with Hoyo Piloting service';
            toggleBtn.textContent = 'Sign In';
            formTitle.textContent = 'SIGN UP';
            signupForm.classList.add('active');
            signinForm.classList.remove('active');
        } else {
            promoTitle.textContent = 'NEED AN ACCOUNT?';
            promoText.textContent = 'Sign up an account and enjoy the services';
            toggleBtn.textContent = 'Create New Account';
            formTitle.textContent = 'SIGN IN';
            signupForm.classList.remove('active');
            signinForm.classList.add('active');
        }
    });

    // Handle Sign In
    signinForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = signinForm.querySelector('input[type="email"]').value.trim();
        const password = signinForm.querySelector('input[type="password"]').value;

        // Check if account exists
        if (DEMO_ACCOUNTS[email]) {
            if (DEMO_ACCOUNTS[email].password === password) {
                // Successful login
                const user = DEMO_ACCOUNTS[email];
                
                // Store user info in localStorage
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userRole', user.role);
                localStorage.setItem('userName', user.name);
                localStorage.setItem('userEmail', email);

                // Show success and redirect
                window.location.href = user.redirect;
            } else {
                // Wrong password
                alert('Incorrect password!');
            }
        } else {
            // Account not found
            alert('Account not found! Use demo accounts:\nuser@example.com\nagent@example.com\nadmin@example.com\nPassword: password');
        }
    });

    // Handle Sign Up
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = signupForm.querySelector('input[type="text"]').value.trim();
        const email = signupForm.querySelector('input[type="email"]').value.trim();
        const password = signupForm.querySelectorAll('input[type="password"]')[0].value;
        const confirmPassword = signupForm.querySelectorAll('input[type="password"]')[1].value;

        // Validate
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        if (password.length < 6) {
            alert('Password must be at least 6 characters!');
            return;
        }

        // Store new user in localStorage
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userRole', 'user');
        localStorage.setItem('userName', name);
        localStorage.setItem('userEmail', email);

        // Show success and redirect
        alert(`Account created successfully! Welcome, ${name}!`);
        window.location.href = 'user-profile.html';
    });

    // Check if already logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userRole = localStorage.getItem('userRole');

    if (isLoggedIn === 'true') {
        // Already logged in, redirect to appropriate page
        if (userRole === 'admin') {
            window.location.href = 'admin-dashboard.html';
        } else if (userRole === 'agent') {
            window.location.href = 'agent-dashboard.html';
        } else {
            window.location.href = 'user-profile.html';
        }
    }
});