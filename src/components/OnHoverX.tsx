interface IProps {
  onClickFn: () => void;
  xOffest?: number;
  yOffest?: number;
}

export default function OnHoverX({
  onClickFn,
  xOffest = 2,
  yOffest = 2,
}: IProps) {
  return (
    <div
      style={{
        position: "absolute",
        top: `${yOffest}px`,
        right: `${xOffest}px`,
        cursor: "pointer",
        zIndex: 40,
      }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClickFn();
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
        }}
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="var(--lt-red)"
        className="bi bi-x"
        viewBox="0 0 16 16"
      >
        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
      </svg>
      <div className="white-fill"></div>
    </div>
  );
}
