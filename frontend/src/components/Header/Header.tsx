import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { SIGNOUT_URL } from '../../constants';
import { logo } from '../../assets';

function Header() {
	const navigate = useNavigate();

	const handleSignOut = () => {
		localStorage.removeItem('token');
		localStorage.removeItem('user');

		toast.success('Signed out successfully !');
		navigate(SIGNOUT_URL);
	};

	return (
		<header className="flex items-center justify-between px-6 py-4 bg-white border-b shadow-sm mb-0">
			<div className="text-2xl font-bold text-primary flex justify-center gap-2 items-center">
				<img
					src={logo}
					alt="NodePilot Logo"
					className="w-8 h-8"
				/>
				NodePilot
			</div>
			<button
				onClick={handleSignOut}
				className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 transition"
			>
				Sign Out
			</button>
		</header>
	);
}

export default Header;
