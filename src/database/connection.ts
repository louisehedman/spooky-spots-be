import mongoose from 'mongoose';


const connectDb = async (uri: string) => {
    let connMessage: string;
    await mongoose.connect(uri).then(
      (res) => {
        const connection = mongoose.connection;
        connMessage = `Connected to database ${connection.db.databaseName}`;
        return console.log(connMessage), connection;
      },
      (err) => {
        connMessage = `${err} No connection`;
        return console.log(connMessage);
      }
    );
  };
  
  export { connectDb };