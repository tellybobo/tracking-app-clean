document.addEventListener('DOMContentLoaded', async () => {
    const sessionId = localStorage.getItem('sessionId');
    
    if (!sessionId) {
        window.location.href = '/';
        return;
    }

    try {
        const response = await fetch('/api/dashboard-data', {
            headers: { 'Authorization': sessionId }
        });
        
        const data = await response.json();
        
        if (data.success) {
            document.getElementById('welcomeMessage').textContent = data.message;
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        alert('Please login again');
        localStorage.removeItem('sessionId');
        window.location.href = '/';
    }
});