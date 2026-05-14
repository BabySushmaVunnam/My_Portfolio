// ═══════════════════════════════════════════════
// 0. CANVAS BACKGROUND — PARTICLE NETWORK
// ═══════════════════════════════════════════════
(function initCanvas() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, particles, pulses, dataDrops;

    const PARTICLE_COUNT = 65;
    const CONNECT_DIST   = 150;
    const PULSE_EVERY    = 1600;
    const REPEL_R        = 140;
    let mX = -9999, mY = -9999;
    window.addEventListener('mousemove', e => { mX = e.clientX; mY = e.clientY; }, { passive: true });
    const DROP_WORDS = [
        'SELECT','JOIN','SPARK','KAFKA','ETL','DELTA',
        'STREAM','0x3F','1101','dbt','BATCH','AWS',
        'HDFS','SQL','ML','YARN','ORC','0xFF','API','RAG',
    ];

    const rand = (a, b) => a + Math.random() * (b - a);

    function mkParticle() {
        return { x: rand(0,W), y: rand(0,H), vx: rand(-0.15,0.15), vy: rand(-0.15,0.15), r: rand(1,2.5), op: rand(0.35,0.8) };
    }
    function mkPulse(p1, p2) {
        return { p1, p2, t: 0, s: rand(0.007, 0.014) };
    }
    function mkDrop() {
        return { x: rand(0,W), y: rand(-H,0), vy: rand(0.12,0.4), word: DROP_WORDS[0|Math.random()*DROP_WORDS.length], op: rand(0.04,0.1), sz: rand(9,13) };
    }

    function resize() { W = canvas.width = innerWidth; H = canvas.height = innerHeight; }

    function isDark() { return document.documentElement.getAttribute('data-theme') !== 'light'; }

    function init() {
        resize();
        particles = Array.from({length: PARTICLE_COUNT}, mkParticle);
        pulses    = [];
        dataDrops = Array.from({length: 20}, mkDrop);
    }

    let lastPulse = 0;

    function draw(ts) {
        requestAnimationFrame(draw);
        ctx.clearRect(0, 0, W, H);

        const dark    = isDark();
        const node    = dark ? '139,92,246'  : '109,40,217';
        const line    = dark ? '139,92,246'  : '109,40,217';
        const pulse1  = dark ? '139,92,246'  : '109,40,217';
        const pulse2  = dark ? '236,72,153'  : '190,24,93';
        const dropClr = dark ? '167,139,250' : '124,58,237';

        // Floating data words
        for (const d of dataDrops) {
            d.y += d.vy;
            if (d.y > H + 20) { d.y = rand(-60,0); d.x = rand(0,W); d.word = DROP_WORDS[0|Math.random()*DROP_WORDS.length]; }
            ctx.globalAlpha = d.op;
            ctx.fillStyle = `rgb(${dropClr})`;
            ctx.font = `600 ${d.sz}px 'Fira Code',monospace`;
            ctx.fillText(d.word, d.x, d.y);
        }

        // Move particles — mouse repulsion creates a parting-sea effect
        for (const p of particles) {
            const rdx = p.x - mX, rdy = p.y - mY;
            const rd2 = rdx * rdx + rdy * rdy;
            if (rd2 < REPEL_R * REPEL_R && rd2 > 1) {
                const rd = Math.sqrt(rd2);
                const f  = (REPEL_R - rd) / REPEL_R * 0.55;
                p.vx += (rdx / rd) * f;
                p.vy += (rdy / rd) * f;
            }
            p.vx *= 0.96; p.vy *= 0.96;
            const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
            if (spd > 2.2) { p.vx = p.vx / spd * 2.2; p.vy = p.vy / spd * 2.2; }
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
            if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        }

        // Edges
        for (let i = 0; i < particles.length; i++) {
            for (let j = i+1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const d  = dx*dx + dy*dy;
                if (d > CONNECT_DIST*CONNECT_DIST) continue;
                ctx.globalAlpha = (1 - Math.sqrt(d)/CONNECT_DIST) * 0.15;
                ctx.strokeStyle = `rgb(${line})`;
                ctx.lineWidth = 0.7;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }

        // Dots
        for (const p of particles) {
            ctx.globalAlpha = p.op * 0.65;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
            ctx.fillStyle = `rgb(${node})`;
            ctx.fill();
        }

        // Spawn pulses
        if (ts - lastPulse > PULSE_EVERY) {
            lastPulse = ts;
            const close = [];
            for (let i = 0; i < particles.length; i++) {
                for (let j = i+1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    if (dx*dx + dy*dy < CONNECT_DIST*CONNECT_DIST) close.push([particles[i],particles[j]]);
                }
            }
            if (close.length) {
                const pair = close[0|Math.random()*close.length];
                pulses.push(mkPulse(pair[0],pair[1]));
                if (Math.random()>0.5) pulses.push(mkPulse(pair[1],pair[0]));
            }
        }

        // Draw pulses
        pulses = pulses.filter(pu => {
            pu.t += pu.s;
            if (pu.t >= 1) return false;
            const px = pu.p1.x + (pu.p2.x - pu.p1.x) * pu.t;
            const py = pu.p1.y + (pu.p2.y - pu.p1.y) * pu.t;
            const g = ctx.createRadialGradient(px,py,0, px,py,10);
            g.addColorStop(0,   `rgba(${pulse2},0.9)`);
            g.addColorStop(0.4, `rgba(${pulse1},0.4)`);
            g.addColorStop(1,   `rgba(${pulse1},0)`);
            ctx.globalAlpha = 1;
            ctx.beginPath(); ctx.arc(px,py,10,0,Math.PI*2); ctx.fillStyle = g; ctx.fill();
            ctx.beginPath(); ctx.arc(px,py,2.5,0,Math.PI*2); ctx.fillStyle = `rgb(${pulse2})`; ctx.fill();
            return true;
        });

        ctx.globalAlpha = 1;
    }

    window.addEventListener('resize', () => { resize(); init(); });
    init();
    requestAnimationFrame(draw);
})();



