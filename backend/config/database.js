const mongoose = require('mongoose')

async function connect() {
  try {
    mongoose.connection.on("error", (err) => {
      console.log(err);
    });
    mongoose.connection.on("connecting", () => {
      console.log("Connecting to DB...");
    });
    mongoose.connect(process.env.DATABASE_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch(err) {
    console.log(err)
  }
}

module.exports = connect