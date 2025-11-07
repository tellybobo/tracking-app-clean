document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Store session ID
                localStorage.setItem('sessionId', data.sessionId);
                // Redirect to dashboard
                window.location.href = '/admin/dashboard.html';
            } else {
                alert(data.message || 'Login failed');
            }
        } catch (error) {
            alert('Login error: ' + error.message);
        }
    });
});