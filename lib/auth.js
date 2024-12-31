export async function checkAuthStatus() {
  try {
    const res = await fetch('/api/auth/check-auth', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include' // Important for cookies
    });
    
    if (!res.ok) {
      console.error('Auth check failed:', res.status);
      return { isAuthenticated: false };
    }
    
    const data = await res.json();
    return {
      isAuthenticated: !!data.isAuthenticated,
      user: data.user || null
    };
  } catch (error) {
    console.error('Auth check error:', error);
    return { isAuthenticated: false };
  }
}