import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';

const ActionNode = ({ data }: NodeProps) => {
	return (
		<div
			className="p-2.5 border border-gray-300 rounded-md bg-white shadow-sm"
			onClick={data.onEdit}
		>
			<Handle
				type="target"
				position={Position.Left}
			/>
			<p className="text-sm font-bold mb-1">⚙️ Action Node</p>
			<div className="text-xs text-muted-foreground whitespace-pre-wrap">
				{data.label}
			</div>
			<Handle
				type="source"
				position={Position.Right}
			/>
		</div>
	);
};

export default ActionNode;
