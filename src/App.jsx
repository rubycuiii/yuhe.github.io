import { useEffect } from "react";
import { Link, Navigate, Route, Routes, useLocation, useParams } from "react-router-dom";
import { projectBySlug, projects, researchArchive } from "./data/projects";

const homepageOrder = [
  "culture-free-pathogen-isolation",
  "fred-factory-mechatronics-upgrade",
  "electroporation-platform",
  "spiral-filtration",
  "bio-inspired-swimming",
  "click-beetle-robot",
  "doki-touch",
  "dymo",
  "magzic-organizer",
];

const homepageProjects = projects.slice().sort((a, b) => homepageOrder.indexOf(a.slug) - homepageOrder.indexOf(b.slug));

function assetUrl(path) {
  return path?.startsWith("/") ? `${import.meta.env.BASE_URL}${path.slice(1)}` : path;
}

function ScrollAndTitle() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    const slug = location.pathname.split("/").filter(Boolean).at(-1);
    const project = projectBySlug[slug];
    document.title = project ? `${project.shortTitle} — Yuhe Cui` : location.pathname === "/about" ? "About — Yuhe Cui" : "Yuhe Cui — Mechanical Engineer & Designer";
  }, [location.pathname]);
  return null;
}

function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="wordmark" to="/" aria-label="Yuhe Cui home">YC</Link>
      <nav aria-label="Primary navigation"><Link to="/">Work</Link><Link to="/about">About</Link></nav>
    </header>
  );
}

function Footer() {
  return <footer className="site-footer"><Link to="/about">About</Link><span>Publications</span><span>CV</span><span>Email</span></footer>;
}

function Home() {
  return (
    <main className="home-shell">
      <section className="intro" aria-labelledby="home-title">
        <p className="eyebrow">Yuhe Cui</p>
        <h1 id="home-title">Mechanical engineer and biomedical engineering researcher developing diagnostic systems, microfluidic technologies, and physical prototypes.</h1>
        <p className="current">PhD candidate in Mechanical Engineering at MIT, conducting biomedical engineering research in diagnostic sample preparation and bioseparation.</p>
        <div className="inline-links" aria-label="Areas"><span>Research</span><span>Design</span><Link to="/about">About</Link></div>
      </section>
      <section className="work-index" aria-labelledby="work-title">
        <h2 id="work-title">Selected work</h2>
        <div className="project-list">
          {homepageProjects.map((project) => (
            <Link className="project-row" to={`/work/${project.slug}`} key={project.slug}>
              <span className="project-year">{project.year}</span><span className="project-title"><span>{project.shortTitle}</span><small>{project.shortDescription}</small></span><span className="project-category">{project.category}</span><span className="project-arrow" aria-hidden="true">↗</span>
            </Link>
          ))}
        </div>
      </section>
      <section className="archive" aria-labelledby="archive-title">
        <h2 id="archive-title">Research archive</h2>
        {researchArchive.map((item) => <div className="archive-row" key={item.title}><div><h3>{item.title}</h3><p>{item.description}</p></div><span className="needed-inline">{item.status}</span></div>)}
      </section>
      <Footer />
    </main>
  );
}

function MediaItem({ item }) {
  if (item.needed) return <div className="media-needed" role="img" aria-label={`Image needed: ${item.needed}`}><span>[IMAGE NEEDED]</span><p>{item.needed}</p></div>;
  return <figure className="project-figure">{item.type === "video" ? <video src={assetUrl(item.src)} poster={assetUrl(item.poster)} controls playsInline preload="metadata" aria-label={item.alt} /> : <img src={assetUrl(item.src)} alt={item.alt} loading="lazy" />}{item.caption && <figcaption>{item.caption}</figcaption>}</figure>;
}

function MediaGrid({ media }) {
  return <div className={`media-grid media-count-${media.length}`}>{media.map((item, index) => <MediaItem item={item} key={item.src || item.needed || index} />)}</div>;
}

