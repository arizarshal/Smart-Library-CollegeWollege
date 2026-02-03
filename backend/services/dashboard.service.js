// Using dashboard.aggregate.service.js for optimized aggregation query insted of dashboard.service.js which was using multiple queries. 

// import Borrow from "../models/borrow.js";
// import Payment from "../models/payment.js";
// import User from "../models/user.js";

// export const getDashboardSummaryService = async (userId) => {
//   const activeBorrows = await Borrow.countDocuments({
//     userId,
//     status: "ACTIVE",
//   });

//   const historyCount = await Borrow.countDocuments({
//     userId,
//   });

//   const pendingPayments = await Payment.find({
//     userId,
//     status: "PENDING",
//   });

//   const totalDue = pendingPayments.reduce(
//     (sum, payment) => sum + payment.amount,
//     0
//   );

//   const user = await User.findById(userId);

//   return {
//     activeBorrows,
//     totalDue,
//     balance: user.balance,
//     historyCount,
//   };
// };
