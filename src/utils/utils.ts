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

export function filterImages(images: ImageDTO[]): ImageDTO[] {
  return images.filter((obj) => obj.approvalDate !== null);
}



export function validateSearch(col: color, query: string): boolean {
  query = query.toLowerCase().trim();
  if (
    !query ||
    col.bl_name.toLowerCase().includes(query) ||
    col.tlg_name.toLowerCase().includes(query) ||
    col.bo_name.toLowerCase().includes(query) ||
    col.note.toLowerCase().includes(query)
  )
    return true;
  if (!isNaN(parseInt(query))) {
    if (
      col.bl_id.toString().includes(query) ||
      col.tlg_id.toString().includes(query)
    )
      return true;
  }
  return false;
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
  let output = statuses.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);

    const valueA = getValue(a.status);
    const valueB = getValue(b.status);
    if (dateA.getTime() === dateB.getTime()) {
      return valueB - valueA;
    }
    return dateB.getTime() - dateA.getTime();
  });
  console.log("output", output);

  return output;
}

export function formatDate(dateStr: string) {
  var date = new Date(dateStr);

  var now_utc = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes()
  );

  let thisdate = new Date(now_utc);
  return (
    thisdate.toDateString() +
    " @ " +
    thisdate.toLocaleTimeString().replace(":00 ", " ")
  );
}
