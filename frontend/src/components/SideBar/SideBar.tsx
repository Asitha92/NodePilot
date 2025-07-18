// src/components/Sidebar.tsx
import React from 'react';
import { Card, CardContent } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { Button } from '../ui/button';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '../ui/tooltip';
import {
	Plus,
	MousePointerClick,
	Zap,
	CircleDivide,
	MessageSquareQuote,
} from 'lucide-react';
import type { SideBarProps } from './types';

export default function SideBar({ onAddNode }: SideBarProps) {
	const onDragStart = (event: React.DragEvent, nodeType: string) => {
		event.dataTransfer.setData('application/reactflow', nodeType);
		event.dataTransfer.effectAllowed = 'move';
	};

	return (
		<aside className="h-full w-[200px] border-r bg-muted p-4">
			<h2 className="text-sm font-semibold mb-3">🧩 Node Library</h2>
			<ScrollArea className="h-full">
				<div>
					<TooltipProvider>
						<div className="space-y-3">
							{/* Input Node Card */}
							<Card
								draggable
								onDragStart={(e) => onDragStart(e, 'inputNode')}
								className="cursor-grab transition-transform hover:scale-[1.01] active:scale-[0.98]"
							>
								<CardContent className="p-3 flex items-center justify-between">
									<div className="flex items-center gap-2">
										<MousePointerClick size={16} />
										<span className="text-sm">Prompt Node</span>
									</div>
									<Tooltip>
										<TooltipTrigger asChild>
											<Button
												size="icon"
												variant="ghost"
												onClick={() => onAddNode('inputNode')}
											>
												<Plus size={14} />
											</Button>
										</TooltipTrigger>
										<TooltipContent>Add Prompt Node</TooltipContent>
									</Tooltip>
								</CardContent>
							</Card>

							{/* Action Node Card */}
							<Card
								draggable
								onDragStart={(e) => onDragStart(e, 'actionNode')}
								className="cursor-grab transition-transform hover:scale-[1.01] active:scale-[0.98]"
							>
								<CardContent className="p-3 flex items-center justify-between">
									<div className="flex items-center gap-2">
										<Zap size={16} />
										<span className="text-sm">Action Node</span>
									</div>
									<Tooltip>
										<TooltipTrigger asChild>
											<Button
												size="icon"
												variant="ghost"
												onClick={() => onAddNode('actionNode')}
											>
												<Plus size={14} />
											</Button>
										</TooltipTrigger>
										<TooltipContent>Add Action Node</TooltipContent>
									</Tooltip>
								</CardContent>
							</Card>

							{/* Decision Node Card */}
							<Card
								draggable
								onDragStart={(e) => onDragStart(e, 'decisionNode')}
								className="cursor-grab transition-transform hover:scale-[1.01] active:scale-[0.98]"
							>
								<CardContent className="p-3 flex items-center justify-between">
									<div className="flex items-center gap-2">
										<CircleDivide size={16} />
										<span className="text-sm">Decision Node</span>
									</div>
									<Tooltip>
										<TooltipTrigger asChild>
											<Button
												size="icon"
												variant="ghost"
												onClick={() => onAddNode('decisionNode')}
											>
												<Plus size={14} />
											</Button>
										</TooltipTrigger>
										<TooltipContent>Add Decision Node</TooltipContent>
									</Tooltip>
								</CardContent>
							</Card>

							{/* Response Node Card */}
							<Card
								draggable
								onDragStart={(e) => onDragStart(e, 'responseNode')}
								className="cursor-grab transition-transform hover:scale-[1.01] active:scale-[0.98]"
							>
								<CardContent className="p-3 flex items-center justify-between">
									<div className="flex items-center gap-2">
										<MessageSquareQuote size={16} />
										<span className="text-sm">Response Node</span>
									</div>
									<Tooltip>
										<TooltipTrigger asChild>
											<Button
												size="icon"
												variant="ghost"
												onClick={() => onAddNode('responseNode')}
											>
												<Plus size={14} />
											</Button>
										</TooltipTrigger>
										<TooltipContent>Add Response Node</TooltipContent>
									</Tooltip>
								</CardContent>
							</Card>
						</div>
					</TooltipProvider>
					<Separator className="my-4" />
				</div>
			</ScrollArea>
		</aside>
	);
}
