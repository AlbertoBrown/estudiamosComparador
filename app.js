const tariffs = [
  {
    company: "Repsol",
    name: "Ahorro Plus 2.0TD",
    type: "fixed",
    energy: { p1: 0.1199, p2: 0.1199, p3: 0.1199 },
    power: { p1: 0.0819, p2: 0.0819 },
    commission: 80,
    segment: "ambos",
    service: "sin",
    chips: ["Nuevo cliente", "12 meses", "Waylet"]
  },
  {
    company: "Repsol",
    name: "Discriminacion Horaria 2.0TD",
    type: "periods",
    energy: { p1: 0.1689, p2: 0.1189, p3: 0.0999 },
    power: { p1: 0.0901, p2: 0.0901 },
    commission: 80,
    segment: "ambos",
    service: "sin",
    chips: ["3 periodos", "Sin permanencia", "Waylet"]
  },
  {
    company: "LoGOs",
    name: "Precio Unico 2.0TD",
    type: "fixed",
    energy: { p1: 0.175131, p2: 0.175131, p3: 0.175131 },
    power: { p1: 0.086861, p2: 0.012946 },
    commission: 65,
    segment: "ambos",
    service: "sin",
    chips: ["-25% primer ano", "Precio 24h"]
  },
  {
    company: "LoGOs",
    name: "Precio Variable 2.0TD",
    type: "periods",
    energy: { p1: 0.246112, p2: 0.177698, p3: 0.146046 },
    power: { p1: 0.086861, p2: 0.012946 },
    commission: 65,
    segment: "ambos",
    service: "sin",
    chips: ["-25% primer ano", "3 periodos"]
  },
  {
    company: "Endesa",
    name: "Luz Fija 24h Online",
    type: "fixed",
    energy: { p1: 0.099999, p2: 0.099999, p3: 0.099999 },
    power: { p1: monthlyPowerToDaily(2.849), p2: monthlyPowerToDaily(2.849) },
    commission: 70,
    segment: "particular",
    service: "sin",
    chips: ["Nuevo cliente", "Online", "Sin permanencia"]
  },
  {
    company: "Endesa",
    name: "Conecta Luz",
    type: "fixed",
    energy: { p1: 0.1135, p2: 0.1135, p3: 0.1135 },
    power: { p1: monthlyPowerToDaily(2.849), p2: monthlyPowerToDaily(2.849) },
    commission: 70,
    segment: "particular",
    service: "sin",
    chips: ["Nuevo cliente", "20% dto.", "Precio 2 anos"]
  },
  {
    company: "Endesa",
    name: "Conecta 3 Periodos",
    type: "periods",
    energy: { p1: 0.18621, p2: 0.11781, p3: 0.09441 },
    power: { p1: yearlyPowerToDaily(27.0144), p2: yearlyPowerToDaily(27.0144) },
    commission: 70,
    segment: "particular",
    service: "sin",
    chips: ["Nuevo cliente", "10% dto.", "Valle barato"]
  },
  {
    company: "Iberdrola",
    name: "Plan Online 3 Periodos",
    type: "periods",
    energy: { p1: 0.194, p2: 0.136, p3: 0.09999 },
    power: { p1: 0.091074, p2: 0.013483 },
    commission: 90,
    segment: "ambos",
    service: "sin",
    chips: ["Online", "3 periodos", "Sin permanencia"]
  },
  {
    company: "Iberdrola",
    name: "Plan Estable",
    type: "fixed",
    energy: { p1: 0.168625, p2: 0.168625, p3: 0.168625 },
    power: { p1: 0.109562, p2: 0.060247 },
    commission: 90,
    segment: "ambos",
    service: "sin",
    chips: ["Precio 24h", "Sin permanencia"]
  },
  {
    company: "Naturgy",
    name: "Tarifa Por Uso Luz",
    type: "fixed",
    energy: { p1: 0.1099, p2: 0.1099, p3: 0.1099 },
    power: { p1: 0.12303, p2: 0.037337 },
    commission: 60,
    segment: "particular",
    service: "sin",
    chips: ["Nuevo cliente", "12 meses", "Sin permanencia"]
  },
  {
    company: "Naturgy",
    name: "Tarifa Noche Luz",
    type: "periods",
    energy: { p1: 0.1802, p2: 0.1072, p3: 0.0718 },
    power: { p1: 0.12303, p2: 0.037337 },
    commission: 60,
    segment: "particular",
    service: "sin",
    chips: ["Nuevo cliente", "3 periodos", "Valle barato"]
  }
];

const colors = {
  Repsol: "#f28c28",
  LoGOs: "#2b8f7b",
  Endesa: "#28a8e0",
  Iberdrola: "#3c9d3c",
  Naturgy: "#f37021"
};

