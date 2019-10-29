import * as Yup from 'yup';
import Grid from '../models/Grid';
import User from '../models/User';

class GridController {
  async index(req, res) {
    const grids = await Grid.findAll({
      where: { deleted_at: null },
      attributes: ['id', 'name', 'details'],
    });

    return res.json(grids);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      details: Yup.string().required(),
    });

    const provider_id = req.userId;

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }
    const { name, details } = req.body;

    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!isProvider) {
      return res.status(401).json({
        error: 'Access blocked!',
      });
    }
    const gridExists = await Grid.findOne({
      where: { name, deleted_at: null },
    });

    if (gridExists) {
      return res.status(400).json({ error: 'Grid already exists!' });
    }

    const grid = await Grid.create({
      name,
      details,
    });

    return res.json(grid);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      details: Yup.string(),
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

    const grid = await Grid.findOne({
      where: { id: req.params.id },
    });

    if (!grid) {
      return res.status(400).json({ error: 'Id dont exists!' });
    }
    const gridNameExist = await Grid.findOne({
      where: { name: req.body.name },
    });

    if (gridNameExist) {
      return res.status(400).json({ error: 'Grid already exists!' });
    }

    await grid.update(req.body);

    return res.json(grid);
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

    const grid = await Grid.findByPk(req.params.id);

    grid.deleted_at = new Date();

    await grid.save();

    return res.json(grid);
  }
}

export default new GridController();
