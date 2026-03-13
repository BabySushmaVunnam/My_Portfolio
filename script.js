// Elements
const svgContainer = document.getElementById('edges-container');
const detailsPanel = document.getElementById('details-panel');
const closePanelBtn = document.getElementById('close-panel-btn');
const dagsBtn = document.getElementById('trigger-dag-btn');
const clearBtn = document.getElementById('clear-dag-btn');

const panelTitle = document.getElementById('panel-title');
const panelContent = document.getElementById('panel-content');
const panelBadge = document.getElementById('panel-state-badge');
const panelLogs = document.getElementById('panel-logs');

// Define the DAG logic structure
// Edges: from -> to
const dagEdgesData = [
    { from: 'node-bio', to: 'node-skills' },
    { from: 'node-skills', to: 'node-experience' },
    { from: 'node-skills', to: 'node-projects' }
];

// Content for each node (To be expanded in later phase)
const nodeDataMap = {
    'node-bio': {
        title: 'extract_bio.py',
        logs: [
            "[INFO] Initializing distributed biography extraction...", 
            "[INFO] Querying partition: data_engineer.sushma_vunnam", 
            "[SUCCESS] Extraction complete. Human detected.",
            "[INFO] Parsing metadata parameters: [Motivation, Core_Focus]"
        ],
        content: `
            <h3>About Me</h3>
            <p>I am a Data Engineer with 3+ years of experience building large-scale Spark-based data pipelines using Java, PySpark, and SQL. I specialize in designing batch and streaming systems capable of handling 100M+ records daily.</p>
            <p>I am deeply passionate about <strong>Machine Learning Infrastructure</strong>, performance optimization across cloud platforms (Azure/AWS), and modernizing enterprise analytics workflows.</p>
            
            <div class="metrics-grid">
                <div class="metric-box">
                    <span class="metric-value">100M+</span>
                    <span class="metric-label">Daily Records Processed</span>
                </div>
                <div class="metric-box">
                    <span class="metric-value">600M+</span>
                    <span class="metric-label">Records/Batch Run</span>
                </div>
                <div class="metric-box">
                    <span class="metric-value">50M+</span>
                    <span class="metric-label">Events Per Day</span>
                </div>
                <div class="metric-box">
                    <span class="metric-value">80%</span>
                    <span class="metric-label">Spark Perf. Boost</span>
                </div>
            </div>

            <h3>Education</h3>
            <ul>
                <li><strong>MS, Data Analytics Engineering</strong> (GPA: 3.70) - George Mason University, USA</li>
                <li><strong>B.Tech, Electrical & Electronics Engineering</strong> (GPA: 7.0) - SASTRA University, India</li>
            </ul>
        `
    },
    'node-skills': {
        title: 'transform_skills.sql',
        logs: [
            "[INFO] Parsing DAG dependencies...", 
            "[INFO] Executing complex JOIN on table: core_competencies", 
            "[INFO] Optimizing query planner for Big Data runtimes",
            "[SUCCESS] Transformations completed. Materialized view 'Skills' created."
        ],
        content: `
            <h3>Core Engineering Competencies</h3>
            
            <h4>Big Data & Distributed Systems</h4>
            <div class="tech-badges">
                <span class="tech-badge">Apache Spark</span>
                <span class="tech-badge">PySpark</span>
                <span class="tech-badge">Scala</span>
                <span class="tech-badge">Hadoop/HDFS</span>
                <span class="tech-badge">Hive</span>
            </div>

            <h4>Streaming Analytics</h4>
            <div class="tech-badges">
                <span class="tech-badge">Apache Kafka</span>
                <span class="tech-badge">Spark Streaming</span>
                <span class="tech-badge">Micro-batch Processing</span>
            </div>

            <h4>Databases & Storage Formats</h4>
            <div class="tech-badges">
                <span class="tech-badge">Apache Cassandra</span>
                <span class="tech-badge">PostgreSQL</span>
                <span class="tech-badge">MongoDB</span>
                <span class="tech-badge">Delta Lake</span>
                <span class="tech-badge">Parquet / ORC</span>
            </div>

            <h4>Cloud, Orchestration & Observability</h4>
            <div class="tech-badges">
                <span class="tech-badge">AWS (Bedrock, EC2)</span>
                <span class="tech-badge">Azure</span>
                <span class="tech-badge">Apache Airflow</span>
                <span class="tech-badge">Prometheus</span>
                <span class="tech-badge">Grafana</span>
                <span class="tech-badge">Docker / CI/CD</span>
            </div>
            
            <h4>Programming & AI</h4>
            <div class="tech-badges">
                <span class="tech-badge">Java (8/17)</span>
                <span class="tech-badge">Python (FastAPI)</span>
                <span class="tech-badge">SQL</span>
                <span class="tech-badge">Prompt Eng (Claude, Sonnet)</span>
            </div>
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
            <h3>Work Experience (Architecture)</h3>
            
            <h4>Walmart Global Tech <span class="monospaced" style="font-size: 0.8em; font-weight: normal;">(Dec 2024 - Present)</span></h4>
            <p>Designed and built a real-time marketplace data pipeline capable of handling high-throughput catalog streams and 600M+ batch records.</p>
            
            <div class="arch-flow-container">
                <div class="arch-flow">
                    <div class="arch-node">📦 Marketplace Events<span class="arch-subtext">50M+ / day</span></div>
                    <div class="arch-arrow">→</div>
                    <div class="arch-node" style="border-color: #d97706;">♨️ Apache Kafka<span class="arch-subtext">Java Consumers</span></div>
                    <div class="arch-arrow">→</div>
                    <div class="arch-node" style="border-color: #eab308;">⚡ Apache Spark<span class="arch-subtext">AQE Optimized (80% boost)</span></div>
                    <div class="arch-arrow">→</div>
                    <div class="arch-node" style="border-color: #3b82f6;">🗄️ Enterprise Data Lake<span class="arch-subtext">Delta / Harmony Platform</span></div>
                    <div class="arch-arrow">→</div>
                    <div class="arch-node" style="border-color: #10b981;">📊 Analytics & Observability<span class="arch-subtext">Prometheus / Grafana</span></div>
                </div>
            </div>
            
            <h4>Accenture <span class="monospaced" style="font-size: 0.8em; font-weight: normal;">(Feb 2021 - Jun 2022)</span></h4>
            <p>Built automated data ingestion workflows handling 10M+ daily records from heterogeneous sources (SAP, Oracle, flat files).</p>

            <div class="arch-flow-container" style="padding: 16px;">
                <div class="arch-flow">
                    <div class="arch-node">🗃️ Legacy Systems<span class="arch-subtext">SAP / CSV / Oracle</span></div>
                    <div class="arch-arrow">→</div>
                    <div class="arch-node" style="border-color: #8b5cf6;">🐍 Python / SQL ETL<span class="arch-subtext">Custom Ingestion DAGs</span></div>
                    <div class="arch-arrow">→</div>
                    <div class="arch-node" style="border-color: #eab308;">⚡ PySpark Cleansing<span class="arch-subtext">Schema validation</span></div>
                    <div class="arch-arrow">→</div>
                    <div class="arch-node" style="border-color: #3b82f6;">🏢 Data Warehouse<span class="arch-subtext">Analytics Ready</span></div>
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
            <h3>Featured Projects & Code</h3>
            
            <h4>1. Enterprise PySpark Pipeline</h4>
            <p>A scalable ETL pipeline processing 50M+ records. Delivered a 45% performance improvement through strict partition strategies and Adaptive Query Execution.</p>
            
            <div class="code-snippet-container">
<pre><code><span class="code-comment">// Sample Spark Optimization Parameters</span>
<span class="code-keyword">spark</span>.conf.<span class="code-method">set</span>(<span class="code-string">"spark.sql.adaptive.enabled"</span>, <span class="code-string">"true"</span>)
<span class="code-keyword">spark</span>.conf.<span class="code-method">set</span>(<span class="code-string">"spark.sql.shuffle.partitions"</span>, <span class="code-string">"200"</span>)
<span class="code-keyword">spark</span>.conf.<span class="code-method">set</span>(<span class="code-string">"spark.sql.adaptive.coalescePartitions.enabled"</span>, <span class="code-string">"true"</span>)</code></pre>
            </div>

            <h4>2. Generative AI Chatbot (AWS Bedrock)</h4>
            <p>Developed a multi-model AI benchmarking framework. Designed structured prompt engineering templates to evaluate LLM reasoning, consistently identifying Claude 3 as the top-performing model over Titan.</p>

            <div class="arch-flow-container" style="padding: 16px; margin: 16px 0;">
                <div class="arch-flow">
                    <div class="arch-node">👤 User Query<span class="arch-subtext">Zero/Few Shot</span></div>
                    <div class="arch-arrow">→</div>
                    <div class="arch-node" style="border-color: #8b5cf6;">🧠 AWS Bedrock API<span class="arch-subtext">Claude / Titan / Sonnet</span></div>
                    <div class="arch-arrow">→</div>
                    <div class="arch-node" style="border-color: #10b981;">📈 Evaluation Framework<span class="arch-subtext">Accuracy Metrics</span></div>
                </div>
            </div>

            <h4>3. Enterprise Target: Native Milvus Integration</h4>
            <p>Currently researching the deployment architecture for feeding streaming <strong>Kafka</strong> topics concurrently into a <strong>Milvus</strong> vector database for low-latency Retrieval-Augmented Generation (RAG) within corporate boundaries.</p>
        `
    }
}

