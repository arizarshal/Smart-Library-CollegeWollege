const books = [
  {
    "title": "An Introduction to C & GUI Programming, 2nd Edition",
    "author": "Alan R. Miller",
    "price": "$12.94",
    "image": "https://itbook.store/img/books/9781912047451.png",
    "singlePricePerDay": 14,
    "groupPricePerDay": 7,
    "duePerDay": 6
  },
  {
    "title": "Snowflake: The Definitive Guide",
    "author": "Bill Inmon",
    "price": "$58.90",
    "image": "https://itbook.store/img/books/9781098103828.png",
    "singlePricePerDay": 14,
    "groupPricePerDay": 7,
    "duePerDay": 6
  },
  {
    "title": "Python for Data Analysis, 3rd Edition",
    "author": "Wes McKinney",
    "price": "$34.96",
    "image": "https://itbook.store/img/books/9781098104030.png",
    "singlePricePerDay": 14,
    "groupPricePerDay": 7,
    "duePerDay": 6
  },
  {
    "title": "Reliable Machine Learning",
    "author": "Vineet Bansal",
    "price": "$43.99",
    "image": "https://itbook.store/img/books/9781098106225.png",
    "singlePricePerDay": 14,
    "groupPricePerDay": 7,
    "duePerDay": 6
  },
  {
    "title": "Data Visualization with Python and JavaScript, 2nd Edition",  
    "author": "Kyran Dale",
    "price": "$60.99",
    "image": "https://itbook.store/img/books/9781098111878.png",
    "singlePricePerDay": 14,
    "groupPricePerDay": 7,
    "duePerDay": 6
  },
  {
    "title": "Learning Microsoft Power BI",
    "author": "Dan Clark",
    "price": "$40.97",
    "image": "https://itbook.store/img/books/9781098112844.png",
    "singlePricePerDay": 14,
    "groupPricePerDay": 7,
    "duePerDay": 6
  },
  {
    "title": "C++ Software Design",
    "author": "Dan Clark",
    "price": "$48.99",
    "image": "https://itbook.store/img/books/9781098113162.png",
    "singlePricePerDay": 14,
    "groupPricePerDay": 7,
    "duePerDay": 6
  },
  {
    "title": "Terraform: Up and Running, 3rd Edition",
    "author": "Dan Clark",
    "price": "$41.99",
    "image": "https://itbook.store/img/books/9781098116743.png",
    "singlePricePerDay": 14,
    "groupPricePerDay": 7,
    "duePerDay": 6
  },
  {
    "title": "Flutter and Dart Cookbook",
    "author": "Dan Clark",
    "price": "$42.99",
    "image": "https://itbook.store/img/books/9781098119515.png",
    "singlePricePerDay": 14,
    "groupPricePerDay": 7,
    "duePerDay": 6
  },
  {
    "title": "Python Data Science Handbook, 2nd Edition",
    "author": "Dan Clark",
    "price": "$56.99",
    "image": "https://itbook.store/img/books/9781098121228.png",
    "singlePricePerDay": 14,
    "groupPricePerDay": 7,
    "duePerDay": 6
  },
  {
    "title": "Raspberry Pi Cookbook, 4th Edition",
    "author": "Dan Clark",
    "price": "$14.99",
    "image": "https://itbook.store/img/books/9781098130923.png",
    "singlePricePerDay": 14,
    "groupPricePerDay": 7,
    "duePerDay": 6
  },
  {
    "title": "Azure Maps Using Blazor Succinctly",
    "author": "Dan Clark",
    "price": "$0.00",
    "image": "https://itbook.store/img/books/9781642002263.png",
    "singlePricePerDay": 14,
    "groupPricePerDay": 7,
    "duePerDay": 6
  },
  {
    "title": "Full Stack Quarkus and React",
    "author": "Dan Clark",
    "price": "$39.99",
    "image": "https://itbook.store/img/books/9781800562738.png",
    "singlePricePerDay": 14,
    "groupPricePerDay": 7,
    "duePerDay": 6
  },
  {
    "title": "Mathematics for Game Programming and Computer Graphics",
    "author": "Dan Clark",
    "price": "$49.99",
    "image": "https://itbook.store/img/books/9781801077330.png",
    "singlePricePerDay": 14,
    "groupPricePerDay": 7,
    "duePerDay": 6
  },
  {
    "title": "Architecting and Building High-Speed SoCs",
    "author": "Dan Clark",
    "price": "$35.99",
    "image": "https://itbook.store/img/books/9781801810999.png",
    "singlePricePerDay": 14,
    "groupPricePerDay": 7,
    "duePerDay": 6
  },
  {
    "title": "Web Development with Julia and Genie",
    "author": "Dan Clark",
    "price": "$39.99",
    "image": "https://itbook.store/img/books/9781801811132.png",
    "singlePricePerDay": 14,
    "groupPricePerDay": 7,
    "duePerDay": 6
  },
  {
    "title": "Java Memory Management",
    "author": "Dan Clark",
    "price": "$34.99",
    "image": "https://itbook.store/img/books/9781801812856.png",
    "singlePricePerDay": 14,
    "groupPricePerDay": 7,
    "duePerDay": 6
  },
  {
    "title": "Test-Driven Development with C++",
    "author": "Dan Clark",
    "price": "$44.99",
    "image": "https://itbook.store/img/books/9781803242002.png",
    "singlePricePerDay": 14,
    "groupPricePerDay": 7,
    "duePerDay": 6
  }
]


// Duplicate until you reach 20 books (change titles slightly)
while (books.length < 20) {
  books.push({
    ...books[books.length % 5],
    title: books[books.length % 5].title + " Vol " + books.length,
  });
}

export default books;
