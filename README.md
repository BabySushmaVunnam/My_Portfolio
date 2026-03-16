<div align="center">

# ⚡ Sushma Vunnam — Data Engineer Portfolio

**An interactive, DAG-driven portfolio** — built to think, feel, and run like a real data pipeline.

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Open_Portfolio-6366f1?style=for-the-badge)](./index.html)
[![Tech](https://img.shields.io/badge/Stack-HTML%20%7C%20CSS%20%7C%20JS-0ea5e9?style=for-the-badge)]()
[![Data](https://img.shields.io/badge/Scale-100M%2B_Records%2FDay-10b981?style=for-the-badge)]()

</div>

---

## 🧠 About This Portfolio

This isn't a traditional resume page. It's a **live simulation of an Apache Airflow DAG** — the same kind of infrastructure I build professionally.

> Enter your name → the pipeline runs → nodes execute in dependency order → your career story unfolds.

Every section is a **DAG task node** with real-time status (Pending → Running → Success), animated SVG edges, and structured log outputs that mirror what you'd see in a real orchestration platform.

---

## ✨ Live Features

| Feature | Description |
|---|---|
| 🔐 **Gatekeeper Modal** | Personalized visitor authentication with a simulated connection handshake |
| 🕸️ **Interactive DAG** | Clickable pipeline nodes connected by animated SVG Bézier edges |
| ▶️ **Run Pipeline** | Triggers realistic execution — nodes turn Running → Success with staggered delays |
| 📋 **Details Side Panel** | Click any node to reveal logs, metadata, architecture diagrams & code snippets |
| 📡 **Live Log Stream** | Color-coded `[INFO]`, `[WARN]`, `[SUCCESS]` log lines per task state |
| 📐 **Architecture Flows** | Visual flow diagrams embedded inside each node's detail panel |
| 🔄 **Responsive Edges** | SVG edges redraw dynamically on window resize |
| ⌨️ **Keyboard Support** | Press `Enter` in the modal to connect instantly |

---

## 🗂️ DAG Structure

```
node-bio ──────────────────── node-skills
                                    │
                    ┌───────────────┴───────────────┐
                    ▼                               ▼
            node-experience                  node-projects
```

| Node | File | Description |
|---|---|---|
| 👤 `node-bio` | `extract_bio.py` | Profile, education, and impact metrics |
| ⚙️ `node-skills` | `transform_skills.sql` | Full technical skills matrix |
| 💼 `node-experience` | `load_experience.yml` | Work history with architecture diagrams |
| 🚀 `node-projects` | `deploy_projects.sh` | Featured projects with live code snippets |

---

## 📊 Impact at a Glance

<div align="center">

| Metric | Value |
|:---:|:---:|
| 📦 Daily Records Processed | **100M+** |
| 🔁 Records per Batch Run | **600M+** |
| 📡 Events Per Day | **50M+** |
| ⚡ Spark Performance Boost | **80%** via AQE |
| 🏎️ ETL Throughput Gain | **45%** via partition optimization |

</div>

---

## 🛠️ Tech Stack

**Big Data & Distributed Systems**
`Apache Spark` `PySpark` `Scala` `Hadoop/HDFS` `Hive`

**Streaming & Messaging**
`Apache Kafka` `Spark Streaming` `Micro-batch Processing`

**Databases & Storage**
`Apache Cassandra` `PostgreSQL` `MongoDB` `Delta Lake` `Parquet / ORC`

**Cloud, Orchestration & Observability**
`AWS (Bedrock, EC2)` `Azure` `Apache Airflow` `Prometheus` `Grafana` `Docker / CI/CD`

**Languages & AI**
`Java 8/17` `Python (FastAPI)` `SQL` `Prompt Engineering (Claude, Sonnet)`

---

## 💼 Experience Timeline

```
Dec 2024 – Present   🏢 Walmart Global Tech
                      Real-time marketplace pipeline · Kafka → Spark (AQE) → Delta Lake
                      50M+ events/day · 600M+ records/batch · Prometheus/Grafana observability

Feb 2021 – Jun 2022  🌐 Accenture
                      Automated ingestion from SAP, Oracle, flat files · 10M+ records/day
                      PySpark cleansing → Data Warehouse (analytics-ready)
```

---

## 🚀 Featured Projects

### 1. Enterprise PySpark Pipeline
- Processes **50M+ records** end-to-end
- **45% performance improvement** through partition strategies + AQE
- Spark config tuned with `coalescePartitions`, `shuffle.partitions`, and adaptive planning

### 2. Generative AI Chatbot — AWS Bedrock
- Multi-model benchmarking framework (Claude 3 Sonnet vs. Titan)
- Structured prompt engineering templates (zero-shot / few-shot)
- Claude 3 identified as consistently top-performing model

### 3. Native Milvus Integration (In Progress)
- Streaming Kafka topics → Milvus vector database
- Low-latency RAG (Retrieval-Augmented Generation) within enterprise boundaries

---

## 📁 Project Structure

```
portfolio/
├── index.html          # Main entry point — DAG canvas & modal
├── styles.css          # Dark-mode design system & animations
├── visual_styles.css   # Additional visual layer & typography
└── script.js           # Full DAG orchestration engine
```

---

## 🎓 Education

| Degree | Institution | GPA |
|---|---|---|
| MS, Data Analytics Engineering | George Mason University, USA | 3.70 / 4.0 |
| B.Tech, Electrical & Electronics Engineering | SASTRA University, India | 7.0 / 10 |

---

## 🚀 Getting Started

No build tools needed. Just open the file:

```bash
# Clone or download the portfolio
git clone <your-repo-url>

# Open in browser
open portfolio/index.html
# or on Windows:
start portfolio/index.html
```

> 💡 **Tip:** For the best experience, open in Chrome or Firefox. Enter your name in the modal and click **Connect** to launch the pipeline!

---

## 📬 Contact

<div align="center">

**Sushma Vunnam** · Data Engineer · ML Infrastructure Enthusiast

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077b5?style=flat-square&logo=linkedin)](https://linkedin.com/in/sushma-vunnam)
[![Email](https://img.shields.io/badge/Email-Reach_Out-ea4335?style=flat-square&logo=gmail)](mailto:sushma@example.com)

*Open to Senior Data Engineer & ML Platform roles — especially at scale.*

</div>

---

<div align="center">
  <sub>Built with 💜 by Sushma Vunnam · Designed to run like the pipelines it represents.</sub>
</div>
