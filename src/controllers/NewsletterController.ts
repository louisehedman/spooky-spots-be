import { Response, Request } from "express";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import { validateEmail } from "../utils/validateEmail";
import { sendEmail } from "../utils/emailSender";
import { ErrorResponse } from "../utils/errorResponse";
import Subscription from "../models/Subscription";
import User from "../models/User";
import Newsletter from "../models/Newsletter";

// Get all subscribers
const getSubscribers = async (req: Request, res: Response) => {
  const user = await User.findById(req.body.id);
  try {
    // Only admins are allowed to get subscribers
    if (user.isAdmin === true) {
      const subscribers = await Subscription.find();
      if (subscribers) {
        return res.status(200).json({
          success: true,
          subscribers,
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "No subscribers found",
        });
      }
    } else {
      res
        .status(400)
        .json({ message: "You are not allowed to send news letters" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error });
  }
};

// Send newsletter to all emails in subscription list and archive newsletter in database
const sendNewsletter = async (req: Request, res: Response, next: any) => {
  const user = await User.findById(req.body.id);
  const newsSubject = req.body.subject;
  const newsMessage = req.body.message;
  const unsubscribeUrl = `${process.env.CLIENT_URL}/unsubscribe`;
  const receivers = await Subscription.find();
  if (!receivers) {
    return next(new ErrorResponse("Subscription list empty", 404));
  }
  try {
    // Only admins are allowed to send news letters
    if (user.isAdmin === true) {
      // Create newsletter subject and message from input
      const newsletter = await Newsletter.create(req.body);

      // Send the newsletter to all emails in subscription list
      receivers.forEach(async function (receiver) {
        await sendEmail({
          to: receiver.email,
          text:
            newsMessage +
            `<p>Don't want to receive emails anymore?</p>
          <a href=${unsubscribeUrl}/${receiver.email} clickTracking=off>Unsubscribe</a>`,
          subject: newsSubject,
        });
      })
      
      // Save newsletter subject and message in database
      newsletter.save({ validateBeforeSave: false });
      
      res.status(200).json({
        success: true,
        message: "Newsletter sent and saved",
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
      res.status(404).json({
        success: false,
        message: "Email doesn't exist in subscription list.",
      });
    }
  }
};

// Get all archived newsletters
const getNewsletters = async (req: Request, res: Response) => {
  try {
    const newsletters = await Newsletter.find();

    if (newsletters) {
      return res.status(200).json({
        success: true,
        newsletters,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "No newsletters found",
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error });
  }
};

// Get one saved newsletter
const getNewsletter = async (req: Request, res: Response) => {
  const condition = () => {
    if (mongoose.isValidObjectId(req.params.newsletter)) {
      return { _id: new ObjectId(req.params.newsletter) };
    }
  };

  Newsletter.findOne(
    condition(),
    function (err: Error, newsletter: mongoose.Document) {
      if (!newsletter) {
        return res.status(404).json("Newsletter does not exist");
      }
      if (err) {
        return res.status(500).send(console.error());
      }
      return res.status(200).json({ newsletter });
    }
  );
};

export {
  getSubscribers,
  sendNewsletter,
  subscribe,
  unSubscribe,
  getNewsletters,
  getNewsletter,
};
