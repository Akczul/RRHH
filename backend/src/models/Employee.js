import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    position: {
      type: String,
      required: [true, 'Por favor ingresa el cargo del empleado'],
      trim: true
    },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: [true, 'Por favor asigna un departamento']
    },
    salary: {
      type: Number,
      required: [true, 'Por favor ingresa el salario'],
      min: 0
    },
    hireDate: {
      type: Date,
      required: [true, 'Por favor ingresa la fecha de contratación'],
      default: Date.now
    },
    isActive: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }
);

const Employee = mongoose.model('Employee', employeeSchema);

export default Employee;
