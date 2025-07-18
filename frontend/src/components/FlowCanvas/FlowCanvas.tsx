import { useCallback, useState } from 'react';
import ReactFlow, {
	Background,
	Controls,
	MiniMap,
	addEdge,
	useNodesState,
	useEdgesState,
	BackgroundVariant,
} from 'reactflow';

import type {
	Connection,
	Edge,
	NodeTypes,
	Node,
	ReactFlowInstance,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { InputNode } from '../InputNode';
import { ActionNode } from '../ActionNode';
import { DecisionNode } from '../DecisionNode';
import { ResponseNode } from '../ResponseNode';
import { initialEdges } from '../../constants';
import { nanoid } from '@reduxjs/toolkit';
import { SideBar } from '../SideBar';
import { Button } from '../ui/button';
import type { CustomNode, CustomNodeTypes, CustomNodeData } from './types';
import { DialogPrompt } from '../DialogPrompt';
import { WorkflowDialog } from '../WorkflowDialog';
import { Play } from 'lucide-react';
import { useWorkflowRunner } from '../../hooks/useWorkFlowRunner';

const API_BASE_URL = import.meta.env.VITE_CLIENT_BASE_URL;

const nodeTypes: NodeTypes = {
	inputNode: InputNode,
	actionNode: ActionNode,
	responseNode: ResponseNode,
	decisionNode: DecisionNode,
};

export default function FlowCanvas() {
	const [nodes, setNodes, onNodesChange] = useNodesState([]);
	const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(initialEdges);
	const [reactFlowInstance, setReactFlowInstance] =
		useState<ReactFlowInstance | null>(null);
	const [selectedNode, setSelectedNode] = useState<CustomNode | null>(null);
	const [showSaveModal, setShowSaveModal] = useState(false);
	const [workflowName, setWorkflowName] = useState('');

	const { runWorkflow, isResponseLoading } = useWorkflowRunner(
		nodes,
		edges,
		setNodes
	);

	const onConnect = useCallback(
		(connection: Connection | Edge) =>
			setEdges((eds) => addEdge(connection, eds)),
		[setEdges]
	);

	const onAddNode = (type: CustomNodeTypes) => {
		const id = nanoid();
		let data: CustomNodeData;

		if (type === 'inputNode' || type === 'actionNode') {
			data = {
				type,
				label: 'Click to add content',
				onEdit: () => {
					const node = nodes.find((nodeEle) => nodeEle.id === id);
					if (node) setSelectedNode(node as unknown as CustomNode);
				},
			};
		} else if (type === 'decisionNode') {
			data = {
				type,
				variable: '',
				operator: '==',
				compareTo: '',
				onEdit: () => {
					const node = nodes.find((nodeEle) => nodeEle.id === id);
					if (node) setSelectedNode(node as unknown as CustomNode);
				},
			};
		} else {
			// responseNode
			data = {
				type,
				output: 'Output will appear here',
				onEdit: () => {
					const node = nodes.find((nodeEle) => nodeEle.id === id);
					if (node) setSelectedNode(node as unknown as CustomNode);
				},
			};
		}

		const newNode: CustomNode = {
			id,
			type,
			position: {
				x: 100 + Math.random() * 200,
				y: 100 + Math.random() * 200,
			},
			data,
		};

		setNodes((prev) => [...prev, newNode]);
	};

	const onDragOver = useCallback((event: React.DragEvent) => {
		event.preventDefault();
		event.dataTransfer.dropEffect = 'move';
	}, []);

	const onDrop = useCallback(
		(event: React.DragEvent) => {
			event.preventDefault();

			const type = event.dataTransfer.getData('application/reactflow');
			if (!type || !reactFlowInstance) return;

			const bounds = event.currentTarget.getBoundingClientRect();

			const position = reactFlowInstance.project({
				x: event.clientX - bounds.left,
				y: event.clientY - bounds.top,
			});

			const newNode: Node = {
				id: nanoid(),
				type,
				position,
				data: {
					label: `${type} content`,
					onChange: (val: string) => console.log(`${type} changed:`, val),
				},
			};

			setNodes((nds) => nds.concat(newNode));
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[reactFlowInstance]
	);

	const handleNodeClick = (_: React.MouseEvent, node: Node) => {
		setSelectedNode(node as CustomNode);
	};

	const handleSave = async () => {
		if (!workflowName.trim()) {
			alert('Please enter a workflow name');
			return;
		}

		try {
			const response = await fetch(`${API_BASE_URL}/workflow`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name: workflowName,
					nodes,
					edges,
				}),
			});

			const data = await response.json();
			console.log('saved data =', data);

			alert(`Workflow saved with ID: ${data.id}`);
			setShowSaveModal(false);
			setWorkflowName('');
		} catch (err) {
			console.error('Failed to save workflow', err);
			alert('Error saving workflow');
		}
	};

	const handleLoadWorkflow = async (id: string) => {
		try {
			const res = await fetch(`${API_BASE_URL}/workflow/${id}`);
			const data = await res.json();
			setNodes(data.nodes);
			setEdges(data.edges);
		} catch (err) {
			console.error(err);
			alert('Failed to load workflow');
		}
	};

	return (
		<div className="flex h-[100vh] w-[100vw]">
			<button
				onClick={runWorkflow}
				className="absolute z-10 flex gap-2 items-center text-xl top-20 right-4 bg-blue-600 text-white px-4 py-2 rounded shadow cursor-pointer hover:bg-green-500"
				disabled={isResponseLoading}
			>
				<Play />
				{isResponseLoading ? 'AI Thinking...' : 'Run Workflow'}
			</button>
			<div className="absolute z-10 flex gap-2 items-center text-xl top-32 right-2 text-white px-2 py-2">
				<Button
					className="text-white bg-black hover:bg-white hover:text-black"
					variant="outline"
					onClick={() => setShowSaveModal(true)}
				>
					Save Workflow
				</Button>
				<WorkflowDialog onLoad={handleLoadWorkflow} />
			</div>
			<SideBar onAddNode={onAddNode} />
			<ReactFlow
				nodes={nodes}
				edges={edges}
				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				onConnect={onConnect}
				nodeTypes={nodeTypes}
				onInit={setReactFlowInstance}
				onDrop={onDrop}
				onDragOver={onDragOver}
				onNodeClick={handleNodeClick}
				fitView
			>
				<MiniMap
					zoomable
					pannable
				/>
				<Controls />
				<Background
					variant={BackgroundVariant.Dots}
					gap={12}
					size={1}
				/>
			</ReactFlow>
			<DialogPrompt
				selectedNode={selectedNode}
				setSelectedNode={setSelectedNode}
				setNodes={setNodes}
			/>
			{showSaveModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white p-6 rounded shadow-lg w-[400px]">
						<h2 className="text-xl font-bold mb-4">Save Workflow</h2>
						<input
							type="text"
							value={workflowName}
							onChange={(e) => setWorkflowName(e.target.value)}
							placeholder="Enter workflow name"
							className="w-full border px-3 py-2 rounded mb-4"
						/>
						<div className="flex justify-end gap-2">
							<Button onClick={() => setShowSaveModal(false)}>Cancel</Button>
							<Button onClick={handleSave}>Save</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
