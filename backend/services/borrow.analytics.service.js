import Borrow from "../models/borrow.js";

export const getMostBorrowedBooksByTitleService = async ({
  limit = 10,
  from,
  to,
} = {}) => { // "{}" accepts an optional object parameter
  const limitNum = Number.isInteger(+limit) && +limit > 0 ? +limit : 10;

  // Optional date filter (if Borrow has createdAt via timestamps)
  const match = {};
  if (from || to) {
    match.createdAt = {};
    if (from) match.createdAt.$gte = new Date(from);
    if (to) match.createdAt.$lte = new Date(to);
  }

  const pipeline = [
    Object.keys(match).length ? { $match: match } : null,

    // group by bookId to count borrows
    {
      $group: {
        _id: "$bookId",
        borrowCount: { $sum: 1 },
      },
    },

    // join book details
    {
      $lookup: {
        from: "books",
        localField: "_id",
        foreignField: "_id",
        as: "book",
      },
    },

    // flatten book array into an object
    { $unwind: "$book" },

    // group by title (in case multiple book docs share same title)
    {
      $group: {
        _id: "$book.title",
        borrowCount: { $sum: "$borrowCount" },
        // keep some sample fields
        authors: { $addToSet: "$book.author" },
        bookIds: { $addToSet: "$book._id" },
      },
    },

    // sort most borrowed first
    { $sort: { borrowCount: -1 } },

    // limit results
    { $limit: limitNum },

    // shape response
    {
      $project: {
        _id: 0,
        title: "$_id",
        borrowCount: 1,
        authors: 1,
        bookIds: 1,
      },
    },
  ].filter(Boolean);

  return Borrow.aggregate(pipeline);
};