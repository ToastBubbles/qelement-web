import  { Dispatch, SetStateAction } from "react";

interface IProps {
  setter: Dispatch<SetStateAction<string>>;
  getter: string;
}

export default function ExpandingTextbox({ setter, getter }: IProps) {
  // const [value, setValue] = useState("");

  const handleChange = (event: any) => {
    // setValue(event.target.value);
    setter(event.target.value);
  };

  const autoExpand = (element: any) => {
    element.style.height = "auto";
    element.style.height = `${element.scrollHeight}px`;
  };

  const handleInput = (event: any) => {
    autoExpand(event.target);
  };

  return (
    <textarea
      maxLength={1000}
      placeholder="Add a comment..."
      value={getter}
      onChange={handleChange}
      className="expandabletextbox"
      onInput={handleInput}
    />
  );
}
