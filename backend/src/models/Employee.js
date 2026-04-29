import mongoose from 'mongoose';
import './Department.js';
import './Position.js';

const employeeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    position: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Position',
      required: [true, 'Por favor asigna un cargo']
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: [true, 'Por favor asigna un departamento']
    },
    hireDate: {
      type: Date,
      required: [true, 'Por favor ingresa la fecha de contratación'],
      default: Date.now
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }
);

const Employee = mongoose.model('Employee', employeeSchema);

export default Employee;
