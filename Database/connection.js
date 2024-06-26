const mongoose = require("mongoose");

const userName = "pankajhasmukh2014";
const password = "7G8qHpCav0W9Q2nB";

mongoose
  .connect(
    `mongodb+srv://root:@7EHF8m5uYSd9wq@cluster0.dwxs9gt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,
    {
      // useCreateIndex:true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000, // Adjust as necessary

      // findAndUpdate:false,
    }
  )
  .then(() => console.log("Connection succesfully..."))
  .catch((error) => console.log("Connection Error==>", error.message));
