// ═══════════════════════════════════════════════
// 1. VIEW & THEME TOGGLE
// ═══════════════════════════════════════════════
const graphView      = document.getElementById('graph-view');
const structureView  = document.getElementById('structure-view');
const graphPill      = document.getElementById('graph-pill');
const structurePill  = document.getElementById('structure-pill');
const dagControls    = document.getElementById('dag-controls');
const navLinks       = document.getElementById('nav-links');
const themeBtn       = document.getElementById('theme-btn');

let currentView = 'structure';

function switchView(view) {
    currentView = view;
    if (view === 'graph') {
        graphView.classList.remove('hidden');
        structureView.classList.add('hidden');
        graphPill.classList.add('active');
        structurePill.classList.remove('active');
        dagControls.classList.remove('hidden');
        navLinks.style.visibility = 'hidden';
        setTimeout(drawEdges, 100);
    } else {
        structureView.classList.remove('hidden');
        graphView.classList.add('hidden');
        structurePill.classList.add('active');
        graphPill.classList.remove('active');
        dagControls.classList.add('hidden');
        navLinks.style.visibility = 'visible';
    }
}

graphPill.addEventListener('click',     () => switchView('graph'));
structurePill.addEventListener('click', () => switchView('structure'));

// Theme toggle
const html = document.documentElement;
themeBtn.addEventListener('click', () => {
    const isDark = html.getAttribute('data-theme') === 'dark';
    html.setAttribute('data-theme', isDark ? 'light' : 'dark');
    themeBtn.textContent = isDark ? '🌙' : '☀️';
});


// ═══════════════════════════════════════════════
// 2. DAG — DATA (REAL DATA PIPELINE)
// ═══════════════════════════════════════════════
const dagEdgesData = [
    { from: 'node-about',      to: 'node-skills' },
    { from: 'node-skills',     to: 'node-experience' },
    { from: 'node-experience', to: 'node-projects' },
    { from: 'node-experience', to: 'node-education' }
];