// ═══════════════════════════════════════════════
// 1. PORTFOLIO STRUCTURE DAG VISUALIZATION
// ═══════════════════════════════════════════════
(function initDAG() {
    const canvas = document.getElementById('dag-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationId = null;

    const NODES = [
        { id: 'about', label: 'About', x: 0.5, y: 0.2, color: '#8B5CF6' },
        { id: 'education', label: 'Education', x: 0.15, y: 0.65, color: '#EC4899' },
        { id: 'experience', label: 'Experience', x: 0.5, y: 0.75, color: '#8B5CF6' },
        { id: 'projects', label: 'Projects', x: 0.85, y: 0.65, color: '#EC4899' },
        { id: 'certifications', label: 'Certifications', x: 0.5, y: 0.5, color: '#A78BFA' },
    ];

    const CONNECTIONS = [
        { from: 'about', to: 'education' },
        { from: 'about', to: 'experience' },
        { from: 'about', to: 'projects' },
        { from: 'about', to: 'certifications' },
        { from: 'certifications', to: 'experience' },
        { from: 'certifications', to: 'projects' },
    ];

    function isDark() { return document.documentElement.getAttribute('data-theme') !== 'light'; }

    function drawArrow(ctx, fromX, fromY, toX, toY, color, W, H) {
        const headlen = 8;
        const angle = Math.atan2(toY - fromY, toX - fromX);
        const nodeR = Math.min(W, H) * 0.055;
        const fx = fromX + nodeR * Math.cos(angle);
        const fy = fromY + nodeR * Math.sin(angle);
        const tx = toX - nodeR * Math.cos(angle);
        const ty = toY - nodeR * Math.sin(angle);
        
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(fx, fy);
        ctx.lineTo(tx, ty);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(tx - headlen * Math.cos(angle - Math.PI / 6), ty - headlen * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(tx - headlen * Math.cos(angle + Math.PI / 6), ty - headlen * Math.sin(angle + Math.PI / 6));
        ctx.closePath();
        ctx.fill();
    }

    function draw() {
        animationId = requestAnimationFrame(draw);
        
        const W = canvas.width;
        const H = canvas.height;
        if (W === 0 || H === 0) return;
        
        const dark = isDark();
        ctx.clearRect(0, 0, W, H);
        
        const lineColor = dark ? 'rgba(139,92,246,0.25)' : 'rgba(109,40,217,0.2)';
        const nodeRadius = Math.min(W, H) * 0.055;

        const nodePos = {};
        for (const node of NODES) {
            nodePos[node.id] = { x: node.x * W, y: node.y * H, ...node };
        }

        for (const conn of CONNECTIONS) {
            const from = nodePos[conn.from];
            const to = nodePos[conn.to];
            drawArrow(ctx, from.x, from.y, to.x, to.y, lineColor, W, H);
        }

        for (const node of NODES) {
            const pos = nodePos[node.id];
            const gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, nodeRadius * 2);
            gradient.addColorStop(0, pos.color + '30');
            gradient.addColorStop(1, pos.color + '00');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, nodeRadius * 2, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = pos.color;
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, nodeRadius, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = dark ? '#F5F5F7' : '#1D1D1F';
            ctx.font = 'bold 13px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(pos.label, pos.x, pos.y);
        }
    }

    function initCanvas() {
        const parent = canvas.parentElement;
        if (!parent) return false;
        const w = parent.offsetWidth - 64;
        if (w < 100) return false;
        canvas.width = Math.max(400, w);
        canvas.height = 320;
        return true;
    }

    const initSuccess = initCanvas();
    if (initSuccess) {
        animationId = requestAnimationFrame(draw);
    }

    window.addEventListener('resize', () => {
        initCanvas();
    });
    
    // Also expose for manual triggering
    window.dagRedraw = () => {
        if (initCanvas()) {
            if (animationId) cancelAnimationFrame(animationId);
            animationId = requestAnimationFrame(draw);
        }
    };
})();

// Force DAG redraw when it becomes visible
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (window.dagRedraw) window.dagRedraw();
    }, 100);
});



