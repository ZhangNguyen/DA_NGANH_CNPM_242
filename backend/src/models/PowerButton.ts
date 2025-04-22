
import mongoose from 'mongoose';

const powerButtonSchema = new mongoose.Schema({
  status: {type: Boolean, default: false},
  actiondevice: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ActionDevice' }],

});

export default mongoose.model('PowerButton', powerButtonSchema);
