import { Response, Request } from "express";
import Subscription from "../models/Subscription";
import { validateEmail } from "../utils/validateEmail";
import { sendEmail } from "../utils/emailSender";
import { ErrorResponse } from "../utils/errorResponse";
import User from "../models/User";

//
const sendNewsletter = async (req: Request, res: Response, next: any) => {
  const user = await User.findById(req.body.id);
  const newsSubject = req.body.subject;
  const newsMessage = req.body.message;
  const receivers = await Subscription.find();
  if (!receivers) {
    return next(new ErrorResponse("Subscription list empty", 404));
  }
  try {
    // Only admins are allowed to send news letters
    if (user.isAdmin === true) {
      receivers.forEach(async function (receiver) {
        await sendEmail({
          to: receiver.email,
          text: newsMessage,
          subject: newsSubject,
        });
      });
      res.status(200).json({
        success: true,
        data: "Newsletter Sent",
      });
    } else {
      res
        .status(400)
        .json({ message: "You are not allowed to send news letters" });
    }
  } catch (error) {
    console.log(error);
    return next(new ErrorResponse("Newsletter could not be sent", 500));
  }
};

// Subscribe email to receive newsletters
const subscribe = async (req: Request, res: Response) => {
  try {
    // Check if the email exists first of all
    let checkSubscription = await Subscription.find({ email: req.body.email });
    // If it doesn't..
    if (checkSubscription.length === 0) {
      // Then validate the email
      if (validateEmail(req.body.email)) {
        // And add it to the database
        const newSubscription = new Subscription({
          email: req.body.email,
        });
        newSubscription.save(function (err) {
          if (err) {
            res
              .status(400)
              .json({ success: false, message: "Error saving your email" });
          } else {
            res
              .status(200)
              .json({ success: true, message: "You have subscribed" });
          }
        });
      } else {
        // Otherwise show errors
        res
          .status(400)
          .json({ success: false, message: "Error saving your email" });
      }
    } else {
      res
        .status(201)
        .json({ success: false, message: "You have already subscribed" });
    }
  } catch (e) {
    // Or a real error if something really goes wrong
    console.log(e);
  }
};

// Unsubscribe email from receiving newsletters
const unSubscribe = async (req: Request, res: Response) => {
  if (typeof req.params.email !== "undefined") {
    // Search for parameter email in subscriptions collection
    let findEmail = await Subscription.find({ email: req.params.email });
    if (findEmail.length > 0) {
      // If it exists, remove it
      await Subscription.deleteOne({ email: req.params.email });
      res.status(200).json({ success: true, message: "Email deleted." });
    } else {
      // Otherwise the user wasn't even subscribed to begin with
      res
        .status(404)
        .json({
          success: false,
          message: "Email doesn't exist in subscription list.",
        });
    }
  }
};

export { sendNewsletter, subscribe, unSubscribe };