const nodeDataMap = {
    'node-about': {
        title: 'sushma_vunnam.profile',
        logs: [
            "[INFO] Loading profile: Sushma Vunnam...",
            "[INFO] Role: Data Engineer | Location: USA",
            "[INFO] Connecting to Walmart Global Tech cluster...",
            "[SUCCESS] Profile loaded. 3+ years experience. 100M+ records/day."
        ],
        section: 'about',
        content: `
            <h3>Sushma Vunnam</h3>
            <p>Data Engineer with <strong>3+ years</strong> building enterprise-scale data platforms at Walmart Global Tech and Accenture.</p>
            <div class="metrics-grid">
                <div class="metric-box"><span class="metric-value">100M+</span><span class="metric-label">Records / Day</span></div>
                <div class="metric-box"><span class="metric-value">3+</span><span class="metric-label">Years Experience</span></div>
                <div class="metric-box"><span class="metric-value">80%</span><span class="metric-label">Spark Perf. Boost</span></div>
                <div class="metric-box"><span class="metric-value">600M+</span><span class="metric-label">Records / Batch</span></div>
            </div>
            <p>Specialises in data lakehouse architecture, real-time streaming, distributed ETL, and generative AI integration across <strong>AWS & Azure</strong>.</p>
            <p style="margin-top:16px"><a href="#about" class="dag-nav-link" data-section="about">→ View Full Profile</a></p>
        `
    },
    'node-skills': {
        title: 'tech_stack.yml',
        logs: [
            "[INFO] Scanning installed packages...",
            "[INFO] Big Data: Spark, PySpark, Kafka, Delta Lake, dbt",
            "[INFO] Cloud: AWS Bedrock, Azure, Databricks, Airflow",
            "[SUCCESS] Tech stack loaded. 25+ tools & frameworks."
        ],
        section: 'skills',
        content: `
            <h3>Tech Stack</h3>
            <h4>Big Data & Processing</h4>
            <div class="tech-badges">
                <span class="tech-badge">Apache Spark</span>
                <span class="tech-badge">PySpark</span>
                <span class="tech-badge">dbt</span>
                <span class="tech-badge">Delta Lake</span>
                <span class="tech-badge">Apache Kafka</span>
                <span class="tech-badge">Apache Iceberg</span>
            </div>
            <h4>Cloud & Orchestration</h4>
            <div class="tech-badges">
                <span class="tech-badge">AWS (Bedrock, S3, Glue)</span>
                <span class="tech-badge">Azure (ADF, ADLS)</span>
                <span class="tech-badge">Databricks</span>
                <span class="tech-badge">Apache Airflow</span>
                <span class="tech-badge">Docker</span>
                <span class="tech-badge">Terraform</span>
            </div>
            <h4>AI & Languages</h4>
            <div class="tech-badges">
                <span class="tech-badge">Python</span>
                <span class="tech-badge">Java 8/17</span>
                <span class="tech-badge">SQL</span>
                <span class="tech-badge">Claude 3 / AWS Bedrock</span>
                <span class="tech-badge">RAG Pipelines</span>
                <span class="tech-badge">LangChain</span>
            </div>
            <p style="margin-top:16px"><a href="#skills" class="dag-nav-link" data-section="skills">→ View All Skills</a></p>
        `
    },
    'node-experience': {
        title: 'career_timeline.json',
        logs: [
            "[INFO] Loading career timeline...",
            "[INFO] Walmart Global Tech — Dec 2024 to Present",
            "[INFO] UCode Technologies — Jun 2024 to Nov 2024",
            "[INFO] Accenture — Feb 2021 to Jun 2022",
            "[SUCCESS] 3 roles loaded. 100M+ records processed daily."
        ],
        section: 'experience',
        content: `
            <h3>Experience</h3>

            <h4>Walmart Global Tech <span class="monospaced" style="font-size:0.8em;font-weight:normal">(Dec 2024 – Present)</span></h4>
            <p>Real-time marketplace pipeline — 50M+ events/day, 600M+ records/batch, 80% Spark boost via AQE.</p>
            <div class="arch-flow-container">
                <div class="arch-flow">
                    <div class="arch-node">📦 Kafka<span class="arch-subtext">50M+ events/day</span></div>
                    <div class="arch-arrow">→</div>
                    <div class="arch-node" style="border-color:#eab308">⚡ Spark AQE<span class="arch-subtext">600M+ records</span></div>
                    <div class="arch-arrow">→</div>
                    <div class="arch-node" style="border-color:#3b82f6">🗄️ Delta Lake<span class="arch-subtext">Bronze→Gold</span></div>
                    <div class="arch-arrow">→</div>
                    <div class="arch-node" style="border-color:#10b981">📊 Grafana<span class="arch-subtext">SLA Monitoring</span></div>
                </div>
            </div>

            <h4>UCode Technologies LLC <span class="monospaced" style="font-size:0.8em;font-weight:normal">(Jun – Nov 2024)</span></h4>
            <p>Backend data services with Python/FastAPI, MySQL ETL pipelines, and CI/CD automation.</p>

            <h4>Accenture <span class="monospaced" style="font-size:0.8em;font-weight:normal">(Feb 2021 – Jun 2022)</span></h4>
            <p>10M+ records/day ingestion from SAP, Oracle, flat files — PySpark cleansing, dimensional modeling.</p>
            <p style="margin-top:16px"><a href="#experience" class="dag-nav-link" data-section="experience">→ View Full Experience</a></p>
        `
    },
    'node-projects': {
        title: 'portfolio_projects.sh',
        logs: [
            "[INFO] Loading project portfolio...",
            "[INFO] Project 1: Enterprise PySpark Pipeline",
            "[INFO] Project 2: Generative AI Chatbot — AWS Bedrock",
            "[INFO] Project 3: Kafka → Milvus RAG Pipeline",
            "[INFO] Project 4: Cloud Data Lakehouse Platform",
            "[SUCCESS] 4 projects deployed."
        ],
        section: 'projects',
        content: `
            <h3>Projects</h3>

            <h4>1. Enterprise PySpark Pipeline</h4>
            <p>ETL processing 50M+ records with 45% throughput improvement via AQE and partition strategy.</p>
            <div class="code-snippet-container">
<pre><code><span class="code-comment"># AQE + partition tuning</span>
<span class="code-keyword">spark</span>.conf.<span class="code-method">set</span>(<span class="code-string">"spark.sql.adaptive.enabled"</span>, <span class="code-string">"true"</span>)
<span class="code-keyword">spark</span>.conf.<span class="code-method">set</span>(<span class="code-string">"spark.sql.adaptive.coalescePartitions.enabled"</span>, <span class="code-string">"true"</span>)</code></pre>
            </div>

            <h4>2. Cloud Data Lakehouse</h4>
            <p>Multi-layer Bronze→Silver→Gold on AWS S3 + Delta Lake with dbt quality checks. 70% latency reduction.</p>

            <h4>3. GenAI Chatbot — AWS Bedrock</h4>
            <p>Claude 3 Sonnet vs Titan benchmarking with zero/few-shot prompt engineering.</p>

            <h4>4. Kafka → Milvus RAG Pipeline</h4>
            <p>Real-time streaming into vector DB for sub-100ms enterprise RAG retrieval.</p>
            <p style="margin-top:16px"><a href="#projects" class="dag-nav-link" data-section="projects">→ View All Projects</a></p>
        `
    },
    'node-education': {
        title: 'education_certs.md',
        logs: [
            "[INFO] Loading academic records...",
            "[INFO] MS Data Analytics Engineering — George Mason University (GPA: 3.70)",
            "[INFO] B.Tech EEE — SASTRA University",
            "[INFO] Certifications: LinkedIn Learning, Anthropic, Accenture",
            "[SUCCESS] Education & certifications loaded."
        ],
        section: 'education',
        content: `
            <h3>Education</h3>
            <ul>
                <li><strong>MS, Data Analytics Engineering</strong><br>George Mason University, USA — 2022–2024 | GPA: 3.70/4.0</li>
                <li style="margin-top:12px"><strong>B.Tech, Electrical & Electronics Engineering</strong><br>SASTRA University, India — 2017–2021</li>
            </ul>

            <h3 style="margin-top:20px">Certifications</h3>
            <div class="tech-badges">
                <span class="tech-badge">Leveraging AI & DE for Sustainability — LinkedIn</span>
                <span class="tech-badge">Claude Code 101 — Anthropic</span>
                <span class="tech-badge">Stream Training — Accenture India</span>
            </div>
            <p style="margin-top:16px"><a href="#education" class="dag-nav-link" data-section="education">→ View Education</a></p>
        `
    }
};


