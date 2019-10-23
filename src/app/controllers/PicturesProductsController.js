import PictureProducts from '../models/PictureProducts';

class PictureProductsController {
  async store(req, res) {
    const { originalname: name, filename: path } = req.file;
    const pictureProducts = await PictureProducts.create({
      name,
      path,
    });

    return res.json(pictureProducts);
  }
}

export default new PictureProductsController();