const state = {
  customerType: "particular",
  serviceMode: "sin",
  simulationMode: "bill",
  activeTab: "cost",
  chartVisible: false
};

const els = {};

document.addEventListener("DOMContentLoaded", () => {
  cacheElements();
  hydrateCompanyFilter();
  attachEvents();
  render();
});

function cacheElements() {
  [
    "invoiceFile", "dropzone", "filePill", "fileName", "clearFile", "startDate", "endDate",
    "paidAmount", "kwhP1", "kwhP2", "kwhP3", "kwP1", "kwP2", "agentCommission",
    "sortMode", "companyFilter", "resultsBody", "currentCost", "bestSaving", "bestNet",
    "planCount", "commercialFilters", "chartBtn", "chartPanel", "bars", "sampleBtn",
    "resetBtn", "saveBtn", "invoicePreview", "uploadStatus"
  ].forEach((id) => {
    els[id] = document.getElementById(id);
  });
}

function attachEvents() {
  document.querySelectorAll("[data-segment]").forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.dataset.segment;
      state[key] = button.dataset.value;
      document.querySelectorAll(`[data-segment="${key}"]`).forEach((item) => {
        item.classList.toggle("active", item === button);
      });
      render();
    });
  });

  document.querySelectorAll("[data-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeTab = button.dataset.tab;
      document.querySelectorAll("[data-tab]").forEach((item) => item.classList.toggle("active", item === button));
      els.commercialFilters.classList.toggle("hidden", state.activeTab !== "commercial");
      if (state.activeTab === "commercial") {
        els.sortMode.value = "net";
      }
      render();
    });
  });

  ["startDate", "endDate", "paidAmount", "kwhP1", "kwhP2", "kwhP3", "kwP1", "kwP2", "agentCommission", "sortMode", "companyFilter"].forEach((id) => {
    els[id].addEventListener("input", render);
    els[id].addEventListener("change", render);
  });

  els.invoiceFile.addEventListener("change", (event) => handleFile(event.target.files[0]));
  els.clearFile.addEventListener("click", clearFile);
  els.sampleBtn.addEventListener("click", loadSample);
  els.resetBtn.addEventListener("click", resetForm);
  els.saveBtn.addEventListener("click", saveSimulation);
  els.chartBtn.addEventListener("click", () => {
    state.chartVisible = !state.chartVisible;
    els.chartPanel.classList.toggle("hidden", !state.chartVisible);
    els.chartBtn.textContent = state.chartVisible ? "Ocultar grafica" : "Mostrar grafica";
  });

  ["dragenter", "dragover"].forEach((eventName) => {
    els.dropzone.addEventListener(eventName, (event) => {
      event.preventDefault();
      els.dropzone.classList.add("dragging");
    });
  });

  ["dragleave", "drop"].forEach((eventName) => {
    els.dropzone.addEventListener(eventName, (event) => {
      event.preventDefault();
      els.dropzone.classList.remove("dragging");
    });
  });

  els.dropzone.addEventListener("drop", (event) => {
    handleFile(event.dataTransfer.files[0]);
  });
}

function hydrateCompanyFilter() {
  [...new Set(tariffs.map((tariff) => tariff.company))].forEach((company) => {
    const option = document.createElement("option");
    option.value = company;
    option.textContent = company;
    els.companyFilter.appendChild(option);
  });
  els.commercialFilters.classList.add("hidden");
}

function handleFile(file) {
  if (!file) return;
  els.fileName.textContent = `${file.name} (${formatKb(file.size)})`;
  els.filePill.classList.remove("hidden");
  els.uploadStatus.classList.remove("hidden");
  els.uploadStatus.textContent = "Factura adjuntada. La simulacion se ha calculado con los datos que aparecen en el formulario; revisa consumo, potencia e importe antes de cerrar la venta.";

  if (file.type === "text/plain" || file.name.toLowerCase().endsWith(".txt")) {
    file.text().then((text) => {
      const parsed = parseInvoiceText(text);
      applyParsedInvoice(parsed);
      markDraftSimulation("TXT leido y simulacion recalculada.");
    });
    return;
  }

  if (file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = () => {
      els.invoicePreview.src = reader.result;
      els.invoicePreview.classList.remove("hidden");
    };
    reader.readAsDataURL(file);
    markDraftSimulation("Imagen adjuntada. En esta version sin backend no hay OCR automatico; rellena o corrige los datos de la izquierda.");
    render();
    return;
  }

  els.invoicePreview.classList.add("hidden");
  markDraftSimulation("PDF adjuntado. En esta version sin backend no se extrae el PDF automaticamente; rellena o corrige los datos de la izquierda.");
  render();
}

