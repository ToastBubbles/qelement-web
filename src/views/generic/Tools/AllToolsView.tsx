import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { AppContext } from "../../../context/context";
import { Link } from "react-router-dom";

export default function AllToolsView() {
  return (
    <>
      <div className="formcontainer">
        <h1>tools</h1>
        <div className="mainform">
          <div className="w-100 d-flex flex-col ai-center">
            <Link className="link" to="/tools/compare">
              Image Comparison Tool
            </Link>
            <Link className="link" to="/tools/userLookup">
              User lookup
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
