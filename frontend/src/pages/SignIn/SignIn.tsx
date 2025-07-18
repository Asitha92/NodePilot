import { useState } from 'react';
import type { FormEvent } from 'react';
import { SIGNUP_URL } from '../../constants';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { background } from '../../assets';

const API_BASE_URL = import.meta.env.VITE_CLIENT_BASE_URL;

function SignIn() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);

		try {
			const res = await fetch(`${API_BASE_URL}/auth/signIn`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password }),
				credentials: 'include',
			});

			const data = await res.json();

			if (data.success) {
				localStorage.setItem('token', data.token);
				localStorage.setItem('user', JSON.stringify(data.user));
				toast.success(
					<div className="flex items-center gap-2">Login Successful !!!</div>
				);
				navigate('/');
			} else {
				toast.warning(
					<div className="flex items-center gap-2">
						Login failed. Please try again !!!
					</div>
				);
			}
		} catch (error) {
			console.error('Login error:', error);
			toast.error(
				<div className="flex items-center gap-2">
					Something went wrong. Please try again.
				</div>
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div
			className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex items-center justify-center px-4"
			style={{ backgroundImage: `url(${background})` }}
		>
			<div className="bg-white/90 backdrop-blur-sm p-8 rounded-lg shadow-lg max-w-md w-full space-y-6">
				<div className="text-center">
					<h1 className="text-3xl font-bold text-foreground">
						Sign in to your account
					</h1>
					<p className="mt-2 text-sm text-muted-foreground">
						Don't have an account?
						<Link
							className="px-2 underline"
							to={SIGNUP_URL}
						>
							Sign Up
						</Link>
					</p>
				</div>

				<form
					onSubmit={handleSubmit}
					className="space-y-4"
				>
					<div>
						<label className="block mb-1 text-sm font-medium">Email</label>
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full px-4 py-2 border rounded-md text-sm"
							placeholder="you@example.com"
							required
						/>
					</div>

					<div>
						<label className="block mb-1 text-sm font-medium">Password</label>
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full px-4 py-2 border rounded-md text-sm"
							placeholder="Enter your password"
							required
						/>
					</div>

					<button
						type="submit"
						disabled={loading}
						className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/90 transition disabled:opacity-50"
					>
						{loading ? 'Signing in...' : 'Sign In'}
					</button>
				</form>
			</div>
		</div>
	);
}

export default SignIn;
