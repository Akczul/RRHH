const mongoose = require("mongoose");

const Category = require("../models/Category");
const { validateRequiredString } = require("../utils/validators");

async function createCategory(req, res) {
  try {
    const { name, description } = req.body;

    const validation = validateRequiredString(name, "name");
    if (!validation.valid) {
      return res.status(400).json({ message: validation.message });
    }

    const category = await Category.create({
      name,
      description,
    });

    return res.status(201).json(category);
  } catch (error) {
    console.error("[createCategory]", error);
    return res.status(500).json({ message: "Error creando categoria" });
  }
}

async function getCategories(req, res) {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    return res.json(categories);
  } catch (error) {
    console.error("[getCategories]", error);
    return res.status(500).json({ message: "Error obteniendo categorias" });
  }
}

async function getCategoryById(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID de categoria invalido" });
    }

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Categoria no encontrada" });
    }

    return res.json(category);
  } catch (error) {
    console.error("[getCategoryById]", error);
    return res.status(500).json({ message: "Error obteniendo categoria" });
  }
}

async function updateCategory(req, res) {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID de categoria invalido" });
    }

    if (name !== undefined) {
      const validation = validateRequiredString(name, "name");
      if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
      }
    }

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;

    const category = await Category.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      return res.status(404).json({ message: "Categoria no encontrada" });
    }

    return res.json(category);
  } catch (error) {
    console.error("[updateCategory]", error);
    return res.status(500).json({ message: "Error actualizando categoria" });
  }
}

async function deleteCategory(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID de categoria invalido" });
    }

    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({ message: "Categoria no encontrada" });
    }

    return res.json({ message: "Categoria eliminada correctamente" });
  } catch (error) {
    console.error("[deleteCategory]", error);
    return res.status(500).json({ message: "Error eliminando categoria" });
  }
}

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};