const mongoose = require('mongoose');
const HistorySchema = new mongoose.Schema(
    {
      value: { type: Number},
      actiondevice: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ActionDevice' }],
      status:{ type: String, enum: ['success', 'unsucces'] },
      action: { type: String, enum: ['FAN', 'PUMP','LIGHT','SHUTDOWN']},
      timeaction: { type: Date},
    },
  );
  const History = mongoose.model('History', HistorySchema);
  export default History;
  