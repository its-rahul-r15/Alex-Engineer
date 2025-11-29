import React, { createContext, useContext, useEffect, useState } from 'react'
import axios from '../config/axios.js'

export const UserContext = createContext(null)

export const useUser = () => useContext(UserContext)

export const UserProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const token = localStorage.getItem('token');

		// If token exists, fetch user data
		if (token) {
			axios.get('/users/profile')
				.then(res => {
					setUser(res.data.user);
					setLoading(false);
				})
				.catch(err => {
					console.error('Failed to fetch user profile:', err);
					// Token might be invalid, clear it
					localStorage.removeItem('token');
					setLoading(false);
				});
		} else {
			setLoading(false);
		}
	}, []);

	return (
		<UserContext.Provider value={{ user, setUser, loading }}>
			{children}
		</UserContext.Provider>
	)
}

export default UserContext
