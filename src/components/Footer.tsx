import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer-container">
      {/* <div className="footer-top">
        <div className="footer-top-left"></div>
        <div className="footer-top-right">
          <a
            href="https://www.patreon.com/qelement"
            target="_blank"
            className="lt-grey"
          >
            Support us on Patreon{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="patreon"
              height="0.9em"
              viewBox="0 0 512 512"
            >
              <path d="M512 194.8c0 101.3-82.4 183.8-183.8 183.8-101.7 0-184.4-82.4-184.4-183.8 0-101.6 82.7-184.3 184.4-184.3C429.6 10.5 512 93.2 512 194.8zM0 501.5h90v-491H0v491z" />
            </svg>
          </a>
        </div>
      </div> */}
      <div className="footer-bottom">
        <div>
          <ul className="footer-horz-ul">
            <li>
              <Link className="lt-grey" to="/">
                Home
              </Link>
            </li>
            <li>
              <Link className="lt-grey" to="/about">
                About Us
              </Link>
            </li>
            <li>
              <Link className="lt-grey" to="/contact">
                Contact Us
              </Link>
            </li>
            <li>
              <Link className="lt-grey" to="/terms">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link className="lt-grey" to="/privacy">
                Privacy Policy
              </Link>
            </li>
            <li>
              {" "}
              <a
                href="https://www.patreon.com/qelement"
                target="_blank"
                className="lt-grey"
              >
                Support us on Patreon{" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="patreon"
                  height="0.9em"
                  viewBox="0 0 512 512"
                >
                  <path d="M512 194.8c0 101.3-82.4 183.8-183.8 183.8-101.7 0-184.4-82.4-184.4-183.8 0-101.6 82.7-184.3 184.4-184.3C429.6 10.5 512 93.2 512 194.8zM0 501.5h90v-491H0v491z" />
                </svg>
              </a>
            </li>
          </ul>
        </div>
        By using this site you are agreeing to the TOS. qelement and the
        qelement logo are a trademark of Jeffrey Neal. LEGO, Bricklink, and
        BrickOwl are separeate trademarks that are not affiliated with qelement.
        Any images hosted by this site are property of the uploader, not
        qelement. This website is for informational purposes only.
      </div>
    </footer>
  );
}

export default Footer;
