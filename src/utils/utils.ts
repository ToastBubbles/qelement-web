import { toast } from "react-toastify";
import {
  ICommentDTO,
  IPartStatusDTO,
  ImageDTO,
  color,
  colorWSimilar,
} from "../interfaces/general";
import tinycolor from "tinycolor2";

export enum Mode {
  Success,
  Warning,
  Error,
  Info,
}

export default function showToast(message: string, mode: Mode = Mode.Success) {
  switch (mode) {
    case Mode.Success: {
      toast.success(message, {
        className: "custom-toast",
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "colored",
      });
      break;
    }
    case Mode.Info: {
      toast.info(message, {
        className: "custom-toast",
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "colored",
      });
      break;
    }
    case Mode.Warning: {
      toast.warn(message, {
        className: "custom-toast",
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "colored",
      });
      break;
    }
    case Mode.Error: {
      toast.error(message, {
        className: "custom-toast",
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "colored",
      });
      break;
    }
  }
}
export function getPrefColorIdString(
  col: color | colorWSimilar | undefined,
  pref: string
): string {
  if (col == undefined) return "";
  let output = -1;

  if (pref == "bl") {
    if (col.bl_id) {
      output = col.bl_id;
    }
  } else if (pref == "tlg") {
    if (col.tlg_id) {
      output = col.tlg_id;
    }
  } else if (pref == "bo") {
    if (col.bo_id) {
      output = col.bo_id;
    }
  } else if (pref == "qe") {
    output = col.id;
  }
  if (output <= 0) {
    return "";
  }
  return output.toString();
}

export function filterString(inputString: string) {
  // Use a regular expression to replace characters other than a-z, A-Z, 0-9, and *
  const filteredString = inputString.replace(/[^a-zA-Z0-9]/g, "");
  return filteredString;
}

export function getPrefColorName(
  col: color | colorWSimilar | undefined,
  pref: string,
  nextBest: boolean = false
): string {
  if (col == undefined) return "No name";
  let nextBestStr = "";
  let isPreferred = false;
  let output = "No name";
  if (pref == "bl") {
    if (col.bl_name.length > 0) {
      output = col.bl_name;
      isPreferred = true;
    } else {
      if (col.tlg_name.length > 0) {
        output = col.tlg_name;
      } else if (col.bo_name.length > 0) {
        output = col.bo_name;
      }
    }
    if (nextBest) {
      if (col.tlg_name.length > 0) {
        output = col.tlg_name;
        nextBestStr = "TLG: ";
      } else {
        if (col.bo_name.length > 0) {
          output = col.bo_name;
          nextBestStr = "BO: ";
        }
      }
    }
  } else if (pref == "tlg") {
    if (col.tlg_name.length > 0) {
      output = col.tlg_name;
      isPreferred = true;
    } else {
      if (col.bl_name.length > 0) {
        output = col.bl_name;
      } else if (col.bo_name.length > 0) {
        output = col.bo_name;
      }
    }
    if (nextBest) {
      if (col.bl_name.length > 0) {
        output = col.bl_name;
        nextBestStr = "BL: ";
      } else {
        if (col.bo_name.length > 0) {
          output = col.bo_name;
          nextBestStr = "BO: ";
        }
      }
    }
  } else if (pref == "bo") {
    if (col.bo_name.length > 0) {
      output = col.bo_name;
      isPreferred = true;
    } else {
      if (col.bl_name.length > 0) {
        output = col.bl_name;
      } else if (col.tlg_name.length > 0) {
        output = col.tlg_name;
      }
    }
    if (nextBest) {
      if (col.tlg_name.length > 0) {
        output = col.tlg_name;
        nextBestStr = "TLG: ";
      } else {
        if (col.bl_name.length > 0) {
          output = col.bl_name;
          nextBestStr = "BL: ";
        }
      }
    }
  }
  if (!nextBest) {
    if (isPreferred) {
      return output;
    } else {
      return output + "*";
    }
  } else {
    return nextBestStr + output;
  }
}

export function getTextColor(
  hex: string,
  invert: boolean = false,
  softColors: boolean = false
): string {
  const light = softColors ? "#32363d" : "#000";
  const dark = "#FFF";
  if (hex == "UNKNWN") {
    return light;
  }
  const bgColor = tinycolor(hex);
  if (invert) return !bgColor.isLight() ? light : dark;
  return bgColor.isLight() ? light : dark;
}
export const imagePath = "http://localhost:9000/q-part-images/";
export function filterImages(images: ImageDTO[]): ImageDTO[] {
  if (images) return images.filter((obj) => obj.approvalDate !== null);
  return images;
}

export function reduceFraction(numerator: number, denominator: number): string {
  // Find the greatest common divisor (GCD) using Euclid's algorithm
  const gcd = (a: number, b: number): number => {
    if (b === 0) return a;
    return gcd(b, a % b);
  };

  // Reduce the fraction by dividing both numerator and denominator by their GCD
  const divisor = gcd(numerator, denominator);
  const reducedNumerator = numerator / divisor;
  const reducedDenominator = denominator / divisor;

  // Return the reduced fraction as a string
  return `${reducedNumerator}/${reducedDenominator}`;
}

