// TEMPORARY DEBUG SCRIPT - Run this in your browser console to check your token

// Get token from localStorage
const token = localStorage.getItem('token');

if (!token) {
    console.log('❌ NO TOKEN FOUND - You need to log in first!');
} else {
    console.log('✅ Token found in localStorage');

    // Decode JWT (without verification - just to see what's inside)
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const decoded = JSON.parse(jsonPayload);
        console.log('📦 Token contents:', decoded);

        if (decoded._id) {
            console.log('✅ Token has _id:', decoded._id);
            console.log('✅ You should be able to deploy!');
        } else {
            console.log('❌ Token does NOT have _id');
            console.log('⚠️  You need to LOG OUT and LOG BACK IN to get a new token');
            console.log('⚠️  Steps: 1) Log out, 2) Log in again, 3) Try deploying');
        }

        // Check expiration
        const exp = new Date(decoded.exp * 1000);
        const now = new Date();
        if (exp < now) {
            console.log('⚠️  Token is EXPIRED - You need to log in again');
        } else {
            console.log(`✅ Token expires: ${exp.toLocaleString()}`);
        }

    } catch (error) {
        console.error('❌ Error decoding token:', error);
    }
}

console.log('\n📝 To fix deployment issues:');
console.log('1. Log out from the app');
console.log('2. Log back in');
console.log('3. Run this script again to verify');
console.log('4. Try deploying');
