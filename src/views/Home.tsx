import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <div className="jumbotron">
        <div className="welcome">welcome to</div>
        <div className="text-logo welcome-logo">
          <Link to="#">
            <span className="lt-red">q</span>
            <span>element</span>
          </Link>
        </div>

        <Link to="#" className="jumbo-btn clickable">
          <div>
            What is qelement? <span>{">>"}</span>
          </div>
        </Link>
      </div>
      <div className="hp-low-container">
        <div className="hp-panel">
          <div className="hp-panel-header">
            <div className="head-line"></div>
            <div className="hp-panel-header-text">news</div>
            <div className="head-line"></div>
          </div>
          <div className="hp-panel-body">
            <div className="listing news-listing"></div>
          </div>
        </div>
        <div className="hp-panel hp-panel-center">
          <div className="hp-panel-header">
            <div className="head-line"></div>
            <div className="hp-panel-header-text">new additions</div>
            <div className="head-line"></div>
          </div>
          <div className="hp-panel-body">
            <div className="listing new-listing"></div>
          </div>
        </div>
        <div className="hp-panel">
          <div className="hp-panel-header">
            <div className="head-line"></div>
            <div className="hp-panel-header-text">changes</div>
            <div className="head-line"></div>
          </div>
          <div className="hp-panel-body">
            <div className="listing recent-change"></div>
          </div>
        </div>
      </div>
    </>
  );
}
