import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import type { DialogPromptProps } from './types';
import type { DecisionNodeData, PromptOrActionData } from '../FlowCanvas/types';

export default function DialogPrompt({
	setNodes,
	setSelectedNode,
	selectedNode,
}: DialogPromptProps) {
	if (!selectedNode) return null;

	const isDecision = selectedNode?.type === 'decisionNode';
	const isPromptOrAction =
		selectedNode.type === 'inputNode' || selectedNode.type === 'actionNode';

	const handleUpdate = () => {
		if (!selectedNode) return;

		setNodes((nodes) =>
			nodes.map((node) => (node.id === selectedNode.id ? selectedNode : node))
		);

		setSelectedNode(null);
	};
	return (
		<Dialog
			open={!!selectedNode}
			onOpenChange={() => setSelectedNode(null)}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit Node</DialogTitle>
				</DialogHeader>

				{isPromptOrAction && (
					<Input
						value={(selectedNode.data as PromptOrActionData).label}
						onChange={(e) => {
							const updated = { ...selectedNode };
							(updated.data as PromptOrActionData).label = e.target.value;
							setSelectedNode(updated);
						}}
						placeholder="Label"
					/>
				)}

				{isDecision && (
					<>
						<Input
							value={(selectedNode.data as DecisionNodeData).variable}
							onChange={(e) => {
								const updated = { ...selectedNode };
								(updated.data as DecisionNodeData).variable = e.target.value;
								setSelectedNode(updated);
							}}
							placeholder="Variable"
							className="mb-2"
						/>

						<select
							value={(selectedNode.data as DecisionNodeData).operator}
							onChange={(e) => {
								const updated = { ...selectedNode };
								(updated.data as DecisionNodeData).operator = e.target.value;
								setSelectedNode(updated);
							}}
							className="w-full border px-2 py-1 rounded mb-2 text-sm"
						>
							<option value="==">==</option>
							<option value="!=">!=</option>
							<option value=">">{'>'}</option>
							<option value="<">{'<'}</option>
						</select>

						<Input
							value={(selectedNode.data as DecisionNodeData).compareTo}
							onChange={(e) => {
								const updated = { ...selectedNode };
								(updated.data as DecisionNodeData).compareTo = e.target.value;
								setSelectedNode(updated);
							}}
							placeholder="Compare to"
						/>
					</>
				)}

				<DialogFooter>
					<Button onClick={handleUpdate}>Save</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
