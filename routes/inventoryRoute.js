const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const multer = require("multer");

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/vehicles");  
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route for individual vehicle details
router.get("/detail/:invId", invController.buildByInvId);

// Route to render the management page
router.get("/", invController.renderManagementPage);

// Route to render the Add Classification form
router.get("/add-classification", invController.renderAddClassificationForm);

// Route to handle classification form submission
router.post("/add-classification", invController.addClassification);

// Route to render the Add Vehicle form
router.get("/add-inventory", invController.renderAddVehicleForm);

// Route to handle adding a new vehicle with image upload
router.post("/add-inventory", upload.fields([{ name: "inv_image" }, { name: "inv_thumbnail" }]), invController.addVehicle);

// Route to render inventory list
router.get("/list", invController.renderInventoryList);


// Route to confirm deletion
router.get("/delete/:invId", invController.confirmDelete);

// Route to handle deletion after confirmation
router.post("/delete/:invId", invController.deleteInventoryItem);


module.exports = router;