// ═══════════════════════════════════════════════
// 2. THEME
// ═══════════════════════════════════════════════
const html     = document.documentElement;
const themeBtn = document.getElementById('theme-btn');
themeBtn.addEventListener('click', () => {
    const dark = html.getAttribute('data-theme') === 'dark';
    html.setAttribute('data-theme', dark ? 'light' : 'dark');
    themeBtn.textContent = dark ? '☀️' : '🌙';
});


// ═══════════════════════════════════════════════
// 3. NAVBAR — transparent on hero, solid on scroll
// ═══════════════════════════════════════════════
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });


// ═══════════════════════════════════════════════
// 4. HERO PARALLAX
// ═══════════════════════════════════════════════
const heroInner = document.getElementById('hero-inner');
const heroName  = document.getElementById('hero-name');
window.addEventListener('scroll', () => {
const y  = window.scrollY;
    const vh = window.innerHeight;
    if (y > vh * 1.2) return;
    const p = y / vh;
    if (heroInner) {
        // Gentle upward drift — only 12% of scroll speed
        heroInner.style.transform = `translateY(${y * 0.12}px)`;
        // Stay fully opaque until 50% scrolled, then fade slowly
        const fadeStart = 0.5;
        const opacity   = p < fadeStart ? 1 : Math.max(0, 1 - (p - fadeStart) * 3.5);
        heroInner.style.opacity = opacity;
    }
}, { passive: true });


// ═══════════════════════════════════════════════
// 5. WORD-BY-WORD SPLIT
// ═══════════════════════════════════════════════
function splitWords(el) {
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map((w, i) =>
        `<span class="word" style="transition-delay:${i * 0.05}s">${w} </span>`
    ).join('');
}
document.querySelectorAll('.word-split').forEach(splitWords);


// ═══════════════════════════════════════════════
// 6. COUNTER ANIMATION
// ═══════════════════════════════════════════════
function animateCounter(el) {
    const target = +el.dataset.target;
    const suffix = el.dataset.suffix || '';
    const dur    = 1800;
    const start  = performance.now();
    function step(ts) {
        const p = Math.min((ts - start) / dur, 1);
        const e = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(e * target) + (p === 1 ? suffix : '');
        if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}


// ═══════════════════════════════════════════════
// 7. SCROLL REVEAL + BAR ANIMATION + COUNTERS
// ═══════════════════════════════════════════════
const revealObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        entry.target.querySelectorAll('[data-target]').forEach(animateCounter);
        revealObs.unobserve(entry.target);
    });
}, { threshold: 0.12 });

const barObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.querySelectorAll('.skill-fill').forEach((b, i) => {
            setTimeout(() => b.classList.add('animated'), i * 130);
        });
        barObs.unobserve(entry.target);
    });
}, { threshold: 0.3 });


// ═══════════════════════════════════════════════
// 8. NAV ACTIVE LINK
// ═══════════════════════════════════════════════
const sections  = document.querySelectorAll('#structure-view section[id]');
const navAnchors = document.querySelectorAll('.nav-link');
if (sections.length) {
    const navObs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
            }
        });
    }, { rootMargin: '-38% 0px -55% 0px' });
    sections.forEach(s => navObs.observe(s));
}


// ═══════════════════════════════════════════════
// 9. 3D PHOTO TILT
// ═══════════════════════════════════════════════
const photo3d = document.getElementById('photo3d');
if (photo3d) {
    const wrap = photo3d.parentElement;
    wrap.addEventListener('mousemove', e => {
        const r  = wrap.getBoundingClientRect();
        const dx = (e.clientX - r.left  - r.width  / 2) / (r.width  / 2);
        const dy = (e.clientY - r.top   - r.height / 2) / (r.height / 2);
        photo3d.style.transform = `perspective(600px) rotateY(${dx*12}deg) rotateX(${-dy*8}deg)`;
    });
    wrap.addEventListener('mouseleave', () => { photo3d.style.transform = ''; });
}


