// services/book.service.js
import Book from "../models/book.js";

const getSortObject = (sort) => {
  // Map sort query param to mongoose sort object
  switch(sort) {
    case "createdAt_asc":
      return { createdAt: 1 };
    case "createdAt_desc":
      return { createdAt: -1 };
    case "title_asc":
      return { title: 1 };
    case "title_desc":
      return { title: -1 };
    case "author_asc":
      return { author: 1 };
    case "author_desc":
      return { author: -1 };
    case "singlePricePerDay_asc":
      return { singlePricePerDay: 1 };
    case "singlePricePerDay_desc":
      return { singlePricePerDay: -1 };
    default:
      return { createdAt: -1 };
  }
}

export const getAllBooksService = async ({
  page,
  limit, 
  search,
  available,
  sort
}) => {

  const pageNum = Number.isInteger(+page) && +page > 0 ? +page : 1;
  const limitNum = Number.isInteger(+limit) && +limit > 0 ? +limit : 10;
  const skip = (pageNum - 1) * limitNum;

  let query = {};

  if (available === "true") {
    query.isBorrowed = false;
  }

  // Using regex for case-insensitive partial match on title or author
  // if (search) {
  //   query.$or = [
  //     { title: { $regex: search, $options: "i" } },
  //     { author: { $regex: search, $options: "i" } },
  //   ];
  // }

  // Use text index for faster search
  if (search) {
    query.$text = { $search: search };
  }

  const sortObj = getSortObject(sort);

  const [books, totalBooks] = await Promise.all([
    Book.find(query)
     // If using $text, you can also sort by relevance:
      // .sort(search ? { score: { $meta: "textScore" } } : { createdAt: -1 }). Here we are using sortObj only.
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum),

    Book.countDocuments(query),
  ]);

  return {
    pagination: {
      page: pageNum,
      limit: limitNum,
      totalItems: totalBooks,
      totalPages: Math.ceil(totalBooks / limitNum),
      sort: sort || "createdAt_desc",
    },
    data: books,
  };
};

