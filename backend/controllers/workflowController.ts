import Workflow from '../models/WorkflowSchema';
import type { Request, Response } from 'express';
import OpenAI from 'openai';

const openai = new OpenAI({
	apiKey: process.env.OPENROUTER_API_KEY,
	baseURL: 'https://openrouter.ai/api/v1',
	defaultHeaders: {
		'HTTP-Referer': process.env.CLIENT_BASE_URL,
		'X-Title': 'NodePilot Workflow Builder',
	},
});

// Save workflow
export const saveWorkflow = async (req: Request, res: Response) => {
	try {
		const { name, nodes, edges } = req.body;
		if (!name) {
			return res.status(400).json({ error: 'Workflow name is required' });
		}
		const newWorkflow = new Workflow({ name, nodes, edges });
		const saved = await newWorkflow.save();
		res.status(201).json({ id: saved.id });
	} catch (err) {
		console.error('Save error:', err);
		res.status(500).json({ error: 'Failed to save workflow' });
	}
};

// Load workflow
export const getWorkflows = async (req: Request, res: Response) => {
	try {
		const workflows = await Workflow.find({}, 'id name createdAt').sort({
			createdAt: -1,
		});
		res.json(workflows);
	} catch (err) {
		res.status(500).json({ error: 'Failed to fetch workflows' });
	}
};

// Get a single workflow by ID
export const getSelectedWorkflow = async (req: Request, res: Response) => {
	try {
		const workflow = await Workflow.findById(req.params.id);
		if (!workflow) {
			return res.status(404).json({ error: 'Workflow not found' });
		}
		res.json(workflow);
	} catch (err) {
		console.error('Fetch by ID error:', err);
		res.status(500).json({ error: 'Failed to fetch workflow' });
	}
};

// delete workflow
export const deleteWorkflow = async (req: Request, res: Response) => {
	try {
		const deleted = await Workflow.findByIdAndDelete(req.params.id);
		if (!deleted) return res.status(404).json({ error: 'Workflow not found' });

		res.json({ message: 'Deleted successfully' });
	} catch (err) {
		res.status(500).json({ error: 'Failed to delete workflow' });
	}
};

// OpenAI API route
export const generateAIResponse = async (req: Request, res: Response) => {
	const { prompt } = req.body;

	console.log('prompt', prompt);

	if (!prompt) {
		return res.status(400).json({ error: 'Prompt is required' });
	}

	try {
		const completion = await openai.chat.completions.create({
			model: 'deepseek/deepseek-r1:free',
			messages: [{ role: 'user', content: prompt }],
		});

		const content = completion.choices[0].message?.content;
		res.status(200).json({ output: content });
	} catch (error) {
		console.error('OpenAI error:', error);
		res.status(500).json({ error: 'Failed to generate response' });
	}
};
