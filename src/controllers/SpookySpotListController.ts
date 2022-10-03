import { Response, Request } from "express";
import User from "../models/User";

const getList = async (req: Request, res: Response) => {
    try {
      const user = await User.findById(req.body.id);
  
      if (user) {
        return res.status(200).json({
          success: true,
          list: user.spookySpotList,
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

  export { getList };

  