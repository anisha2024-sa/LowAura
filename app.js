const sections = [
    ["overview", "Overview", "gauge"], ["energy-mix", "Energy Mix", "battery-charging"],
    ["state-wise-analysis", "State-wise Analysis", "map-pinned"], ["rpo-tracker", "RPO Tracker", "target"],
    ["solar-calculator", "Solar Calculator", "calculator"], ["green-jobs", "Green Jobs", "briefcase-business"],
    ["data-sources", "Data Sources", "database"],
];

const generation = [
    ["Apr", 128, 224], ["May", 142, 221], ["Jun", 158, 230], ["Jul", 151, 226], ["Aug", 173, 238], ["Sep", 188, 242],
    ["Oct", 196, 237], ["Nov", 211, 245], ["Dec", 222, 249], ["Jan", 240, 252], ["Feb", 253, 247], ["Mar", 271, 255],
];
const mix = [["Solar", 36, "#FBBF24"], ["Wind", 25, "#60A5FA"], ["Hydro", 19, "#34D399"], ["Bioenergy", 8, "#A78BFA"], ["Other", 12, "#F472B6"]];
const states = [["Rajasthan", 38, 44], ["Gujarat", 33, 39], ["Tamil Nadu", 28, 34], ["Karnataka", 24, 31], ["Maharashtra", 21, 29]];
const pageInfo = {
    "energy-mix": ["GENERATION PORTFOLIO", "Explore solar, wind, hydro and bioenergy in India’s clean power transition.", "216.4 GW"],
    "state-wise-analysis": ["REGIONAL PERFORMANCE", "Compare capacity, targets and momentum across India’s leading states.", "36 states tracked"],
    "rpo-tracker": ["POLICY COMPLIANCE", "Track Renewable Purchase Obligation progress against annual milestones.", "82% progress"],
    "solar-calculator": ["ROOFTOP SOLAR", "Estimate generation, savings and carbon reductions with placeholder inputs.", "?48,200 savings"],
    "green-jobs": ["WORKFORCE TRANSITION", "Monitor green-economy workforce and opportunity clusters.", "1.24M jobs"],
    "data-sources": ["DATA CATALOGUE", "A transparent inventory of placeholder datasets powering this prototype.", "12 sources"],
};

let charts = [];
let compact = false;

const getSection = () => {
    const slug = location.hash.replace("#", "") || "overview";
    return sections.some(([id]) => id === slug) ? slug : "overview";
};
const sectionName = (slug) => sections.find(([id]) => id === slug)[1];
const icon = (name, size = 18) => `<i data-lucide="${name}" width="${size}" height="${size}"></i>`;

function navigation(active) {
    return sections.map(([slug, label, glyph]) => `<a href="#${slug}" class="${slug === active ? "active" : ""}">${icon(glyph)}<span class="label">${label}</span></a>`).join("");
}

function shell(content, active) {
    const title = sectionName(active);
    document.querySelector("#app").innerHTML = `
    <aside class="sidebar ${compact ? "compact" : ""}" id="sidebar">
      <div class="brand"><span class="brand-mark">${icon("leaf", 20)}</span><span class="brand-copy">INDIA GREEN<br><b>GRID</b></span><button class="icon-button" id="sidebar-toggle" aria-label="Toggle sidebar">${icon(compact ? "panel-left-open" : "panel-left-close")}</button></div>
      <nav class="nav">${navigation(active)}</nav>
      <div class="status"><div class="status-title">${icon("shield-check", 15)}<span>Grid Status</span></div><p>Updated 8 min ago</p></div>
    </aside>
    <div class="layout ${compact ? "compact" : ""}">
      <header class="topbar"><div><div class="crumb">India Green Grid / ${title}</div><h1>${title}</h1></div><div class="top-actions"><span class="live">Live renewable data</span><span class="avatar">IG</span></div></header>
      <main>${content}</main>
    </div>
    <button class="mobile-toggle" id="mobile-toggle" aria-label="Open navigation">${icon("menu", 20)}</button>
    <div class="mobile-menu" id="mobile-menu"><div class="mobile-menu-head"><b>INDIA GREEN GRID</b><button class="icon-button" id="mobile-close">Close</button></div>${navigation(active)}</div>`;
    lucide.createIcons();
    document.querySelector("#sidebar-toggle").addEventListener("click", () => { compact = !compact; render(); });
    document.querySelector("#mobile-toggle").addEventListener("click", () => document.querySelector("#mobile-menu").classList.add("open"));
    document.querySelector("#mobile-close").addEventListener("click", () => document.querySelector("#mobile-menu").classList.remove("open"));
}

function kpi(label, value, glyph, color) {
    return `<article class="card"><div class="kpi-head"><div><div class="kpi-label">${label}</div><div class="kpi-value">${value}</div></div><span class="kpi-icon" style="color:${color};background:${color}20">${icon(glyph, 20)}</span></div><p class="delta"><strong>? 12.8%</strong> vs last year</p></article>`;
}

