import os

filepath = r"C:\Users\sushma vunnam\.gemini\antigravity\scratch\portfolio\styles.css"
with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
    text = f.read()

# Find the valid end
good_end = text.find("#app-wrapper.blurred {")
if good_end != -1:
    end_bracket = text.find("}", good_end)
    good_text = text[:end_bracket + 1] + "\n"
else:
    good_text = text

correct_css = """
/* ---- Visual Components Additions for portfolio details panel ---- */

/* 1. Impact Metrics Grid */
.metrics-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    margin: 20px 0 32px 0;
}

.metric-box {
    background: #ffffff;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 20px 16px;
    text-align: center;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    transition: transform 0.2s ease, box-shadow 0.2s;
}

.metric-box:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    border-color: #cbd5e1;
}

.metric-value {
    display: block;
    font-size: 2rem;
    font-weight: 800;
    color: var(--accent-blue);
    line-height: 1.1;
    margin-bottom: 8px;
    font-family: var(--font-sans);
}

.metric-label {
    display: block;
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

/* 2. Architecture Diagram Flow */
.arch-flow-container {
    background: #f8fafc;
    border: 1px dashed #cbd5e1;
    border-radius: 12px;
    padding: 24px;
    margin: 24px 0;
    overflow-x: auto;
}

.arch-flow {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 12px;
    min-width: max-content;
}

.arch-node {
    background: #ffffff;
    border: 1.5px solid var(--accent-blue);
    border-radius: 6px;
    padding: 12px 18px;
    font-weight: 700;
    font-size: 0.95rem;
    color: var(--text-primary);
    box-shadow: 0 2px 4px rgba(37, 99, 235, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
}

.arch-node span.arch-subtext {
    font-size: 0.75rem;
    color: var(--text-secondary);
    font-weight: 600;
}

.arch-arrow {
    color: var(--text-secondary);
    font-weight: bold;
    font-size: 1.2rem;
}

/* 3. Tech Badges / Chips */
.tech-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 12px;
    margin-bottom: 24px;
}

.tech-badge {
    background-color: #f1f5f9;
    border: 1px solid #e2e8f0;
    color: #334155;
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 600;
    transition: all 0.2s ease;
}

.tech-badge:hover {
    background-color: var(--accent-blue-glow);
    border-color: var(--accent-blue);
    color: var(--accent-blue);
}

/* 4. Code Snippets */
.code-snippet-container {
    background: #0f172a; /* Deep dark blue for code */
    border-radius: 8px;
    padding: 16px 20px;
    margin: 20px 0;
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.2);
    border: 1px solid #1e293b;
    overflow-x: auto;
}

.code-snippet-container pre {
    margin: 0;
}

.code-snippet-container code {
    font-family: var(--font-mono);
    font-size: 0.85rem;
    color: #e2e8f0;
    line-height: 1.5;
}

.code-keyword { color: #f472b6; } /* Pink */
.code-string { color: #86efac; } /* Light Green */
.code-method { color: #60a5fa; } /* Light Blue */
.code-comment { color: #64748b; font-style: italic; }
"""

with open(filepath, "w", encoding="utf-8") as f:
    f.write(good_text + "\n" + correct_css)
