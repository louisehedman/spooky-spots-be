import { Response, Request } from "express";
import User from "../models/User";

const getSpookySpotList = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.body.id);

    if (user) {
      return res.status(200).json({
        success: true,
        spookySpotList: user.spookySpotList,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Not found",
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error });
  }
};

const createSpookySpotListItem = async (req: Request, res: Response) => {
  const { id, spookySpotId, comment, hasVisited } = req.body;

  if (spookySpotId && comment && hasVisited !== undefined) {
    try {
      const user = await User.findById(id);

      const updateList = await User.findByIdAndUpdate(
        id,
        {
          spookySpotList: [
            ...user.spookySpotList,
            { spookySpotId, hasVisited, comment },
          ],
        },
        { new: true }
      );

      if (updateList) {
        return res.status(200).json({
          success: true,
          updateList,
        });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "Could not update list" });
      }
    } catch (error) {
      return res.status(500).json({ success: false, error });
    }
  } else {
    return res
      .status(400)
      .json({ success: false, message: "All fields must be populated" });
  }
};

export { getSpookySpotList, createSpookySpotListItem };
