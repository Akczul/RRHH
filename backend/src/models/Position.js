import mongoose from 'mongoose';

const positionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Por favor ingresa el titulo del cargo'],
      trim: true
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: [true, 'Por favor asigna un departamento']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }
);

const Position = mongoose.model('Position', positionSchema);

export default Position;
