import { model, Schema } from 'mongoose';

const ElectricityCosts = new Schema({
	year: { type: Number, required: true },
	department: { type: Schema.Types.ObjectId, ref: 'Department', required: true },
	costs: { type: Number, required: true, default: 0 },
});

export default model('ElectricityCosts', ElectricityCosts);