function clearFile(event) {
  event.preventDefault();
  els.invoiceFile.value = "";
  els.filePill.classList.add("hidden");
  els.invoicePreview.removeAttribute("src");
  els.invoicePreview.classList.add("hidden");
  els.uploadStatus.classList.add("hidden");
}

function parseInvoiceText(text) {
  const read = (patterns) => {
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) return toNumber(match[1]);
    }
    return null;
  };

  return {
    paidAmount: read([/importe\s*(?:pagado|factura|total)?\D+([\d.,]+)/i, /total\s*factura\D+([\d.,]+)/i]),
    kwhP1: read([/punta\D+([\d.,]+)\s*kwh/i, /p1\D+([\d.,]+)\s*kwh/i]),
    kwhP2: read([/llano\D+([\d.,]+)\s*kwh/i, /p2\D+([\d.,]+)\s*kwh/i]),
    kwhP3: read([/valle\D+([\d.,]+)\s*kwh/i, /p3\D+([\d.,]+)\s*kwh/i]),
    kwP1: read([/potencia\s*(?:punta|p1)\D+([\d.,]+)\s*kw/i]),
    kwP2: read([/potencia\s*(?:valle|p2)\D+([\d.,]+)\s*kw/i])
  };
}

function applyParsedInvoice(parsed) {
  Object.entries(parsed).forEach(([key, value]) => {
    if (value !== null && els[key]) {
      els[key].value = value;
    }
  });
  render();
}

function loadSample() {
  els.startDate.value = "2025-12-01";
  els.endDate.value = "2025-12-31";
  els.paidAmount.value = 48.67;
  els.kwhP1.value = 45;
  els.kwhP2.value = 50;
  els.kwhP3.value = 89;
  els.kwP1.value = 3.45;
  els.kwP2.value = 3.45;
  render();
}

function resetForm() {
  els.startDate.value = "2025-12-01";
  els.endDate.value = "2025-12-31";
  els.paidAmount.value = 48.67;
  els.kwhP1.value = 45;
  els.kwhP2.value = 50;
  els.kwhP3.value = 89;
  els.kwP1.value = 3.45;
  els.kwP2.value = 3.45;
  els.agentCommission.value = 15;
  els.companyFilter.value = "all";
  els.sortMode.value = "saving";
  clearFile(new Event("click"));
  render();
}

function saveSimulation() {
  const results = getResults();
  const best = results[0];
  if (!best) return;
  const payload = {
    date: new Date().toISOString(),
    input: getInput(),
    best: {
      company: best.company,
      name: best.name,
      cost: best.cost,
      saving: best.saving,
      net: best.net
    }
  };
  const history = JSON.parse(localStorage.getItem("simulations") || "[]");
  history.unshift(payload);
  localStorage.setItem("simulations", JSON.stringify(history.slice(0, 20)));
  els.saveBtn.textContent = "Guardado";
  setTimeout(() => {
    els.saveBtn.textContent = "Guardar simulación";
  }, 1200);
}

function markDraftSimulation(message) {
  const results = getResults();
  const best = results[0];
  if (!best) return;
  els.uploadStatus.textContent = `${message} Mejor opcion provisional: ${best.company} - ${best.name}, ahorro estimado ${money(best.saving)} y neto empresa ${money(best.net)}.`;
}

function render() {
  const results = getResults();
  renderSummary(results);
  renderTable(results);
  renderBars(results);
}

function getResults() {
  const input = getInput();
  const companyFilter = els.companyFilter.value;
  const sortMode = els.sortMode.value;

  return tariffs
    .filter((tariff) => tariff.segment === "ambos" || tariff.segment === state.customerType)
    .filter((tariff) => state.serviceMode === "ambos" || tariff.service === state.serviceMode)
    .filter((tariff) => companyFilter === "all" || tariff.company === companyFilter)
    .map((tariff) => {
      const energyCost = input.kwhP1 * tariff.energy.p1 + input.kwhP2 * tariff.energy.p2 + input.kwhP3 * tariff.energy.p3;
      const powerCost = input.kwP1 * tariff.power.p1 * input.days + input.kwP2 * tariff.power.p2 * input.days;
      const socialBonusFinancing = 0.012742 * input.days;
      const meterRental = 0.02663 * input.days;
      const electricityTax = (energyCost + powerCost + socialBonusFinancing) * 0.05112696;
      const taxableBase = energyCost + powerCost + socialBonusFinancing + electricityTax + meterRental;
      const cost = taxableBase * 1.21;
      const saving = input.paidAmount - cost;
      const savingPct = input.paidAmount > 0 ? saving / input.paidAmount : 0;
      const agentPayout = tariff.commission;
      const companyCommission = input.agentCommission;
      const totalCommission = agentPayout + companyCommission;
      const balanced = saving + companyCommission * 0.35;

      return { ...tariff, cost, saving, savingPct, agentPayout, companyCommission, totalCommission, net: companyCommission, balanced };
    })
    .sort((a, b) => {
      if (sortMode === "net") return b.agentPayout - a.agentPayout || b.saving - a.saving;
      if (sortMode === "balanced") return b.balanced - a.balanced;
      return b.saving - a.saving || b.net - a.net;
    });
}

