const mongoose = require('mongoose');
import ActionDevice from './ActionDevice';

const SharedDeviceSchema = new mongoose.Schema(
    {
      _id: { type: Number, required: true },
      devicetype: {
        type: String,
        enum: ['fan_level','RGB','light'],
        required: true
      },
      value: {type: Number},
      actiondevice: { type: mongoose.Schema.Types.ObjectId, ref: 'ActionDevice' },
      timeAction: {type: Date},
    },
  );
  const SharedDevice = ActionDevice.discriminator('SharedDevice', SharedDeviceSchema);
  export default SharedDevice;
  