import { toast } from "react-toastify";

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
