import React, { useEffect, useState } from "react";

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
    <div>
      <h1>{message}</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {products.length === 0 ? (
            <p>No products found.</p>
          ) : (
            products.map((product) => (
              <div
                key={product.id}
                style={{
                  border: "1px solid #ccc",
                  padding: 16,
                  marginBottom: 16,
                }}
              >
                <h2>{product.title}</h2>
                <img
                  src={product.mainImage}
                  alt={product.title}
                  style={{ width: 200, height: "auto" }}
                />
                <p>{product.description}</p>
                <p>Category: {product.category}</p>
                <p>Sub-category: {product.subCategory}</p>
                <p>Status: {product.status}</p>
                <p>Contact: {product.contact}</p>
                <p>Address: {product.address}</p>
                <div>
                  <strong>Other Images:</strong>
                  <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                    {product.otherImages.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`Other ${index}`}
                        style={{ width: 100, height: "auto" }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default UserProduct;
