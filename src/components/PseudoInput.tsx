import { useState } from "react";

interface IProps {}

export default function PseudoInput({}: IProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState("");

  const handleFocus = () => {
    console.log("focus");
    setIsEditing(true);
  };

  const handleBlur = () => {
    console.log("blur");
    if (text.length == 0) setIsEditing(false);
  };

  const showPlaceholder = () => {
    return !isEditing && text.length === 0;
  };

  const handleInput = (e: React.FormEvent<HTMLParagraphElement>) => {
    const inputText = e.currentTarget.textContent || "";
    const normalizedText = inputText.normalize("NFC");
    setText(normalizedText);

    const selection = window.getSelection();

    if (selection) {
      const range = document.createRange();
      range.selectNodeContents(e.currentTarget);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };

  return (
    <div className="pseudo-input-container">
      <div
        onFocus={handleFocus}
        onBlur={handleBlur}
        onInput={handleInput}
        contentEditable
        suppressContentEditableWarning={true}
        className={"pseudo-input"}
        style={{ padding: "5px" }}
      >
        {text}
      </div>
      <div
        className={`pseudo-placeholder ${showPlaceholder() ? "" : "hidden"}`}
      >
        Write a comment
      </div>
    </div>
  );
}
