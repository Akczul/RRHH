import mongoose from 'mongoose';
import Category from '../models/Category.js';

export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'El campo name es obligatorio'
      });
    }

    const category = await Category.create({
      name,
      description
    });

    return res.status(201).json({
      success: true,
      message: 'Categoria creada correctamente',
      category
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error creando categoria',
      error: error.message
    });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });

    return res.json({
      success: true,
      categories
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error obteniendo categorias',
      error: error.message
    });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de categoria invalido'
      });
    }

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Categoria no encontrada'
      });
    }

    return res.json({
      success: true,
      category
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error obteniendo categoria',
      error: error.message
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de categoria invalido'
      });
    }

    if (name !== undefined && !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'El campo name no puede estar vacio'
      });
    }

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;

    const category = await Category.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Categoria no encontrada'
      });
    }

    return res.json({
      success: true,
      message: 'Categoria actualizada correctamente',
      category
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error actualizando categoria',
      error: error.message
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de categoria invalido'
      });
    }

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Categoria no encontrada'
      });
    }

    return res.json({
      success: true,
      message: 'Categoria eliminada correctamente'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error eliminando categoria',
      error: error.message
    });
  }
};