import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';

const ResponseNode = ({ data }: NodeProps) => {
	return (
		<div className="p-3 border border-gray-300 rounded-md bg-gray-50 shadow-sm min-w-[200px]">
			<Handle
				type="target"
				position={Position.Left}
			/>
			<div className="text-sm font-semibold mb-1">🤖 AI Response</div>
			<div className="text-xs text-muted-foreground whitespace-pre-wrap">
				{data.output || 'No response yet.'}
			</div>
		</div>
	);
};

export default ResponseNode;
