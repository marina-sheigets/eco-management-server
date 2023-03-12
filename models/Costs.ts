import { model, Schema } from 'mongoose';

const Costs = new Schema({
	year: { type: Number, required: true },
	month: { type: String, required: true },
	department: { type: Schema.Types.ObjectId, ref: 'Department', required: true },
	enterprise: { type: Schema.Types.ObjectId, ref: 'Enterprise', required: true },
	resource: { type: String, required: true },
	days: { type: Number, required: false, default: 0 },
	costs: { type: Number, required: true, default: 0 },
});

export default model('Costs', Costs);
