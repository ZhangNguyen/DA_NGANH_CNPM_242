const mongoose = require('mongoose');
const HistorySchema = new mongoose.Schema(
    {
      value: { type: Number},
      actiondevice: { type: String, ref: 'ActionDevice'},
      status:{ type: String, enum: ['success', 'unsucces'] },
      action: { type: String, enum: ['FAN', 'PUMP','LIGHT','SHUTDOWN','RGB']},
      timeaction: { type: Date},
      plantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Plant' }
    },
    { timestamps: true }
  );
  const History = mongoose.model('History', HistorySchema);
  export default History;
  