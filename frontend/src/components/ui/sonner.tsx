import { useTheme } from 'next-themes';
import { Toaster as Sonner } from 'sonner';

const Toaster = ({ ...props }) => {
	const { theme } = useTheme();

	const resolvedTheme =
		theme === 'light' || theme === 'dark' || theme === 'system'
			? theme
			: 'system';

	return (
		<Sonner
			theme={resolvedTheme}
			className="toaster group"
			style={
				{
					'--normal-bg': 'var(--popover)',
					'--normal-text': 'var(--popover-foreground)',
					'--normal-border': 'var(--border)',
				} as React.CSSProperties
			}
			{...props}
		/>
	);
};

export { Toaster };
