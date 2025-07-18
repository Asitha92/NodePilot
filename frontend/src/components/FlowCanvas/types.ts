import type { Node } from 'reactflow';

export type CustomNodeTypes =
	| 'inputNode'
	| 'actionNode'
	| 'decisionNode'
	| 'responseNode';

export type PromptOrActionData = {
	type: 'inputNode' | 'actionNode';
	label: string;
	onEdit?: () => void;
};

// TODO: update this since most of the time we don't need to edit
export type ResponseNodeData = {
	type: 'responseNode';
	output: string;
	onEdit?: () => void;
};

export type DecisionNodeData = {
	type: 'decisionNode';
	variable: string;
	operator: string;
	compareTo: string;
	onEdit?: () => void;
};

export type CustomNodeData =
	| PromptOrActionData
	| DecisionNodeData
	| ResponseNodeData;

export type CustomNode = Node<CustomNodeData>;