export function getProfilePicture(
  img: ImageDTO | null | undefined,
  showIfNotApproved = false
): string {
  let defaultPath = "/img/blank_profile.webp";
  if (img == null) return defaultPath;
  if (img.approvalDate == null) {
    if (showIfNotApproved) return imagePath + img.fileName;
    return defaultPath;
  }
  return imagePath + img.fileName;
}

export function validateSearch(col: color, query: string): boolean {
  let isNumber = false;
  // let numericValue: number;
  if (!isNaN(parseFloat(query)) && isFinite(Number(query))) {
    isNumber = true;
    // numericValue = parseFloat(query);
  } else {
    query = query.toLowerCase().trim();
  }
  if (!isNumber) {
    if (
      !query ||
      col.bl_name.toLowerCase().includes(query) ||
      col.tlg_name.toLowerCase().includes(query) ||
      col.bo_name.toLowerCase().includes(query) ||
      col.note.toLowerCase().includes(query)
    ) {
      return true;
    }
  } else {
    if (
      (col.bl_id && col.bl_id.toString().includes(query)) ||
      (col.tlg_id && col.tlg_id.toString().includes(query)) ||
      (col.bo_id && col.bo_id.toString().includes(query)) ||
      (col.id && col.id.toString().includes(query))
    )
      return true;
  }
  return false;
}
export function getTier(rating: number): string {
  let output: string;
  switch (true) {
    case rating == -1:
      output = "Not-Rated";
      break;
    case rating < 25:
      output = "Common";
      break;
    case rating < 45:
      output = "Uncommon";
      break;
    case rating < 60:
      output = "Rare";
      break;
    case rating < 85:
      output = "Exceptional";
      break;
    case rating < 95:
      output = "Legendary";
      break;
    case rating < 100:
      output = "Elusive";
      break;
    case rating == 100:
      output = "Unobtainable";
      break;
    default:
      output = "Error";
      break;
  }
  return output;
}
export function sortStatus(
  statuses: IPartStatusDTO[],
  includeNotApproved = false,
  reverse = false
): IPartStatusDTO[] {
  let filteredStatuses: IPartStatusDTO[];

  if (includeNotApproved) filteredStatuses = statuses;
  else filteredStatuses = statuses.filter((s) => s.approvalDate != null);

  function getValue(str: string): number {
    switch (str) {
      case "unknown":
        return 0;
      case "other":
        return 1;
      case "idOnly":
        return 2;
      case "seen":
        return 3;
      case "found":
        return 4;
      case "known":
        return 5;
      default:
        return 0;
    }
  }
  const output = filteredStatuses.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);

    const valueA = getValue(a.status);
    const valueB = getValue(b.status);
    if (dateA.getTime() === dateB.getTime()) {
      return valueB - valueA;
    }
    return dateB.getTime() - dateA.getTime();
  });
  if (reverse) return output.reverse();

  return output;
}
export function testStatus(status: string): boolean {
  const validStatuses = [
    "unknown",
    "idOnly",
    "seen",
    "found",
    "known",
    "other",
  ];
  return validStatuses.includes(status);
}
interface EntityWithCreatedAt {
  createdAt: string;
}

export function sortByCreatedAt<T extends EntityWithCreatedAt>(items: T[], ascending: boolean = true): T[] {
  const sortedItems = [...items].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      if (ascending) {
          return dateA - dateB;
      } else {
          return dateB - dateA;
      }
  });
  return sortedItems;
}

export function paginate<T>(
  items: T[],
  currentPage: number,
  itemsPerPage: number
): T[] {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return items.slice(startIndex, endIndex);
}
export function sortCommentsByDate(
  comments: ICommentDTO[] | undefined
): ICommentDTO[] {
  if (comments) {
    return comments.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return dateA.getTime() - dateB.getTime();
    });
  }
  return [];
}
export function howLongAgo(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  let interval = Math.floor(seconds / 31536000);

  if (interval >= 1) {
    let s = interval == 1 ? "" : "s";
    return interval + ` year${s} ago`;
  }
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) {
    let s = interval == 1 ? "" : "s";
    return interval + ` month${s} ago`;
  }
  interval = Math.floor(seconds / 604800);
  if (interval >= 1) {
    let s = interval == 1 ? "" : "s";
    return interval + ` week${s} ago`;
  }
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) {
    let s = interval == 1 ? "" : "s";
    return interval + ` day${s} ago`;
  }
  interval = Math.floor(seconds / 3600);

  if (interval >= 1) {
    let s = interval == 1 ? "" : "s";
    return interval + ` hour${s} ago`;
  }
  interval = Math.floor(seconds / 60);
  if (interval >= 1) {
    let s = interval == 1 ? "" : "s";
    return interval + ` minute${s} ago`;
  }
  return "Just now";
}

export function formatDate(dateStr: string, mode: string = "short"): string {
  const date = new Date(dateStr);

  const now_utc = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes()
  );

  const thisdate = new Date(now_utc);

  if (mode === "long")
    return (
      thisdate.toDateString() +
      " @ " +
      thisdate.toLocaleTimeString().replace(":00 ", " ")
    );
  if (mode === "short") {
    const day = ("0" + date.getDate()).slice(-2); // Add leading zero if needed
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  }
  return dateStr;
}
