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

	// const runWorkflow = async () => {
	// // map node array to map for easier access
	// const nodeMap = new Map(nodes.map((node) => [node.id, node]));
	// const outputMap: Record<string, string> = {};
	// // get input node for start point
	// const inputNodes = nodes.filter((n) => n.type === 'inputNode');

	// for (const input of inputNodes) {
	// 	if (!('label' in input.data)) continue;

	// 	let currentNode = input;
	// 	let currentValue = input.data.label;
	// 	// this will be the prompt that send to the AI
	// 	const workflowSteps: string[] = [`Start: ${currentValue}`];

	// 	while (currentNode) {
	// 		// find related edge to that node
	// 		const outgoingEdge = edges.find((e) => e.source === currentNode.id);
	// 		if (!outgoingEdge) break;

	// 		// assign next node value from the map using edge target id
	// 		const nextNode = nodeMap.get(outgoingEdge.target);
	// 		if (!nextNode) break;

	// 		switch (nextNode.type) {
	// 			case 'actionNode': {
	// 				// check label property
	// 				if ('label' in nextNode.data) {
	// 					// assign label value
	// 					const action = `${nextNode.data.label}`;
	// 					// add current value and action value together (e.g: action node data : input node data)
	// 					currentValue = `${action}: ${currentValue}`;
	// 					workflowSteps.push(`Action: ${action}`);
	// 				}
	// 				break;
	// 			}
	// 			case 'decisionNode': {
	// 				const { operator, compareTo } = nextNode.data as DecisionNodeData;
	// 				// get decision node data values to string
	// 				const condition = `if currentValue ${operator} ${compareTo}`;
	// 				workflowSteps.push(`Decision: ${condition}`);
	// 				break;
	// 			}
	// 			case 'responseNode': {
	// 				// get all data from nodes and create prompt fro the AI
	// 				const finalPrompt = `You are a workflow manager. Analyze the following steps and return a meaningful response:${workflowSteps.join(
	// 					'\n'
	// 				)} Final input: "${currentValue}"`;
	// 				try {
	// 					setIsResponseLoading(true);
	// 					const response = await fetch(
	// 						`${API_BASE_URL}/workflow/generate`,
	// 						{
	// 							method: 'POST',
	// 							headers: { 'Content-Type': 'application/json' },
	// 							body: JSON.stringify({ prompt: finalPrompt.trim() }),
	// 						}
	// 					);
	// 					const result = await response.json();
	// 					// this will be the response that send to the user
	// 					// final node will be response node
	// 					outputMap[nextNode.id] = result.output || 'No response';
	// 				} catch (err) {
	// 					outputMap[nextNode.id] = 'AI Error';
	// 					console.error('Error fetching AI response:', err);
	// 				} finally {
	// 					setIsResponseLoading(false);
	// 				}
	// 				break;
	// 			}
	// 		}
	// 		currentNode = nextNode;
	// 	}
	// }

	// // set output from AI to the response node
	// // TODO: update code to handle multiple response nodes, currently handle single response node
	// const updatedNodes = nodes.map((node) => {
	// 	if (node.type === 'responseNode' && outputMap[node.id]) {
	// 		return {
	// 			...node,
	// 			data: {
	// 				...node.data,
	// 				output: outputMap[node.id],
	// 			},
	// 		};
	// 	}
	// 	return node;
	// });

	// setNodes(updatedNodes);

	// Please check above code which written by me. Below code enhanced my function using AI to handle multiple paths and responses using recursion
	const runWorkflow = async () => {
		const nodeMap = new Map(nodes.map((node) => [node.id, node]));
		// map node array to map for easier access
		const outputMap: Record<string, string> = {};
		// start points
		const inputNodes = nodes.filter((n) => n.type === 'inputNode');

		setIsResponseLoading(true);

		// Recursive function to walk through the workflow
		const traversePath = async (
			currentNode: Node,
			// current input string
			currentValue: string,
			// track visited nodes
			visited: Set<string>,
			// this will be the prompt that send to the AI
			workflowSteps: string[]
		) => {
			if (visited.has(currentNode.id)) return;
			visited.add(currentNode.id);

			// Get all outgoing connections from current node
			const outgoingEdges = edges.filter((e) => e.source === currentNode.id);

			// Walk through each outgoing connection
			for (const edge of outgoingEdges) {
				// get connected node from edge targe
				const nextNode = nodeMap.get(edge.target);
				if (!nextNode) continue;

				let newValue = currentValue;
				const newSteps = [...workflowSteps];

				switch (nextNode.type) {
					case 'actionNode': {
						// Add action description to prompt and value
						if ('label' in nextNode.data) {
							// assign label value
							const action = `${nextNode.data.label}`;
							// add current value and action value together (e.g: action node data : input node data)
							newValue = `${action}: ${newValue}`;
							newSteps.push(`Action: ${action}`);
						}
						break;
					}
					case 'decisionNode': {
						const { operator, compareTo } = nextNode.data as DecisionNodeData;
						// get decision node data values to string
						const condition = `if currentValue ${operator} ${compareTo}`;
						newSteps.push(`Decision: ${condition}`);
						break;
					}
					case 'responseNode': {
						// get all data from nodes and create prompt from the AI
						const prompt = `You are a workflow manager. Analyze the following steps and return a meaningful response:\n ${newSteps.join(
							'\n'
						)}\n Final input: "${newValue}"`;

						try {
							// Send to OpenAI backend
							const res = await fetch(`${API_BASE_URL}/workflow/generate`, {
								method: 'POST',
								headers: { 'Content-Type': 'application/json' },
								body: JSON.stringify({ prompt }),
							});

							const result = await res.json();
							// this will be the response that send to the user
							// final node will be response node
							outputMap[nextNode.id] = result.output || 'No response';
						} catch (err) {
							outputMap[nextNode.id] = 'AI Error';
							console.error(
								`Error fetching response for node ${nextNode.id}`,
								err
							);
						}
						break;
					}
				}
				await traversePath(nextNode, newValue, new Set(visited), newSteps);
			}
		};

		// initiate traversePath function
		for (const input of inputNodes) {
			if (!('label' in input.data)) continue;
			await traversePath(input, input.data.label, new Set(), [
				`Start: ${input.data.label}`,
			]);
		}

		// set output from AI to the response node data
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
		setIsResponseLoading(false);
	};

	return { runWorkflow, isResponseLoading };
}
