import { ChangeEvent, Dispatch, SetStateAction } from "react";

interface IProps {
  setter: Dispatch<SetStateAction<string>>;
  getter: string;
}

export default function ExpandingTextbox({ setter, getter }: IProps) {
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setter(event.target.value);
  };

  const autoExpand = (element: HTMLTextAreaElement) => {
    element.style.height = "auto";
    element.style.height = `${element.scrollHeight}px`;
  };

  const handleInput = (event: React.FormEvent<HTMLTextAreaElement>) => {
    if (event.target instanceof HTMLTextAreaElement) {
      autoExpand(event.target);
    }
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