// ═══════════════════════════════════════════════
// 3. SVG EDGE DRAWING
// ═══════════════════════════════════════════════
const svgContainer = document.getElementById('edges-container');
let edgeElements = [];

function drawEdges() {
    svgContainer.innerHTML = '';
    edgeElements = [];

    // Arrowhead marker
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML = `
        <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" class="dag-edge-arrow" />
        </marker>
    `;
    svgContainer.appendChild(defs);
    const svgRect = svgContainer.getBoundingClientRect();

    dagEdgesData.forEach(link => {
        const fromNode = document.getElementById(link.from);
        const toNode   = document.getElementById(link.to);
        if (!fromNode || !toNode) return;

        const fromRect = fromNode.getBoundingClientRect();
        const toRect   = toNode.getBoundingClientRect();

        // Horizontal layout: exit right side of from-node, enter left side of to-node
        const startX = fromRect.right - svgRect.left;
        const startY = fromRect.top + fromRect.height / 2 - svgRect.top;
        const endX   = toRect.left - svgRect.left;
        const endY   = toRect.top + toRect.height / 2 - svgRect.top;
        const cx     = startX + (endX - startX) / 2;

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', `M ${startX},${startY} C ${cx},${startY} ${cx},${endY} ${endX},${endY}`);
        path.setAttribute('class', 'dag-edge');
        path.setAttribute('marker-end', 'url(#arrowhead)');
        path.dataset.from = link.from;
        path.dataset.to   = link.to;

        svgContainer.appendChild(path);
        edgeElements.push(path);
    });
}
window.addEventListener('resize', drawEdges);


// ═══════════════════════════════════════════════
// 4. PANEL INTERACTION
// ═══════════════════════════════════════════════
const detailsPanel  = document.getElementById('details-panel');
const closePanelBtn = document.getElementById('close-panel-btn');
const panelTitle    = document.getElementById('panel-title');
const panelContent  = document.getElementById('panel-content');
const panelBadge    = document.getElementById('panel-state-badge');
const panelLogs     = document.getElementById('panel-logs');

function openPanel(nodeId) {
    const node   = document.getElementById(nodeId);
    const data   = nodeDataMap[nodeId];
    const status = node.getAttribute('data-status');
    if (!data) return;

    panelTitle.textContent   = data.title;
    panelContent.innerHTML   = data.content;
    panelBadge.textContent   = status.charAt(0).toUpperCase() + status.slice(1);
    panelBadge.className     = 'badge badge-' + status;
    panelLogs.innerHTML      = '';

    if (status === 'pending') {
        panelLogs.innerHTML = '<p class="log-line">Waiting for task execution to complete...</p>';
    } else if (status === 'running') {
        panelLogs.innerHTML = `<p class="log-line info">${data.logs[0]}</p><p class="log-line warn">${data.logs[1]}</p>`;
    } else {
        data.logs.forEach(l => {
            const cls = l.includes('SUCCESS') ? 'success' : l.includes('INFO') ? 'info' : '';
            panelLogs.innerHTML += `<p class="log-line ${cls}">${l}</p>`;
        });
    }
    detailsPanel.classList.add('open');
}

