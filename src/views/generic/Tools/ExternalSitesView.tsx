export default function ExternalSitesView() {
  return (
    <>
      <div className="formcontainer">
        <h1>Resources</h1>
        <div className="mainform">
          <div className="grey-txt" style={{ marginBottom: "1em" }}>
            The following are external links
          </div>
          <div className="d-flex flex-col ai-center">
            <a
              style={{ margin: "0.5em 0" }}
              className="link"
              href="https://ryliehowerter.net/colors.php"
            >
              Rylie's Color List
            </a>
            <a
              style={{ margin: "0.5em 0" }}
              className="link"
              href="https://bricknerd.com/home/every-type-of-plastic-used-by-lego-5-20-22"
            >
              Every Type of Plastic Used By LEGO (bricknerd.com)
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
