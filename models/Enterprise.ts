import { model, Schema } from 'mongoose';

const Enterprise = new Schema({
	name: { type: String, required: true },
});

export default model('Enterprise', Enterprise);
