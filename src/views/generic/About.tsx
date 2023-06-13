export default function About() {
  return (
    <>
      <div className="padded-container">
        <h1>What is qelement?</h1>
        <div style={{ marginBottom: "1em" }}>
          qelement is a LEGO fan website designed to document and keep track of
          non-production LEGO parts. There is a variety of non-production parts,
          see below for a breakdown:
        </div>
        <ul id="about">
          <li>
            <span>Q-element:</span> this generally refers to an existing part
            that was produced in a specific color for model builders in LEGOLAND
            or something similar, but were never released to the public in this
            part/color combination, examples of this would be any non-DUPLO part
            in Warm Yellowish Orange. Also known as a "q-part"
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
            <span>Nightshift:</span> this refers to re-colored parts that were
            produced by rogue LEGO Factory employees. These are typically highly
            sought-after parts like Minifigure parts and accessories, Darth
            Vader is one of the more notable examples of this. These are
            commonly referred to as 'prototypes'
          </li>
          <li>
            <span>Employee:</span> this refer to employee gifts, typically just
            Chrome Gold parts
          </li>
          <li>
            <span>Known:</span> this refers to a part that has seen an offical
            release in a set or through Pick a Brick. Sometimes Q-elements
            eventually get released, and become 'known' parts, an example of
            this would be Dark Brown 3001
          </li>
          <li>
            <span>Other:</span> this is a catch-all for unique cases where a
            part might not fit into any of the above categories. An example of
            this might be the "Trans-Medium Green" 1x6 and 1x8 Bricks.
          </li>
        </ul>
        <h2>Who is behind qelement?</h2>
        <div>
          theqelement.com was designed, developed, and moderated by Jeffrey
          Neal. I am a Web Developer who is very passionate about LEGO and
          collecting rare and non-production parts. I was already keeping track
          of quite a few Q-elements in a personal Excel sheet, but as my
          interest grew, I decided to publish my findings and allow others to
          contribute as well. If you found my website helpful, I would greatly
          appriciate if you considered becoming a Patron! It helps cover the
          hosting fees and keep theqelement.com ad-free. Plus I have some neat
          little perks set up!
        </div>
      </div>
    </>
  );
}