function getInput() {
  return {
    paidAmount: numberFromInput("paidAmount"),
    kwhP1: numberFromInput("kwhP1"),
    kwhP2: numberFromInput("kwhP2"),
    kwhP3: numberFromInput("kwhP3"),
    kwP1: numberFromInput("kwP1"),
    kwP2: numberFromInput("kwP2"),
    agentCommission: numberFromInput("agentCommission"),
    days: getBillingDays()
  };
}

function renderSummary(results) {
  const paid = numberFromInput("paidAmount");
  const bestSaving = results.reduce((best, item) => Math.max(best, item.saving), Number.NEGATIVE_INFINITY);
  const bestNet = results.reduce((best, item) => Math.max(best, item.agentPayout), Number.NEGATIVE_INFINITY);

  els.currentCost.textContent = money(paid);
  els.bestSaving.textContent = money(Math.max(0, bestSaving || 0));
  els.bestNet.textContent = money(Math.max(0, bestNet || 0));
  els.planCount.textContent = String(results.length);
}

function renderTable(results) {
  els.resultsBody.innerHTML = "";
  const fragment = document.createDocumentFragment();

  results.forEach((item, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="rank" data-label="#">#${index + 1}</td>
      <td data-label="Compania">
        <div class="company">
          <span class="logo" style="background:${colors[item.company] || "#667085"}">${shortName(item.company)}</span>
          <span>${item.company}</span>
        </div>
      </td>
      <td class="plan-name" data-label="Nombre">${item.name}</td>
      <td class="cost" data-label="Coste factura">${money(item.cost)}</td>
      <td class="saving" data-label="Ahorro">${money(item.saving)}<small>${percent(item.savingPct)}</small></td>
      <td class="net" data-label="Comision">${money(item.agentPayout)}</td>
      <td data-label="Claves"><div class="chips">${item.chips.map((chip) => `<span class="chip">${chip}</span>`).join("")}</div></td>
    `;
    fragment.appendChild(row);
  });

  els.resultsBody.appendChild(fragment);
}

function renderBars(results) {
  els.bars.innerHTML = "";
  const top = results.slice(0, 6);
  const maxSaving = Math.max(...top.map((item) => Math.max(0, item.saving)), 1);
  const fragment = document.createDocumentFragment();

  top.forEach((item) => {
    const row = document.createElement("div");
    row.className = "bar-row";
    row.innerHTML = `
      <strong>${item.company} · ${item.name}</strong>
      <span class="bar-track"><span class="bar-fill" style="width:${Math.max(4, (Math.max(0, item.saving) / maxSaving) * 100)}%"></span></span>
      <span class="net">${money(item.agentPayout)}</span>
    `;
    fragment.appendChild(row);
  });

  els.bars.appendChild(fragment);
}

function getBillingDays() {
  const start = new Date(els.startDate.value);
  const end = new Date(els.endDate.value);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) return 30;
  const ms = end - start;
  return Math.max(1, Math.round(ms / 86400000) + 1);
}

function numberFromInput(id) {
  return toNumber(els[id].value);
}

function toNumber(value) {
  if (value === null || value === undefined) return 0;
  const raw = String(value).trim();
  const hasComma = raw.includes(",");
  const hasDot = raw.includes(".");
  const normalized = hasComma && hasDot
    ? raw.replace(/\./g, "").replace(",", ".")
    : raw.replace(",", ".");
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function money(value) {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(value || 0);
}

function percent(value) {
  return new Intl.NumberFormat("es-ES", { style: "percent", maximumFractionDigits: 0 }).format(value || 0);
}

function formatKb(size) {
  return `${(size / 1024).toLocaleString("es-ES", { maximumFractionDigits: 1 })} kB`;
}

function shortName(company) {
  if (company === "Iberdrola") return "IB";
  if (company === "Naturgy") return "NG";
  if (company === "Endesa") return "EN";
  if (company === "Repsol") return "RP";
  return "LG";
}

function monthlyPowerToDaily(value) {
  return value / 30;
}

function yearlyPowerToDaily(value) {
  return value / 365;
}
