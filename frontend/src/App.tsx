import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from 'react-router-dom';
import { Home } from './pages/Home';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';
import { Toaster } from './components/ui/sonner';
import { SIGNIN_URL, SIGNUP_URL } from './constants';

const isAuthenticated = () => {
	const token = localStorage.getItem('token');
	return Boolean(token);
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
	if (!isAuthenticated())
		return (
			<Navigate
				to={SIGNIN_URL}
				replace
			/>
		);
	return <>{children}</>;
};

function App() {
	return (
		<Router>
			<Toaster />
			<Routes>
				<Route
					path="/"
					element={
						<ProtectedRoute>
							<Home />
						</ProtectedRoute>
					}
				/>
				<Route
					path={SIGNIN_URL}
					element={<SignIn />}
				/>
				<Route
					path={SIGNUP_URL}
					element={<SignUp />}
				/>
				<Route
					path="*"
					element={<Navigate to="/" />}
				/>
			</Routes>
		</Router>
	);
}

export default App;