// ═══════════════════════════════════════════════
// 10. SPARKLES
// ═══════════════════════════════════════════════
const sparks = ['✦','✧','⋆','★','✸'];
document.addEventListener('mousemove', e => {
    if (Math.random() > 0.05) return;
    const s = document.createElement('div');
    s.className   = 'sparkle';
    s.textContent = sparks[0|Math.random()*sparks.length];
    s.style.cssText = `left:${e.clientX + (Math.random()-0.5)*22}px;top:${e.clientY + (Math.random()-0.5)*22}px;font-size:${Math.random()*7+8}px;color:hsl(${Math.random()>0.5?265:180},80%,70%)`;
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 800);
});


// ═══════════════════════════════════════════════
// 11. PIPELINE DAG
// ═══════════════════════════════════════════════
const pipelineSvg   = document.getElementById('pipeline-svg');
const pipelineEdges = [
    { from: 'pn-about',      to: 'pn-skills' },
    { from: 'pn-skills',     to: 'pn-experience' },
    { from: 'pn-experience', to: 'pn-projects' },
    { from: 'pn-experience', to: 'pn-education' },
];
let pipelineRAFs = [];

function animatePipeDot(path) {
    const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    dot.setAttribute('r', '4');
    dot.setAttribute('fill', '#EC4899');
    dot.style.filter = 'drop-shadow(0 0 5px #EC4899) drop-shadow(0 0 2px #fff)';
    dot.setAttribute('opacity', '0');
    pipelineSvg.appendChild(dot);
    const dur = 1900 + Math.random() * 900;
    const startAt = performance.now() + Math.random() * 1400;
    function tick(now) {
        const elapsed = now - startAt;
        if (elapsed < 0) { pipelineRAFs.push(requestAnimationFrame(tick)); return; }
        const t = (elapsed % dur) / dur;
        try {
            const len = path.getTotalLength();
            const pt  = path.getPointAtLength(t * len);
            dot.setAttribute('cx', pt.x);
            dot.setAttribute('cy', pt.y);
            const alpha = t < 0.08 ? t / 0.08 : t > 0.92 ? (1 - t) / 0.08 : 1;
            dot.setAttribute('opacity', (alpha * 0.9).toFixed(2));
        } catch(e) { return; }
        pipelineRAFs.push(requestAnimationFrame(tick));
    }
    pipelineRAFs.push(requestAnimationFrame(tick));
}

function drawPipelineEdges() {
    pipelineRAFs.forEach(id => cancelAnimationFrame(id));
    pipelineRAFs = [];
    if (!pipelineSvg) return;
    pipelineSvg.innerHTML = '';

    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML = `<marker id="pipe-arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
        <polygon points="0 0,8 3,0 6" fill="rgba(139,92,246,0.8)"/>
    </marker>`;
    pipelineSvg.appendChild(defs);

    const sr = pipelineSvg.getBoundingClientRect();
    pipelineEdges.forEach(({ from, to }) => {
        const fn = document.getElementById(from);
        const tn = document.getElementById(to);
        if (!fn || !tn) return;
        const fr = fn.getBoundingClientRect();
        const tr = tn.getBoundingClientRect();
        const sx = fr.right  - sr.left;
        const sy = fr.top + fr.height / 2 - sr.top;
        const ex = tr.left   - sr.left;
        const ey = tr.top + tr.height / 2 - sr.top;
        const cx = sx + (ex - sx) / 2;
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', `M${sx},${sy} C${cx},${sy} ${cx},${ey} ${ex},${ey}`);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', 'rgba(139,92,246,0.4)');
        path.setAttribute('stroke-width', '1.5');
        path.setAttribute('stroke-dasharray', '6 4');
        path.setAttribute('marker-end', 'url(#pipe-arrow)');
        pipelineSvg.appendChild(path);
        animatePipeDot(path);
    });
}

window.addEventListener('resize', () => {
    pipelineRAFs.forEach(id => cancelAnimationFrame(id));
    pipelineRAFs = [];
    requestAnimationFrame(() => requestAnimationFrame(drawPipelineEdges));
}, { passive: true });


// ═══════════════════════════════════════════════
// 12. PIPELINE SIDEBAR
// ═══════════════════════════════════════════════
const pipeSidebar   = document.getElementById('pipe-sidebar');
const pipeSbTitle   = document.getElementById('pipe-sb-title');
const pipeSbState   = document.getElementById('pipe-sb-state');
const pipeSbLogs    = document.getElementById('pipe-sb-logs');
const pipeSbContent = document.getElementById('pipe-sb-content');
const pipeSbClose   = document.getElementById('pipe-sb-close');
let pipeSidebarOpen = false;

