const mongoose = require("mongoose");

const Product = require("../models/Product");
const Category = require("../models/Category");
const { validateRequiredString } = require("../utils/validators");

async function createProduct(req, res) {
  try {
    const { name, description, price, categoryId } = req.body;

    const nameValidation = validateRequiredString(name, "name");
    if (!nameValidation.valid) {
      return res.status(400).json({ message: nameValidation.message });
    }

    if (typeof price !== "number" || Number.isNaN(price) || price < 0) {
      return res.status(400).json({ message: "price debe ser un numero >= 0" });
    }

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ message: "categoryId invalido" });
    }

    const categoryExists = await Category.exists({ _id: categoryId });
    if (!categoryExists) {
      return res.status(404).json({ message: "Categoria no encontrada" });
    }

    const product = await Product.create({
      name,
      description,
      price,
      categoryId,
    });

    const result = await Product.findById(product._id).populate(
      "categoryId",
      "name description"
    );

    return res.status(201).json(result);
  } catch (error) {
    console.error("[createProduct]", error);
    return res.status(500).json({ message: "Error creando producto" });
  }
}

async function getProducts(req, res) {
  try {
    const products = await Product.find()
      .populate("categoryId", "name description")
      .sort({ createdAt: -1 });

    return res.json(products);
  } catch (error) {
    console.error("[getProducts]", error);
    return res.status(500).json({ message: "Error obteniendo productos" });
  }
}

async function getProductById(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID de producto invalido" });
    }

    const product = await Product.findById(id).populate(
      "categoryId",
      "name description"
    );

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    return res.json(product);
  } catch (error) {
    console.error("[getProductById]", error);
    return res.status(500).json({ message: "Error obteniendo producto" });
  }
}

async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const { name, description, price, categoryId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID de producto invalido" });
    }

    if (name !== undefined) {
      const nameValidation = validateRequiredString(name, "name");
      if (!nameValidation.valid) {
        return res.status(400).json({ message: nameValidation.message });
      }
    }

    if (price !== undefined) {
      if (typeof price !== "number" || Number.isNaN(price) || price < 0) {
        return res.status(400).json({ message: "price debe ser un numero >= 0" });
      }
    }

    if (categoryId !== undefined) {
      if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        return res.status(400).json({ message: "categoryId invalido" });
      }

      const categoryExists = await Category.exists({ _id: categoryId });
      if (!categoryExists) {
        return res.status(404).json({ message: "Categoria no encontrada" });
      }
    }

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (price !== undefined) updates.price = price;
    if (categoryId !== undefined) updates.categoryId = categoryId;

    const product = await Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).populate("categoryId", "name description");

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    return res.json(product);
  } catch (error) {
    console.error("[updateProduct]", error);
    return res.status(500).json({ message: "Error actualizando producto" });
  }
}

async function deleteProduct(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID de producto invalido" });
    }

    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    return res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    console.error("[deleteProduct]", error);
    return res.status(500).json({ message: "Error eliminando producto" });
  }
}

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};