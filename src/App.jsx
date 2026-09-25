import { useEffect } from "react";
import { Link, Navigate, Route, Routes, useLocation, useParams } from "react-router-dom";
import { projectBySlug } from "./data/projects";

const researchOrder = [
  "culture-free-pathogen-isolation",
  "electroporation-platform",
  "spiral-filtration",
  "bio-inspired-swimming",
];

const designOrder = [
  "doki-touch",
  "dymo",
];

const archiveOrder = [
  "click-beetle-robot",
  "magzic-organizer",
  "thermal-fluid-research",
];

const selectProjects = (order) => order.map((slug) => projectBySlug[slug]).filter(Boolean);

function assetUrl(path) {
  return path?.startsWith("/") ? `${import.meta.env.BASE_URL}${path.slice(1)}` : path;
}

function ScrollAndTitle() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    const slug = location.pathname.split("/").filter(Boolean).at(-1);
    const project = projectBySlug[slug];
    document.title = project ? `${project.shortTitle} — Yuhe Cui` : location.pathname === "/about" ? "About — Yuhe Cui" : "Yuhe Cui — Mechanical Engineer, Researcher & Designer";
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
  return <footer className="site-footer"><Link to="/about">About</Link><Link to="/about">Publications</Link><a href="mailto:yuhecui@mit.edu">Email</a></footer>;
}