const pipeNodeData = {
    'pn-about': {
        title: 'sushma_vunnam.profile', state: 'Active', navLabel: 'About Me', section: 'about',
        logs: ['Loading profile: Sushma Vunnam...', 'Role: ML Data Engineer | Location: USA', 'Connecting to Walmart Global Tech...', '[SUCCESS] Profile loaded. 3+ yrs · 100M+ records/day.'],
        html: `<h3>Sushma Vunnam</h3><p>Data Engineer with <strong>3+ years</strong> building enterprise-scale data platforms at Walmart Global Tech and Accenture.</p><div class="pipe-sb-metrics"><div class="pipe-sb-metric"><span class="pipe-sb-metric-val">100M+</span><span class="pipe-sb-metric-lbl">Records / Day</span></div><div class="pipe-sb-metric"><span class="pipe-sb-metric-val">3+</span><span class="pipe-sb-metric-lbl">Years Exp</span></div><div class="pipe-sb-metric"><span class="pipe-sb-metric-val">80%</span><span class="pipe-sb-metric-lbl">Spark Boost</span></div><div class="pipe-sb-metric"><span class="pipe-sb-metric-val">6B+</span><span class="pipe-sb-metric-lbl">Records / Batch</span></div></div>`
    },
    'pn-skills': {
        title: 'tech_stack.yml', state: 'Loaded', navLabel: 'Tech Stack', section: 'skills',
        logs: ['Scanning installed packages...', 'Big Data: Spark, PySpark, Kafka, Delta Lake, dbt', 'Cloud: AWS, Azure, Databricks, Airflow', '[SUCCESS] 25+ tools ready.'],
        html: `<h3>Tech Stack</h3><p>Full-stack data engineering across Big Data, Cloud, and AI platforms.</p><div class="pipe-sb-chips"><span class="pipe-sb-chip">Spark</span><span class="pipe-sb-chip">PySpark</span><span class="pipe-sb-chip">Kafka</span><span class="pipe-sb-chip">Delta Lake</span><span class="pipe-sb-chip">dbt</span><span class="pipe-sb-chip">AWS</span><span class="pipe-sb-chip">Azure</span><span class="pipe-sb-chip">Databricks</span><span class="pipe-sb-chip">Airflow</span><span class="pipe-sb-chip">Python</span><span class="pipe-sb-chip">Java</span><span class="pipe-sb-chip">RAG</span></div>`
    },
    'pn-experience': {
        title: 'career_timeline.json', state: 'Active', navLabel: 'Experience', section: 'experience',
        logs: ['Loading career timeline...', 'Walmart Global Tech — Dec 2024–Present', 'UCode Technologies — Jun–Nov 2024', 'Accenture — Feb 2021–Jun 2022', '[SUCCESS] 3 roles · 3+ years loaded.'],
        html: `<h3>Experience</h3><p><strong>Walmart Global Tech</strong> — Data Engineer<br><span style="font-size:0.8rem;color:var(--text-3)">Dec 2024–Present · 50M+ events/day, 6B+ records/batch</span></p><p><strong>UCode Technologies</strong> — Software Trainee<br><span style="font-size:0.8rem;color:var(--text-3)">Jun–Nov 2024 · Python, FastAPI, ETL</span></p><p><strong>Accenture</strong> — Associate Engineer<br><span style="font-size:0.8rem;color:var(--text-3)">Feb 2021–Jun 2022 · 10M+ records/day, Spark, SAP</span></p>`
    },
    'pn-projects': {
        title: 'portfolio_projects.sh', state: 'Deployed', navLabel: 'Projects', section: 'projects',
        logs: ['Enterprise PySpark Pipeline — 50M+ records', 'GenAI Chatbot — AWS Bedrock, Claude 3 vs Titan', 'Kafka → Milvus RAG — sub-100ms retrieval', 'Cloud Lakehouse — Bronze→Gold, 70% latency cut', '[SUCCESS] 4 projects deployed.'],
        html: `<h3>Projects</h3><p><strong>Enterprise PySpark Pipeline</strong><br><span style="font-size:0.8rem;color:var(--text-3)">50M+ records, 45% throughput gain via AQE</span></p><p><strong>GenAI Chatbot — AWS Bedrock</strong><br><span style="font-size:0.8rem;color:var(--text-3)">Claude 3 vs Titan zero/few-shot benchmarking</span></p><p><strong>Kafka → Milvus RAG Pipeline</strong><br><span style="font-size:0.8rem;color:var(--text-3)">Sub-100ms vector retrieval at scale</span></p><p><strong>Cloud Data Lakehouse</strong><br><span style="font-size:0.8rem;color:var(--text-3)">Bronze→Gold, 70% latency reduction</span></p>`
    },
    'pn-education': {
        title: 'education_certs.md', state: 'Completed', navLabel: 'Education', section: 'education',
        logs: ['MS Data Analytics Engineering — GMU, GPA 3.70', 'B.Tech EEE — SASTRA University, India', 'Certs: LinkedIn, Anthropic, Accenture', '[SUCCESS] Education loaded.'],
        html: `<h3>Education</h3><p><strong>MS, Data Analytics Engineering</strong><br><span style="font-size:0.8rem;color:var(--text-3)">George Mason University, 2022–2024 · GPA 3.70</span></p><p><strong>B.Tech, Electrical &amp; Electronics</strong><br><span style="font-size:0.8rem;color:var(--text-3)">SASTRA University, 2017–2021</span></p><div class="pipe-sb-chips" style="margin-top:10px"><span class="pipe-sb-chip">AI &amp; DE — LinkedIn</span><span class="pipe-sb-chip">Claude Code 101</span><span class="pipe-sb-chip">Accenture Training</span></div>`
    }
};

