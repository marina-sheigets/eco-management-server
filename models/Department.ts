import { model, Schema } from 'mongoose';

const Department = new Schema({
	name: { type: String, required: true },
	enterprise: { type: Schema.Types.ObjectId, ref: 'Enterprise', required: true },
	// electricityCosts: { type: Number, required: true, default: 0 },
	// electricityVolumes: { type: Number, required: true, default: 0 },
	// gasCosts: { type: umber, required: true, default: 0 },
	// gasVolumes: { type: Number, required: true, default: 0 },
	// gasolineCosts: { type: Number, required: true, default: 0 },
	// gasolineVolumes: { type: Number, required: true, default: 0 },
	// dieselCosts: { type: Number, required: true, default: 0 },
	// dieselVolumes: { type: Number, required: true, default: 0 },
	// waterCosts: { type: Number, required: true, default: 0 },
	// waterVolumes: { type: Number, required: true, default: 0 },
});

export default model('Department', Department);
