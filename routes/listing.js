let express=require("express");
let router=express.Router();
let mo=require("method-override");
const {ListingSchema}=require("../Schema.js");
const wrapAsync=require("../utils/WrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
let listings=require("../models/listings");
const {loggedIn,isOwner,ValidateListing}=require("../middleware.js");
const session = require("express-session");
const ListingController=require("../controllers/listingControllr.js")
const multer=require("multer");
const {storage}=require("../cloudconfig.js");
const upload=multer({storage,
    limits:{fileSize:2*1024*1024}
});
//home Page
router.route("/")
.get(wrapAsync(ListingController.index))
.post(loggedIn,upload.single('listing[image]'),ValidateListing,wrapAsync(ListingController.postingdata));//create new page

//create new page
router.get("/new",loggedIn,ListingController.createHomepage);
//show route
router.route("/:id")
.get(wrapAsync(ListingController.show))
.put(loggedIn,isOwner,upload.single('listing[image]'),ValidateListing,wrapAsync(ListingController.update))
.delete(loggedIn,isOwner,wrapAsync(ListingController.destroyRoute));//delete

//editing
router.get("/:id/edit",loggedIn,isOwner,wrapAsync(ListingController.edit));
module.exports=router;