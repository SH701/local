export async function logout() {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (accessToken) {
        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json',
                    "Authorization": `Bearer ${accessToken}`
                },
                body: JSON.stringify({ refreshToken })
            });
        } catch (error) {
            console.error('Logout API call failed:', error);
        }
    }
    
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
}