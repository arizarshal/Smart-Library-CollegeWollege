import mongoose from "mongoose";
import Borrow from "../models/borrow.js";
import Payment from "../models/payment.js";
import User from "../models/user.js";

export const getDashboardSummaryAggregateService = async (userId) => {
  const userObjectId = new mongoose.Types.ObjectId(userId);

  const [borrowAgg, dueAgg, user] = await Promise.all([
    //Borrow aggregation to get historyCount and activeBorrows
    Borrow.aggregate([
      { $match: { userId: userObjectId } },
      {
        $group: {
          _id: null,
          historyCount: { $sum: 1 },
          activeBorrows: {
            $sum: {
              $cond: [{ $eq: ["$status", "ACTIVE"] }, 1, 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0, 
          historyCount: 1,
          activeBorrows: 1,
        },
      },
    ]),

    //Payment aggregation to get totalDue
    Payment.aggregate([
      { $match: { userId: userObjectId, status: "PENDING" } },
      {
        $group: {
          _id: null,
          totalDue: { $sum: "$amount" },
        },
      },
      { $project: { _id: 0, totalDue: 1 } },
    ]),

    //User findById() then select method of mongoose to get balance
    User.findById(userId).select("balance"),
  ]);

  return {
    activeBorrows: borrowAgg[0]?.activeBorrows ?? 0,
    historyCount: borrowAgg[0]?.historyCount ?? 0,
    totalDue: dueAgg[0]?.totalDue ?? 0,
    balance: user?.balance ?? 0,
  };
};