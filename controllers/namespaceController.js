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

  static async createRoom(req, res, next) {
    try {
      const { title, namespace_href } = req.body;
      const mainNamespace = await namespaceModel.findOne({ href: namespace_href });

      if (!mainNamespace) return res.status(400).json({ message: "Namespace not found !!" });

      const mainRoom = await namespaceModel.findOne({ "rooms.title": title });
      if (mainRoom) return res.status(400).json({ message: "Room already exist !!" });

      const room = { title, image: "Test IMG" };

      await namespaceModel.findOneAndUpdate(
        { href: namespace_href },
        {
          $push: {
            rooms: room,
          },
        },
      );

      return res.status(201).json({ message: "New room created successfully" });
    } catch (err) {
      next(err);
    }
  }
}
