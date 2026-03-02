const mongoose =require("mongoose");
const schema=mongoose.Schema;

const listingschema=new schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image: {
    filename: String,
    url: {
        type:String,
        default:"https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
  }
},
    price :Number,
    location:String,
    country:String
});

const listing =mongoose.model("listing",listingschema);

module.exports=listing;