import FlowCanvas from '../../components/FlowCanvas/FlowCanvas';
import { Header } from '../../components/Header';

const Home = () => {
	return (
		<main className="flex min-h-screen flex-col items-center justify-center px-4 text-center bg-background text-foreground">
			<div className="space-y-4">
				<Header />
				<FlowCanvas />
			</div>
		</main>
	);
};

export default Home;
