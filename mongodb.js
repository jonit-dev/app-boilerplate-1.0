const { MongoClient, ObjectId } = require("mongodb");
// const MongoClient = mongodb.MongoClient; //functions to connect to database
const connectionURL = "mongodb://127.0.0.1:27017";
const database = "task-manager";

//connect to the server
MongoClient.connect(
  connectionURL,
  { useNewUrlParser: true },
  (error, client) => {
    if (error) {
      return console.log("Unable to connect to database");
    }
    console.log("Connected correctly!");

    const db = client.db(database); //we reference db to manipulate it

    // INSERT: Single document  ========================================

    // db.collection("users")
    //   .insertOne({
    //     name: "Nathan",
    //     age: 29
    //   })
    //   .then(result => console.log(result.ops))
    //   .catch(err => console.log(err));

    // INSERT: Many items ========================================

    // db.collection("tasks")
    //   .insertMany([
    //     { description: "Buy milk2", completed: false },
    //     { description: "Buy oranges2", completed: true },
    //     { description: "Sell my car2", completed: false }
    //   ])
    //   .then(results => console.log(results.ops))
    //   .catch(err => console.log(err));

    // READ: Reading items from mongoDB ========================================

    // db.collection("users")
    //   .findOne({ name: "Jen" })
    //   .then(result => console.log(result))
    //   .catch(err => console.log(err));

    //finding multiple users
    // db.collection("users")
    //   .find({ age: 52 })
    //   .toArray()
    //   .then(items => console.log(items))
    //   .catch(err => console.log(err));

    // //counting results
    // db.collection("users")
    //   .find({ age: 27 })
    //   .count((error, items) => {
    //     console.log(items);
    //   });

    // db.collection("tasks").findOne(
    //   { _id: new ObjectId("5d61d21b2df1c679d7893eec") },
    //   (error, item) => {
    //     if (error) {
    //       return console.log("Unable to fetch item");
    //     }

    //     console.log(item);
    //   }
    // );

    // db.collection("tasks")
    //   .find({ completed: true })
    //   .toArray((error, items) => {
    //     console.log(items);
    //   });

    // UPDATE ========================================

    //id: 5d61cc9891962b72879695a8

    // db.collection("users")
    //   .updateOne(
    //     { _id: new ObjectId("5d61cc9891962b72879695a8") },
    //     {
    //       $set: {
    //         name: "Mike"
    //       },
    //       $inc: {
    //         age: 1
    //       }
    //     }
    //   )
    //   .then(result => {
    //     if (result.modifiedCount === 1) {
    //       console.log("Resource updated!");
    //     } else {
    //       console.log("Resource wasnt updated.");
    //     }
    //   })
    //   .catch(result => {
    //     console.log(result);
    //   });

    // db.collection("users")
    //   .updateMany(
    //     { age: 52 },
    //     {
    //       $set: {
    //         age: 22
    //       }
    //     }
    //   )
    //   .then(result => {
    //     const { modifiedCount } = result;

    //     modifiedCount >= 1
    //       ? console.log(`${modifiedCount} resource(s) updated!`)
    //       : console.log("Resource wasnt updated.");
    //   })
    //   .catch(result => {
    //     console.log(result);
    //   });

    // DELETE ========================================

    // db.collection("users")
    //   .deleteMany({
    //     age: 22
    //   })
    //   .then(result =>
    //     console.log(`${result.deletedCount} resources were deleted`)
    //   )
    //   .catch(err => console.log(err));

    db.collection("tasks")
      .deleteOne({
        description: "Buy milk"
      })
      .then(result =>
        result.deletedCount
          ? console.log("Resource deleted")
          : console.log("Failed to delete resource")
      );
  }
);
