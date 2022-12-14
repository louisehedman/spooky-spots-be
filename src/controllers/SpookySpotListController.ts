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

const getSpookySpotListItem = async (req: Request, res: Response) => {
  const { listItemId } = req.params;

  try {
    const user = await User.findById(req.body.id);

    if (user) {
      const listItem = user.spookySpotList.id(listItemId);

      if (listItem) {
        return res.status(200).json({ success: true, listItem });
      } else {
        return res.status(404).json({ success: false, message: "Not found" });
      }
    }
  } catch (error) {
    return res.status(500).json({ success: false, error });
  }
};

const createSpookySpotListItem = async (req: Request, res: Response) => {
  const { id, spookySpotId, comment, hasVisited } = req.body;

  if (spookySpotId && hasVisited !== undefined) {
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
      .json({
        success: false,
        message: "All required fields must be populated",
      });
  }
};

const editSpookySpotListItem = async (req: Request, res: Response) => {
  let { comment, hasVisited } = req.body;
  const { userId, listItemId } = req.params;

  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId, "spookySpotList._id": listItemId },
      {
        $set: {
          "spookySpotList.$.comment": comment,
          "spookySpotList.$.hasVisited": hasVisited,
        },
      },
      { new: true }
    );

    if (updatedUser) {
      return res.status(200).json({ success: true, updatedUser });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Could not update list item" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error });
  }
};

const deleteSpookySpotListItem = async (req: Request, res: Response) => {
  const { userId, listItemId } = req.params;
  try {
    const deletedListItem: any = await User.findOneAndUpdate(
      {
        _id: userId,
      },
      {
        $pull: {
          spookySpotList: {
            _id: listItemId,
          },
        },
      }
    );
    if (deletedListItem) {
      res.status(200).json({ success: true, message: "List item deleted" });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Could not delete list item" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error while trying to delete list item" });
  }
};

export {
  getSpookySpotList,
  getSpookySpotListItem,
  createSpookySpotListItem,
  editSpookySpotListItem,
  deleteSpookySpotListItem,
};
