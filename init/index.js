const mongoose=require("mongoose");
const MONGO_URL="mongodb://127.0.0.1:27017/Wanderlust";
const initdata=require("./data.js");
const listing = require("../models/listing");


main()
.then(()=>{
    console.log("connected to db");
})
.catch((err)=>{
    console.log(err);
})
async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDb=async ()=>{
    await listing.deleteMany({});
    await listing.insertMany(initdata.data);
    console.log("data intialsed");
}

initDb();