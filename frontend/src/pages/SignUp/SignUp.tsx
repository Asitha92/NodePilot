import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SIGNIN_URL } from '../../constants';
import { toast } from 'sonner';
import { background } from '../../assets';

const initialState = {
	userName: '',
	email: '',
	password: '',
};

const API_BASE_URL = import.meta.env.VITE_CLIENT_BASE_URL;

function SignUp() {
	const [formData, setFormData] = useState(initialState);
	const [loading, setLoading] = useState(false);

	const navigate = useNavigate();

	async function onSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setLoading(true);

		try {
			const res = await fetch(`${API_BASE_URL}/auth/signUp`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData),
			});

			const data = await res.json();

			if (data.success) {
				toast.success('Account created successfully !', {
					duration: 4000,
					action: {
						label: 'Undo',
						onClick: () => console.log('Undo clicked'),
					},
				});
				navigate(SIGNIN_URL);
			} else {
				toast.warning('Account creation unsuccessful !', {
					duration: 4000,
					action: {
						label: 'Undo',
						onClick: () => console.log('Undo clicked'),
					},
				});
			}
		} catch (error) {
			toast.error('Something wrong, Please try  again !', {
				duration: 4000,
				action: {
					label: 'Undo',
					onClick: () => console.log('Undo clicked'),
				},
			});
			console.error(error);
		} finally {
			setLoading(false);
		}
	}

	return (
		<div
			className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex items-center justify-center px-4"
			style={{ backgroundImage: `url(${background})` }}
		>
			<div className="bg-white/90 backdrop-blur-sm p-8 rounded-lg shadow-lg max-w-md w-full space-y-6">
				<div className="text-center">
					<h1 className="text-3xl font-bold tracking-tight text-foreground">
						Create new account
					</h1>
					<p className="mt-2 text-sm text-muted-foreground">
						Already have an account?
						<Link
							to={SIGNIN_URL}
							className="px-2 underline"
						>
							Sign In
						</Link>
					</p>
				</div>

				<form
					onSubmit={onSubmit}
					className="space-y-4"
				>
					<div>
						<label
							htmlFor="userName"
							className="block mb-1 text-sm font-medium"
						>
							Username
						</label>
						<input
							id="userName"
							type="text"
							required
							value={formData.userName}
							onChange={(e) =>
								setFormData({ ...formData, userName: e.target.value })
							}
							className="w-full border rounded px-3 py-2"
						/>
					</div>

					<div>
						<label
							htmlFor="email"
							className="block mb-1 text-sm font-medium"
						>
							Email
						</label>
						<input
							id="email"
							type="email"
							required
							value={formData.email}
							onChange={(e) =>
								setFormData({ ...formData, email: e.target.value })
							}
							className="w-full border rounded px-3 py-2"
						/>
					</div>

					<div>
						<label
							htmlFor="password"
							className="block mb-1 text-sm font-medium"
						>
							Password
						</label>
						<input
							id="password"
							type="password"
							required
							value={formData.password}
							onChange={(e) =>
								setFormData({ ...formData, password: e.target.value })
							}
							className="w-full border rounded px-3 py-2"
						/>
					</div>

					<button
						type="submit"
						disabled={loading}
						className="w-full bg-primary text-white py-2 rounded hover:bg-primary/90 transition"
					>
						{loading ? 'Signing up...' : 'Sign Up'}
					</button>
				</form>
			</div>
		</div>
	);
}

export default SignUp;