// ----------------------------------------------------
// 1. SVG Edge Drawing Logic
// ----------------------------------------------------
let edgeElements = [];

function drawEdges() {
    // Clear existing
    svgContainer.innerHTML = '';
    edgeElements = [];

    const svgRect = svgContainer.getBoundingClientRect();

    dagEdgesData.forEach(link => {
        const fromNode = document.getElementById(link.from);
        const toNode = document.getElementById(link.to);

        if (!fromNode || !toNode) return;

        const fromRect = fromNode.getBoundingClientRect();
        const toRect = toNode.getBoundingClientRect();

        // Calculate connection points relative to SVG container
        // From: middle bottom
        const startX = fromRect.left + (fromRect.width / 2) - svgRect.left;
        const startY = fromRect.bottom - svgRect.top;

        // To: middle top
        const endX = toRect.left + (toRect.width / 2) - svgRect.left;
        const endY = toRect.top - svgRect.top;

        // Draw a bezier curve connecting them
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        const controlY = startY + (endY - startY) / 2;
        
        const d = `M ${startX},${startY} C ${startX},${controlY} ${endX},${controlY} ${endX},${endY}`;
        
        path.setAttribute("d", d);
        path.setAttribute("class", "dag-edge");
        path.dataset.from = link.from;
        path.dataset.to = link.to;

        svgContainer.appendChild(path);
        edgeElements.push(path);
    });
}

