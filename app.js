const express=require("express");
const app=express();
const mongoose=require("mongoose");
const listing = require("./models/listing");
const path = require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const WrapAsync= require("./utils/WrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");


const MONGO_URL="mongodb://127.0.0.1:27017/Wanderlust";
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,'public')));


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

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));


app.get("/",(req,res)=>{
    res.send("hi am root");
})

function normalizeListingPayload(body){
    const listingData = { ...(body?.listing || {}) };
    if (typeof listingData.image === "string") {
        const imageUrl = listingData.image.trim();
        listingData.image = imageUrl ? { url: imageUrl } : undefined;
    }
    return listingData;
}

app.delete("/listings/:id",async(req,res)=>{
    const {id}=req.params;
    const Listing=await listing.findByIdAndDelete(id);
    res.redirect("/alllistings");
    console.log(Listing);
    
})

app.put("/listings/:id",async(req,res)=>{
    const {id}=req.params;
    const listingData = normalizeListingPayload(req.body);
    await listing.findByIdAndUpdate(id, listingData, { runValidators: true });
    res.redirect(`/listings/${id}`);

})


app.post("/listings",WrapAsync(async(req,res,next)=>{
         const listingData = normalizeListingPayload(req.body);
        const newlisting=new listing(listingData);
        await newlisting.save();
        res.redirect("/alllistings");
   
}))

app.get("/listings/new",(req,res)=>{
    res.render("./listings/new")
})



app.get("/listings/:id",async(req,res)=>{
    const {id}=req.params;
    const Listing=await listing.findById(id);
    res.render("./listings/show.ejs",{Listing})
})

app.get("/listings/:id/edit",async(req,res)=>{
    const {id}=req.params;
    const Listing=await listing.findById(id);
    res.render("./listings/edit.ejs",{Listing});


})

app.get("/alllistings",async (req,res)=>{
    const alllisting= await listing.find({});
    res.render("./listings/index.ejs",{alllisting});
})

app.use((err,req,res,next)=>{
    res.send("Something went worng!");
})

app.listen(8080,()=>{
    console.log("server is running");
});
