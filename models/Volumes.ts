import { model, Schema } from 'mongoose';

const Volumes = new Schema({
	year: { type: Number, required: true },
	department: { type: Schema.Types.ObjectId, ref: 'Department', required: true },
	enterprise: { type: Schema.Types.ObjectId, ref: 'Enterprise', required: true },
	type: { type: String, required: true },
	volumes: { type: String, required: true, default: 0 },
});

export default model('Volumes', Volumes);
