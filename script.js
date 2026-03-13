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
            <br>
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
            
            <h4>Big Data & Streaming</h4>
            <ul>
                <li><strong>Distributed Compute:</strong> Apache Spark (PySpark, Scala, Java), Hadoop/HDFS, Hive</li>
                <li><strong>Streaming:</strong> Apache Kafka, Micro-Batch Processing, Harmony Platform</li>
                <li><strong>Storage Formats:</strong> Parquet, Delta Lake, JSON, ORC</li>
            </ul>

            <h4>Cloud & Infrastructure-as-Code</h4>
            <ul>
                <li><strong>Cloud Ecosystems:</strong> AWS (Bedrock, EC2, S3), Azure, GCP (GCS)</li>
                <li><strong>Orchestration:</strong> Apache Airflow, Workflow Automation, Metadata-Driven orchestration</li>
                <li><strong>DevOps & Monitoring:</strong> Docker, Git, CI/CD, Grafana, Prometheus, Splunk</li>
            </ul>

            <h4>Languages & Frameworks</h4>
            <ul>
                <li><strong>Languages:</strong> Java (8/17), Python (Flask, FastAPI), SQL, Scala, Bash/Shell</li>
                <li><strong>Databases:</strong> Apache Cassandra, Azure SQL, PostgreSQL, MongoDB</li>
                <li><strong>Data Science & AI:</strong> PyTorch, Pandas, MLflow, Prompt Engineering (Claude, Sonnet), AWS Bedrock</li>
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
            <h3>Professional Experience</h3>
            
            <p><strong>Data Engineer @ Walmart Global Tech</strong> <span class="monospaced">(Dec 2024 - Present)</span></p>
            <ul>
                <li>Built a real-time marketplace data pipeline using <strong>Kafka (Java)</strong> to ingest product metadata and pricing updates, enabling accurate downstream catalog analytics.</li>
                <li>Designed a large-scale batch framework of 7 interconnected <strong>Spark</strong> pipelines handling 600M+ records per run.</li>
                <li>Delivered an 80% improvement in Spark job performance by tuning AQE, optimizing partitioning, caching, and broadcast joins.</li>
            </ul>

            <p><strong>Software Trainee @ UCode Technologies</strong> <span class="monospaced">(Jun 2024 - Nov 2024)</span></p>
            <ul>
                <li>Developed backend data processing services using Python (Flask/FastAPI) and built ETL pipelines integrating MySQL.</li>
            </ul>

            <p><strong>Associate Software Engineer @ Accenture</strong> <span class="monospaced">(Feb 2021 - Jun 2022)</span></p>
            <ul>
                <li>Built automated data ingestion workflows using Python, SQL, and <strong>Apache Spark</strong> handling 10M+ daily records from SAP systems and CSV files.</li>
                <li>Created data transformation logic using PySpark and implemented monitoring mechanisms with Python scripts and logging frameworks.</li>
            </ul>
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
            <h3>Completed & Target Projects</h3>
            
            <h4>1. Generative AI Chatbot (AWS Bedrock)</h4>
            <p>Developed a multi-model AI chatbot benchmarking Claude, Titan, and Sonnet on reasoning quality. Built structured prompt engineering templates to evaluate LLM consistency, identifying Claude as the top-performing model. Presented findings to the CENTRL ITS team.</p>
            <br>
            
            <h4>2. Enterprise PySpark Pipeline</h4>
            <p>Built a scalable ETL pipeline using PySpark to ingest, clean, and aggregate 50M+ records. Designed Airflow DAGs for ingestion and validation, modeled curated datasets into star schemas, and improved job performance by 45% using optimized window functions.</p>
            <br>

            <h4>3. Current Working Goal: Real-Time RAG Pipeline Target</h4>
            <p><strong>[Currently exploring]</strong> Extending my Bedrock chatbot experience into a continuous ingestion data pipeline that streams documentation via <strong>Kafka</strong>, and upserts vectors directly into a <strong>Milvus</strong> vector database to serve live LLM queries.</p>
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
