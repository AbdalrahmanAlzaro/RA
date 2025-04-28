import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  PlusCircle,
  Trash2,
  Edit,
  X,
  Save,
  Camera,
  Image as ImageIcon,
  AlertCircle,
  CheckCircle,
  Loader,
} from "lucide-react";

// Toast notification component
const Toast = ({ message, type, onClose }) => {
  if (!message) return null;

  return (
    <div
      className={`fixed bottom-4 right-4 flex items-center p-4 mb-4 rounded-lg shadow-lg z-50 ${
        type === "success"
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
      }`}
    >
      <div className="mr-2">
        {type === "success" ? (
          <CheckCircle size={20} />
        ) : (
          <AlertCircle size={20} />
        )}
      </div>
      <div className="text-sm font-medium">{message}</div>
      <button
        onClick={onClose}
        className="ml-4 text-gray-400 hover:text-gray-600"
      >
        <X size={16} />
      </button>
    </div>
  );
};

// Modal component for updating a service
const UpdateServiceModal = ({ isOpen, service, onClose, onUpdate }) => {
  const [updatedService, setUpdatedService] = useState({
    title: "",
    description: "",
    mainImage: null,
    subImages: [],
  });
  const [loading, setLoading] = useState(false);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [subImagesPreview, setSubImagesPreview] = useState([]);

  useEffect(() => {
    if (service) {
      setUpdatedService({
        title: service.title,
        description: service.description,
      });

      if (service.mainImage) {
        setMainImagePreview(
          `http://localhost:4000/uploads/${service.mainImage}`
        );
      }

      if (service.subImage) {
        setSubImagesPreview(
          service.subImage
            .split(", ")
            .map((img) => `http://localhost:4000/uploads/${img}`)
        );
      }
    }
  }, [service]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedService((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const { name, files } = e.target;

    if (name === "mainImage" && files[0]) {
      setMainImagePreview(URL.createObjectURL(files[0]));
    }

    if (name === "subImages" && files.length) {
      const newPreviews = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setSubImagesPreview(newPreviews);
    }

    setUpdatedService((prev) => ({
      ...prev,
      [name]: files,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onUpdate(service.id, updatedService);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  if (!isOpen || !service) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md transform transition-all max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Update Service</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Service Title
            </label>
            <input
              type="text"
              name="title"
              value={updatedService.title}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              placeholder="Enter service title"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Service Description
            </label>
            <textarea
              name="description"
              value={updatedService.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              placeholder="Enter service description"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2  items-center">
              <Camera size={18} className="mr-2 text-blue-500" />
              Main Image
            </label>
            {mainImagePreview && (
              <div className="relative mb-3 w-full h-48 rounded-lg overflow-hidden border border-gray-200">
                <img
                  src={mainImagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="relative">
              <input
                type="file"
                name="mainImage"
                onChange={handleImageChange}
                className="hidden"
                id="mainImage"
              />
              <label
                htmlFor="mainImage"
                className="flex items-center justify-center w-full p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 cursor-pointer transition-colors"
              >
                <ImageIcon size={18} className="mr-2 text-gray-500" />
                <span className="text-gray-600">Choose new main image</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2  items-center">
              <ImageIcon size={18} className="mr-2 text-blue-500" />
              Additional Images
            </label>
            {subImagesPreview.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {subImagesPreview.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200"
                  >
                    <img
                      src={img}
                      alt={`Preview ${idx}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
            <div className="relative">
              <input
                type="file"
                name="subImages"
                multiple
                onChange={handleImageChange}
                className="hidden"
                id="subImages"
              />
              <label
                htmlFor="subImages"
                className="flex items-center justify-center w-full p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 cursor-pointer transition-colors"
              >
                <ImageIcon size={18} className="mr-2 text-gray-500" />
                <span className="text-gray-600">
                  Choose new additional images
                </span>
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium flex items-center transition-colors"
            >
              <X size={18} className="mr-1" />
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center transition-colors"
              disabled={loading}
            >
              {loading ? (
                <Loader size={18} className="mr-1 animate-spin" />
              ) : (
                <Save size={18} className="mr-1" />
              )}
              Update Service
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ProductsService = ({ businessId }) => {
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({
    title: "",
    description: "",
    mainImage: null,
    subImages: [],
  });
  const [toast, setToast] = useState({ message: "", type: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [subImagesPreview, setSubImagesPreview] = useState([]);
  const [isCreatingService, setIsCreatingService] = useState(false);

  useEffect(() => {
    fetchServices();
  }, [businessId]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:4000/api/services?businessId=${businessId}`
      );
      setServices(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching services:", error);
      showToast("Error fetching services", "error");
      setLoading(false);
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 5000);
  };

  const openUpdateModal = (service) => {
    setCurrentService(service);
    setIsModalOpen(true);
  };

  const closeUpdateModal = () => {
    setIsModalOpen(false);
    setCurrentService(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewService((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const { name, files } = e.target;

    if (name === "mainImage" && files[0]) {
      setMainImagePreview(URL.createObjectURL(files[0]));
    }

    if (name === "subImages" && files.length) {
      const newPreviews = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setSubImagesPreview(newPreviews);
    }

    setNewService((prev) => ({
      ...prev,
      [name]: files,
    }));
  };

  const resetForm = () => {
    setNewService({
      title: "",
      description: "",
      mainImage: null,
      subImages: [],
    });
    setMainImagePreview(null);
    setSubImagesPreview([]);
  };

  const createService = async (e) => {
    e.preventDefault();
    setIsCreatingService(true);

    const formData = new FormData();
    formData.append("title", newService.title);
    formData.append("description", newService.description);
    formData.append("businessId", businessId);

    if (newService.mainImage) {
      formData.append("mainImage", newService.mainImage[0]);
    }
    if (newService.subImages) {
      Array.from(newService.subImages).forEach((image) => {
        formData.append("subImage", image);
      });
    }

    try {
      const response = await axios.post(
        "http://localhost:4000/api/services/create",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      showToast("Service created successfully", "success");
      setServices([...services, response.data.service]);
      resetForm();
    } catch (error) {
      console.error("Error creating service:", error);
      showToast("Error creating service", "error");
    } finally {
      setIsCreatingService(false);
    }
  };

  const updateService = async (serviceId, updatedData) => {
    const formData = new FormData();
    formData.append("title", updatedData.title);
    formData.append("description", updatedData.description);
    formData.append("businessId", businessId);

    if (updatedData.mainImage) {
      formData.append("mainImage", updatedData.mainImage[0]);
    }
    if (updatedData.subImages) {
      Array.from(updatedData.subImages).forEach((image) => {
        formData.append("subImage", image);
      });
    }

    try {
      const response = await axios.put(
        `http://localhost:4000/api/services/${serviceId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      showToast("Service updated successfully", "success");
      setServices(
        services.map((service) =>
          service.id === serviceId ? response.data.service : service
        )
      );
      closeUpdateModal();
    } catch (error) {
      console.error("Error updating service:", error);
      showToast("Error updating service", "error");
      throw error;
    }
  };

  const deleteService = async (serviceId) => {
    if (!window.confirm("Are you sure you want to delete this service?"))
      return;

    try {
      await axios.delete(`http://localhost:4000/api/services/${serviceId}`);
      showToast("Service deleted successfully", "success");
      setServices(services.filter((service) => service.id !== serviceId));
    } catch (error) {
      console.error("Error deleting service:", error);
      showToast("Error deleting service", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "" })}
      />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-2 text-gray-800">
            Services Dashboard
          </h1>
          <p className="text-center text-gray-600 mb-12">
            Manage and showcase the services for Business #{businessId}
          </p>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Create Service Form */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-8">
                <div className="flex items-center mb-6">
                  <PlusCircle size={24} className="text-blue-600 mr-2" />
                  <h3 className="text-2xl font-bold text-gray-800">
                    Create Service
                  </h3>
                </div>

                <form onSubmit={createService} className="space-y-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Service Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={newService.title}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                      placeholder="Enter service title"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Service Description
                    </label>
                    <textarea
                      name="description"
                      value={newService.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                      placeholder="Enter service description"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2  items-center">
                      <Camera size={18} className="mr-2 text-blue-500" />
                      Main Image
                    </label>
                    {mainImagePreview && (
                      <div className="relative mb-3 w-full h-48 rounded-lg overflow-hidden border border-gray-200">
                        <img
                          src={mainImagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="relative">
                      <input
                        type="file"
                        name="mainImage"
                        onChange={handleImageChange}
                        className="hidden"
                        id="createMainImage"
                        required
                      />
                      <label
                        htmlFor="createMainImage"
                        className="flex items-center justify-center w-full p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 cursor-pointer transition-colors"
                      >
                        <ImageIcon size={18} className="mr-2 text-gray-500" />
                        <span className="text-gray-600">Choose main image</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2  items-center">
                      <ImageIcon size={18} className="mr-2 text-blue-500" />
                      Additional Images
                    </label>
                    {subImagesPreview.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {subImagesPreview.map((img, idx) => (
                          <div
                            key={idx}
                            className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200"
                          >
                            <img
                              src={img}
                              alt={`Preview ${idx}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="relative">
                      <input
                        type="file"
                        name="subImages"
                        multiple
                        onChange={handleImageChange}
                        className="hidden"
                        id="createSubImages"
                      />
                      <label
                        htmlFor="createSubImages"
                        className="flex items-center justify-center w-full p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 cursor-pointer transition-colors"
                      >
                        <ImageIcon size={18} className="mr-2 text-gray-500" />
                        <span className="text-gray-600">
                          Choose additional images
                        </span>
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center transition-colors"
                    disabled={isCreatingService}
                  >
                    {isCreatingService ? (
                      <>
                        <Loader size={18} className="mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <PlusCircle size={18} className="mr-2" />
                        Create Service
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Service List */}
            <div className="lg:w-2/3">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800">
                  All Services
                </h3>
                {loading && (
                  <div className="flex items-center text-blue-600">
                    <Loader size={18} className="animate-spin mr-2" />
                    <span>Loading...</span>
                  </div>
                )}
              </div>

              {services.length === 0 && !loading ? (
                <div className="bg-white rounded-xl shadow-md p-12 text-center">
                  <ImageIcon size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-xl text-gray-500 mb-2">
                    No services available
                  </p>
                  <p className="text-gray-400">
                    Create your first service to get started
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                    >
                      <div className="relative h-56 overflow-hidden">
                        <img
                          src={`http://localhost:4000/uploads/${service.mainImage}`}
                          alt={service.title}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>

                      <div className="p-6">
                        <h4 className="text-xl font-bold text-gray-800 mb-2">
                          {service.title}
                        </h4>
                        <p className="text-gray-600 mb-6 line-clamp-3">
                          {service.description}
                        </p>

                        {service.subImage && (
                          <div className="mb-6">
                            <p className="text-sm font-medium text-gray-500 mb-2">
                              Additional Images
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {service.subImage
                                .split(", ")
                                .map((image, index) => (
                                  <div
                                    key={index}
                                    className="w-14 h-14 rounded-md overflow-hidden border border-gray-200"
                                  >
                                    <img
                                      src={`http://localhost:4000/uploads/${image}`}
                                      alt={`${service.title} - ${index}`}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}

                        <div className="flex justify-between pt-4 border-t border-gray-100">
                          <button
                            onClick={() => deleteService(service.id)}
                            className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 font-medium flex items-center transition-colors"
                          >
                            <Trash2 size={16} className="mr-1" />
                            Delete
                          </button>
                          <button
                            onClick={() => openUpdateModal(service)}
                            className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 font-medium flex items-center transition-colors"
                          >
                            <Edit size={16} className="mr-1" />
                            Update
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <UpdateServiceModal
        isOpen={isModalOpen}
        service={currentService}
        onClose={closeUpdateModal}
        onUpdate={updateService}
      />
    </div>
  );
};

export default ProductsService;
