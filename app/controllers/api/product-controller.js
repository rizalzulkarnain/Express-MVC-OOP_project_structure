const ProductRepository = require('../../repositories/product-repository');
const fs = require('fs');
const util = require('util');
const path = require('path');
const mkdir = util.promisify(fs.mkdir);
const writeFile = util.promisify(fs.writeFile);

class ProductController {
  async index(req, res) {
    return res.send('Product Index');
  }

  async create(req, res) {
    const { name } = req.body;
    const files = Object.values(req.body.files);

    const buffer = files[0].buffer;
    const extension = 'jpg';
    const filename = `${Date.now()}.${extension}`;

    const product = await ProductRepository.create({
      name,
      image: filename,
    });

    const destination = `../../../public/images/products/${product.id}`;

    await mkdir(path.join(__dirname, destination));

    await writeFile(path.join(__dirname, destination, filename), buffer);

    res.send(product);
  }
}

module.exports = new ProductController();
