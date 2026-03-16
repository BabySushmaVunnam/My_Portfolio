# Sushma Vunnam — Data Engineer Portfolio

An interactive portfolio built to look, feel, and run like a real Apache Airflow DAG. Enter your name, hit Connect, and watch the pipeline execute — nodes light up in dependency order, edges animate, and each task reveals a section of the portfolio.

## How It Works

The portfolio is structured as a Directed Acyclic Graph (DAG) with four task nodes: **Profile & Education**, **Technical Skills**, **Work Experience**, and **Portfolio Projects**. Nodes execute layer by layer, simulating real pipeline orchestration — each transitions from Pending → Running → Success with a staggered delay.

Clicking any node opens a side panel that renders structured logs, metadata (operator, state, duration), and the full content for that section — including embedded architecture flow diagrams and syntax-highlighted code snippets.

## Features

A welcome modal greets each visitor by name and simulates a connection handshake before revealing the canvas. SVG Bézier edges connect the nodes and redraw responsively on window resize. The **Run Pipeline** button re-triggers the full execution sequence; **Clear State** resets all nodes back to Pending. The `Enter` key is supported in the modal for quick access.

## Stack

Built with vanilla HTML, CSS, and JavaScript — no frameworks, no dependencies. All animations, edge drawing, and orchestration logic are hand-rolled.

## Running Locally

Open `index.html` directly in any modern browser. No build step or server required.

---

*Designed to run like the pipelines it represents.*
