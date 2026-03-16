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
    { from: 'node-ingest',   to: 'node-process' },
    { from: 'node-process',  to: 'node-storage' },
    { from: 'node-storage',  to: 'node-analytics' },
    { from: 'node-storage',  to: 'node-insights' }
];

const nodeDataMap = {
    'node-ingest': {
        title: 'kafka_ingest.py',
        logs: [
            "[INFO] Initializing data ingestion pipeline...",
            "[INFO] Connecting to Kafka brokers (50M+ events/day)",
            "[INFO] Sources: Marketplace | Orders | User Events | Transactions",
            "[SUCCESS] Kafka consumers initialized. Streaming started."
        ],
        content: `
            <h3>Data Ingestion</h3>
            <p>Real-time and batch data collection from multiple sources processing <strong>50M+ events daily</strong> at Walmart scale.</p>
            
            <h4>Sources Connected</h4>
            <div class="tech-badges">
                <span class="tech-badge">Kafka Streams</span>
                <span class="tech-badge">SAP & Oracle</span>
                <span class="tech-badge">Marketplace APIs</span>
                <span class="tech-badge">Cloud Storage</span>
            </div>
            
            <h4>Key Metrics</h4>
            <ul>
                <li><strong>50M+ events/day</strong> from marketplace</li>
                <li><strong>600M+ batch records</strong> processed per cycle</li>
                <li><strong>Sub-second latency</strong> for critical events</li>
                <li><strong>99.99% uptime</strong> on ingestion pipelines</li>
            </ul>
        `
    },
    'node-process': {
        title: 'spark_etl_pipeline.py',
        logs: [
            "[INFO] Parsing 600M+ records for ETL transformation...",
            "[INFO] Executing Spark job with Adaptive Query Execution (AQE)",
            "[INFO] Partitioning data by marketplace & timestamp",
            "[SUCCESS] ETL complete. 80% performance boost achieved via AQE."
        ],
        content: `
            <h3>Processing & ETL</h3>
            <p>Enterprise-grade Apache Spark framework for distributed processing, transforming <strong>600M+ records per batch</strong> with <strong>80% performance improvement</strong> using Adaptive Query Execution.</p>
            
            <h4>Processing Stack</h4>
            <div class="tech-badges">
                <span class="tech-badge">Apache Spark 3.5</span>
                <span class="tech-badge">PySpark</span>
                <span class="tech-badge">Scala</span>
                <span class="tech-badge">AQE Optimization</span>
                <span class="tech-badge">Catalyst Optimizer</span>
            </div>
            
            <h4>Pipeline Stages</h4>
            <ul>
                <li>Data Validation & Cleansing</li>
                <li>Complex Joins & Aggregations</li>
                <li>Feature Engineering</li>
                <li>Quality Metrics & Monitoring</li>
            </ul>
        `
    },
    'node-storage': {
        title: 'delta_lake_warehouse.sql',
        logs: [
            "[INFO] Writing transformed data to Delta Lake...",
            "[INFO] Creating optimized partitions: date/marketplace/category",
            "[INFO] Enabling ACID transactions & time-travel",
            "[SUCCESS] Data warehouse layer ready for analytics (600M+ records)."
        ],
        content: `
            <h3>Data Storage & Warehouse</h3>
            <p>Modern data lake architecture using <strong>Delta Lake</strong> for ACID transactions, versioning, and optimized analytics queries on petabyte-scale data.</p>
            
            <h4>Storage Technologies</h4>
            <div class="tech-badges">
                <span class="tech-badge">Delta Lake</span>
                <span class="tech-badge">Parquet Format</span>
                <span class="tech-badge">Hive Partitioning</span>
                <span class="tech-badge">AWS S3</span>
                <span class="tech-badge">Azure Data Lake</span>
            </div>
            
            <h4>Data Organization</h4>
            <ul>
                <li>Z-Order clustering for query optimization</li>
                <li>Automated vacuuming & compaction</li>
                <li>Unified Batch & Streaming</li>
                <li>ACID guarantees on all writes</li>
            </ul>
        `
    },
    'node-analytics': {
        title: 'ml_model_training.py',
        logs: [
            "[INFO] Loading transformed datasets from warehouse...",
            "[INFO] Training predictive ML models (Demand Forecasting, Recommendation Engine)",
            "[INFO] Feature importance analysis complete",
            "[SUCCESS] Models deployed to production. Real-time inference ready."
        ],
        content: `
            <h3>Analytics & ML Models</h3>
            <p>Building production-grade machine learning models for demand forecasting, personalization, and anomaly detection on enterprise scale data.</p>
            
            <h4>ML Infrastructure</h4>
            <div class="tech-badges">
                <span class="tech-badge">TensorFlow</span>
                <span class="tech-badge">PyTorch</span>
                <span class="tech-badge">MLflow</span>
                <span class="tech-badge">AWS SageMaker</span>
                <span class="tech-badge">LLMs & RAG</span>
            </div>
            
            <h4>Model Deployment</h4>
            <ul>
                <li>Real-time inference APIs using FastAPI</li>
                <li>A/B testing & experimentation framework</li>
                <li>Model monitoring with Prometheus/Grafana</li>
                <li>GenAI chatbots (AWS Bedrock, Claude 3)</li>
            </ul>
        `
    },
    'node-insights': {
        title: 'dashboards_reports.py',
        logs: [
            "[INFO] Generating business intelligence dashboards...",
            "[INFO] Computing KPIs: Revenue, Growth, Churn, Engagement",
            "[INFO] Creating interactive visualizations for stakeholders",
            "[SUCCESS] Real-time dashboards & reports deployed to exec team."
        ],
        content: `
            <h3>Business Insights & Reporting</h3>
            <p>Executive-level dashboards and reports delivering actionable business intelligence to drive strategic decisions and revenue optimization.</p>
            
            <h4>Reporting Tools</h4>
            <div class="tech-badges">
                <span class="tech-badge">Tableau</span>
                <span class="tech-badge">Grafana</span>
                <span class="tech-badge">Apache Superset</span>
                <span class="tech-badge">Custom APIs</span>
            </div>
            
            <h4>Key Outputs</h4>
            <ul>
                <li>Real-time KPI dashboards</li>
                <li>Predictive analytics for business planning</li>
                <li>Automated anomaly detection alerts</li>
                <li>Customer insights & personalization engines</li>
            </ul>
        `
    },

    'node-experience': {
        title: 'load_experience.yml',
        logs: [
            "[INFO] Initiating loading sequence to target 'resume_dim'...",
            "[WARN] High latency detected on legacy ETL... Tuning AQE.",
            "[INFO] Refactoring to streaming micro-batch. Latency dropping...",
            "[SUCCESS] Load complete. 100M+ records processed daily."
        ],
        content: `
            <h3>Work Experience</h3>

            <h4>Walmart Global Tech <span class="monospaced" style="font-size:0.8em;font-weight:normal">(Dec 2024 – Present)</span></h4>
            <p>Designed and built a real-time marketplace pipeline handling 50M+ events/day and 600M+ batch records with 80% Spark performance boost via AQE.</p>
            <div class="arch-flow-container">
                <div class="arch-flow">
                    <div class="arch-node">📦 Marketplace Events<span class="arch-subtext">50M+ / day</span></div>
                    <div class="arch-arrow">→</div>
                    <div class="arch-node" style="border-color:#d97706">♨️ Apache Kafka<span class="arch-subtext">Java Consumers</span></div>
                    <div class="arch-arrow">→</div>
                    <div class="arch-node" style="border-color:#eab308">⚡ Apache Spark<span class="arch-subtext">AQE Optimized</span></div>
                    <div class="arch-arrow">→</div>
                    <div class="arch-node" style="border-color:#3b82f6">🗄️ Delta Lake<span class="arch-subtext">Harmony Platform</span></div>
                    <div class="arch-arrow">→</div>
                    <div class="arch-node" style="border-color:#10b981">📊 Observability<span class="arch-subtext">Prometheus / Grafana</span></div>
                </div>
            </div>

            <h4>Accenture <span class="monospaced" style="font-size:0.8em;font-weight:normal">(Feb 2021 – Jun 2022)</span></h4>
            <p>Automated data ingestion from SAP, Oracle &amp; flat files — 10M+ records/day into an analytics-ready warehouse, with PySpark cleansing.</p>
            <div class="arch-flow-container" style="padding:16px">
                <div class="arch-flow">
                    <div class="arch-node">🗃️ Legacy Systems<span class="arch-subtext">SAP / CSV / Oracle</span></div>
                    <div class="arch-arrow">→</div>
                    <div class="arch-node" style="border-color:#8b5cf6">🐍 Python / SQL ETL<span class="arch-subtext">Custom Ingestion DAGs</span></div>
                    <div class="arch-arrow">→</div>
                    <div class="arch-node" style="border-color:#eab308">⚡ PySpark Cleansing<span class="arch-subtext">Schema validation</span></div>
                    <div class="arch-arrow">→</div>
                    <div class="arch-node" style="border-color:#3b82f6">🏢 Data Warehouse<span class="arch-subtext">Analytics Ready</span></div>
                </div>
            </div>
        `
    },
    'node-projects': {
        title: 'deploy_projects.sh',
        logs: [
            "[INFO] Triggering downstream deploys for portfolio assets...",
            "[INFO] Compiling Enterprise PySpark Pipeline...",
            "[INFO] Benchmarking Claude 3 Sonnet vs Titan on AWS Bedrock...",
            "[SUCCESS] All pipeline artifacts deployed successfully."
        ],
        content: `
            <h3>Featured Projects</h3>

            <h4>1. Enterprise PySpark Pipeline</h4>
            <p>Scalable ETL pipeline processing 50M+ records with 45% throughput improvement via partition strategies and AQE.</p>
            <div class="code-snippet-container">
<pre><code><span class="code-comment">// Spark AQE Optimization</span>
<span class="code-keyword">spark</span>.conf.<span class="code-method">set</span>(<span class="code-string">"spark.sql.adaptive.enabled"</span>, <span class="code-string">"true"</span>)
<span class="code-keyword">spark</span>.conf.<span class="code-method">set</span>(<span class="code-string">"spark.sql.shuffle.partitions"</span>, <span class="code-string">"200"</span>)
<span class="code-keyword">spark</span>.conf.<span class="code-method">set</span>(<span class="code-string">"spark.sql.adaptive.coalescePartitions.enabled"</span>, <span class="code-string">"true"</span>)</code></pre>
            </div>

            <h4>2. Generative AI Chatbot — AWS Bedrock</h4>
            <p>Multi-model benchmarking framework with structured prompt engineering (zero/few-shot). Claude 3 Sonnet consistently outperformed Titan.</p>
            <div class="arch-flow-container" style="padding:16px;margin:12px 0">
                <div class="arch-flow">
                    <div class="arch-node">👤 User Query<span class="arch-subtext">Zero/Few Shot</span></div>
                    <div class="arch-arrow">→</div>
                    <div class="arch-node" style="border-color:#8b5cf6">🧠 AWS Bedrock<span class="arch-subtext">Claude / Titan</span></div>
                    <div class="arch-arrow">→</div>
                    <div class="arch-node" style="border-color:#10b981">📈 Evaluation<span class="arch-subtext">Accuracy Metrics</span></div>
                </div>
            </div>

            <h4>3. Kafka → Milvus RAG Pipeline</h4>
            <p>Streaming Kafka topics into Milvus vector database for low-latency Retrieval-Augmented Generation (RAG) within enterprise boundaries.</p>
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
    const svgRect = svgContainer.getBoundingClientRect();

    dagEdgesData.forEach(link => {
        const fromNode = document.getElementById(link.from);
        const toNode   = document.getElementById(link.to);
        if (!fromNode || !toNode) return;

        const fromRect = fromNode.getBoundingClientRect();
        const toRect   = toNode.getBoundingClientRect();

        const startX = fromRect.left + fromRect.width / 2 - svgRect.left;
        const startY = fromRect.bottom - svgRect.top;
        const endX   = toRect.left + toRect.width / 2 - svgRect.left;
        const endY   = toRect.top - svgRect.top;
        const cy     = startY + (endY - startY) / 2;

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', `M ${startX},${startY} C ${startX},${cy} ${endX},${cy} ${endX},${endY}`);
        path.setAttribute('class', 'dag-edge');
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


// ═══════════════════════════════════════════════
// 5. DAG ORCHESTRATION
// ═══════════════════════════════════════════════
const dagsBtn  = document.getElementById('trigger-dag-btn');
const clearBtn = document.getElementById('clear-dag-btn');

const executionOrder = [
    ['node-ingest'],
    ['node-process'],
    ['node-storage'],
    ['node-analytics', 'node-insights']
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
