import * as Yup from 'yup';
import Product from '../models/Products';
import User from '../models/User';
import Grid from '../models/Grid';
import PictureProducts from '../models/PictureProducts';

class ProductsController {
  async index(req, res) {
    const products = await Product.findAll({
      attributes: ['id', 'name', 'description', 'stock', 'price'],
      include: [
        {
          model: Grid,
          as: 'grids',
          attributes: ['name', 'details'],
        },
        {
          model: PictureProducts,
          as: 'picture_products',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    return res.json(products);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      description: Yup.string().required(),
      stock: Yup.number().required(),
      type: Yup.string().required(),
      price: Yup.number().required(),
      grid_id: Yup.number().required(),
      picture_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }
    const {
      name,
      description,
      stock,
      type,
      price,
      grid_id,
      picture_id,
    } = req.body;

    const provider_id = req.userId;

    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!isProvider) {
      return res.status(401).json({
        error: 'Access blocked!',
      });
    }

    const productExits = await Product.findOne({
      where: { name },
    });

    if (productExits) {
      return res.status(400).json({ error: 'Product already exists!' });
    }

    const product = await Product.create({
      name,
      description,
      stock,
      type,
      price,
      grid_id,
      picture_id,
    });

    return res.json(product);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }

    const isProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    if (!isProvider) {
      return res.status(401).json({
        error: 'Access blocked!',
      });
    }

    const product = await Product.findOne({
      where: { id: req.params.id },
    });

    if (!product) {
      return res.status(400).json({ error: 'Id dont exists!' });
    }
    const productNameExists = await Product.findOne({
      where: { name: req.body.name },
    });

    if (productNameExists) {
      return res.status(400).json({ error: 'Product already exists!' });
    }

    await product.update(req.body);

    return res.json(product);
  }

  async delete(req, res) {
    const isProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    if (!isProvider) {
      return res.status(401).json({
        error: 'Access blocked!',
      });
    }

    const product = await Product.findByPk(req.params.id);

    product.deleted_at = new Date();

    await product.save();

    return res.json(product);
  }
}

export default new ProductsController();