const sPipeline = document.querySelector('.s-pipeline');

function openPipeSidebar(nodeId) {
    const data = pipeNodeData[nodeId];
    if (!data) return;
    pipeSbTitle.textContent = data.title;
    pipeSbState.textContent = data.state;
    pipeSbLogs.innerHTML = data.logs.map((l, i) => {
        const cls = l.startsWith('[SUCCESS]') ? 'success' : i > 0 ? 'info' : '';
        return `<div class="pipe-sb-log-line ${cls}">${l}</div>`;
    }).join('');
    pipeSbContent.innerHTML = data.html +
        `<a class="pipe-sb-nav-link" href="#${data.section}">View ${data.navLabel} section →</a>`;
    pipeSidebar.classList.add('open');
    sPipeline.classList.add('panel-open');
    pipeSidebarOpen = true;
    setTimeout(drawPipelineEdges, 430);
}

function closePipeSidebar() {
    pipeSidebar.classList.remove('open');
    sPipeline.classList.remove('panel-open');
    pipeSidebarOpen = false;
    setTimeout(drawPipelineEdges, 430);
}

pipeSbClose.addEventListener('click', closePipeSidebar);
document.querySelectorAll('.pipe-node').forEach(node =>
    node.addEventListener('click', () => openPipeSidebar(node.id))
);
window.addEventListener('scroll', () => {
    if (pipeSidebarOpen) closePipeSidebar();
}, { passive: true });


// ═══════════════════════════════════════════════
// 13. INIT
// ═══════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
    requestAnimationFrame(() => requestAnimationFrame(drawPipelineEdges));
    document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));
    const skillBars = document.querySelector('.skill-bars');
    if (skillBars) barObs.observe(skillBars);
});


// ═══════════════════════════════════════════════
// 14. SCROLL PROGRESS BAR
// ═══════════════════════════════════════════════
(function initScrollBar() {
    const bar = document.getElementById('scroll-bar');
    if (!bar) return;
    window.addEventListener('scroll', () => {
        const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
        bar.style.transform = `scaleX(${Math.min(pct, 1)})`;
    }, { passive: true });
})();


// ═══════════════════════════════════════════════
// 15. HERO TYPING / CYCLING TEXT
// ═══════════════════════════════════════════════
(function initTyped() {
    const el = document.getElementById('typed-text');
    if (!el) return;

    const phrases = [
        'Spark & Kafka at enterprise scale',
        '500M+ records flowing daily',
        'Delta Lake  ·  dbt  ·  AWS Bedrock',
        'Bronze → Silver → Gold lakehouse',
        'RAG pipelines with sub-100ms retrieval',
        'Open to Data Engineer roles in the US',
    ];

    let pi = 0, ci = 0, deleting = false, pause = 0;

    function tick() {
        const phrase = phrases[pi];
        if (pause > 0) { pause--; setTimeout(tick, 60); return; }

        if (!deleting) {
            el.textContent = phrase.slice(0, ++ci);
            if (ci === phrase.length) { deleting = true; pause = 48; }
            setTimeout(tick, 68 + Math.random() * 38);
        } else {
            el.textContent = phrase.slice(0, --ci);
            if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; pause = 6; }
            setTimeout(tick, 32);
        }
    }

    setTimeout(tick, 1300);
})();


