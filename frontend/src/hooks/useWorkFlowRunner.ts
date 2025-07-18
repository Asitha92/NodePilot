import { useState } from 'react';
import type { Edge, Node } from 'reactflow';
import type { DecisionNodeData } from '../components/FlowCanvas/types';

const API_BASE_URL = import.meta.env.VITE_CLIENT_BASE_URL;

export function useWorkflowRunner(
	nodes: Node[],
	edges: Edge[],
	setNodes: (nodes: Node[]) => void
) {
	const [isResponseLoading, setIsResponseLoading] = useState(false);

	const runWorkflow = async () => {
		const nodeMap = new Map(nodes.map((node) => [node.id, node]));
		const outputMap: Record<string, string> = {};
		const inputNodes = nodes.filter((n) => n.type === 'inputNode');

		for (const input of inputNodes) {
			if (!('label' in input.data)) continue;

			let currentNode = input;
			let currentValue = input.data.label;

			while (currentNode) {
				const outgoingEdge = edges.find((e) => e.source === currentNode.id);
				if (!outgoingEdge) break;

				const nextNode = nodeMap.get(outgoingEdge.target);
				if (!nextNode) break;

				switch (nextNode.type) {
					case 'actionNode': {
						if ('label' in nextNode.data) {
							currentValue = `${nextNode.data.label}: ${currentValue}`;
						}
						break;
					}
					case 'decisionNode': {
						const { operator, compareTo } = nextNode.data as DecisionNodeData;
						let condition = false;
						switch (operator) {
							case '==':
								condition = currentValue == compareTo;
								break;
							case '!=':
								condition = currentValue != compareTo;
								break;
							case '>':
								condition = currentValue > compareTo;
								break;
							case '<':
								condition = currentValue < compareTo;
								break;
						}
						if (!condition) {
							currentValue = 'Blocked by decision node';
						}
						break;
					}
					case 'responseNode': {
						try {
							setIsResponseLoading(true);
							const response = await fetch(
								`${API_BASE_URL}/workflow/generate`,
								{
									method: 'POST',
									headers: { 'Content-Type': 'application/json' },
									body: JSON.stringify({ prompt: currentValue }),
								}
							);
							const result = await response.json();
							outputMap[nextNode.id] = result.output || 'No response';
						} catch (err) {
							outputMap[nextNode.id] = 'AI Error';
							console.error('Error fetching AI response:', err);
						} finally {
							setIsResponseLoading(false);
						}
						break;
					}
				}

				currentNode = nextNode;
			}
		}

		const updatedNodes = nodes.map((node) => {
			if (node.type === 'responseNode' && outputMap[node.id]) {
				return {
					...node,
					data: {
						...node.data,
						output: outputMap[node.id],
					},
				};
			}
			return node;
		});

		setNodes(updatedNodes);
	};

	return { runWorkflow, isResponseLoading };
}
