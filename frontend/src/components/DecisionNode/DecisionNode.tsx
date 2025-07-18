import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';

const operators = ['==', '!=', '>', '<'];

const DecisionNode = ({ data }: NodeProps) => {
	const handleChange = (field: string, value: string) => {
		data.onChange?.({ ...data, [field]: value });
	};

	return (
		<div className="p-3 border border-gray-300 rounded-md bg-white shadow-sm w-[220px]">
			<Handle
				type="target"
				position={Position.Left}
			/>
			<div className="text-sm font-semibold mb-1">❓ Decision Node</div>

			<div className="text-xs mb-2">
				If <strong>{data.variable || 'input'}</strong>{' '}
				<strong>{data.operator || '=='}</strong>{' '}
				<strong>{data.compareTo || '?'}</strong>
			</div>

			<input
				placeholder="Variable"
				value={data.variable}
				onChange={(e) => handleChange('variable', e.target.value)}
				className="w-full text-xs border rounded px-1 py-0.5 mb-2"
			/>

			<select
				value={data.operator}
				onChange={(e) => handleChange('operator', e.target.value)}
				className="w-full text-xs border rounded px-1 py-0.5 mb-2"
			>
				{operators.map((op) => (
					<option
						key={op}
						value={op}
					>
						{op}
					</option>
				))}
			</select>

			<input
				placeholder="Compare to"
				value={data.compareTo}
				onChange={(e) => handleChange('compareTo', e.target.value)}
				className="w-full text-xs border rounded px-1 py-0.5"
			/>

			<Handle
				type="source"
				position={Position.Right}
				id="true"
				style={{ top: 40 }}
			/>
			<Handle
				type="source"
				position={Position.Right}
				id="false"
				style={{ bottom: 10 }}
			/>
		</div>
	);
};

export default DecisionNode;
