import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";
import { cancelSubscriptions, createSubscription, deleteSubscriptions, getAllSubscriptions, getSubscriptionsDetails, getUpcomingRenewals, getUserSubscriptions, updateSubscriptions } from "../controllers/subscription.controller.js";

const subscriptionRouter = Router();

subscriptionRouter.get('/', authorize, getAllSubscriptions);
subscriptionRouter.get('/:id', authorize, getSubscriptionsDetails);
subscriptionRouter.post('/', authorize, createSubscription);
subscriptionRouter.put('/:id', authorize, updateSubscriptions);
subscriptionRouter.delete('/:id', authorize, deleteSubscriptions);

subscriptionRouter.get('/user/:id', authorize, getUserSubscriptions);
subscriptionRouter.put('/:id/cancel', authorize, cancelSubscriptions);
subscriptionRouter.get('/upcoming-renewals', authorize, getUpcomingRenewals);

export default subscriptionRouter;