function Section({ section }) {
  return (
    <section className={`case-section${section.isNeeded ? " section-needed" : ""}`}>
      <div className="section-copy"><p className="section-number">{section.number}</p><div><h2>{section.title}</h2>{section.body?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></div>
      {section.mediaFirst && section.media && <MediaGrid media={section.media} />}
      {section.sequence && <ol className={`process-line process-count-${section.sequence.length}`} aria-label={`${section.title} process`}>{section.sequence.map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, "0")}</span>{step}</li>)}</ol>}
      {section.metrics && <div className="metrics">{section.metrics.map((metric) => <div className="metric" key={metric.value + metric.label}><strong>{metric.value}</strong><span>{metric.label}</span></div>)}</div>}
      {!section.mediaFirst && section.media && <MediaGrid media={section.media} />}
    </section>
  );
}

function ProjectPage() {
  const { slug } = useParams();
  const project = projectBySlug[slug];
  if (!project) return <Navigate to="/" replace />;
  return (
    <main className="project-page">
      <header className="project-hero">
        <div className="project-heading"><p className="eyebrow">{project.category} / {project.year}</p><h1>{project.title}</h1><p className="dek">{project.subtitle || project.shortDescription}</p></div>
        {project.heroImage && <figure className="hero-media"><img src={assetUrl(project.heroImage)} alt={project.heroAlt} /></figure>}
      </header>
      <section className="overview"><h2>Overview</h2><p>{project.shortDescription}</p><dl>{project.status && <div><dt>Status</dt><dd>{project.status}</dd></div>}<div><dt>Role</dt><dd>{project.role}</dd></div><div><dt>Methods / Tools</dt><dd>{project.tools}</dd></div>{project.collaborators && <div><dt>Collaborators</dt><dd>{project.collaborators}</dd></div>}<div><dt>Year</dt><dd>{project.year}</dd></div></dl></section>
      <div className="case-study">{project.sections.map((section) => <Section section={section} key={section.number + section.title} />)}</div>
      <nav className="project-end" aria-label="Case study navigation"><Link to="/">← All work</Link><Link to="/about">About Yuhe →</Link></nav>
      <Footer />
    </main>
  );
}

function About() {
  return (
    <main className="about-page">
      <header className="about-intro"><p className="eyebrow">About</p><h1>Yuhe Cui is a mechanical engineer, researcher, and designer currently pursuing a PhD in Mechanical Engineering at MIT.</h1><p>Her work spans physical product development, microfluidics, biological systems, simulation, experimentation, and human-centered design.</p></header>
      <section className="education"><h2>Education</h2><div className="education-row"><div><strong>MIT</strong><span>PhD Mechanical Engineering</span></div><time>2025–Present</time></div><div className="education-row"><div><strong>MIT</strong><span>SM Mechanical Engineering</span></div><time>2023–2025</time></div><div className="education-row"><div><strong>University of Illinois Urbana-Champaign</strong><span>BS Mechanical Engineering · BFA Industrial Design</span></div><time>2018–2023</time></div></section>
      <section className="skills-section" aria-labelledby="skills-title">
        <h2 id="skills-title">Skills</h2>
        <div className="skill-group"><h3>Laboratory and fabrication</h3><ul><li>PDMS microfluidic fabrication</li><li>PDMS–glass bonding using microwave oxygen-plasma and corona treatment</li><li>Plasma/sputter coating for SEM sample preparation</li><li>Epoxy and Loctite-based prototype assembly</li><li>Bacterial culture and particle-based capture experiments</li><li>Raman sample preparation and spectral analysis</li></ul></div>
        <div className="skill-group"><h3>Data analysis</h3><ul><li>Python data analysis and visualization</li><li>Experimental data analysis</li><li>Raman spectral processing</li><li>Machine-learning classification — ongoing</li><li>Statistical evaluation of classification performance — ongoing</li></ul></div>
      </section>
      <section className="about-links"><span>Selected publications</span><span>CV</span><span>Email</span></section><Footer />
    </main>
  );
}

export default function App() {
  return <><ScrollAndTitle /><SiteHeader /><Routes><Route path="/" element={<Home />} /><Route path="/about" element={<About />} /><Route path="/work/:slug" element={<ProjectPage />} /><Route path="*" element={<Navigate to="/" replace />} /></Routes></>;
}
