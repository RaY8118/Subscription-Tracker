import dayjs from "dayjs";
import { NODE_ENV, SERVER_URL } from "../config/env.js";
import { workflowClient } from "../config/upstash.js";
import Subscription from "../models/subscription.model.js"

export const createSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.create({
      ...req.body,
      user: req.user._id,
    });

    if (NODE_ENV === 'production') {
      const { workflowRunId } = await workflowClient.trigger({
        url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
        body: { subscriptionId: subscription.id, },
        headers: {
          'content-type': 'application/json'
        },
        retries: 0
      })
      res.status(201).json({ success: true, data: { subscription, workflowRunId } })
    } else {
      res.status(201).json({ success: true, data: subscription })
    }
  } catch (error) {
    next(error)
  }
}

export const getSubscriptionsDetails = async (req, res, next) => {
  try {
    const subscriptionDetails = await Subscription.findOne({ _id: req.params.id });

    res.status(200).json({ success: true, data: subscriptionDetails });
  } catch (error) {
    next(error);
  }
}

export const getAllSubscriptions = async (req, res, next) => {
  try {
    const subscriptions = await Subscription.find();

    res.status(200).json({ success: true, data: subscriptions });
  } catch (error) {
    next(error);
  }
}

export const getUserSubscriptions = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id) {
      const error = new Error('You are not the owner of this account');
      error.status = 401;
      throw error;
    }

    const subscriptions = await Subscription.find({ user: req.params.id });

    res.status(200).json({ success: true, data: subscriptions });
  } catch (error) {
    next(error);
  }
}

export const updateSubscriptions = async (req, res, next) => {
  try {
    const subscriptionId = req.params.id;
    const { name, price, currency, frequency, category, paymentMethod, status, startDate } = req.body;

    const updateFields = {};

    if (name) updateFields.name = name;
    if (price) updateFields.price = price;
    if (currency) updateFields.currency = currency;
    if (frequency) updateFields.frequency = frequency;
    if (category) updateFields.category = category;
    if (paymentMethod) updateFields.paymentMethod = paymentMethod;
    if (status) updateFields.status = status;
    if (startDate) updateFields.startDate = startDate;

    const response = await Subscription.updateOne(
      { _id: subscriptionId },
      { $set: updateFields }
    );

    if (response.matchedCount === 0) {
      res.status(404).json({ success: false, message: 'Subscription not found' });
    }
    if (response.modifiedCount) {
      res.status(200).json({ success: true, message: 'Subscription updated successfully', response });
    };
  } catch (error) {
    next(error);
  }
}

export const deleteSubscriptions = async (req, res, next) => {
  try {
    const subscriptionId = req.params.id;

    const response = await Subscription.deleteOne({ _id: subscriptionId });
    if (response.deletedCount) {
      res.status(200).json({ success: true, message: 'Subscription deleted successfully', response });
    } else {
      res.status(404).json({ success: true, message: 'Subscription not found' });
    }
  } catch (error) {
    next(error);
  }
}

export const cancelSubscriptions = async (req, res, next) => {
  try {
    const subscriptionId = req.params.id;

    const response = await Subscription.updateOne(
      { _id: subscriptionId },
      { $set: { status: 'cancelled' } }
    );

    if (response.modifiedCount > 0) {
      res.status(200).json({ success: true, message: 'Subscription cancelled successfully' });
    } else {
      res.status(404).json({ success: true, message: 'Subscription not found or already cancelled' })
    }
  } catch (error) {
    next(error);
  }
}

export const getUpcomingRenewals = async (req, res, next) => {
  try {
    const today = dayjs();
    const upcomingDate = today.add(7, 'day');

    const subscriptions = await Subscription.find({ status: 'active' })

    const upcomingRenewals = subscriptions.filter((sub) => {
      const startDate = dayjs(sub.startDate);

      let nextRenewalDate;

      switch (sub.frequency) {
        case 'daily':
          nextRenewalDate = startDate.add(1, 'day');
          break;
        case 'weekly':
          nextRenewalDate = startDate.add(1, 'week');
          break;
        case 'monthly':
          nextRenewalDate = startDate.add(1, 'month');
          break;
        case 'yearly':
          nextRenewalDate = startDate.add(1, 'year');
          break;
        default:
          return false;
      }
      return nextRenewalDate.isAfter(today) && nextRenewalDate.isBefore(upcomingDate);
    });
    res.status(200).json({ success: true, data: upcomingRenewals });
  } catch (error) {
    next(error);
  }
}
