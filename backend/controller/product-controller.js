import mongoose from "mongoose";
import Product from "../models/product-model.js";

export const createProduct = async (req, res) => {
  try {
    const { name, price, image } = req.body;

    if (!name || !price || !image) {
      return res.status(400).json({
        success: false,
        message: "All fields (name, price, image) are required",
      });
    }

    const newProduct = new Product({ name, price, image });
    const savedProduct = await newProduct.save();

    res.status(201).json({
      success: true,
      data: savedProduct,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getProduct = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, image } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Product not found" });
  }

  try {
    const product = await Product.findByIdAndUpdate(
      id,
      { name, price, image },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Tambahkan response sukses
    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, messasge: "Server Error" });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  // Tambahkan validasi ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid product ID" });
  }

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);

    // Tambahkan pengecekan jika produk tidak ditemukan
    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(404).json({ success: false, message: "Product not found" });
    console.log(error.message);
  }
};
