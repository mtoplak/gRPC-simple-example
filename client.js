const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const PROTO_PATH = "library.proto";
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
const libraryService = protoDescriptor.LibraryService;

const client = new libraryService(
  "localhost:50051",
  grpc.credentials.createInsecure()
);

function addBookStream() {
  const books = [
    {
      title: "Book Title 1",
      authorId: 0,
      genre: "Genre 1",
      publicationYear: 2023,
    },
    {
      title: "Book Title 2",
      authorId: 1,
      genre: "Genre 2",
      publicationYear: 2023,
    },
  ];

  const call = client.AddBookStream((error, response) => {
    if (!error) {
      console.log("Server Response:", response);
    } else {
      console.error(error.details);
    }
  });

  for (const book of books) {
    call.write(book);
  }

  call.end();
}

function getBook() {
  const bookToGet = { id: 1 };

  client.GetBook(bookToGet, (error, response) => {
    if (!error) {
      console.log("Retrieved Book:", response);
    } else {
      console.error(error.details);
    }
  });
}

function updateBook() {
  const updatedBook = {
    id: 1,
    title: "Updated Title",
    authorId: 1,
    genre: "Updated Genre",
    publicationYear: 2000,
  };

  client.UpdateBook(updatedBook, (error, response) => {
    if (!error) {
      console.log("Updated Book:", response);
    } else {
      console.error(error.details);
    }
  });
}

function deleteBook() {
  const bookToDelete = { id: 1 };

  client.DeleteBook(bookToDelete, (error, response) => {
    if (!error) {
      console.log("Deleted Book:", response);
    } else {
      console.error(error.details);
    }
  });
}

function addAuthor() {
  const newAuthor = {
    name: "J.K.",
    surname: "Rowling",
    birthYear: 1965,
    country: "United Kingdom",
    genre: "Fantasy",
  };

  client.AddAuthor(newAuthor, (error, response) => {
    if (!error) {
      console.log("All Authors:", response);
    } else {
      console.error(error.details);
    }
  });
}

function getAuthor() {
  const authorToGet = { id: 0 };

  client.GetAuthor(authorToGet, (error, response) => {
    if (!error) {
      console.log("Retrieved Author:", response);
    } else {
      console.error(error.details);
    }
  });
}

function updateAuthor() {
  const updatedAuthor = {
    id: 0,
    name: "Updated Author Name",
    surname: "Updated Author Surname",
    birthYear: 2000,
    country: "Updated Country",
  };

  client.UpdateAuthor(updatedAuthor, (error, response) => {
    if (!error) {
      console.log("Updated Author:", response);
    } else {
      console.error(error.details);
    }
  });
}

function deleteAuthor() {
  const authorToDelete = { id: 0 };

  client.DeleteAuthor(authorToDelete, (error, response) => {
    if (!error) {
      console.log("Deleted Author:", response);
    } else {
      console.error(error.details);
    }
  });
}

// addBookStream();
// getBook();
// updateBook();
// deleteBook();

// addAuthor();
// getAuthor();
// updateAuthor();
// deleteAuthor();
