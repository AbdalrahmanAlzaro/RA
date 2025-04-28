const express = require("express");
const router = express.Router();
const upload = require("../config/multer");
const {
  createService,
  getAllServices,
  updateService,
  deleteService,
  getServicesByBusinessId,
  getServiceById,
} = require("../controllers/serviceController");

router.post("/create", upload, createService);

router.get("/", getAllServices);

router.put("/:serviceId", upload, updateService);

router.delete("/:serviceId", deleteService);

router.get("/business/:businessId", getServicesByBusinessId);

router.get("/service/:serviceId", getServiceById);

module.exports = router;