// Redraw on window resize
window.addEventListener('resize', drawEdges);

// ----------------------------------------------------
// 2. Interaction & Panel Logic
// ----------------------------------------------------
function openPanel(nodeId) {
    const node = document.getElementById(nodeId);
    if (!node) return;

    const data = nodeDataMap[nodeId];
    const status = node.getAttribute('data-status');

    panelTitle.textContent = data.title;
    panelContent.innerHTML = data.content;
    
    // Set Badge
    panelBadge.textContent = status.charAt(0).toUpperCase() + status.slice(1);
    panelBadge.className = 'badge badge-' + status;

    // Render Logs based on status
    panelLogs.innerHTML = '';
    if (status === 'pending') {
        panelLogs.innerHTML = '<p class="log-line">Waiting for task execution to complete...</p>';
    } else if (status === 'running') {
        panelLogs.innerHTML = '<p class="log-line info">' + data.logs[0] + '</p>';
        panelLogs.innerHTML += '<p class="log-line warn">' + data.logs[1] + '</p>';
    } else if (status === 'success') {
        data.logs.forEach(l => {
            let cls = l.includes('SUCCESS') ? 'success' : (l.includes('INFO') ? 'info' : '');
            panelLogs.innerHTML += '<p class="log-line ' + cls + '">' + l + '</p>';
        });
    }

    detailsPanel.classList.add('open');
}

