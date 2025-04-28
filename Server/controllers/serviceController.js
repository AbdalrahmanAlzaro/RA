const { Service, UserSubscription } = require("../models");
const path = require("path");

const createService = async (req, res) => {
  try {
    const { title, description, businessId } = req.body;

    const business = await UserSubscription.findByPk(businessId);
    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    const mainImagePath = req.files.mainImage
      ? req.files.mainImage[0].filename
      : null;
    const subImagesPath = req.files.subImage
      ? req.files.subImage.map((file) => file.filename)
      : [];

    const newService = await Service.create({
      title,
      description,
      mainImage: mainImagePath,
      subImage: subImagesPath.join(", "),
      businessId,
    });

    res
      .status(201)
      .json({ message: "Service created successfully", service: newService });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllServices = async (req, res) => {
  try {
    const services = await Service.findAll();
    res.status(200).json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { title, description, businessId } = req.body;

    const service = await Service.findByPk(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    const mainImagePath = req.files?.mainImage
      ? req.files.mainImage[0].filename
      : service.mainImage;
    const subImagesPath = req.files?.subImage
      ? req.files.subImage.map((file) => file.filename).join(", ")
      : service.subImage;

    await service.update({
      title: title || service.title,
      description: description || service.description,
      mainImage: mainImagePath,
      subImage: subImagesPath,
      businessId: businessId || service.businessId,
    });

    res.status(200).json({ message: "Service updated successfully", service });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteService = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const service = await Service.findByPk(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    await service.destroy();

    res.status(200).json({ message: "Service deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getServicesByBusinessId = async (req, res) => {
  try {
    const { businessId } = req.params;

    const services = await Service.findAll({
      where: { businessId },
    });

    if (!services || services.length === 0) {
      return res
        .status(404)
        .json({ message: "No services found for this business" });
    }

    res.status(200).json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getServiceById = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const service = await Service.findByPk(serviceId);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.status(200).json(service);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createService,
  getAllServices,
  updateService,
  deleteService,
  getServicesByBusinessId,
  getServiceById,
};
