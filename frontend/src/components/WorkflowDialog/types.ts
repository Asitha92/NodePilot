export type Workflow = {
	_id: string;
	name: string;
};

export type WorkflowProps = {
	onLoad: (id: string) => void;
};
