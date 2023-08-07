

function Navpane() {
  return (
    <>
      <form id="search-form-left" action="/ads">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          fill="currentColor"
          className="bi bi-search zen-search-icon"
          viewBox="0 0 16 16"
        >
          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
        </svg>

        <input
          id="searchbar-left"
          name="searchbar-left"
          type="text"
          placeholder="Search..."
        />
      </form>
      <ul className="nav-pane">
        <li>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi-caret-right-fill"
            viewBox="0 0 16 16"
          >
            <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
          </svg>
          Plants
        </li>
        <li>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi-caret-down-fill"
            viewBox="0 0 16 16"
          >
            <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
          </svg>
          Bricks
          <ul className="bricks">
            <li>
              <a href="#">brick 1</a>
            </li>
            <li>
              <a href="#">brick 2</a>
            </li>
            <li>
              <a href="#">brick 3</a>
            </li>
            <li>
              <a href="#">brick 4</a>
            </li>
            <li>
              <a href="#">brick 5</a>
            </li>
            <li>
              <a href="#">brick 6</a>
            </li>
            <li>
              <a href="#">brick 7</a>
            </li>
          </ul>
        </li>
        <li>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi-caret-down-fill"
            viewBox="0 0 16 16"
          >
            <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
          </svg>
          Plates
          <ul className="plates">
            <li>
              <a href="#">plate 1</a>
            </li>
            <li>
              <a href="#">plate 2</a>
            </li>
            <li>
              <a href="#">plate 3</a>
            </li>
            <li>
              <a href="#">plate 4</a>
            </li>
            <li>
              <a href="#">plate 5</a>
            </li>
            <li>
              <a href="#">plate 6</a>
            </li>
            <li>
              <a href="#">plate 7</a>
            </li>
            <li>
              <a href="#">plate 8</a>
            </li>
            <li>
              <a href="#">plate 9</a>
            </li>
          </ul>
        </li>
        <li>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi-caret-right-fill"
            viewBox="0 0 16 16"
          >
            <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
          </svg>
          Baseplates
        </li>
        <li>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi-caret-right-fill"
            viewBox="0 0 16 16"
          >
            <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
          </svg>
          Accessories
        </li>
      </ul>
    </>
  );
}

export default Navpane;
