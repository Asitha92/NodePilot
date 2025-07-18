import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';

const InputNode = ({ data }: NodeProps) => {
	return (
		<div
			onClick={data.onEdit}
			className="p-3 border border-gray-300 rounded-md bg-white shadow-sm cursor-pointer hover:shadow-sm"
		>
			<Handle
				type="source"
				position={Position.Right}
			/>
			<div className="text-sm font-semibold mb-1">🗣️ Prompt Node</div>
			<div className="text-xs text-muted-foreground whitespace-pre-wrap">
				{data.label || 'Click to add a prompt...'}
			</div>
		</div>
	);
};

export default InputNode;
