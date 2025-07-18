import type { CustomNode } from '../FlowCanvas/types';

export type DialogPromptProps = {
	selectedNode: CustomNode | null;
	setSelectedNode: (node: CustomNode | null) => void;
	setNodes: React.Dispatch<React.SetStateAction<CustomNode[]>>;
};