// ═══════════════════════════════════════════════
// 16. EXPERIENCE TIMELINE DRAW ANIMATION
// ═══════════════════════════════════════════════
(function initTimelineDraw() {
    const tl = document.querySelector('.timeline');
    if (!tl) return;
    const obs = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
            tl.classList.add('tl-drawn');
            obs.disconnect();
        }
    }, { threshold: 0.1 });
    obs.observe(tl);
})();


// ═══════════════════════════════════════════════
// 17. AURORA BLOBS — inject into hero
// ═══════════════════════════════════════════════
(function initAurora() {
    const hero = document.querySelector('.s-hero');
    if (!hero) return;
    [1, 2, 3].forEach(n => {
        const blob = document.createElement('div');
        blob.className = `aurora-blob aurora-blob-${n}`;
        hero.insertBefore(blob, hero.firstChild);
    });
})();


// ═══════════════════════════════════════════════
// 15. CUSTOM SPRING CURSOR (desktop only)
// ═══════════════════════════════════════════════
(function initCustomCursor() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const dot  = document.createElement('div');  dot.className  = 'cursor-dot';
    const ring = document.createElement('div');  ring.className = 'cursor-ring';
    document.body.append(dot, ring);
    document.body.classList.add('hide-cursor');

    let mx = innerWidth / 2,  my = innerHeight / 2;
    let rx = mx, ry = my;
    let targetScale = 1, currentScale = 1;
    let visible = false;

    document.addEventListener('mousemove', e => {
        mx = e.clientX; my = e.clientY;
        if (!visible) {
            visible = true;
            dot.classList.add('active');
            ring.classList.add('active');
        }
    });
    document.addEventListener('mouseleave',  () => { dot.classList.remove('active'); ring.classList.remove('active'); });
    document.addEventListener('mouseenter',  () => { if (visible) { dot.classList.add('active'); ring.classList.add('active'); } });

    const hoverSels = 'a, button, .btn, .pipe-node, .proj-card, .skill-logo, .contact-link, .cert-card, .tl-item';
    document.querySelectorAll(hoverSels).forEach(el => {
        el.addEventListener('mouseenter', () => { targetScale = 2.2; ring.classList.add('on-hover'); dot.classList.add('on-hover'); });
        el.addEventListener('mouseleave', () => { targetScale = 1;   ring.classList.remove('on-hover'); dot.classList.remove('on-hover'); });
    });

    (function tick() {
        dot.style.transform  = `translate(${mx}px, ${my}px)`;
        rx += (mx - rx) * 0.11;
        ry += (my - ry) * 0.11;
        currentScale += (targetScale - currentScale) * 0.10;
        ring.style.transform = `translate(${rx}px, ${ry}px) scale(${currentScale.toFixed(3)})`;
        requestAnimationFrame(tick);
    })();
})();


// ═══════════════════════════════════════════════
// 16. MAGNETIC BUTTONS
// ═══════════════════════════════════════════════
(function initMagnetic() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    document.querySelectorAll('.btn').forEach(btn => {
        let tx = 0, ty = 0, rafId = null;

        btn.addEventListener('mousemove', e => {
            const r  = btn.getBoundingClientRect();
            tx = (e.clientX - (r.left + r.width  / 2)) * 0.34;
            ty = (e.clientY - (r.top  + r.height / 2)) * 0.34;
            btn.style.translate = `${tx}px ${ty}px`;
        });

        btn.addEventListener('mouseleave', () => {
            if (rafId) cancelAnimationFrame(rafId);
            function spring() {
                tx *= 0.72; ty *= 0.72;
                btn.style.translate = `${tx}px ${ty}px`;
                if (Math.abs(tx) > 0.05 || Math.abs(ty) > 0.05) {
                    rafId = requestAnimationFrame(spring);
                } else {
                    btn.style.translate = '';
                    rafId = null;
                }
            }
            rafId = requestAnimationFrame(spring);
        });
    });
})();


// ═══════════════════════════════════════════════
// 17. CARD SPOTLIGHT GLOW
// ═══════════════════════════════════════════════
(function initSpotlight() {
    document.querySelectorAll('.proj-card, .cert-card, .impact-stat').forEach(card => {
        card.addEventListener('mousemove', e => {
            const r = card.getBoundingClientRect();
            card.style.setProperty('--spot-x', `${e.clientX - r.left}px`);
            card.style.setProperty('--spot-y', `${e.clientY - r.top}px`);
        });
    });
})();


