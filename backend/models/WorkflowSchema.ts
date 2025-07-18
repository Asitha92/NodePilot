import mongoose from 'mongoose';

const nodeSchema = new mongoose.Schema({}, { strict: false, _id: false });
const edgeSchema = new mongoose.Schema({}, { strict: false, _id: false });

const workflowSchema = new mongoose.Schema({
	name: { type: String, required: true },
	nodes: [nodeSchema],
	edges: [edgeSchema],
	createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Workflow', workflowSchema);