function ProjectIndex({ id, eyebrow, title, description, projects, compact = false }) {
  return (
    <section className={`work-index${compact ? " work-index-compact" : ""}`} aria-labelledby={id}>
      <div className="index-heading"><p>{eyebrow}</p><div><h2 id={id}>{title}</h2>{description && <p>{description}</p>}</div></div>
      <div className="project-list">
        {projects.map((project) => (
          <Link className="project-row" to={`/work/${project.slug}`} key={project.slug}>
            <span className="project-year">{project.year}</span>
            <span className="project-thumb" aria-hidden="true"><img src={assetUrl(project.heroImage)} alt="" loading="lazy" /></span>
            <span className="project-title"><span>{project.shortTitle}</span><small>{project.shortDescription}</small></span>
            <span className="project-category">{project.category}</span>
            <span className="project-arrow" aria-hidden="true">↗</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function Home() {
  return (
    <main className="home-shell">
      <section className="intro" aria-labelledby="home-title">
        <p className="eyebrow">Yuhe Cui</p>
        <h1 id="home-title">Mechanical engineer, biomedical researcher, and product designer translating complex systems into testable devices.</h1>
        <p className="current">MIT PhD candidate working across diagnostic sample preparation, microfluidics, biomimetics, and human-centered product development.</p>
        <div className="inline-links" aria-label="Areas"><button type="button" onClick={() => document.getElementById("graduate-research")?.scrollIntoView()}>Research</button><button type="button" onClick={() => document.getElementById("design-work")?.scrollIntoView()}>Design</button><Link to="/about">About</Link></div>
      </section>
      <ProjectIndex id="graduate-research" eyebrow="01" title="Graduate research" description="Current and recent engineering research at MIT, plus foundational biomimetics work." projects={selectProjects(researchOrder)} />
      <ProjectIndex id="design-work" eyebrow="02" title="Product & interaction design" description="Undergraduate work combining physical products, interfaces, service systems, and user research." projects={selectProjects(designOrder)} />
      <ProjectIndex id="archive-title" eyebrow="03" title="Archive" description="Earlier research and product explorations retained as compact case studies." projects={selectProjects(archiveOrder)} compact />
      <Footer />
    </main>
  );
}

function MediaItem({ item }) {
  if (item.needed) return <div className="media-needed" role="img" aria-label={`Image needed: ${item.needed}`}><span>[IMAGE NEEDED]</span><p>{item.needed}</p></div>;
  return <figure className={`project-figure${item.size ? ` media-${item.size}` : ""}`}>{item.type === "video" ? <video src={assetUrl(item.src)} poster={assetUrl(item.poster)} controls playsInline preload="metadata" aria-label={item.alt} /> : <img src={assetUrl(item.src)} alt={item.alt} loading="lazy" />}{item.caption && <figcaption>{item.caption}</figcaption>}</figure>;
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
    <main className={`project-page${researchOrder.includes(project.slug) ? " project-page-research" : ""}`}>
      <header className="project-hero">
        <div className="project-heading"><p className="eyebrow">{project.category} / {project.year}</p><h1>{project.title}</h1><p className="dek">{project.subtitle || project.shortDescription}</p></div>
        {project.heroImage && <figure className="hero-media"><img src={assetUrl(project.heroImage)} alt={project.heroAlt} /></figure>}
      </header>
      <section className="overview"><h2>Overview</h2><p>{project.shortDescription}</p><dl>{project.status && <div><dt>Status</dt><dd>{project.status}</dd></div>}<div><dt>Role</dt><dd>{project.role}</dd></div><div><dt>Methods / Tools</dt><dd>{project.tools}</dd></div>{project.collaborators && <div><dt>Collaborators</dt><dd>{project.collaborators}</dd></div>}<div><dt>Year</dt><dd>{project.year}</dd></div></dl>{project.document && <a className="document-link" href={assetUrl(project.document.href)} target="_blank" rel="noreferrer"><span>{project.document.label}</span><small>{project.document.meta}</small><b aria-hidden="true">↗</b></a>}</section>
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
      <section className="publications" id="publications">
        <h2>Publications</h2>
        <article><time>2025</time><a className="publication-link" href="https://doi.org/10.1371/journal.pone.0311242" target="_blank" rel="noreferrer"><p><strong>MCount: An automated colony counting tool for high-throughput microbiology.</strong><span>Chen, S., Huang, P.-H., Kim, H., Cui, Y., &amp; Buie, C. R. · PLOS ONE 20(3), e0311242.</span></p><b aria-hidden="true">↗</b></a></article>
        <article><time>2023</time><a className="publication-link" href="https://doi.org/10.1145/3594806.3594860" target="_blank" rel="noreferrer"><p><strong>TOUCH: A multi-sensory communication system that communicates emotions.</strong><span>Aguiar, C. A., Guo, Z., &amp; Cui, Y. · ACM PETRA ’23, 347–356.</span></p><b aria-hidden="true">↗</b></a></article>
        <article><time>2023</time><a className="publication-link" href="https://amps-research.com/wp-content/uploads/2023/07/Amps-Proceedings-Series-32.pdf" target="_blank" rel="noreferrer"><p><strong>Dymo: A future dynamic micro-mobility transportation system.</strong><span>Aguiar, C. A., Guo, Z., &amp; Cui, Y. · AMPS: Representing Pasts – Visioning Futures. ISSN 2398-9467.</span></p><b aria-hidden="true">↗</b></a></article>
        <article><time>2022</time><a className="publication-link" href="https://doi.org/10.1093/icb/icac101" target="_blank" rel="noreferrer"><p><strong>An adaptable flying fish robotic model for aero- and hydrodynamic experimentation.</strong><span>Saro-Cortes, V., Cui, Y., Dufficy, T., Boctor, A., Flammang, B. E., &amp; Wissa, A. W. · Integrative and Comparative Biology 62(5), 1202–1216.</span></p><b aria-hidden="true">↗</b></a></article>
        <article><time>2022</time><a className="publication-link" href="https://doi.org/10.1109/IE54923.2022.9826782" target="_blank" rel="noreferrer"><p><strong>Doki: A multi-sensation interaction device that communicates emotions.</strong><span>Cui, Y., Guo, Z., Wang, Y., Peng, X., Aguiar, C., &amp; Park, J. · IEEE Intelligent Environments 2022, 1–4.</span></p><b aria-hidden="true">↗</b></a></article>
      </section>
      <section className="about-links"><a href="mailto:yuhecui@mit.edu">yuhecui@mit.edu</a></section><Footer />
    </main>
  );
}

export default function App() {
  return <><ScrollAndTitle /><SiteHeader /><Routes><Route path="/" element={<Home />} /><Route path="/about" element={<About />} /><Route path="/work/:slug" element={<ProjectPage />} /><Route path="*" element={<Navigate to="/" replace />} /></Routes></>;
}