closePanelBtn.addEventListener('click', () => {
    detailsPanel.classList.remove('open');
});

// Add click listeners to nodes
document.querySelectorAll('.dag-node').forEach(node => {
    node.addEventListener('click', () => openPanel(node.id));
});

// ----------------------------------------------------
// 3. Orchestration Engine (The "Trigger" logic)
// ----------------------------------------------------
const executionOrder = [
    ['node-bio'],                           // Layer 1
    ['node-skills'],                        // Layer 2
    ['node-experience', 'node-projects']    // Layer 3
];

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function updateNodeState(nodeId, state) {
    const node = document.getElementById(nodeId);
    node.setAttribute('data-status', state);
    
    // Update incoming edges if status turns success or running
    if(state === 'success' || state === 'running'){
        edgeElements.forEach(edge => {
            // If the edge comes out of this node, glow it
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
        
        // Mark layer as running
        for (const nodeId of layer) {
            updateNodeState(nodeId, 'running');
        }
        
        // Wait simulated processing time
        await sleep(1500);

        // Mark layer as success
        for (const nodeId of layer) {
            updateNodeState(nodeId, 'success');
        }
    }

    dagsBtn.disabled = false;
}

function clearDagState() {
    document.querySelectorAll('.dag-node').forEach(node => {
        node.setAttribute('data-status', 'pending');
    });
    document.querySelectorAll('.dag-edge').forEach(edge => {
        edge.classList.remove('success', 'running');
    });
}

dagsBtn.addEventListener('click', triggerDag);
clearBtn.addEventListener('click', clearDagState);

// INIT
setTimeout(drawEdges, 100); // Draw after brief delay to ensure DOM is ready

// ----------------------------------------------------
// 4. Gatekeeper Modal
// ----------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    const connectBtn = document.getElementById('connect-btn');
    const nameInput = document.getElementById('visitor-name-input');
    const modalInputGroup = document.querySelector('.modal-input-group');
    const modalStatus = document.getElementById('modal-greeting-status');
    const greetingText = document.getElementById('greeting-text');
    const modalOverlay = document.getElementById('welcome-modal');
    const appWrapper = document.getElementById('app-wrapper');

    connectBtn.addEventListener('click', () => {
        const rawName = nameInput.value.trim();
        const visitorName = rawName ? rawName : "Guest";

        // Hide input, show loading status
        modalInputGroup.style.display = 'none';
        modalStatus.classList.remove('hidden');
        
        // Personalized Greeting
        greetingText.innerHTML = `Hi <strong style="color:var(--text-primary)">${visitorName}</strong>, initializing data pipeline...`;

        // Simulate connection delay then reveal portfolio
        setTimeout(() => {
            modalOverlay.classList.add('fade-out');
            appWrapper.classList.remove('blurred');
            
            // Remove modal from DOM after fade out completes
            setTimeout(() => {
                modalOverlay.style.display = 'none';
                // Automatically run the pipeline for them!
                triggerDag();
            }, 600);
            
        }, 1800); // 1.8 seconds to read the personalized message
    });
    
    // Allow 'Enter' key to submit
    nameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            connectBtn.click();
        }
    });
});