closePanelBtn.addEventListener('click', () => detailsPanel.classList.remove('open'));
document.querySelectorAll('.dag-node').forEach(n => n.addEventListener('click', () => openPanel(n.id)));

// "→ View Section" links inside panel navigate to structure view
document.addEventListener('click', e => {
    const link = e.target.closest('.dag-nav-link');
    if (!link) return;
    e.preventDefault();
    const section = link.dataset.section;
    detailsPanel.classList.remove('open');
    switchView('structure');
    setTimeout(() => {
        const target = document.getElementById(section);
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    }, 300);
});


// ═══════════════════════════════════════════════
// 5. DAG ORCHESTRATION
// ═══════════════════════════════════════════════
const dagsBtn  = document.getElementById('trigger-dag-btn');
const clearBtn = document.getElementById('clear-dag-btn');

const executionOrder = [
    ['node-about'],
    ['node-skills'],
    ['node-experience'],
    ['node-projects', 'node-education']
];

const sleep = ms => new Promise(r => setTimeout(r, ms));

function updateNodeState(nodeId, state) {
    const node = document.getElementById(nodeId);
    if (!node) return;
    node.setAttribute('data-status', state);
    if (state === 'success' || state === 'running') {
        edgeElements.forEach(edge => {
            if (edge.dataset.from === nodeId) {
                edge.classList.remove('success', 'running');
                edge.classList.add(state);
            }
        });
    }
}

async function triggerDag() {
    clearDagState();
    dagsBtn.disabled = true;
    for (const layer of executionOrder) {
        layer.forEach(id => updateNodeState(id, 'running'));
        await sleep(1500);
        layer.forEach(id => updateNodeState(id, 'success'));
    }
    dagsBtn.disabled = false;
}

function clearDagState() {
    document.querySelectorAll('.dag-node').forEach(n => n.setAttribute('data-status', 'pending'));
    document.querySelectorAll('.dag-edge').forEach(e => e.classList.remove('success', 'running'));
}

dagsBtn.addEventListener('click', triggerDag);
clearBtn.addEventListener('click', clearDagState);


// ═══════════════════════════════════════════════
// 6. SKILLS TABS
// ═══════════════════════════════════════════════
document.querySelectorAll('.skill-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.skill-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.skills-panel').forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        document.querySelector(`.skills-panel[data-panel="${tab.dataset.tab}"]`).classList.add('active');
    });
});


// ═══════════════════════════════════════════════
// 8. MAGIC WAND SPARKLES
// ═══════════════════════════════════════════════
document.addEventListener('mousemove', (e) => {
    if (Math.random() > 0.08) return; 
    
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.innerHTML = '✨';
    sparkle.style.position = 'fixed';
    sparkle.style.left = (e.clientX + (Math.random()-0.5)*20) + 'px';
    sparkle.style.top = (e.clientY + (Math.random()-0.5)*20) + 'px';
    sparkle.style.fontSize = (Math.random() * 10 + 10) + 'px';
    
    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 800);
});


// ═══════════════════════════════════════════════
// 9. SCROLL REVEAL OBSERVER
// ═══════════════════════════════════════════════
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            entry.target.style.animation = 'slideInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards';
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });


// ═══════════════════════════════════════════════
// 10. NAV ACTIVE OBSERVER
// ═══════════════════════════════════════════════
const sections = document.querySelectorAll('#structure-view section[id]');
const navAnchors = document.querySelectorAll('.nav-link');

if (sections.length > 0) {
    const navObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navAnchors.forEach(a => {
                    a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
                });
            }
        });
    }, { rootMargin: '-40% 0px -55% 0px' });

    sections.forEach(s => navObserver.observe(s));
}


// ═══════════════════════════════════════════════
// 11. INIT
// ═══════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
    // Default: structure view
    switchView('structure');
    
    // Initialize scroll reveals
    const revealEls = document.querySelectorAll('.reveal, .metric-card, .timeline-card, .project-card');
    revealEls.forEach((el, i) => {
        el.style.opacity = '0';
        el.style.animationDelay = (i * 0.05) + 's';
        revealObserver.observe(el);
    });
});
