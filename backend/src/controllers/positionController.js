import Position from '../models/Position.js';

// Obtener todos los cargos
export const getPositions = async (req, res) => {
  try {
    const positions = await Position.find().populate('department', 'name');

    res.status(200).json({
      success: true,
      count: positions.length,
      positions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener cargos',
      error: error.message
    });
  }
};

// Obtener cargo por ID
export const getPositionById = async (req, res) => {
  try {
    const position = await Position.findById(req.params.id).populate('department', 'name');

    if (!position) {
      return res.status(404).json({
        success: false,
        message: 'Cargo no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      position
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener cargo',
      error: error.message
    });
  }
};

// Crear nuevo cargo
export const createPosition = async (req, res) => {
  try {
    const { title, department } = req.body;

    if (!title || !department) {
      return res.status(400).json({
        success: false,
        message: 'El titulo y departamento del cargo son requeridos'
      });
    }

    const position = new Position({
      title,
      department
    });

    await position.save();
    await position.populate('department', 'name');

    res.status(201).json({
      success: true,
      message: 'Cargo creado correctamente',
      position
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al crear cargo',
      error: error.message
    });
  }
};

// Actualizar cargo
export const updatePosition = async (req, res) => {
  try {
    const { title, department } = req.body;

    const position = await Position.findByIdAndUpdate(
      req.params.id,
      {
        ...(title && { title }),
        ...(department && { department })
      },
      { new: true, runValidators: true }
    ).populate('department', 'name');

    if (!position) {
      return res.status(404).json({
        success: false,
        message: 'Cargo no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cargo actualizado correctamente',
      position
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al actualizar cargo',
      error: error.message
    });
  }
};

// Eliminar cargo
export const deletePosition = async (req, res) => {
  try {
    const position = await Position.findByIdAndDelete(req.params.id);

    if (!position) {
      return res.status(404).json({
        success: false,
        message: 'Cargo no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cargo eliminado correctamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar cargo',
      error: error.message
    });
  }
};
