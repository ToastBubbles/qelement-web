import { Link } from "react-router-dom";
import NewAdditions from "../../components/NewAdditions";
import { useQuery } from "react-query";
import axios from "axios";
import { color, qpart } from "../../interfaces/general";
import PartOfTheDay from "../../components/PartOfTheDay";
import SiteStats from "../../components/SiteStats";

export default function Home() {
  return (
    <>
      <div className="w-100 new-container">
        <div className="jumbotron">
          <div className="welcome">welcome to</div>
          <div className="text-logo welcome-logo">
            <Link to="#">
              <span className="lt-red">q</span>
              <span>element</span>
            </Link>
          </div>

          <Link to="/about" className="jumbo-btn clickable">
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
              <SiteStats />
            </div>
          </div>
          <div className="hp-panel hp-panel-center">
            <div className="hp-panel-header">
              <div className="head-line"></div>
              <div className="hp-panel-header-text">new additions</div>
              <div className="head-line"></div>
            </div>
            <NewAdditions />
          </div>
          <div className="hp-panel">
            <div className="hp-panel-header">
              <div className="head-line"></div>
              <div className="hp-panel-header-text">changes</div>
              <div className="head-line"></div>
            </div>
            <div className="hp-panel-body">
              <div className="listing recent-change">
                Changelog is coming soon!
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
