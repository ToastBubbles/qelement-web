export default function About() {
  return (
    <>
      <div className="page-content-wrapper">
        <div className="page-content">
          <h1>What is qelement?</h1>
          <div style={{ marginBottom: "1em" }}>
            qelement is a LEGO fan website designed to document and keep track
            of non-production LEGO parts. There is a variety of non-production
            parts, see below for a breakdown:
          </div>
          <ul className="about-ul">
            <li>
              <span>Q-element:</span> this generally refers to an existing part
              that was produced in a specific color for model builders in
              LEGOLAND or something similar, but were never released to the
              public in this part/color combination, examples of this would be
              any non-DUPLO part in Warm Yellowish Orange. Also known as a
              "q-part"
            </li>
            <li>
              <span>Prototype:</span> this typically refers to a part in the
              development stage, this could mean that the part was produced in a
              different color to help identify imperfections (most often red or
              trans-clear) or it could refer to a mold or element that was never
              used as an official release part. An example would be Sea-Tron
              parts.
            </li>
            <li>
              <span>Test:</span> this is reserved for test bricks and parts,
              mostly 2x4 bricks like 7xC, 8xC, 8xF, ABCD, bricks with 'TEST'
              molded on them, and any other similar variety
            </li>
            <li>
              <span>Nightshift:</span> this refers to re-colored parts that were
              produced by rogue LEGO Factory employees. These are typically
              highly sought-after parts like Minifigure parts and accessories,
              Darth Vader is one of the more notable examples of this. These are
              commonly referred to as 'prototypes'
            </li>
            <li>
              <span>Employee:</span> this refers to employee gifts, typically
              just Chrome Gold parts
            </li>

            <li>
              <span>Other/Unknown:</span> this is a catch-all for unique cases
              where a part might not fit into any of the above categories. An
              example of this might be the "Trans-Medium Green" 1x6 and 1x8
              Bricks.
            </li>
          </ul>
          <div style={{ marginBottom: "1em" }}>
            Additionally, we keep track of each part's status to help users know
            what to expect when hunting for these non-production parts. Here is
            a breakdown of the statuses we use:
          </div>
          <ul className="about-ul">
            <li>
              <span>ID Only:</span> typically The LEGO Group assigns an Element
              ID to each element, this is a unique number that represents the
              part/color comnbination. Some parts may have multiple Element IDs,
              this could be because the part was discontinued, then
              reintroduced, or it could be a minor design change. Sometimes we
              have element IDs for parts we have never seen, this hints at their
              existence, but there is a possiblity that these parts never turn
              up. Not all known/found parts have known element IDs.
            </li>
            <li>
              <span>Seen:</span> this is assigned to parts that have been seen
              in a model/display, but have not been found/collected. Take these
              with a grain of salt, the part could have been mis-identified due
              to lighting, damage, or obstruction.
            </li>
            <li>
              <span>Found:</span> this refers to a part that has been
              found/collected, but have not been released in an official set.
            </li>
            <li>
              <span>Known:</span> this refers to a part that has seen an offical
              release in a set or through Shop-At-Home Pick a Brick. Sometimes
              Q-elements eventually get released, and become 'known' parts, an
              example of this would be Dark Brown 3001
            </li>
            <li>
              <span>Other/Unknown:</span> this is a catch-all for unique cases
              where a part might not fit into any of the above categories. A
              good usecase would be rumoured parts that don't have a known
              element ID.
            </li>
          </ul>
          <h2>How do we keep track of these parts?</h2>
          <div>
            In order to keep track of all these variations while still remaining
            relatively organized, we have designed the following relational
            chart.
          </div>
          <div className="d-flex jc-center" style={{ margin: "3em 0" }}>
            <img src={"/public/img/db_chart.png"} />
          </div>

          <h2>Who is behind qelement?</h2>
          <div>
            theqelement.com was designed, developed, and moderated by Jeffrey
            Neal. I am a Web Developer who is very passionate about LEGO and
            collecting rare and non-production parts. I was already keeping
            track of quite a few Q-elements in a personal Excel sheet, but as my
            interest grew, I decided to publish my findings and allow others to
            contribute as well. If you found my website helpful, I would greatly
            appriciate if you considered becoming a Patron! It helps cover the
            hosting fees and keep theqelement.com ad-free. Plus I have some neat
            little perks set up!
          </div>
        </div>
      </div>
    </>
  );
}
