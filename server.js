const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const fs = require("fs");

const PROTO_PATH = "library.proto";
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
const libraryService = protoDescriptor.LibraryService;

const server = new grpc.Server();

server.addService(libraryService.service, {
  AddBookStream: addBookStream,
  GetBook: getBook,
  UpdateBook: updateBook,
  DeleteBook: deleteBook,
  AddAuthor: addAuthor,
  GetAuthor: getAuthor,
  UpdateAuthor: updateAuthor,
  DeleteAuthor: deleteAuthor,
});

let books = [];
let authors = [];

function loadInitialData() {
  try {
    const data = fs.readFileSync("library_data.json", "utf-8");
    const jsonData = JSON.parse(data);
    books = jsonData.books || [];
    authors = jsonData.authors || [];
  } catch (error) {
    console.error("Error loading initial data:", error.message);
  }
}

function saveDataToJson() {
  const data = { books, authors };
  const jsonData = JSON.stringify(data, null, 2);
  fs.writeFileSync("library_data.json", jsonData, "utf-8");
}

function addBookStream(call, callback) {
  call.on("data", (book) => {
    book.id = books.length;
    books.push(book);
    saveDataToJson();
  });

  call.on("end", () => {
    console.log("No more books to add.");
    callback(null, { books: books });
  });
}

function getBook(call, callback) {
  const requestedBook = books.find((book) => book.id == call.request.id);
  if (requestedBook) {
    callback(null, requestedBook);
  } else {
    callback({
      code: grpc.status.NOT_FOUND,
      details: "Book not found",
    });
  }
}

function updateBook(call, callback) {
  const updatedBook = call.request;
  const index = books.findIndex((book) => book.id === updatedBook.id);
  if (index !== -1) {
    books[index] = updatedBook;
    saveDataToJson();
    callback(null, updatedBook);
  } else {
    callback({
      code: grpc.status.NOT_FOUND,
      details: "Book not found",
    });
  }
}

function deleteBook(call, callback) {
  const deletedBook = call.request;
  const index = books.findIndex((book) => book.id === deletedBook.id);
  if (index !== -1) {
    const [removedBook] = books.splice(index, 1);
    saveDataToJson();

    const deleteSuccessResponse = {
      success: true,
    };

    callback(null, deleteSuccessResponse);
  } else {
    const errorResponse = {
      code: grpc.status.NOT_FOUND,
      details: "Book not found",
    };

    callback(errorResponse);
  }
}

function addAuthor(call, callback) {
  const newAuthor = call.request;
  newAuthor.id = authors.length;
  authors.push(newAuthor);
  saveDataToJson();
  const response = {
    authors: authors,
  };
  callback(null, response);
}

function getAuthor(call, callback) {
  const requestedAuthor = authors.find(
    (author) => author.id === call.request.id
  );
  if (requestedAuthor) {
    callback(null, requestedAuthor);
  } else {
    callback({
      code: grpc.status.NOT_FOUND,
      details: "Author not found",
    });
  }
}

function updateAuthor(call, callback) {
  const updatedAuthor = call.request;
  const index = authors.findIndex((author) => author.id === updatedAuthor.id);
  if (index !== -1) {
    authors[index] = updatedAuthor;
    saveDataToJson();
    callback(null, updatedAuthor);
  } else {
    callback({
      code: grpc.status.NOT_FOUND,
      details: "Author not found",
    });
  }
}

function deleteAuthor(call, callback) {
  const deletedAuthor = call.request;
  const index = authors.findIndex((author) => author.id === deletedAuthor.id);
  if (index !== -1) {
    const [removedAuthor] = authors.splice(index, 1);
    saveDataToJson();
    const deleteAuthorSuccess = {
      success: true,
    };

    callback(null, deleteAuthorSuccess);
  } else {
    callback({
      code: grpc.status.NOT_FOUND,
      details: "Author not found",
    });
  }
}

loadInitialData();
server.bindAsync(
  "localhost:50051",
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log("Server running at http://localhost:50051");
    server.start();
  }
);
