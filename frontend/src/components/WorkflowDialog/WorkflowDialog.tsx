// components/LoadWorkflowDialog.tsx
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { useEffect, useState } from 'react';
import type { WorkflowProps, Workflow } from './types';
import { Trash2, Loader2 } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_CLIENT_BASE_URL;

export default function WorkflowDialog({ onLoad }: WorkflowProps) {
	const [workflows, setWorkflows] = useState<Workflow[]>([]);
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState<string | null>(null);

	useEffect(() => {
		if (!open) return;

		fetch(`${API_BASE_URL}/workflow`)
			.then((res) => res.json())
			.then(setWorkflows)
			.catch((err) => {
				console.error('Failed to fetch workflows', err);
			});
	}, [open]);

	const handleDelete = async (id: string) => {
		const confirmed = confirm('Are you sure you want to delete this workflow?');
		if (!confirmed) return;

		try {
			setLoading(id);
			await fetch(`${API_BASE_URL}/workflow/delete/${id}`, {
				method: 'DELETE',
			});
			setWorkflows((prev) => prev.filter((workflow) => workflow._id !== id));
		} catch (err) {
			console.error('Failed to delete workflow', err);
			alert('Failed to delete workflow');
		} finally {
			setLoading(null);
		}
	};

	return (
		<Dialog
			open={open}
			onOpenChange={setOpen}
		>
			<DialogTrigger asChild>
				<Button
					className="text-white bg-black"
					variant="outline"
				>
					Load Workflow
				</Button>
			</DialogTrigger>

			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>Select a Workflow</DialogTitle>
				</DialogHeader>

				{workflows.length === 0 ? (
					<p className="text-sm text-muted-foreground">
						No saved workflows found.
					</p>
				) : (
					<ul className="space-y-2 max-h-[300px] overflow-y-auto">
						{workflows.map((workflow) => (
							<li key={workflow._id}>
								<div className="inline-flex w-11/12">
									<Button
										variant="ghost"
										className="w-full justify-start text-left"
										onClick={() => {
											onLoad(workflow._id);
											setOpen(false);
										}}
									>
										{workflow.name}
									</Button>
									<Button
										variant="ghost"
										size="icon"
										className="text-red-600 "
										onClick={() => handleDelete(workflow._id)}
										disabled={loading === workflow._id}
									>
										{loading === workflow._id ? (
											<Loader2 className="w-4 h-4 animate-spin" />
										) : (
											<Trash2 className="w-4 h-4" />
										)}
									</Button>
								</div>
							</li>
						))}
					</ul>
				)}
			</DialogContent>
		</Dialog>
	);
}
