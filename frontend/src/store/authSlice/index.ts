import { SIGNIN_URL, SIGNOUT_URL, SIGNUP_URL } from '../../constants';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import type { InitialState, FormData } from './types';

const initialState: InitialState = {
	isAuthenticated: false,
	isLoading: true,
	user: null,
	token: null,
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const signUpUser = createAsyncThunk(
	SIGNUP_URL,
	async (formData: FormData) => {
		const response = await axios.post(
			`${API_BASE_URL}/api/auth/signUp`,
			formData,
			{
				withCredentials: true,
			}
		);
		return response.data;
	}
);

export const signInUser = createAsyncThunk(
	SIGNIN_URL,
	async (formData: FormData) => {
		const response = await axios.post(
			`${API_BASE_URL}/api/auth/signIn`,
			formData,
			{
				withCredentials: true,
			}
		);
		return response.data;
	}
);

export const signOutUser = createAsyncThunk(SIGNOUT_URL, async () => {
	const response = await axios.post(
		`${API_BASE_URL}/api/auth/signOut`,
		{},
		{
			withCredentials: true,
		}
	);
	return response.data;
});

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setUser: (state, action) => {
			state.user = action.payload;
		},
		resetTokenAndCredentials: (state) => {
			state.isAuthenticated = false;
			state.token = null;
			state.user = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(signUpUser.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(signUpUser.fulfilled, (state) => {
				state.isLoading = false;
				state.user = null;
				state.isAuthenticated = false;
			})
			.addCase(signUpUser.rejected, (state) => {
				state.isLoading = false;
				state.user = null;
				state.isAuthenticated = false;
			})
			.addCase(signInUser.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(signInUser.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isAuthenticated = action.payload.success;
				state.user = action.payload.success ? action.payload.user : null;
				state.token = action.payload.token;
				sessionStorage.setItem('token', JSON.stringify(action.payload.token));
			})
			.addCase(signInUser.rejected, (state) => {
				state.isLoading = false;
				state.isAuthenticated = false;
				state.user = null;
				state.token = null;
			})
			.addCase(signOutUser.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(signOutUser.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isAuthenticated = !action.payload.success;
				state.user = action.payload.success ? null : action.payload.user;
			})
			.addCase(signOutUser.rejected, (state) => {
				state.isLoading = false;
				state.isAuthenticated = false;
				state.user = null;
			});
	},
});

export const { setUser, resetTokenAndCredentials } = authSlice.actions;
export default authSlice.reducer; // export reducer to store.js
