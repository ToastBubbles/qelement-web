import axios from "axios";
import Cookies from "js-cookie";
import { useContext } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { AppContext } from "../context/context";
import { Types } from "../context/jwt/reducer";
import { IAPIResponse } from "../interfaces/general";
import showToast, { Mode } from "../utils/utils";

export default function NotificationPopdown() {
  return <div className={"notif-pop-down"}>NOTIFGICVASDO</div>;
}
