import React from "react";
import { useParams } from "react-router-dom";
import ProductsService from "../components/Service/ProductsService";

const Analytics = () => {
  const { businessId } = useParams();

  return (
    <div>
      <ProductsService businessId={businessId} />
    </div>
  );
};

export default Analytics;
