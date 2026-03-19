import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Category from '../models/Category.js';

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, categoryId } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'El campo name es obligatorio'
      });
    }

    if (typeof price !== 'number' || Number.isNaN(price) || price < 0) {
      return res.status(400).json({
        success: false,
        message: 'El campo price debe ser un numero mayor o igual a 0'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({
        success: false,
        message: 'categoryId invalido'
      });
    }

    const categoryExists = await Category.exists({ _id: categoryId });
    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        message: 'Categoria no encontrada'
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      categoryId
    });

    const result = await Product.findById(product._id).populate(
      'categoryId',
      'name description'
    );

    return res.status(201).json({
      success: true,
      message: 'Producto creado correctamente',
      product: result
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error creando producto',
      error: error.message
    });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate('categoryId', 'name description')
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      products
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error obteniendo productos',
      error: error.message
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de producto invalido'
      });
    }

    const product = await Product.findById(id).populate('categoryId', 'name description');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    return res.json({
      success: true,
      product
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error obteniendo producto',
      error: error.message
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, categoryId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de producto invalido'
      });
    }

    if (name !== undefined && !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'El campo name no puede estar vacio'
      });
    }

    if (price !== undefined) {
      if (typeof price !== 'number' || Number.isNaN(price) || price < 0) {
        return res.status(400).json({
          success: false,
          message: 'El campo price debe ser un numero mayor o igual a 0'
        });
      }
    }

    if (categoryId !== undefined) {
      if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        return res.status(400).json({
          success: false,
          message: 'categoryId invalido'
        });
      }

      const categoryExists = await Category.exists({ _id: categoryId });
      if (!categoryExists) {
        return res.status(404).json({
          success: false,
          message: 'Categoria no encontrada'
        });
      }
    }

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (price !== undefined) updates.price = price;
    if (categoryId !== undefined) updates.categoryId = categoryId;

    const product = await Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    }).populate('categoryId', 'name description');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    return res.json({
      success: true,
      message: 'Producto actualizado correctamente',
      product
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error actualizando producto',
      error: error.message
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de producto invalido'
      });
    }

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    return res.json({
      success: true,
      message: 'Producto eliminado correctamente'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error eliminando producto',
      error: error.message
    });
  }
};