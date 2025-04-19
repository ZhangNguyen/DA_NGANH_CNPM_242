const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        type: {type:String, required: true},
        location: {type:String, required: true},
        limitWatering: {
            min: {type:Number},
            max: {type:Number}
        },
        limitTemp:{
            min: {type:Number},
            max: {type:Number}
        },
        deviceId: {type: mongoose.Schema.Types.ObjectId, ref: 'DedicatedDevice'},
        status: [{
            type: String,
            enum: ['watering', 'fanning','normal'],
            default: 'normal',
          }],
    },
    {timestamps: true}
);
plantSchema.index({ userId: 1, type: 1, location: 1 }, { unique: true });
plantSchema.index({ deviceId: 1 }, { unique: true, sparse: true });

const Plant = mongoose.model('Plant', plantSchema);
export default Plant;
