import { namespaceModel } from "../models/chatModel.js";
export default class NamespaceController {
  static async getAll(req, res, next) {
    try {
      const namespace = await namespaceModel.find({}, { room: 0 });
      return res.status(200).json(namespace);
    } catch (err) {
      next(err);
    }
  }
  static async create(req, res, next) {
    try {
      const { title, href } = req.body;
      const namespace = await namespaceModel.findOne({ $or: [{ title }, { href }] });

      if (namespace)
        return res.status(400).json({ message: "There is Namespace with this info !!" });

      await namespaceModel.create({ title, href });

      return res.status(201).json({ message: "New namespace created successfully" });
    } catch (err) {
      next(err);
    }
  }
}
