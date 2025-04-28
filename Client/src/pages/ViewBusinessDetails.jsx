import React from "react";
import { useParams } from "react-router-dom";
import BusinessDetails from "../components/business/BusinessDetails";
import AddBusinessReview from "../components/business/AddBusinessReview";

const ViewBusinessDetails = () => {
  const { id } = useParams();
  console.log("Business ID:", id);

  return (
    <div className=" mx-auto p-6 space-y-12">
      {/* Business Details Section */}
      <div className="bg-white p-6 rounded-lg ">
        <BusinessDetails id={id} />
      </div>

      {/* Add Business Review Section */}
      <div className="bg-white p-6 rounded-lg ">
        <AddBusinessReview id={id} />
      </div>
    </div>
  );
};

export default ViewBusinessDetails;
