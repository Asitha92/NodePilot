import express from 'express';
import {
	saveWorkflow,
	getWorkflows,
	getSelectedWorkflow,
	deleteWorkflow,
	generateAIResponse,
} from '../../controllers/workflowController.ts';

const router = express.Router();

router.post('/', saveWorkflow);
router.get('/', getWorkflows);
router.post('/generate', generateAIResponse);
router.delete('/delete/:id', deleteWorkflow);
router.get('/:id', getSelectedWorkflow);

export default router;
