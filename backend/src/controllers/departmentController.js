import Department from '../models/Department.js';

// Obtener todos los departamentos
export const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find();

    res.status(200).json({
      success: true,
      count: departments.length,
      departments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener departamentos',
      error: error.message
    });
  }
};

// Obtener departamento por ID
export const getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Departamento no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      department
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener departamento',
      error: error.message
    });
  }
};

// Crear nuevo departamento
export const createDepartment = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'El nombre del departamento es requerido'
      });
    }

    const department = new Department({
      name,
      description: description || ''
    });

    await department.save();

    res.status(201).json({
      success: true,
      message: 'Departamento creado correctamente',
      department
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al crear departamento',
      error: error.message
    });
  }
};

// Actualizar departamento
export const updateDepartment = async (req, res) => {
  try {
    const { name, description } = req.body;

    const department = await Department.findByIdAndUpdate(
      req.params.id,
      {
        ...(name && { name }),
        ...(description !== undefined && { description })
      },
      { new: true, runValidators: true }
    );

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Departamento no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Departamento actualizado correctamente',
      department
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al actualizar departamento',
      error: error.message
    });
  }
};

// Eliminar departamento
export const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Departamento no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Departamento eliminado correctamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar departamento',
      error: error.message
    });
  }
};
