import React from "react";
import CreateSubUserForm from "../components/CreateSubUserForm";
import SubUserListing from "../components/SubUserListing";


export const SubUser = () => {
  return (
    <>
      <CreateSubUserForm/>
      <SubUserListing title={"Sub User Listing"}/>
    </>
  );
};