// ═══════════════════════════════════════════════
// 18. HERO KICKER TEXT SCRAMBLE
// ═══════════════════════════════════════════════
(function initScramble() {
    const el = document.querySelector('.hero-kicker');
    if (!el) return;
    const original = el.textContent.trim();
    const chars    = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789·◈⚡#@%';
    let frame = 0, iid = null;

    function scramble() {
        clearInterval(iid);
        frame = 0;
        iid = setInterval(() => {
            el.textContent = original.split('').map((ch, i) => {
                if (ch === ' ') return ' ';
                if (i < frame)  return ch;
                return chars[Math.floor(Math.random() * chars.length)];
            }).join('');
            if (Math.random() > 0.52) frame++;
            if (frame >= original.length) { clearInterval(iid); el.textContent = original; }
        }, 38);
    }

    setTimeout(scramble, 750);
    el.addEventListener('mouseenter', scramble);
})();


// ═══════════════════════════════════════════════
// 21. TERMINAL CARD HEADERS
// ═══════════════════════════════════════════════
(function initTerminalHeaders() {
    const filenames = [
        'enterprise_pipeline.py',
        'genai_chatbot.py',
        'kafka_milvus_rag.py',
        'cloud_lakehouse.sql',
    ];
    document.querySelectorAll('.proj-card').forEach((card, i) => {
        const bar = document.createElement('div');
        bar.className = 'terminal-bar';
        bar.innerHTML = `
            <span class="terminal-dot t-dot-red"></span>
            <span class="terminal-dot t-dot-yellow"></span>
            <span class="terminal-dot t-dot-green"></span>
            <span class="terminal-filename">${filenames[i] || 'project.py'}</span>`;
        card.prepend(bar);
    });
})();


// ═══════════════════════════════════════════════
// 22. MOTION (FRAMER) — CDN ENHANCEMENTS
//     Loaded from cdn.jsdelivr.net/npm/motion@11
// ═══════════════════════════════════════════════
(function initMotionAnimations() {
    if (typeof window.Motion === 'undefined') return;
    const { animate, inView, stagger } = window.Motion;

    // Skill logos — spring overshoot stagger
    inView('.skill-logo-grid', () => {
        const logos = document.querySelectorAll('.skill-logo');
        logos.forEach(l => { l.style.opacity = '0'; });
        animate(logos,
            { opacity: [0, 1], scale: [0.65, 1], y: [22, 0] },
            { delay: stagger(0.04), duration: 0.5, easing: [0.34, 1.56, 0.64, 1] }
        );
    }, { amount: 0.2 });

    // Pipeline nodes — spring stagger
    inView('.pipeline-nodes', () => {
        animate(document.querySelectorAll('.pipe-node'),
            { opacity: [0, 1], scale: [0.82, 1], y: [28, 0] },
            { delay: stagger(0.10), duration: 0.62, easing: [0.34, 1.56, 0.64, 1] }
        );
    }, { amount: 0.3 });

    // Project cards — blur + lift entrance
    inView('.projects-grid', () => {
        animate(document.querySelectorAll('.proj-card'),
            { opacity: [0, 1], y: [40, 0], filter: ['blur(6px)', 'blur(0px)'] },
            { delay: stagger(0.12), duration: 0.65, easing: [0.16, 1, 0.3, 1] }
        );
    }, { amount: 0.15 });

    // Experience tl-items — slide in from left
    inView('.timeline', () => {
        animate(document.querySelectorAll('.tl-item'),
            { opacity: [0, 1], x: [-32, 0] },
            { delay: stagger(0.15), duration: 0.7, easing: [0.16, 1, 0.3, 1] }
        );
    }, { amount: 0.1 });

    // Contact links — spring stagger
    inView('.contact-links', () => {
        animate(document.querySelectorAll('.contact-link'),
            { opacity: [0, 1], y: [28, 0], scale: [0.9, 1] },
            { delay: stagger(0.08), duration: 0.55, easing: [0.34, 1.56, 0.64, 1] }
        );
    }, { amount: 0.4 });

    // Section eyebrows — fast slide up
    document.querySelectorAll('.t-eyebrow').forEach(el => {
        inView(el, () => {
            animate(el, { opacity: [0, 1], y: [14, 0] }, { duration: 0.45, easing: [0.16, 1, 0.3, 1] });
        }, { amount: 0.8 });
    });

    // Cert cards
    inView('.certs-grid', () => {
        animate(document.querySelectorAll('.cert-card'),
            { opacity: [0, 1], scale: [0.88, 1], y: [20, 0] },
            { delay: stagger(0.1), duration: 0.5, easing: [0.34, 1.56, 0.64, 1] }
        );
    }, { amount: 0.3 });
})();
