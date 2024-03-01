import { useEffect, useState } from "react";
import showToast, { Mode } from "../../utils/utils";

interface IProps {
  keywords: string[];
  fn: (kw: string, addOrRemove: string) => void;
}

export default function KeywordAdd({ keywords, fn }: IProps) {
  const [keyword, setKeyword] = useState<string>("");
  const [lowercaseKeywords, setLowercaseKeywords] = useState<string[]>([]);

  useEffect(() => {
    const lowercaseKeywordsArray = keywords.map((kw) => kw.toLowerCase());
    setLowercaseKeywords(lowercaseKeywordsArray);
  }, [keywords]);

  return (
    <div style={{ margin: "0 8em" }}>
      <div style={{ marginBottom: "2em" }}>Add keyword</div>
      <input
        maxLength={12}
        name="keyword"
        className="formInput"
        style={{ width: "80%" }}
        type="text"
        placeholder="Optional"
        onChange={(e) => {
          const inputValue = e.target.value.trim().replace(/[^a-zA-Z0-9]/g, "");

          setKeyword(inputValue);
        }}
        value={keyword}
      />
      <button
        className="formInput"
        style={{ width: "20%" }}
        onClick={() => {
          if (
            keyword.length > 0 &&
            !lowercaseKeywords.includes(keyword.toLowerCase())
          ) {
            if (keywords.join(";").length + keyword.length > 255) {
              showToast("Maximum keywords reached!", Mode.Error);
            } else {
              fn(keyword, "add");
              setKeyword("");
            }
          } else {
            if (keyword.length == 0) {
              showToast("Please enter a keyword first", Mode.Warning);
            } else {
              showToast(
                "This keyword already exists for this sculpture!",
                Mode.Warning
              );
            }
          }
        }}
      >
        Add
      </button>
    </div>
  );
}