function overview() {
    return `<section class="grid-kpi">${kpi("Renewable Capacity", "216.4 GW", "zap", "#60A5FA")}${kpi("Clean Energy Share", "31.4%", "leaf", "#34D399")}${kpi("CO? Avoided", "284 Mt", "cloud-sun", "#A78BFA")}${kpi("Green Investments", "?1.84 L Cr", "circle-dollar-sign", "#FBBF24")}</section>
  <section class="content-grid"><article class="card chart-card"><div class="section-head"><div><h2>Energy Generation</h2><p>Monthly trend · placeholder data</p></div><span class="view-link">Renewable vs grid</span></div><div class="chart-wrap"><canvas id="generation-chart"></canvas></div></article>
  <article class="card"><h2>Energy Mix</h2><p>Installed renewable capacity</p><div class="donut-wrap"><canvas id="mix-chart"></canvas><span class="donut-total">216.4<small>GW TOTAL</small></span></div><div class="legend">${mix.map(([label, value, color]) => `<span><i class="dot" style="background:${color}"></i>${label} <b>${value}%</b></span>`).join("")}</div></article></section>
  <section class="content-grid"><article class="card chart-card"><div class="section-head"><div><h2>State-wise Capacity</h2><p>Installed vs 2030 target</p></div><a class="view-link" href="#state-wise-analysis">View analysis ?</a></div><div class="chart-wrap"><canvas id="state-chart"></canvas></div></article>
  <article class="card"><div class="section-head"><div><h2>Energy Updates</h2><p>Latest sector signals</p></div>${icon("bar-chart-3", 19)}</div><div class="updates">${update("sun", "Rajasthan crosses 38 GW renewable capacity", "2 hours ago", "#FBBF24")}${update("wind", "New offshore wind corridor announced", "5 hours ago", "#60A5FA")}${update("factory", "Green hydrogen pilot receives funding", "Yesterday", "#A78BFA")}</div></article></section>`;
}

function update(glyph, title, time, color) { return `<div class="update"><span class="update-icon" style="color:${color};background:${color}18">${icon(glyph, 16)}</span><p>${title}<br><small>${time}</small></p></div>`; }

function detail(slug) {
    const [eyebrow, description, metric] = pageInfo[slug];
    return `<section class="detail-hero"><p class="eyebrow">${eyebrow}</p><div class="title-row"><div><h2>${sectionName(slug)}</h2><p class="description">${description}</p></div><span class="metric">${metric}</span></div></section>
  <section class="detail-grid"><article class="card chart-card"><div class="section-head"><div><h2>Placeholder insights</h2><p>Interactive sample data for this section</p></div>${icon("trending-up", 20)}</div><div class="chart-wrap"><canvas id="detail-chart"></canvas></div></article><article class="card"><h2>Coming into focus</h2><div class="focus-list">${["Verified placeholder dataset", "Monthly refresh cadence", "Regional benchmark view"].map((item, index) => `<div class="focus-item"><b class="number">0${index + 1}</b>${item}</div>`).join("")}</div></article></section>`;
}

function chartOptions() { return { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: "#A1A1AA", boxWidth: 10, usePointStyle: true } }, tooltip: { backgroundColor: "#171A20", titleColor: "#F5F5F5", bodyColor: "#F5F5F5", borderColor: "#30343D", borderWidth: 1, padding: 10 } }, scales: { x: { grid: { display: false }, ticks: { color: "#A1A1AA" }, border: { display: false } }, y: { grid: { color: "#30343D" }, ticks: { color: "#A1A1AA" }, border: { display: false } } } }; }

function makeCharts(slug) {
    Chart.defaults.color = "#A1A1AA";
    if (slug === "overview") {
        const area = chartOptions(); area.plugins.legend.display = true;
        charts.push(new Chart(document.querySelector("#generation-chart"), { type: "line", data: { labels: generation.map(([m]) => m), datasets: [{ label: "Renewable", data: generation.map(([, r]) => r), borderColor: "#60A5FA", backgroundColor: "#60A5FA38", fill: true, tension: .38, pointRadius: 0, borderWidth: 3 }, { label: "Grid", data: generation.map(([, , g]) => g), borderColor: "#A78BFA", borderDash: [6, 6], tension: .38, pointRadius: 0, borderWidth: 2 }] }, options: area }));
        charts.push(new Chart(document.querySelector("#mix-chart"), { type: "doughnut", data: { labels: mix.map(([label]) => label), datasets: [{ data: mix.map(([, value]) => value), backgroundColor: mix.map(([, , color]) => color), borderColor: "#1B1F27", borderWidth: 5, hoverOffset: 5 }] }, options: { responsive: true, maintainAspectRatio: false, cutout: "66%", plugins: { legend: { display: false }, tooltip: { backgroundColor: "#171A20", borderColor: "#30343D", borderWidth: 1 } } } }));
        const bars = chartOptions(); bars.plugins.legend.display = true;
        charts.push(new Chart(document.querySelector("#state-chart"), { type: "bar", data: { labels: states.map(([state]) => state), datasets: [{ label: "Installed", data: states.map(([, capacity]) => capacity), backgroundColor: "#34D399", borderRadius: 5 }, { label: "2030 target", data: states.map(([, , target]) => target), backgroundColor: "#A78BFA", borderRadius: 5 }] }, options: bars }));
    } else {
        const line = chartOptions(); line.plugins.legend.display = false;
        charts.push(new Chart(document.querySelector("#detail-chart"), { type: "line", data: { labels: generation.slice(-7).map(([month]) => month), datasets: [{ label: "Renewable", data: generation.slice(-7).map(([, renewable]) => renewable), borderColor: "#60A5FA", backgroundColor: "#60A5FA33", fill: true, tension: .38, pointBackgroundColor: "#60A5FA", pointRadius: 4, borderWidth: 3 }] }, options: line }));
    }
}

function render() {
    charts.forEach((chart) => chart.destroy()); charts = [];
    const slug = getSection();
    shell(slug === "overview" ? overview() : detail(slug), slug);
    makeCharts(slug);
}

addEventListener("hashchange", render);
render();
