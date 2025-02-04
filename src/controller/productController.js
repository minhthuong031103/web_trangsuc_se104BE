import Product from "../models/product.js";

export default class ProductController {
  //Lấy danh sách sản phẩm:
  static async getAllProduct(req, res) {
    try {
      const product = await Product.find();
      if (!product) {
        throw "error";
      }
      return res.status(201).json(product);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  // Phân loại sản phẩm:
  static async getProductsByCategory(req, res) {
    try {
      const { category } = req.params;
      const products = await Product.find({ category });
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
  //sort và lấy 4 sản phẩm
  static async sortAndgetAllProduct(req, res) {
    try {
      const sort = { _id: -1 };
      const limit = 7;
      const product = await Product.find().sort(sort).limit(limit);
      if (!product) {
        throw "error";
      }
      return res.status(201).json(product);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
  //sort theo số lượng sản phẩm bán được
  static async sortBySoldNumberAndGetAllProduct(req, res) {
    try {
      const sort = { quantity_sold: -1 };
      const limit = 7;
      const product = await Product.find().sort(sort).limit(limit);
      if (!product) {
        throw "error";
      }
      return res.status(201).json(product);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
  //Lấy sản phẩm theo id:
  static async getProductById(req, res) {
    try {
      const { id } = req.params;
      const product = await Product.findById(id);
      if (!product) {
        throw "error";
      }
      return res.status(201).json(product);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
  //Lấy số lượng sản phẩm đã bán
  static async getSoldCount(req, res) {
    try {
      const products = await Product.find();
      const soldCount = products.reduce(
        (total, product) => total + product.quantity_sold,
        0
      );
      res.json({ soldCount });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
  //Thêm sản phẩm:
  static async addProduct(req, res) {
    try {
      console.debug("Adding product...");
      const product = new Product({ ...req.body });
      await product.save();
      return res.status(201).json(product);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
  //Cập nhật thông tin sản phẩm:
  static async updateProduct(req, res) {
    try {
      console.debug("Updating Product...");
      const { id } = req.params;
      const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      if (!updatedProduct) {
        return res.status(404).json({ error: "Product not found." });
      }
      return res.json(updatedProduct);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
  //Xóa sản phẩm:

  static async deleteProduct(req, res) {
    try {
      console.debug("Deleting Product...");
      const deletedProduct = await Product.findOneAndDelete({
        _id: req.params.id,
      });
      if (!deletedProduct) {
        return res.status(404).json({ error: "Product not found." });
      }
      return res.json(deletedProduct);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async searchProduct(req, res) {
    const { searchTerm } = req.query;

    try {
      const products = await Product.find({
        $or: [
          { productid: { $regex: searchTerm, $options: "i" } },
          { name: { $regex: searchTerm, $options: "i" } },
        ],
      });

      res.json(products);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Something went wrong" });
    }
  }
}
