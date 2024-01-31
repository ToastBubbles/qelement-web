import { Link } from "react-router-dom";
import NewAdditions from "../../components/NewAdditions";
import PartOfTheDay from "../../components/PartOfTheDay";
// import SiteStats from "../../components/SiteStats";

export default function Home() {
  return (
    <>
      <div className="w-100 new-container">
        <div className="jumbotron">
          <div className="welcome">welcome to</div>
          <div className="text-logo welcome-logo">
            <div>
              <span className="lt-red">q</span>
              <span className="lt-grey">element</span>
            </div>
          </div>

          <Link to="/about" className="jumbo-btn link clickable">
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
              {/* <div className="listing news-listing"></div> */}
              <PartOfTheDay />
              {/* <SiteStats /> */}
            </div>
          </div>
          <div className="hp-panel hp-panel-center">
            <div className="hp-panel-header">
              <div className="head-line"></div>
              <div className="hp-panel-header-text">new parts</div>
              <div className="head-line"></div>
            </div>
            <NewAdditions type="qpart" />
          </div>
          <div className="hp-panel">
            <div className="hp-panel-header">
              <div className="head-line"></div>
              <div className="hp-panel-header-text">new sculptures</div>
              <div className="head-line"></div>
            </div>
            <NewAdditions type="sculpture" />
            <div className="hp-panel-body">
              {/* <div className="listing recent-change">
                Changelog is coming soon!
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
