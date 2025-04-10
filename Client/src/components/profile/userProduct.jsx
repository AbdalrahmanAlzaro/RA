import React, { useEffect, useState } from "react";
import {
  Package2,
  Loader2,
  ShoppingBag,
  MapPin,
  Phone,
  Tag,
  FileText,
  AlertCircle,
} from "lucide-react";

function UserProduct() {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const BASE_URL = "http://localhost:4000/";

  useEffect(() => {
    const fetchUserProducts = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:4000/api/user-products", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          const modifiedProducts = data.products.map((product) => ({
            ...product,
            mainImage: BASE_URL + product.mainImage,
            otherImages: product.otherImages
              ? product.otherImages.split(",").map((img) => BASE_URL + img)
              : [],
          }));
          setProducts(modifiedProducts);
          setMessage(data.message);
        } else {
          setMessage(data.message || "Failed to fetch products.");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setMessage("Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProducts();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <ShoppingBag className="text-indigo-600" size={24} />
          My Products
        </h1>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
          <p className="text-gray-600">Loading your products...</p>
        </div>
      ) : (
        <div>
          {products.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-lg">
              <Package2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">No products found.</p>
              <p className="text-gray-500 mt-2">
                You haven't added any products yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="relative aspect-video overflow-hidden bg-gray-100">
                    <img
                      src={product.mainImage}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          product.status === "Available"
                            ? "bg-green-100 text-green-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {product.status}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">
                      {product.title}
                    </h2>

                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <Tag size={16} className="mr-1 text-indigo-500" />
                      <span className="mr-2">{product.category}</span>
                      {product.subCategory && (
                        <>
                          <span className="mx-1 text-gray-400">•</span>
                          <span>{product.subCategory}</span>
                        </>
                      )}
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {product.description}
                    </p>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Phone size={16} className="mr-2 text-gray-500" />
                        <span>{product.contact}</span>
                      </div>

                      <div className="flex items-start text-gray-600">
                        <MapPin
                          size={16}
                          className="mr-2 mt-1 flex-shrink-0 text-gray-500"
                        />
                        <span className="line-clamp-1">{product.address}</span>
                      </div>
                    </div>

                    {product.otherImages && product.otherImages.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Additional Images
                        </p>
                        <div className="flex gap-2 overflow-x-auto pb-2">
                          {product.otherImages.map((img, index) => (
                            <img
                              key={index}
                              src={img}
                              alt={`${product.title} - Image ${index + 1}`}
                              className="w-16 h-16 object-cover rounded border border-gray-200 flex-shrink-0"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default UserProduct;
