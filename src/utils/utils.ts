import { toast } from "react-toastify";
import { IPartStatusDTO, ImageDTO, color } from "../interfaces/general";

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
export const imagePath = "http://localhost:9000/q-part-images/";
export function filterImages(images: ImageDTO[]): ImageDTO[] {
  if (images) return images.filter((obj) => obj.approvalDate !== null);
  return images;
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
export function sortStatus(statuses: IPartStatusDTO[]): IPartStatusDTO[] {
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
  const output = statuses.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);

    const valueA = getValue(a.status);
    const valueB = getValue(b.status);
    if (dateA.getTime() === dateB.getTime()) {
      return valueB - valueA;
    }
    return dateB.getTime() - dateA.getTime();
  });
  return output;
}

export function formatDate(dateStr: string) {
  const date = new Date(dateStr);

  const now_utc = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes()
  );

  const thisdate = new Date(now_utc);
  return (
    thisdate.toDateString() +
    " @ " +
    thisdate.toLocaleTimeString().replace(":00 ", " ")
  );
}
