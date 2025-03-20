const mongoose = require('mongoose');
const sensorSchema = new mongoose.Schema(
    {
      name: { type: String, required: true, unique: true },
  
      type: {
        type: String,
        enum: ['light', 'temperature', 'humidity','soil'],
        required: true
      },
  
      status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'inactive'
      },  
      newestdata: { type: Number},
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    },
    { timestamps: true }  //  createdAt và updatedAt 
  );
  
  const Sensor = mongoose.model('Sensor', sensorSchema);
  export default Sensor;
  