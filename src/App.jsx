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
  return <figure className={`project-figure${item.size ? ` media-${item.size}` : ""}`}>{item.type === "video" ? <video src={assetUrl(item.src)} poster={assetUrl(item.poster)} controls={item.controls !== false} autoPlay={item.autoPlay} loop={item.loop} muted={item.muted} playsInline preload={item.autoPlay ? "auto" : "metadata"} aria-label={item.alt} /> : <img src={assetUrl(item.src)} alt={item.alt} loading="lazy" />}{(item.caption || item.source) && <figcaption>{item.caption}{item.source && <>{item.caption ? " " : ""}<a href={item.source.href} target="_blank" rel="noreferrer">{item.source.label}</a></>}</figcaption>}</figure>;
}

function MediaGrid({ media, layout }) {
  return <div className={`media-grid media-count-${media.length}${layout ? ` media-layout-${layout}` : ""}`}>{media.map((item, index) => <MediaItem item={item} key={item.src || item.needed || index} />)}</div>;
}

function ProjectDocuments({ project }) {
  const documents = project.documents || (project.document ? [project.document] : []);
  if (!documents.length) return null;
  return <div className="document-links">{documents.map((document) => <a className="document-link" href={assetUrl(document.href)} target="_blank" rel="noreferrer" download={document.download || undefined} key={document.href}><span>{document.label}</span><small>{document.meta}</small><b aria-hidden="true">{document.download ? "↓" : "↗"}</b></a>)}</div>;
}

function Section({ section }) {
  return (
    <section className={`case-section${section.isNeeded ? " section-needed" : ""}`}>
      <div className="section-copy"><p className="section-number">{section.number}</p><div><h2>{section.title}</h2>{section.body?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></div>
      {section.mediaFirst && section.media && <MediaGrid media={section.media} layout={section.mediaLayout} />}
      {section.sequence && <ol className={`process-line process-count-${section.sequence.length}`} aria-label={`${section.title} process`}>{section.sequence.map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, "0")}</span>{step}</li>)}</ol>}
      {section.metrics && <div className="metrics">{section.metrics.map((metric) => <div className="metric" key={metric.value + metric.label}><strong>{metric.value}</strong><span>{metric.label}</span></div>)}</div>}
      {!section.mediaFirst && section.media && <MediaGrid media={section.media} layout={section.mediaLayout} />}
    </section>
  );
}

function DimsFigure({ src, alt, caption, className = "" }) {
  return (
    <figure className={`dims-figure${className ? ` ${className}` : ""}`}>
      <img src={assetUrl(src)} alt={alt} loading="lazy" />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

function DimsProjectPage() {
  return (
    <main className="project-page dims-page">
      <header className="dims-hero">
        <div className="dims-hero-copy">
          <p className="eyebrow">Biomedical Engineering · Bioseparation · Experimental Research</p>
          <h1>Culture-Free Pathogen Isolation for Sepsis Diagnostics</h1>
          <p className="dek">Engineering a density-shift immunocapture workflow to isolate rare bloodstream bacteria from complex samples and prepare them for Raman identification.</p>
          <div className="dims-metadata" aria-label="Project metadata">
            <span>MIT · Karnik Lab × Tadesse Lab</span>
            <span>2025–Present</span>
            <span>Role · Experimental system design &amp; validation</span>
          </div>
        </div>
        <DimsFigure
          className="dims-hero-figure"
          src="/images/dims/dims-system-workflow.png"
          alt="End-to-end DIMS diagnostic workflow from bacterial capture and density-based separation to Raman spectroscopy and identification"
          caption="Collaborative end-to-end diagnostic workflow spanning bacterial capture, density-based separation, Raman spectroscopy, and identification. My work focuses on capture, separation, recovery, experimental system design, and Raman sample preparation."
        />
      </header>

      <div className="dims-case-study">
        <section className="dims-section">
          <div className="dims-copy">
            <h2>Engineering challenge</h2>
            <p>Bloodstream pathogens can occur at extremely low concentrations within a background dominated by blood cells and other biological components. The sample-preparation system therefore has to selectively capture bacteria, preserve the conjugates during density separation, recover them with minimal loss, and deliver a sample compatible with downstream Raman spectroscopy.</p>
          </div>
          <div className="dims-card-grid dims-card-grid-four">
            <article><h3>Selective capture</h3><p>Bind target bacteria while minimizing nonspecific background.</p></article>
            <article><h3>Density stability</h3><p>Keep bead–bacteria conjugates intact during centrifugation.</p></article>
            <article><h3>Controlled recovery</h3><p>Retrieve bacteria from a moving density interface without introducing large operator-dependent losses.</p></article>
            <article><h3>Raman compatibility</h3><p>Preserve bacterial molecular signatures for downstream optical identification.</p></article>
          </div>
        </section>

        <section className="dims-section">
          <div className="dims-copy"><h2>How DIMS works</h2></div>
          <ol className="dims-steps" aria-label="DIMS workflow">
            <li><span>01</span><h3>Capture</h3><p>Antibody-functionalized particles bind target bacteria.</p></li>
            <li><span>02</span><h3>Density shift</h3><p>Bead–bacterium conjugates acquire a different effective density from unbound bacteria and background components.</p></li>
            <li><span>03</span><h3>Separation &amp; recovery</h3><p>Centrifugation localizes the conjugates near a defined liquid-density interface for extraction.</p></li>
            <li><span>04</span><h3>Raman preparation</h3><p>Recovered conjugates are prepared for downstream single-cell Raman measurement.</p></li>
          </ol>
        </section>

        <section className="dims-section dims-split dims-capture-platform">
          <DimsFigure
            src="/images/dims/dims-bead-platform.png"
            alt="Silica and gold-coated silica bead platforms with antibody-based bacterial capture chemistry"
            caption="Silica and gold-coated silica bead platforms with antibody-based capture chemistry."
          />
          <div className="dims-split-copy">
            <p className="dims-kicker">Engineering the capture platform</p>
            <h2>Improving capture without sacrificing separation stability</h2>
            <p>I experimentally evaluated particle-based capture strategies for use in the density-gradient workflow. The system must provide strong bacterial binding while remaining stable under DIMS centrifugation conditions and compatible with downstream optical measurement.</p>
            <div className="dims-result-card">
              <strong>90.0%</strong>
              <span><em>E. coli</em> capture with Au-PEG beads</span>
              <small>22.8% with plain silica beads<br />Matched 30-minute incubation</small>
            </div>
            <DimsFigure
              className="dims-inline-chart dims-figure-narrow"
              src="/images/dims/dims-aupeg-capture.png"
              alt="Comparison of E. coli capture using Au-PEG beads and plain silica beads after a matched 30-minute incubation"
            />
          </div>
        </section>

        <section className="dims-section dims-split dims-density-section">
          <div className="dims-split-copy">
            <h2>Capture must survive the separation environment</h2>
            <p>A high capture efficiency is not useful if bead–bacteria conjugates dissociate during density-gradient centrifugation. Antibody-based capture was therefore evaluated in both buffer and 1.2 g/mL density media.</p>
            <p>Comparable capture between the two conditions showed that antibody-mediated binding remained stable under the DIMS separation conditions.</p>
          </div>
          <DimsFigure
            className="dims-small-chart dims-figure-narrow"
            src="/images/dims/dims-density-stability.png"
            alt="Capture efficiency comparison in buffer and 1.2 grams per milliliter density media"
            caption="Capture efficiency in buffer versus 1.2 g/mL density media."
          />
        </section>

        <section className="dims-section">
          <div className="dims-copy">
            <h2>Where does the sample go?</h2>
            <p>I use step-by-step recovery measurements to identify where bacteria are lost across capture, density localization, interface retrieval, and handling.</p>
          </div>
          <DimsFigure
            className="dims-wide-figure"
            src="/images/dims/dims-separation-profile.png"
            alt="DIMS separation and recovery profile showing bacterial distribution and losses through the workflow"
          />
          <div className="dims-metrics">
            <article><strong>13.95%</strong><span>End-to-end DIMS recovery in PBS</span></article>
            <article><strong>5.40%</strong><span>Preliminary end-to-end recovery in 10% whole blood</span></article>
          </div>
          <p className="dims-followup">These measurements turn the workflow into an engineering loss budget. Current optimization focuses on particle surface properties, density-media distribution, centrifugation conditions, interface recovery, and nonspecific adhesion.</p>
        </section>

        <section className="dims-section">
          <div className="dims-copy">
            <p className="dims-kicker">Current development</p>
            <h2>Reducing operator-dependent recovery</h2>
            <p>One current engineering focus is a camera-guided extraction module that locates and tracks moving density interfaces during aspiration. The goal is to improve recovery repeatability by replacing subjective manual interface selection with a more controlled extraction process.</p>
          </div>
          <div className="dims-card-grid dims-card-grid-three">
            <article><h3>Imaging</h3><p>Locate the density interface during recovery.</p></article>
            <article><h3>Tracking</h3><p>Follow interface motion during aspiration.</p></article>
            <article><h3>Extraction</h3><p>Control sampling position to reduce operator-dependent variation.</p></article>
          </div>
        </section>

        <section className="dims-section dims-split dims-raman-section">
          <DimsFigure
            className="dims-raman-figure dims-figure-narrow"
            src="/images/dims/dims-raman.png"
            alt="Representative bead-bound E. coli image and Raman spectra compared with bacteria-only and bead-only controls"
            caption="Representative bead-bound E. coli imaging and Raman spectra compared with bacteria-only and bead-only controls."
          />
          <div className="dims-split-copy">
            <h2>Isolation must preserve the signal</h2>
            <p>The separation step is only useful if captured bacteria remain compatible with downstream identification. Raman measurements from individual Au-PEG bead–<em>E. coli</em> conjugates retain identifiable bacterial spectral features, while bead-only controls allow particle background to be distinguished from the bacterial signal.</p>
            <p className="dims-highlight">Sample preparation and detection must be designed as one system.</p>
          </div>
        </section>

        <section className="dims-section dims-contribution">
          <h2>My contribution</h2>
          <ul>
            <li>Designing and experimentally validating the integrated mechanical and fluidic workflow for bacterial isolation and downstream optical analysis.</li>
            <li>Designing bacterial capture and density-separation experiments.</li>
            <li>Experimentally evaluating silica and gold-coated silica particle platforms.</li>
            <li>Quantifying capture efficiency, recovery, and losses across the multi-step workflow.</li>
            <li>Designing controlled experiments to identify failure modes and optimize geometry, operating conditions, material interfaces, and component interactions.</li>
            <li>Developing a camera-guided interface extraction approach to reduce operator-dependent variation.</li>
            <li>Preparing recovered samples for downstream Raman measurements.</li>
            <li>Analyzing experimental data and troubleshooting sources of variability.</li>
            <li>Developing Raman-spectrum analysis and classification methods as ongoing work.</li>
          </ul>
          <div className="dims-collaboration-note"><h3>Collaborative context</h3><p>This project spans pathogen capture, density separation, Raman spectroscopy, and computational analysis. Automated Raman acquisition and portions of the classification workflow are collaborative components rather than my individual contribution.</p></div>
        </section>

        <section className="dims-section">
          <div className="dims-copy"><h2>Current engineering questions</h2></div>
          <div className="dims-card-grid dims-card-grid-four">
            <article><h3>Recovery</h3><p>How can interface extraction be made more repeatable?</p></article>
            <article><h3>Surface chemistry</h3><p>How can high capture be maintained while reducing nonspecific binding?</p></article>
            <article><h3>Process conditions</h3><p>How do centrifugation time, speed, and density distribution affect recovery?</p></article>
            <article><h3>System integration</h3><p>How can capture, separation, recovery, and optical analysis operate as one reliable workflow?</p></article>
          </div>
        </section>

        <section className="dims-section dims-direction">
          <div className="dims-copy"><h2>Toward rapid culture-free pathogen identification</h2><p>The long-term goal is an integrated sample-preparation workflow that isolates bloodstream pathogens directly from complex samples and prepares them for molecular identification without relying on conventional culture expansion.</p></div>
        </section>
      </div>

      <nav className="project-end" aria-label="Case study navigation"><Link to="/">← All work</Link><Link to="/about">About Yuhe →</Link></nav>
      <Footer />
    </main>
  );
}

function ProjectPage() {
  const { slug } = useParams();
  const project = projectBySlug[slug];
  if (!project) return <Navigate to="/" replace />;
  if (project.slug === "culture-free-pathogen-isolation") return <DimsProjectPage />;
  return (
    <main className={`project-page${researchOrder.includes(project.slug) ? " project-page-research" : ""}`}>
      <header className="project-hero">
        <div className="project-heading"><p className="eyebrow">{project.category} / {project.year}</p><h1>{project.title}</h1><p className="dek">{project.subtitle || project.shortDescription}</p></div>
        {project.heroImage && <figure className="hero-media"><img src={assetUrl(project.heroImage)} alt={project.heroAlt} /></figure>}
      </header>
      <section className="overview"><h2>Overview</h2><p>{project.shortDescription}</p><dl>{project.status && <div><dt>Status</dt><dd>{project.status}</dd></div>}<div><dt>Role</dt><dd>{project.role}</dd></div><div><dt>Methods / Tools</dt><dd>{project.tools}</dd></div>{project.collaborators && <div><dt>Collaborators</dt><dd>{project.collaborators}</dd></div>}<div><dt>Year</dt><dd>{project.year}</dd></div></dl><ProjectDocuments project={project} /></section>
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
