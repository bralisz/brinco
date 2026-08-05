"use strict";

const SITE_VERSION = "2026.08.05.1807";
const SITE_VERSION_STORAGE_KEY = "provador-site-version";
const SITE_VERSION_URL = "version.json";
const SITE_UPDATE_CHECK_INTERVAL = 5 * 60 * 1000;
const MAX_PHOTO_BYTES = 20 * 1024 * 1024;
const MAX_CANVAS_SIDE = 3000;
const MAX_CUSTOM_SIDE = 1200;
const NUDGE_PERCENT = 0.005;
const LOCAL_ANALYSIS_SIZE = 72;
const LOCAL_LAYER_MAX_SIDE = 1400;
const CATALOG_SOURCE_BASE_SIZE = 344;
const CATALOG_CUTOUT_SIDE = 1024;
const TRANSPARENT_PIXEL = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
const PRICE_STORAGE_KEY = "provador-virtual-brincos-prices-v2";
const MAX_PRICE = 999999.99;
const priceFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL"
});

const catalog = [
  {
    "id": "tiffany-rubi-2mm",
    "name": "Tiffany Rubi 2 mm",
    "src": "assets/earrings/real/tiffany-rubi-2mm.png",
    "thumb": "assets/earrings/real/tiffany-rubi-2mm.png",
    "audience": "todos",
    "type": "Tiffany",
    "line": "System75 Baby",
    "code": "134",
    "reference": "7581-0107",
    "sizeMm": 2,
    "verified": true,
    "globalWhiteCutout": false
  },
  {
    "id": "bezel-cristal-2mm",
    "name": "Bezel Cristal 2 mm",
    "src": "assets/earrings/real/bezel-cristal-2mm.png",
    "thumb": "assets/earrings/real/bezel-cristal-2mm.png",
    "audience": "todos",
    "type": "Bezel",
    "line": "System75 Baby",
    "code": "124",
    "reference": "7581-0204",
    "sizeMm": 2,
    "verified": true,
    "globalWhiteCutout": false
  },
  {
    "id": "bezel-rosa-2mm",
    "name": "Bezel Rosa 2 mm",
    "src": "assets/earrings/real/bezel-rosa-2mm.png",
    "thumb": "assets/earrings/real/bezel-rosa-2mm.png",
    "audience": "todos",
    "type": "Bezel",
    "line": "System75 Baby",
    "code": "129",
    "reference": "7581-0210",
    "sizeMm": 2,
    "verified": true,
    "globalWhiteCutout": false
  },
  {
    "id": "bolinha-3mm",
    "name": "Bolinha 3 mm",
    "src": "assets/earrings/real/bolinha-3mm.png",
    "thumb": "assets/earrings/real/bolinha-3mm.png",
    "audience": "todos",
    "type": "Bolinha",
    "line": "System75 Baby",
    "code": "123",
    "reference": "7581-0300",
    "sizeMm": 3,
    "verified": true,
    "globalWhiteCutout": false
  },
  {
    "id": "daisy-rosa-fucsia-3mm",
    "name": "Daisy Rosa Fúcsia 3 mm",
    "src": "assets/earrings/real/daisy-rosa-fucsia-3mm.png",
    "thumb": "assets/earrings/real/daisy-rosa-fucsia-3mm.png",
    "audience": "todos",
    "type": "Daisy",
    "line": "System75 Baby",
    "code": "130",
    "reference": "7581-6023",
    "sizeMm": 3,
    "verified": true,
    "globalWhiteCutout": false
  },
  {
    "id": "daisy-cristal-3mm",
    "name": "Daisy Cristal 3 mm",
    "src": "assets/earrings/real/daisy-cristal-3mm.png",
    "thumb": "assets/earrings/real/daisy-cristal-3mm.png",
    "audience": "todos",
    "type": "Daisy",
    "line": "System75 Baby",
    "code": "126",
    "reference": "7581-6004",
    "sizeMm": 3,
    "verified": true,
    "globalWhiteCutout": false
  },
  {
    "id": "daisy-rubi-cristal-3mm",
    "name": "Daisy Rubi Cristal 3 mm",
    "src": "assets/earrings/real/daisy-rubi-cristal-3mm.png",
    "thumb": "assets/earrings/real/daisy-rubi-cristal-3mm.png",
    "audience": "todos",
    "type": "Daisy",
    "line": "System75 Baby",
    "code": "125",
    "reference": "7581-6074",
    "sizeMm": 3,
    "verified": true,
    "globalWhiteCutout": false
  },
  {
    "id": "daisy-cristal-rosa-3mm",
    "name": "Daisy Cristal Rosa 3 mm",
    "src": "assets/earrings/real/daisy-cristal-rosa-3mm.png",
    "thumb": "assets/earrings/real/daisy-cristal-rosa-3mm.png",
    "audience": "todos",
    "type": "Daisy",
    "line": "System75 Baby",
    "code": "127",
    "reference": "7581-6410",
    "sizeMm": 3,
    "verified": true,
    "globalWhiteCutout": false
  }
];

const dom = {
  uploadSection: document.querySelector("#uploadSection"),
  workspace: document.querySelector("#workspace"),
  dropZone: document.querySelector("#dropZone"),
  photoInput: document.querySelector("#photoInput"),
  cameraInput: document.querySelector("#cameraInput"),
  choosePhotoBtn: document.querySelector("#choosePhotoBtn"),
  cameraPhotoBtn: document.querySelector("#cameraPhotoBtn"),
  changePhotoBtn: document.querySelector("#changePhotoBtn"),
  changeEarringBtn: document.querySelector("#changeEarringBtn"),
  editorKicker: document.querySelector("#editorKicker"),
  editorTitle: document.querySelector("#editorTitle"),
  canvas: document.querySelector("#editorCanvas"),
  canvasHint: document.querySelector("#canvasHint"),
  catalogPanel: document.querySelector("#catalogPanel"),
  catalogGrid: document.querySelector("#catalogGrid"),
  catalogCount: document.querySelector("#catalogCount"),
  catalogEmpty: document.querySelector("#catalogEmpty"),
  catalogSearch: document.querySelector("#catalogSearch"),
  typeFilter: document.querySelector("#typeFilter"),
  audienceButtons: [...document.querySelectorAll("[data-audience]")],
  priceSettingsButtons: [...document.querySelectorAll("[data-open-price-settings]")],
  priceDialog: document.querySelector("#priceDialog"),
  priceForm: document.querySelector("#priceForm"),
  priceEditorList: document.querySelector("#priceEditorList"),
  closePriceDialogBtn: document.querySelector("#closePriceDialogBtn"),
  clearPricesBtn: document.querySelector("#clearPricesBtn"),
  selectedPriceValue: document.querySelector("#selectedPriceValue"),
  selectedModelName: document.querySelector("#selectedModelName"),
  selectedModelImage: document.querySelector("#selectedModelImage"),
  customEarringBtn: document.querySelector("#customEarringBtn"),
  customEarringInput: document.querySelector("#customEarringInput"),
  autoRemoveBg: document.querySelector("#autoRemoveBg"),
  adjustmentPanel: document.querySelector("#adjustmentPanel"),
  sizeRange: document.querySelector("#sizeRange"),
  sizeOutput: document.querySelector("#sizeOutput"),
  rotationRange: document.querySelector("#rotationRange"),
  rotationOutput: document.querySelector("#rotationOutput"),
  opacityRange: document.querySelector("#opacityRange"),
  opacityOutput: document.querySelector("#opacityOutput"),
  markHoleBtn: document.querySelector("#markHoleBtn"),
  flipBtn: document.querySelector("#flipBtn"),
  removeBtn: document.querySelector("#removeBtn"),
  downloadBtn: document.querySelector("#downloadBtn"),
  downloadFormat: document.querySelector("#downloadFormat"),
  downloadLabel: document.querySelector("#downloadLabel"),
  downloadStatus: document.querySelector("#downloadStatus"),
  toast: document.querySelector("#toast"),
  siteUpdateButton: document.querySelector("#siteUpdateButton"),
  stepItems: [...document.querySelectorAll(".step")],
  nudgeButtons: [...document.querySelectorAll("[data-nudge]")]
};

const ctx = dom.canvas.getContext("2d", { alpha: false, desynchronized: true });
const localAnalysisCanvas = document.createElement("canvas");
localAnalysisCanvas.width = LOCAL_ANALYSIS_SIZE;
localAnalysisCanvas.height = LOCAL_ANALYSIS_SIZE;
const localAnalysisCtx = localAnalysisCanvas.getContext("2d", { willReadFrequently: true });

const state = {
  background: null,
  backgroundObjectUrl: null,
  earring: null,
  customObjectUrls: new Set(),
  selectedId: null,
  anchor: null,
  anchorMode: false,
  transform: {
    x: 0,
    y: 0,
    baseScale: 1,
    sizePercent: 100,
    rotation: 0,
    opacity: 1,
    flipX: false
  },
  pointers: new Map(),
  interaction: null,
  rafId: 0,
  customCount: 0,
  toastTimer: 0,
  renderBusy: false,
  availableSiteVersion: SITE_VERSION,
  siteUpdateBusy: false,
  localAnalysisCache: null,
  localRenderCache: null,
  prices: loadStoredPrices(),
  priceDialogLastFocus: null,
  filters: { audience: "todos", type: "todos", query: "" }
};

function loadStoredPrices() {
  try {
    const raw = window.localStorage.getItem(PRICE_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return Object.fromEntries(
      Object.entries(parsed).filter(([, value]) => Number.isFinite(value) && value >= 0 && value <= MAX_PRICE)
    );
  } catch (error) {
    console.warn("Não foi possível carregar os preços salvos.", error);
    return {};
  }
}

function persistPrices() {
  try {
    window.localStorage.setItem(PRICE_STORAGE_KEY, JSON.stringify(state.prices));
    return true;
  } catch (error) {
    console.warn("Não foi possível salvar os preços no navegador.", error);
    return false;
  }
}

function parsePriceInput(value) {
  const original = String(value ?? "").trim();
  if (!original) return null;

  let cleaned = original.replace(/[^0-9,.-]/g, "");
  const commaIndex = cleaned.lastIndexOf(",");
  const dotIndex = cleaned.lastIndexOf(".");

  if (commaIndex !== -1 && dotIndex !== -1) {
    if (commaIndex > dotIndex) cleaned = cleaned.replace(/\./g, "").replace(",", ".");
    else cleaned = cleaned.replace(/,/g, "");
  } else if (commaIndex !== -1) {
    cleaned = cleaned.replace(",", ".");
  }

  const price = Number(cleaned);
  if (!Number.isFinite(price) || price < 0 || price > MAX_PRICE) return undefined;
  return Math.round(price * 100) / 100;
}

function formatPrice(price) {
  return Number.isFinite(price) ? priceFormatter.format(price) : "Preço não definido";
}

function getCatalogItem(itemId) {
  return catalog.find((item) => item.id === itemId) || null;
}


function getHighResolutionCatalogUrl(src) {
  if (!src || !src.includes("static.wixstatic.com")) return src;
  return src
    .replace(/w_344%2Ch_344/gi, "w_1200%2Ch_1200")
    .replace(/q_90/gi, "q_100");
}

async function loadCatalogSource(item) {
  const highResolutionSrc = getHighResolutionCatalogUrl(item.src);
  try {
    return await loadImage(highResolutionSrc, { crossOrigin: "anonymous" });
  } catch (error) {
    if (highResolutionSrc !== item.src) {
      return loadImage(item.src, { crossOrigin: "anonymous" });
    }
    throw error;
  }
}

function renderCatalogPreview(target, item) {
  const token = `${item.id}-${Date.now()}-${Math.random()}`;
  target.dataset.previewToken = token;
  target.classList.add("is-loading");
  target.src = (item.crop || item.globalWhiteCutout) ? TRANSPARENT_PIXEL : (item.thumb || item.src);

  if (!item.crop && !item.globalWhiteCutout) {
    target.classList.remove("is-loading");
    return;
  }

  loadCatalogEarring(item)
    .then((image) => {
      if (target.dataset.previewToken !== token) return;
      target.src = image.src;
      target.classList.remove("is-loading");
    })
    .catch((error) => {
      console.warn(`Não foi possível preparar a miniatura de ${item.name}.`, error);
      if (target.dataset.previewToken !== token) return;
      target.src = item.thumb || item.src;
      target.classList.remove("is-loading");
    });
}

function createCatalogButton(item) {
  const card = document.createElement("article");
  card.className = "catalog-card";
  card.dataset.id = item.id;
  card.setAttribute("role", "listitem");

  const select = document.createElement("button");
  select.type = "button";
  select.className = "catalog-select";
  select.dataset.id = item.id;

  const img = document.createElement("img");
  img.src = TRANSPARENT_PIXEL;
  img.alt = "";
  img.loading = "lazy";
  renderCatalogPreview(img, item);

  const name = document.createElement("span");
  name.className = "catalog-name";
  name.textContent = item.name;

  const tags = document.createElement("span");
  tags.className = "catalog-tags";
  tags.textContent = `${item.line} · Ref. ${item.reference}`;
  select.append(img, name, tags);
  select.addEventListener("click", () => selectEarring(item));

  const priceLabel = document.createElement("label");
  priceLabel.className = "catalog-price-field";
  const prefix = document.createElement("span");
  prefix.textContent = "R$";
  const input = document.createElement("input");
  input.type = "text";
  input.inputMode = "decimal";
  input.autocomplete = "off";
  input.placeholder = "0,00";
  input.className = "catalog-price-input";
  input.dataset.inlinePrice = item.id;
  input.setAttribute("aria-label", `Preço de ${item.name}`);
  const saved = state.prices[item.id];
  input.value = Number.isFinite(saved) ? saved.toFixed(2).replace(".", ",") : "";
  input.addEventListener("change", () => saveSinglePrice(input));
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") { event.preventDefault(); input.blur(); }
  });
  priceLabel.append(prefix, input);

  card.append(select, priceLabel);
  updateCatalogButtonPrice(card, item);
  return card;
}

function saveSinglePrice(input) {
  const parsed = parsePriceInput(input.value);
  if (parsed === undefined) {
    input.setAttribute("aria-invalid", "true");
    showToast("Digite um preço válido.");
    return false;
  }
  input.removeAttribute("aria-invalid");
  if (parsed === null) delete state.prices[input.dataset.inlinePrice];
  else state.prices[input.dataset.inlinePrice] = parsed;
  persistPrices();
  if (Number.isFinite(parsed)) input.value = parsed.toFixed(2).replace(".", ",");
  updateSelectedPriceSummary();
  return true;
}

function updateCatalogButtonPrice(card, item) {
  const value = state.prices[item.id];
  const input = card.querySelector(".catalog-price-input");
  if (input && document.activeElement !== input) input.value = Number.isFinite(value) ? value.toFixed(2).replace(".", ",") : "";
  const select = card.querySelector(".catalog-select");
  if (select) select.setAttribute("aria-label", Number.isFinite(value) ? `Aplicar ${item.name}, ${formatPrice(value)}` : `Aplicar ${item.name}`);
}

function getFilteredCatalog() {
  const query = state.filters.query.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  return catalog.filter((item) => {
    const audienceMatch = true;
    const typeMatch = state.filters.type === "todos" || item.type === state.filters.type;
    const haystack = `${item.name} ${item.type} ${item.line} ${item.code} ${item.reference}`.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    return audienceMatch && typeMatch && (!query || haystack.includes(query));
  });
}

function renderCatalog() {
  const visible = getFilteredCatalog();
  dom.catalogGrid.textContent = "";
  visible.forEach((item) => dom.catalogGrid.appendChild(createCatalogButton(item)));
  dom.catalogEmpty.hidden = visible.length > 0;
  updateCatalogCount(visible.length);
  syncSelectedCatalogItem();
}

function populateTypeFilter() {
  const types = [...new Set(catalog.map((item) => item.type))].sort((a, b) => a.localeCompare(b, "pt-BR"));
  dom.typeFilter.innerHTML = '<option value="todos">Todos os tipos</option>';
  types.forEach((type) => {
    const option = document.createElement("option");
    option.value = type;
    option.textContent = type;
    dom.typeFilter.appendChild(option);
  });
}

function updateCatalogCount(visibleCount = getFilteredCatalog().length) {
  dom.catalogCount.textContent = `${visibleCount} de ${catalog.length}`;
}

function updateCatalogPrices() {
  dom.catalogGrid.querySelectorAll(".catalog-card").forEach((card) => {
    const item = getCatalogItem(card.dataset.id);
    if (item) updateCatalogButtonPrice(card, item);
  });
  updateSelectedPriceSummary();
}

function updateSelectedPriceSummary() {
  if (!state.selectedId) {
    dom.selectedPriceValue.textContent = "Preço não definido";
    dom.selectedPriceValue.classList.add("is-empty");
    dom.selectedModelName.textContent = "—";
    dom.selectedModelImage.removeAttribute("src");
    return;
  }
  const item = getCatalogItem(state.selectedId);
  const price = state.prices[state.selectedId];
  dom.selectedPriceValue.textContent = formatPrice(price);
  dom.selectedPriceValue.classList.toggle("is-empty", !Number.isFinite(price));
  if (item) {
    dom.selectedModelName.textContent = item.name;
    dom.selectedModelImage.alt = item.name;
    renderCatalogPreview(dom.selectedModelImage, item);
  }
}

function renderPriceEditor() {
  dom.priceEditorList.textContent = "";
  catalog.forEach((item) => {
    const row = document.createElement("label");
    row.className = "price-editor-row";

    const preview = document.createElement("img");
    preview.src = TRANSPARENT_PIXEL;
    preview.alt = "";
    preview.loading = "lazy";
    renderCatalogPreview(preview, item);

    const info = document.createElement("span");
    info.className = "price-editor-info";
    const name = document.createElement("strong");
    name.textContent = item.name;
    const hint = document.createElement("small");
    hint.textContent = "Valor exibido no catálogo";
    info.append(name, hint);

    const field = document.createElement("span");
    field.className = "price-input-wrap";
    const prefix = document.createElement("span");
    prefix.textContent = "R$";
    const input = document.createElement("input");
    input.type = "text";
    input.inputMode = "decimal";
    input.autocomplete = "off";
    input.placeholder = "0,00";
    input.dataset.priceInput = item.id;
    input.setAttribute("aria-label", `Preço de ${item.name}`);
    const saved = state.prices[item.id];
    input.value = Number.isFinite(saved) ? saved.toFixed(2).replace(".", ",") : "";
    field.append(prefix, input);

    row.append(preview, info, field);
    dom.priceEditorList.appendChild(row);
  });
}

function openPriceDialog(event) {
  if (!dom.priceDialog) return;
  state.priceDialogLastFocus = event?.currentTarget || document.activeElement;
  renderPriceEditor();
  if (typeof dom.priceDialog.showModal === "function") dom.priceDialog.showModal();
  else dom.priceDialog.setAttribute("open", "");
  window.setTimeout(() => dom.priceEditorList.querySelector("input")?.focus(), 0);
}

function closePriceDialog() {
  if (!dom.priceDialog) return;
  if (typeof dom.priceDialog.close === "function" && dom.priceDialog.open) dom.priceDialog.close();
  else dom.priceDialog.removeAttribute("open");
  state.priceDialogLastFocus?.focus?.();
}

function savePricesFromEditor() {
  const nextPrices = { ...state.prices };
  const inputs = [...dom.priceEditorList.querySelectorAll("[data-price-input]")];

  for (const input of inputs) {
    const parsed = parsePriceInput(input.value);
    if (parsed === undefined) {
      input.focus();
      input.setAttribute("aria-invalid", "true");
      showToast("Digite um valor válido entre R$ 0,00 e R$ 999.999,99.");
      return false;
    }
    input.removeAttribute("aria-invalid");
    if (parsed === null) delete nextPrices[input.dataset.priceInput];
    else nextPrices[input.dataset.priceInput] = parsed;
  }

  state.prices = nextPrices;
  const persisted = persistPrices();
  updateCatalogPrices();
  showToast(persisted ? "Preços salvos neste navegador." : "Preços aplicados, mas o navegador bloqueou o armazenamento.");
  return true;
}

function clearAllPrices() {
  if (!window.confirm("Remover todos os preços salvos deste navegador?")) return;
  state.prices = {};
  persistPrices();
  renderPriceEditor();
  updateCatalogPrices();
  showToast("Todos os preços foram removidos.");
}

function updateSteps(activeStep) {
  dom.stepItems.forEach((item, index) => {
    const step = index + 1;
    item.classList.toggle("is-active", step === activeStep);
    item.classList.toggle("is-complete", step < activeStep);
  });
}

function setBusy(isBusy, label = "Processando…") {
  const hasComposition = Boolean(state.background && state.earring && state.anchor && !state.anchorMode);
  dom.downloadBtn.disabled = isBusy || state.renderBusy || !hasComposition;
  dom.choosePhotoBtn.disabled = isBusy;
  dom.cameraPhotoBtn.disabled = isBusy;
  dom.customEarringBtn.disabled = isBusy;
  dom.priceSettingsButtons.forEach((button) => { button.disabled = isBusy; });
  if (isBusy) showToast(label, 8000);
}

function setRenderStatus(message, type = "neutral") {
  if (!dom.downloadStatus) return;
  dom.downloadStatus.textContent = message;
  dom.downloadStatus.classList.toggle("is-error", type === "error");
  dom.downloadStatus.classList.toggle("is-success", type === "success");
}

function resetLocalRenderStatus({ resetStatus = true } = {}) {
  state.localAnalysisCache = null;
  state.localRenderCache = null;
  if (resetStatus) {
    setRenderStatus("A IA visual local ajusta luz, sombra, cor e contato diretamente no seu aparelho.");
  }
}

function invalidateLocalRender() {
  state.localAnalysisCache = null;
  state.localRenderCache = null;
}

function setRenderBusy(isBusy) {
  state.renderBusy = isBusy;
  const hasComposition = Boolean(state.background && state.earring && state.anchor && !state.anchorMode);
  dom.workspace.classList.toggle("is-local-busy", isBusy);
  dom.workspace.setAttribute("aria-busy", String(isBusy));
  dom.downloadBtn.disabled = isBusy || !hasComposition;
  dom.downloadBtn.classList.toggle("is-loading", isBusy);
  dom.downloadLabel.textContent = isBusy ? "Finalizando no aparelho…" : "Baixar imagem";
  dom.downloadFormat.disabled = isBusy;
  dom.changePhotoBtn.disabled = isBusy;
  dom.markHoleBtn.disabled = isBusy;
  dom.flipBtn.disabled = isBusy;
  dom.removeBtn.disabled = isBusy;
  dom.customEarringBtn.disabled = isBusy;
  dom.priceSettingsButtons.forEach((button) => { button.disabled = isBusy; });
  dom.sizeRange.disabled = isBusy || !state.earring;
  dom.rotationRange.disabled = isBusy || !state.earring;
  dom.opacityRange.disabled = isBusy || !state.earring;
  dom.nudgeButtons.forEach((button) => { button.disabled = isBusy; });
  dom.catalogGrid.querySelectorAll("button, input").forEach((control) => { control.disabled = isBusy; });
  if (isBusy) {
    setRenderStatus("Ajustando iluminação, reflexos, recorte e sombra localmente…");
  } else {
    updateEditorAvailability();
  }
}

function showToast(message, duration = 2600) {
  window.clearTimeout(state.toastTimer);
  dom.toast.textContent = message;
  dom.toast.classList.add("is-visible");
  state.toastTimer = window.setTimeout(() => dom.toast.classList.remove("is-visible"), duration);
}

function validateImageFile(file, maxBytes = MAX_PHOTO_BYTES) {
  if (!file) return false;
  if (!/^image\/(jpeg|png|webp)$/i.test(file.type)) {
    showToast("Use uma imagem JPG, PNG ou WEBP.");
    return false;
  }
  if (file.size > maxBytes) {
    showToast(`A imagem deve ter no máximo ${Math.round(maxBytes / 1024 / 1024)} MB.`);
    return false;
  }
  return true;
}

function loadImage(source, options = {}) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    if (options.crossOrigin) image.crossOrigin = options.crossOrigin;
    image.referrerPolicy = "no-referrer";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Não foi possível abrir a imagem."));
    image.src = source;
  });
}

const catalogCutoutCache = new Map();

function clampByte(value) {
  return Math.max(0, Math.min(255, Math.round(value)));
}

function removeWhiteProductBackground(canvas) {
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const { data } = imageData;
  const width = canvas.width;
  const height = canvas.height;
  const exterior = new Uint8Array(width * height);
  const queue = new Int32Array(width * height);
  let head = 0;
  let tail = 0;

  const isBackgroundLike = (index) => {
    const p = index * 4;
    const r = data[p];
    const g = data[p + 1];
    const b = data[p + 2];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    return min > 218 && max - min < 38;
  };

  const enqueue = (index) => {
    if (exterior[index] || !isBackgroundLike(index)) return;
    exterior[index] = 1;
    queue[tail++] = index;
  };

  for (let x = 0; x < width; x += 1) {
    enqueue(x);
    enqueue((height - 1) * width + x);
  }
  for (let y = 1; y < height - 1; y += 1) {
    enqueue(y * width);
    enqueue(y * width + width - 1);
  }

  while (head < tail) {
    const index = queue[head++];
    const x = index % width;
    const y = Math.floor(index / width);
    if (x > 0) enqueue(index - 1);
    if (x + 1 < width) enqueue(index + 1);
    if (y > 0) enqueue(index - width);
    if (y + 1 < height) enqueue(index + width);
  }

  for (let index = 0; index < width * height; index += 1) {
    const p = index * 4;
    if (exterior[index]) {
      const r = data[p];
      const g = data[p + 1];
      const b = data[p + 2];
      const distance = Math.hypot(255 - r, 255 - g, 255 - b);
      data[p + 3] = clampByte((distance - 5) * 7.5);
    } else {
      data[p + 3] = Math.max(data[p + 3], 225);
    }
  }
  ctx.putImageData(imageData, 0, 0);
}

function removeNeutralLightBackgroundGlobal(canvas) {
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const { data } = imageData;

  for (let index = 0; index < data.length; index += 4) {
    const r = data[index];
    const g = data[index + 1];
    const b = data[index + 2];
    const alpha = data[index + 3];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);

    if (alpha < 8) {
      data[index + 3] = 0;
      continue;
    }

    if (min > 168 && max - min < 58) {
      const distance = Math.hypot(255 - r, 255 - g, 255 - b);
      data[index + 3] = Math.min(alpha, clampByte((distance - 7) * 6.5));
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

function trimTransparentCanvas(sourceCanvas, padding = 18) {
  const ctx = sourceCanvas.getContext("2d", { willReadFrequently: true });
  const { data } = ctx.getImageData(0, 0, sourceCanvas.width, sourceCanvas.height);
  let minX = sourceCanvas.width;
  let minY = sourceCanvas.height;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < sourceCanvas.height; y += 1) {
    for (let x = 0; x < sourceCanvas.width; x += 1) {
      if (data[(y * sourceCanvas.width + x) * 4 + 3] > 12) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }
  if (maxX < minX || maxY < minY) return sourceCanvas;
  const width = maxX - minX + 1;
  const height = maxY - minY + 1;
  const side = Math.max(width, height) + padding * 2;
  const output = document.createElement("canvas");
  output.width = side;
  output.height = side;
  const outputCtx = output.getContext("2d");
  outputCtx.imageSmoothingEnabled = true;
  outputCtx.imageSmoothingQuality = "high";
  outputCtx.drawImage(sourceCanvas, minX, minY, width, height, (side - width) / 2, (side - height) / 2, width, height);
  return output;
}

async function loadCatalogEarring(item) {
  if (!item.crop && !item.globalWhiteCutout) return loadImage(item.src);
  if (catalogCutoutCache.has(item.id)) return catalogCutoutCache.get(item.id);

  const promise = (async () => {
    if (item.globalWhiteCutout && !item.crop) {
      const source = await loadImage(item.src);
      const maxSide = Math.max(source.naturalWidth, source.naturalHeight);
      const renderScale = Math.min(3, CATALOG_CUTOUT_SIDE / maxSide);
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(source.naturalWidth * renderScale));
      canvas.height = Math.max(1, Math.round(source.naturalHeight * renderScale));
      const ctx = canvas.getContext("2d");
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
      removeNeutralLightBackgroundGlobal(canvas);
      const trimmed = trimTransparentCanvas(canvas, 34);
      return loadImage(trimmed.toDataURL("image/png"));
    }

    const source = await loadCatalogSource(item);
    const [baseX, baseY, baseWidth, baseHeight] = item.crop;
    const baseSize = item.cropBaseSize || CATALOG_SOURCE_BASE_SIZE;
    const scaleX = source.naturalWidth / baseSize;
    const scaleY = source.naturalHeight / baseSize;
    const sourceX = baseX * scaleX;
    const sourceY = baseY * scaleY;
    const sourceWidth = baseWidth * scaleX;
    const sourceHeight = baseHeight * scaleY;
    const renderScale = Math.min(4, CATALOG_CUTOUT_SIDE / Math.max(sourceWidth, sourceHeight));

    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(sourceWidth * renderScale));
    canvas.height = Math.max(1, Math.round(sourceHeight * renderScale));
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(source, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, canvas.width, canvas.height);
    removeWhiteProductBackground(canvas);
    const trimmed = trimTransparentCanvas(canvas, 30);
    return loadImage(trimmed.toDataURL("image/png"));
  })();

  catalogCutoutCache.set(item.id, promise);
  try {
    return await promise;
  } catch (error) {
    catalogCutoutCache.delete(item.id);
    throw error;
  }
}

async function handlePhotoFile(file) {
  if (!validateImageFile(file)) return;
  setBusy(true, "Preparando sua foto…");

  try {
    if (state.backgroundObjectUrl) URL.revokeObjectURL(state.backgroundObjectUrl);
    const objectUrl = URL.createObjectURL(file);
    const image = await loadImage(objectUrl);
    state.backgroundObjectUrl = objectUrl;
    state.background = image;

    const scale = Math.min(1, MAX_CANVAS_SIDE / Math.max(image.naturalWidth, image.naturalHeight));
    dom.canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    dom.canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));

    state.anchor = null;
    state.anchorMode = true;
    state.earring = null;
    state.selectedId = null;
    resetLocalRenderStatus();
    resetTransformControls();
    syncSelectedCatalogItem();
    updateSelectedPriceSummary();
    updateEditorAvailability();

    dom.uploadSection.hidden = true;
    dom.workspace.hidden = false;
    dom.catalogPanel.hidden = true;
    dom.adjustmentPanel.hidden = true;
    dom.editorKicker.textContent = "Passo 2";
    dom.editorTitle.textContent = "Toque no furo da orelha";
    dom.canvasHint.classList.remove("is-hidden");
    dom.markHoleBtn.classList.add("is-active");
    dom.canvas.style.cursor = "crosshair";
    setRenderStatus(`Prévia em ${dom.canvas.width} × ${dom.canvas.height} px. O acabamento local está ativo.`);
    updateSteps(2);
    requestDraw();
    dom.workspace.scrollIntoView({ behavior: "smooth", block: "start" });
    showToast("Agora toque exatamente no furo da orelha.");
  } catch (error) {
    console.error(error);
    showToast("Não foi possível abrir essa foto.");
  } finally {
    setBusy(false);
  }
}

function resetTransformControls() {
  state.transform = {
    x: dom.canvas.width / 2,
    y: dom.canvas.height / 2,
    baseScale: 1,
    sizePercent: 100,
    rotation: 0,
    opacity: 1,
    flipX: false
  };
  dom.sizeRange.value = "100";
  dom.rotationRange.value = "0";
  dom.opacityRange.value = "100";
  updateRangeOutputs();
}

function updateRangeOutputs() {
  dom.sizeOutput.value = `${Math.round(state.transform.sizePercent)}%`;
  dom.rotationOutput.value = `${Math.round(state.transform.rotation)}°`;
  dom.opacityOutput.value = `${Math.round(state.transform.opacity * 100)}%`;
}

function updateEditorAvailability() {
  const hasEarring = Boolean(state.earring);
  dom.sizeRange.disabled = !hasEarring || state.renderBusy;
  dom.rotationRange.disabled = !hasEarring || state.renderBusy;
  dom.opacityRange.disabled = !hasEarring || state.renderBusy;
  const isReady = Boolean(state.background && hasEarring && state.anchor && !state.anchorMode);
  dom.downloadBtn.disabled = state.renderBusy || !isReady;
  if (hasEarring && state.anchor && !state.anchorMode) updateSteps(4);
}

function getCanvasPoint(event) {
  const rect = dom.canvas.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left) * (dom.canvas.width / rect.width),
    y: (event.clientY - rect.top) * (dom.canvas.height / rect.height)
  };
}

function effectiveScale() {
  return state.transform.baseScale * (state.transform.sizePercent / 100);
}

function hitTestEarring(point, padding = 0.18) {
  if (!state.earring) return false;
  const scale = effectiveScale();
  const width = state.earring.naturalWidth * scale;
  const height = state.earring.naturalHeight * scale;
  const angle = -state.transform.rotation * Math.PI / 180;
  const dx = point.x - state.transform.x;
  const dy = point.y - state.transform.y;
  const localX = Math.cos(angle) * dx - Math.sin(angle) * dy;
  const localY = Math.sin(angle) * dx + Math.cos(angle) * dy;
  return Math.abs(localX) <= width * (0.5 + padding) && Math.abs(localY) <= height * (0.5 + padding);
}

function requestDraw() {
  if (state.rafId) return;
  state.rafId = requestAnimationFrame(() => {
    state.rafId = 0;
    drawScene(true);
  });
}

function drawScene(showGuides, renderMode = "preview") {
  if (!state.background) return;
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = "source-over";
  ctx.filter = "none";
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, dom.canvas.width, dom.canvas.height);
  ctx.drawImage(state.background, 0, 0, dom.canvas.width, dom.canvas.height);

  if (state.earring) {
    const scale = effectiveScale();
    const width = state.earring.naturalWidth * scale;
    const height = state.earring.naturalHeight * scale;
    drawLocallyBlendedEarring(ctx, width, height, renderMode);

    if (showGuides && !state.anchorMode) drawSelectionGuide(width, height);
  }

  if (showGuides && state.anchor) drawAnchorGuide();
  ctx.restore();
}

function sampleLocalEnvironment(width, height) {
  if (!state.background) {
    return {
      r: 160, g: 140, b: 130, luminance: 145, deviation: 28,
      brightness: 1, contrast: 1.06, saturation: 1,
      lightX: -0.45, lightY: -0.55, shadowX: 2, shadowY: 3,
      shadowBlur: 5, shadowAlpha: 0.24
    };
  }

  const positionStep = Math.max(2, Math.round(Math.min(dom.canvas.width, dom.canvas.height) / 500));
  const key = [
    state.backgroundObjectUrl || "background",
    Math.round(state.transform.x / positionStep),
    Math.round(state.transform.y / positionStep),
    Math.round(width / 3),
    Math.round(height / 3)
  ].join("|");
  if (state.localAnalysisCache?.key === key) return state.localAnalysisCache.value;

  const radius = clamp(
    Math.max(width, height) * 1.1,
    Math.min(dom.canvas.width, dom.canvas.height) * 0.025,
    Math.min(dom.canvas.width, dom.canvas.height) * 0.17
  );
  const sourceScaleX = state.background.naturalWidth / dom.canvas.width;
  const sourceScaleY = state.background.naturalHeight / dom.canvas.height;
  const sx = clamp((state.transform.x - radius) * sourceScaleX, 0, state.background.naturalWidth - 1);
  const sy = clamp((state.transform.y - radius) * sourceScaleY, 0, state.background.naturalHeight - 1);
  const sw = Math.max(1, Math.min(radius * 2 * sourceScaleX, state.background.naturalWidth - sx));
  const sh = Math.max(1, Math.min(radius * 2 * sourceScaleY, state.background.naturalHeight - sy));

  localAnalysisCtx.setTransform(1, 0, 0, 1, 0, 0);
  localAnalysisCtx.clearRect(0, 0, LOCAL_ANALYSIS_SIZE, LOCAL_ANALYSIS_SIZE);
  localAnalysisCtx.drawImage(
    state.background,
    sx, sy, sw, sh,
    0, 0, LOCAL_ANALYSIS_SIZE, LOCAL_ANALYSIS_SIZE
  );

  const pixels = localAnalysisCtx.getImageData(0, 0, LOCAL_ANALYSIS_SIZE, LOCAL_ANALYSIS_SIZE).data;
  let weightSum = 0;
  let rSum = 0;
  let gSum = 0;
  let bSum = 0;
  let lumSum = 0;
  let lumSqSum = 0;
  let centerWeightSum = 0;
  let centerR = 0;
  let centerG = 0;
  let centerB = 0;
  let brightWeight = 0;
  let brightX = 0;
  let brightY = 0;

  for (let y = 0; y < LOCAL_ANALYSIS_SIZE; y += 1) {
    for (let x = 0; x < LOCAL_ANALYSIS_SIZE; x += 1) {
      const index = (y * LOCAL_ANALYSIS_SIZE + x) * 4;
      const alpha = pixels[index + 3] / 255;
      if (alpha < 0.05) continue;
      const r = pixels[index];
      const g = pixels[index + 1];
      const b = pixels[index + 2];
      const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      const nx = (x + 0.5) / LOCAL_ANALYSIS_SIZE * 2 - 1;
      const ny = (y + 0.5) / LOCAL_ANALYSIS_SIZE * 2 - 1;
      const distanceFromCenter = Math.min(1, Math.hypot(nx, ny) / Math.SQRT2);
      const weight = alpha * (1 - distanceFromCenter * 0.58);

      weightSum += weight;
      rSum += r * weight;
      gSum += g * weight;
      bSum += b * weight;
      lumSum += luminance * weight;
      lumSqSum += luminance * luminance * weight;

      if (Math.hypot(nx, ny) < 0.48) {
        const centerWeight = alpha * (1.1 - Math.hypot(nx, ny));
        centerWeightSum += centerWeight;
        centerR += r * centerWeight;
        centerG += g * centerWeight;
        centerB += b * centerWeight;
      }
    }
  }

  const safeWeight = Math.max(1, weightSum);
  const meanLum = lumSum / safeWeight;
  const variance = Math.max(0, lumSqSum / safeWeight - meanLum * meanLum);
  const deviation = Math.sqrt(variance);

  for (let y = 0; y < LOCAL_ANALYSIS_SIZE; y += 1) {
    for (let x = 0; x < LOCAL_ANALYSIS_SIZE; x += 1) {
      const index = (y * LOCAL_ANALYSIS_SIZE + x) * 4;
      const alpha = pixels[index + 3] / 255;
      if (alpha < 0.05) continue;
      const luminance = 0.2126 * pixels[index] + 0.7152 * pixels[index + 1] + 0.0722 * pixels[index + 2];
      const nx = (x + 0.5) / LOCAL_ANALYSIS_SIZE * 2 - 1;
      const ny = (y + 0.5) / LOCAL_ANALYSIS_SIZE * 2 - 1;
      const highlight = Math.max(0, luminance - meanLum + 12) * alpha;
      brightWeight += highlight;
      brightX += nx * highlight;
      brightY += ny * highlight;
    }
  }

  const centerSafe = Math.max(1, centerWeightSum);
  let lightX = brightWeight > 0 ? brightX / brightWeight : -0.45;
  let lightY = brightWeight > 0 ? brightY / brightWeight : -0.55;
  const lightLength = Math.max(0.001, Math.hypot(lightX, lightY));
  lightX = clamp(lightX / lightLength, -1, 1);
  lightY = clamp(lightY / lightLength, -1, 1);

  const shadowDistance = clamp(Math.min(width, height) * 0.055, 1.2, Math.min(dom.canvas.width, dom.canvas.height) * 0.018);
  const value = {
    r: Math.round(centerR / centerSafe || rSum / safeWeight),
    g: Math.round(centerG / centerSafe || gSum / safeWeight),
    b: Math.round(centerB / centerSafe || bSum / safeWeight),
    luminance: meanLum,
    deviation,
    brightness: clamp(1 + (meanLum - 150) / 520, 0.74, 1.16),
    contrast: clamp(1.03 + deviation / 430, 1.03, 1.18),
    saturation: clamp(0.94 + deviation / 520, 0.94, 1.1),
    lightX,
    lightY,
    shadowX: -lightX * shadowDistance + width * 0.008,
    shadowY: -lightY * shadowDistance + height * 0.012,
    shadowBlur: clamp(Math.min(width, height) * 0.075, 2, Math.min(dom.canvas.width, dom.canvas.height) * 0.025),
    shadowAlpha: clamp(0.18 + (170 - meanLum) / 700, 0.14, 0.32)
  };

  state.localAnalysisCache = { key, value };
  return value;
}

function createLocalEarringLayer(width, height, environment, renderMode) {
  const requestedWidth = Math.max(1, Math.round(width));
  const requestedHeight = Math.max(1, Math.round(height));
  const maxSide = renderMode === "export" ? LOCAL_LAYER_MAX_SIDE : Math.min(900, LOCAL_LAYER_MAX_SIDE);
  const layerScale = Math.min(1, maxSide / Math.max(requestedWidth, requestedHeight));
  const layerWidth = Math.max(1, Math.round(requestedWidth * layerScale));
  const layerHeight = Math.max(1, Math.round(requestedHeight * layerScale));
  const key = [
    state.selectedId || "custom",
    layerWidth,
    layerHeight,
    Math.round(environment.brightness * 100),
    Math.round(environment.contrast * 100),
    Math.round(environment.saturation * 100),
    Math.round(environment.r / 8),
    Math.round(environment.g / 8),
    Math.round(environment.b / 8),
    renderMode
  ].join("|");
  if (state.localRenderCache?.key === key) return state.localRenderCache;

  const layer = document.createElement("canvas");
  layer.width = layerWidth;
  layer.height = layerHeight;
  const layerCtx = layer.getContext("2d");
  layerCtx.imageSmoothingEnabled = true;
  layerCtx.imageSmoothingQuality = "high";
  layerCtx.filter = `brightness(${environment.brightness}) contrast(${environment.contrast}) saturate(${environment.saturation})`;
  layerCtx.drawImage(state.earring, 0, 0, layerWidth, layerHeight);
  layerCtx.filter = "none";

  layerCtx.globalCompositeOperation = "source-atop";
  layerCtx.fillStyle = `rgba(${environment.r}, ${environment.g}, ${environment.b}, 0.055)`;
  layerCtx.fillRect(0, 0, layerWidth, layerHeight);

  const startX = (0.5 - environment.lightX * 0.5) * layerWidth;
  const startY = (0.5 - environment.lightY * 0.5) * layerHeight;
  const endX = (0.5 + environment.lightX * 0.5) * layerWidth;
  const endY = (0.5 + environment.lightY * 0.5) * layerHeight;
  const highlight = layerCtx.createLinearGradient(startX, startY, endX, endY);
  highlight.addColorStop(0, "rgba(255,255,255,0.24)");
  highlight.addColorStop(0.34, "rgba(255,255,255,0.07)");
  highlight.addColorStop(0.72, "rgba(255,255,255,0)");
  highlight.addColorStop(1, "rgba(0,0,0,0.08)");
  layerCtx.fillStyle = highlight;
  layerCtx.fillRect(0, 0, layerWidth, layerHeight);

  const glintRadius = Math.max(layerWidth, layerHeight) * 0.58;
  const glintX = clamp(layerWidth * (0.5 - environment.lightX * 0.26), 0, layerWidth);
  const glintY = clamp(layerHeight * (0.5 - environment.lightY * 0.26), 0, layerHeight);
  const glint = layerCtx.createRadialGradient(glintX, glintY, 0, glintX, glintY, glintRadius);
  glint.addColorStop(0, "rgba(255,255,255,0.17)");
  glint.addColorStop(0.38, "rgba(255,255,255,0.035)");
  glint.addColorStop(1, "rgba(255,255,255,0)");
  layerCtx.fillStyle = glint;
  layerCtx.fillRect(0, 0, layerWidth, layerHeight);
  layerCtx.globalCompositeOperation = "source-over";

  const silhouette = document.createElement("canvas");
  silhouette.width = layerWidth;
  silhouette.height = layerHeight;
  const silhouetteCtx = silhouette.getContext("2d");
  silhouetteCtx.drawImage(layer, 0, 0);
  silhouetteCtx.globalCompositeOperation = "source-in";
  silhouetteCtx.fillStyle = "#100b08";
  silhouetteCtx.fillRect(0, 0, layerWidth, layerHeight);
  silhouetteCtx.globalCompositeOperation = "source-over";

  const result = { key, layer, silhouette, layerScale };
  state.localRenderCache = result;
  return result;
}

function drawContactShadow(targetCtx, width, height, environment) {
  const radiusX = clamp(width * 0.15, 2, Math.min(dom.canvas.width, dom.canvas.height) * 0.025);
  const radiusY = clamp(height * 0.11, 1.5, Math.min(dom.canvas.width, dom.canvas.height) * 0.018);
  targetCtx.save();
  targetCtx.translate(state.transform.x, state.transform.y);
  targetCtx.rotate(state.transform.rotation * Math.PI / 180);
  const gradient = targetCtx.createRadialGradient(
    environment.shadowX * 0.22,
    environment.shadowY * 0.22,
    0,
    environment.shadowX * 0.22,
    environment.shadowY * 0.22,
    Math.max(radiusX, radiusY)
  );
  gradient.addColorStop(0, `rgba(24, 13, 9, ${environment.shadowAlpha * 0.7})`);
  gradient.addColorStop(0.42, `rgba(24, 13, 9, ${environment.shadowAlpha * 0.24})`);
  gradient.addColorStop(1, "rgba(24, 13, 9, 0)");
  targetCtx.fillStyle = gradient;
  targetCtx.beginPath();
  targetCtx.ellipse(0, 0, radiusX, radiusY, 0, 0, Math.PI * 2);
  targetCtx.fill();
  targetCtx.restore();
}

function drawLocallyBlendedEarring(targetCtx, width, height, renderMode = "preview") {
  const environment = sampleLocalEnvironment(width, height);
  const localLayer = createLocalEarringLayer(width, height, environment, renderMode);
  const layerWidth = localLayer.layer.width / localLayer.layerScale;
  const layerHeight = localLayer.layer.height / localLayer.layerScale;

  drawContactShadow(targetCtx, width, height, environment);

  targetCtx.save();
  targetCtx.translate(state.transform.x, state.transform.y);
  targetCtx.rotate(state.transform.rotation * Math.PI / 180);
  targetCtx.scale(state.transform.flipX ? -1 : 1, 1);

  targetCtx.globalAlpha = state.transform.opacity * environment.shadowAlpha;
  targetCtx.filter = `blur(${environment.shadowBlur}px)`;
  targetCtx.drawImage(
    localLayer.silhouette,
    -layerWidth / 2 + environment.shadowX,
    -layerHeight / 2 + environment.shadowY,
    layerWidth,
    layerHeight
  );

  targetCtx.filter = "none";
  targetCtx.globalAlpha = state.transform.opacity;
  targetCtx.drawImage(localLayer.layer, -layerWidth / 2, -layerHeight / 2, layerWidth, layerHeight);

  targetCtx.globalCompositeOperation = "screen";
  targetCtx.globalAlpha = state.transform.opacity * 0.055;
  const edgeLight = targetCtx.createLinearGradient(
    -layerWidth * environment.lightX * 0.5,
    -layerHeight * environment.lightY * 0.5,
    layerWidth * environment.lightX * 0.5,
    layerHeight * environment.lightY * 0.5
  );
  edgeLight.addColorStop(0, "rgba(255,255,255,0.72)");
  edgeLight.addColorStop(0.6, "rgba(255,255,255,0)");
  targetCtx.fillStyle = edgeLight;
  targetCtx.beginPath();
  targetCtx.ellipse(0, 0, layerWidth * 0.47, layerHeight * 0.47, 0, 0, Math.PI * 2);
  targetCtx.fill();
  targetCtx.restore();

}

function downloadDataUrl(dataUrl, filename) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function drawSelectionGuide(width, height) {
  ctx.save();
  ctx.translate(state.transform.x, state.transform.y);
  ctx.rotate(state.transform.rotation * Math.PI / 180);
  ctx.strokeStyle = "rgba(255,255,255,.95)";
  ctx.lineWidth = Math.max(2, dom.canvas.width / 700);
  ctx.setLineDash([Math.max(8, dom.canvas.width / 180), Math.max(5, dom.canvas.width / 260)]);
  ctx.strokeRect(-width / 2 - 8, -height / 2 - 8, width + 16, height + 16);
  ctx.restore();
}

function drawAnchorGuide() {
  const radius = Math.max(9, dom.canvas.width * 0.008);
  ctx.save();
  ctx.beginPath();
  ctx.arc(state.anchor.x, state.anchor.y, radius, 0, Math.PI * 2);
  ctx.fillStyle = state.anchorMode ? "rgba(17,17,17,.78)" : "rgba(255,255,255,.72)";
  ctx.fill();
  ctx.lineWidth = Math.max(2, dom.canvas.width / 900);
  ctx.strokeStyle = state.anchorMode ? "#ffffff" : "rgba(17,17,17,.65)";
  ctx.stroke();
  ctx.restore();
}

function enterAnchorMode() {
  if (!state.background || state.renderBusy) return;
  state.anchorMode = true;
  updateEditorAvailability();
  dom.markHoleBtn.classList.add("is-active");
  dom.canvasHint.classList.remove("is-hidden");
  dom.canvas.style.cursor = "crosshair";
  requestDraw();
  showToast("Toque exatamente no furo da orelha.");
}

function setAnchor(point) {
  resetLocalRenderStatus();
  state.anchor = point;
  state.anchorMode = false;
  dom.markHoleBtn.classList.remove("is-active");
  dom.canvasHint.classList.add("is-hidden");
  dom.canvas.style.cursor = state.earring ? "grab" : "default";
  if (state.earring) {
    state.transform.x = point.x;
    state.transform.y = point.y;
    dom.adjustmentPanel.hidden = false;
    dom.catalogPanel.hidden = true;
    dom.editorKicker.textContent = "Prévia";
    dom.editorTitle.textContent = "Brinco posicionado";
    updateSteps(4);
  } else {
    dom.catalogPanel.hidden = false;
    dom.adjustmentPanel.hidden = true;
    dom.editorKicker.textContent = "Sua foto";
    dom.editorTitle.textContent = "Furo marcado";
    updateSteps(3);
  }
  updateEditorAvailability();
  requestDraw();
  if (!state.earring) dom.catalogPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  showToast(state.earring ? "Brinco reposicionado no furo." : "Ponto marcado. Agora escolha um brinco.");
}

async function selectEarring(item) {
  if (state.renderBusy) return;
  if (!state.background) {
    showToast("Envie primeiro uma foto da orelha.");
    return;
  }
  resetLocalRenderStatus();
  setBusy(true, `Aplicando ${item.name}…`);
  try {
    const image = await loadCatalogEarring(item);
    state.earring = image;
    state.selectedId = item.id;
    const sizeMm = Number(item.sizeMm) || 3;
    const targetSize = Math.min(dom.canvas.width, dom.canvas.height) * Math.min(0.22, 0.055 + sizeMm * 0.012);
    state.transform.baseScale = targetSize / Math.max(image.naturalWidth, image.naturalHeight);
    state.transform.sizePercent = 100;
    state.transform.rotation = 0;
    state.transform.opacity = 1;
    state.transform.flipX = false;
    state.transform.x = state.anchor?.x ?? dom.canvas.width / 2;
    state.transform.y = state.anchor?.y ?? dom.canvas.height / 2;
    dom.sizeRange.value = "100";
    dom.rotationRange.value = "0";
    dom.opacityRange.value = "100";
    updateRangeOutputs();
    syncSelectedCatalogItem();
    updateSelectedPriceSummary();
    updateEditorAvailability();
    dom.canvas.style.cursor = "grab";
    requestDraw();
    if (!state.anchor) {
      enterAnchorMode();
    } else {
      dom.catalogPanel.hidden = true;
      dom.adjustmentPanel.hidden = false;
      dom.editorKicker.textContent = "Prévia";
      dom.editorTitle.textContent = "Brinco posicionado";
      updateSteps(4);
      window.setTimeout(() => dom.adjustmentPanel.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
    }
  } catch (error) {
    console.error(error);
    showToast("Não foi possível carregar esse brinco.");
  } finally {
    setBusy(false);
  }
}

function syncSelectedCatalogItem() {
  dom.catalogGrid.querySelectorAll(".catalog-card").forEach((card) => {
    const selected = card.dataset.id === state.selectedId;
    card.classList.toggle("is-selected", selected);
    card.querySelector(".catalog-select")?.setAttribute("aria-pressed", String(selected));
  });
}

function onPointerDown(event) {
  if (!state.background) return;
  dom.canvas.setPointerCapture?.(event.pointerId);
  const point = getCanvasPoint(event);
  state.pointers.set(event.pointerId, point);

  if (state.anchorMode) {
    setAnchor(point);
    return;
  }

  if (!state.earring) return;

  if (state.pointers.size === 1 && hitTestEarring(point)) {
    state.interaction = {
      type: "drag",
      startPointer: point,
      startX: state.transform.x,
      startY: state.transform.y
    };
    dom.canvas.style.cursor = "grabbing";
  }

  if (state.pointers.size === 2) {
    const [a, b] = [...state.pointers.values()];
    const center = midpoint(a, b);
    state.interaction = {
      type: "pinch",
      startDistance: distance(a, b),
      startAngle: angleBetween(a, b),
      startCenter: center,
      startX: state.transform.x,
      startY: state.transform.y,
      startSizePercent: state.transform.sizePercent,
      startRotation: state.transform.rotation
    };
  }
  event.preventDefault();
}

function onPointerMove(event) {
  if (!state.pointers.has(event.pointerId)) return;
  const point = getCanvasPoint(event);
  state.pointers.set(event.pointerId, point);
  const interaction = state.interaction;
  if (!interaction || !state.earring) return;
  invalidateLocalRender();

  if (interaction.type === "drag" && state.pointers.size === 1) {
    state.transform.x = clamp(interaction.startX + point.x - interaction.startPointer.x, 0, dom.canvas.width);
    state.transform.y = clamp(interaction.startY + point.y - interaction.startPointer.y, 0, dom.canvas.height);
  } else if (interaction.type === "pinch" && state.pointers.size >= 2) {
    const [a, b] = [...state.pointers.values()];
    const currentDistance = Math.max(1, distance(a, b));
    const currentAngle = angleBetween(a, b);
    const currentCenter = midpoint(a, b);
    state.transform.sizePercent = clamp(interaction.startSizePercent * currentDistance / Math.max(1, interaction.startDistance), 30, 300);
    state.transform.rotation = normalizeAngle(interaction.startRotation + (currentAngle - interaction.startAngle) * 180 / Math.PI);
    state.transform.x = clamp(interaction.startX + currentCenter.x - interaction.startCenter.x, 0, dom.canvas.width);
    state.transform.y = clamp(interaction.startY + currentCenter.y - interaction.startCenter.y, 0, dom.canvas.height);
    dom.sizeRange.value = String(Math.round(state.transform.sizePercent));
    dom.rotationRange.value = String(Math.round(state.transform.rotation));
    updateRangeOutputs();
  }
  requestDraw();
  event.preventDefault();
}

function onPointerUp(event) {
  state.pointers.delete(event.pointerId);
  if (state.pointers.size < 2 && state.interaction?.type === "pinch") state.interaction = null;
  if (state.pointers.size === 0) {
    state.interaction = null;
    dom.canvas.style.cursor = state.earring ? "grab" : "default";
  }
}

function midpoint(a, b) { return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }; }
function distance(a, b) { return Math.hypot(b.x - a.x, b.y - a.y); }
function angleBetween(a, b) { return Math.atan2(b.y - a.y, b.x - a.x); }
function clamp(value, min, max) { return Math.min(max, Math.max(min, value)); }
function normalizeAngle(value) {
  let result = value;
  while (result > 180) result -= 360;
  while (result < -180) result += 360;
  return result;
}

async function handleCustomEarring(file) {
  if (state.renderBusy) return;
  if (!validateImageFile(file, 12 * 1024 * 1024)) return;
  setBusy(true, dom.autoRemoveBg.checked ? "Recortando o brinco…" : "Preparando o brinco…");
  try {
    const resultUrl = dom.autoRemoveBg.checked ? await removeUniformBackground(file) : URL.createObjectURL(file);
    const image = await loadImage(resultUrl);
    const item = {
      id: `custom-${Date.now()}-${++state.customCount}`,
      name: file.name.replace(/\.[^.]+$/, "") || "Meu brinco",
      src: resultUrl,
      custom: true,
      audience: "todos",
      type: "Personalizado"
    };
    catalog.unshift(item);
    addCatalogItemToStart(item);
    if (resultUrl.startsWith("blob:")) state.customObjectUrls.add(resultUrl);
    await selectEarring(item);
    updateCatalogCount();
    showToast("Seu brinco foi aplicado no ponto marcado.");
  } catch (error) {
    console.error(error);
    showToast("Não foi possível preparar essa imagem de brinco.");
  } finally {
    dom.customEarringInput.value = "";
    setBusy(false);
  }
}

function addCatalogItemToStart(item) {
  populateTypeFilter();
  state.filters.query = "";
  dom.catalogSearch.value = "";
  renderCatalog();
}

async function removeUniformBackground(file) {
  const sourceUrl = URL.createObjectURL(file);
  try {
    const image = await loadImage(sourceUrl);
    const scale = Math.min(1, MAX_CUSTOM_SIDE / Math.max(image.naturalWidth, image.naturalHeight));
    const width = Math.max(1, Math.round(image.naturalWidth * scale));
    const height = Math.max(1, Math.round(image.naturalHeight * scale));
    const temp = document.createElement("canvas");
    temp.width = width;
    temp.height = height;
    const tempCtx = temp.getContext("2d", { willReadFrequently: true });
    tempCtx.drawImage(image, 0, 0, width, height);
    const imageData = tempCtx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const bg = sampleCornerColor(data, width, height);
    const threshold = 42;
    const feather = 58;

    for (let i = 0; i < data.length; i += 4) {
      const dr = data[i] - bg.r;
      const dg = data[i + 1] - bg.g;
      const db = data[i + 2] - bg.b;
      const distanceFromBg = Math.sqrt(dr * dr + dg * dg + db * db);
      const keep = clamp((distanceFromBg - threshold) / feather, 0, 1);
      data[i + 3] = Math.round(data[i + 3] * keep);
    }

    tempCtx.putImageData(imageData, 0, 0);
    return temp.toDataURL("image/png");
  } finally {
    URL.revokeObjectURL(sourceUrl);
  }
}

function sampleCornerColor(data, width, height) {
  const samples = [];
  const patch = Math.max(2, Math.round(Math.min(width, height) * 0.015));
  const corners = [
    [0, 0],
    [Math.max(0, width - patch), 0],
    [0, Math.max(0, height - patch)],
    [Math.max(0, width - patch), Math.max(0, height - patch)]
  ];

  for (const [startX, startY] of corners) {
    for (let y = startY; y < Math.min(height, startY + patch); y++) {
      for (let x = startX; x < Math.min(width, startX + patch); x++) {
        const index = (y * width + x) * 4;
        if (data[index + 3] > 20) samples.push([data[index], data[index + 1], data[index + 2]]);
      }
    }
  }

  if (!samples.length) return { r: 255, g: 255, b: 255 };
  samples.sort((a, b) => (a[0] + a[1] + a[2]) - (b[0] + b[1] + b[2]));
  const middle = samples[Math.floor(samples.length / 2)];
  return { r: middle[0], g: middle[1], b: middle[2] };
}

function removeEarring() {
  if (!state.earring) return;
  resetLocalRenderStatus();
  state.earring = null;
  state.selectedId = null;
  syncSelectedCatalogItem();
  updateSelectedPriceSummary();
  dom.adjustmentPanel.hidden = true;
  dom.catalogPanel.hidden = false;
  dom.editorKicker.textContent = "Sua foto";
  dom.editorTitle.textContent = "Escolha outro brinco";
  updateSteps(3);
  updateEditorAvailability();
  requestDraw();
  dom.catalogPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  showToast("Brinco removido.");
}

function nudge(direction) {
  if (!state.earring) return;
  invalidateLocalRender();
  const amount = Math.max(1, Math.round(Math.min(dom.canvas.width, dom.canvas.height) * NUDGE_PERCENT));
  if (direction === "up") state.transform.y -= amount;
  if (direction === "down") state.transform.y += amount;
  if (direction === "left") state.transform.x -= amount;
  if (direction === "right") state.transform.x += amount;
  state.transform.x = clamp(state.transform.x, 0, dom.canvas.width);
  state.transform.y = clamp(state.transform.y, 0, dom.canvas.height);
  requestDraw();
}

async function exportLocalImage(formatValue) {
  const format = formatValue === "jpeg" ? "image/jpeg" : "image/png";
  const blob = await new Promise((resolve, reject) => {
    drawScene(false, "export");
    dom.canvas.toBlob(
      (result) => result ? resolve(result) : reject(new Error("Falha na exportação.")),
      format,
      format === "image/jpeg" ? 0.96 : undefined
    );
  });
  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Falha ao preparar o arquivo."));
    reader.readAsDataURL(blob);
  });
  requestDraw();
  return dataUrl;
}

function nextFrame() {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

async function downloadImage() {
  if (!state.background || !state.earring || !state.anchor || state.anchorMode || state.renderBusy) return;
  const formatValue = dom.downloadFormat.value === "jpeg" ? "jpeg" : "png";
  const extension = formatValue === "jpeg" ? "jpg" : "png";
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

  setRenderBusy(true);
  try {
    await nextFrame();
    const dataUrl = await exportLocalImage(formatValue);
    downloadDataUrl(dataUrl, `provador-brinco-${timestamp}.${extension}`);
    setRenderStatus("Imagem finalizada no aparelho, sem envio para servidores.", "success");
    showToast("Imagem baixada com acabamento local.");
  } catch (error) {
    console.error(error);
    setRenderStatus("Não foi possível finalizar a imagem neste aparelho.", "error");
    showToast("Não foi possível baixar a imagem.");
  } finally {
    setRenderBusy(false);
    requestDraw();
    updateEditorAvailability();
  }
}

function resetAppForNewPhoto() {
  dom.photoInput.value = "";
  dom.cameraInput.value = "";
  dom.photoInput.click();
}

function openCatalogForChange() {
  if (!state.background || state.renderBusy) return;
  dom.catalogPanel.hidden = false;
  dom.adjustmentPanel.hidden = true;
  dom.editorKicker.textContent = "Sua foto";
  dom.editorTitle.textContent = state.anchor ? "Escolha outro brinco" : "Toque no furo da orelha";
  updateSteps(state.anchor ? 3 : 2);
  dom.catalogPanel.scrollIntoView({ behavior: "smooth", block: "start" });
}


function normalizeSiteVersion(value) {
  return String(value || "").trim().replace(/[^0-9A-Za-z._-]/g, "").slice(0, 80);
}

function getStoredSiteVersion() {
  try {
    return normalizeSiteVersion(window.localStorage.getItem(SITE_VERSION_STORAGE_KEY));
  } catch {
    return "";
  }
}

function storeSiteVersion(version) {
  try {
    window.localStorage.setItem(SITE_VERSION_STORAGE_KEY, normalizeSiteVersion(version) || SITE_VERSION);
  } catch {
    // O aviso continua funcionando na sessão mesmo quando o armazenamento está bloqueado.
  }
}

function setSiteUpdateButtonVisible(visible) {
  if (!dom.siteUpdateButton) return;
  dom.siteUpdateButton.hidden = !visible;
  dom.siteUpdateButton.classList.toggle("is-visible", visible);
}

async function fetchLatestSiteVersion() {
  const url = new URL(SITE_VERSION_URL, window.location.href);
  url.searchParams.set("check", String(Date.now()));
  const response = await fetch(url, {
    cache: "no-store",
    credentials: "same-origin",
    headers: { Accept: "application/json" }
  });
  if (!response.ok) throw new Error(`Falha ao consultar a versão do site (${response.status}).`);
  const payload = await response.json();
  return normalizeSiteVersion(payload.version) || SITE_VERSION;
}

async function checkForSiteUpdate({ initialize = false } = {}) {
  let latestVersion = SITE_VERSION;
  try {
    latestVersion = await fetchLatestSiteVersion();
  } catch (error) {
    console.warn("Não foi possível verificar a versão mais recente do site.", error);
  }

  state.availableSiteVersion = latestVersion;
  const storedVersion = getStoredSiteVersion();

  if (!storedVersion) {
    storeSiteVersion(latestVersion);
    setSiteUpdateButtonVisible(false);
    return;
  }

  const hasUpdate = storedVersion !== latestVersion;
  setSiteUpdateButtonVisible(hasUpdate);

  if (initialize && !hasUpdate) {
    const currentUrl = new URL(window.location.href);
    if (currentUrl.searchParams.has("_siteUpdated")) {
      currentUrl.searchParams.delete("_siteUpdated");
      window.history.replaceState(null, "", `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`);
    }
  }
}

async function clearSiteCachesAndReload() {
  if (state.siteUpdateBusy) return;
  state.siteUpdateBusy = true;

  if (dom.siteUpdateButton) {
    dom.siteUpdateButton.disabled = true;
    dom.siteUpdateButton.textContent = "Atualizando...";
  }

  storeSiteVersion(state.availableSiteVersion || SITE_VERSION);

  try {
    if ("caches" in window) {
      const cacheNames = await window.caches.keys();
      await Promise.all(cacheNames.map((cacheName) => window.caches.delete(cacheName)));
    }

    if ("serviceWorker" in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((registration) => registration.unregister()));
    }
  } catch (error) {
    console.warn("Nem todos os caches puderam ser removidos pelo navegador.", error);
  }

  const returnUrl = new URL(window.location.href);
  returnUrl.searchParams.delete("_siteUpdated");
  const refreshUrl = new URL("cache-refresh.html", window.location.href);
  refreshUrl.searchParams.set("return", `${returnUrl.pathname}${returnUrl.search}${returnUrl.hash}`);
  refreshUrl.searchParams.set("version", state.availableSiteVersion || SITE_VERSION);
  refreshUrl.searchParams.set("time", String(Date.now()));
  window.location.replace(refreshUrl.href);
}

function setupSiteUpdateNotification() {
  if (!dom.siteUpdateButton) return;
  dom.siteUpdateButton.addEventListener("click", clearSiteCachesAndReload);
  checkForSiteUpdate({ initialize: true });

  window.setInterval(() => checkForSiteUpdate(), SITE_UPDATE_CHECK_INTERVAL);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") checkForSiteUpdate();
  });
}

function attachEvents() {
  dom.choosePhotoBtn.addEventListener("click", (event) => { event.stopPropagation(); dom.photoInput.click(); });
  dom.cameraPhotoBtn.addEventListener("click", (event) => { event.stopPropagation(); dom.cameraInput.click(); });
  dom.changePhotoBtn.addEventListener("click", resetAppForNewPhoto);
  dom.changeEarringBtn.addEventListener("click", openCatalogForChange);
  dom.photoInput.addEventListener("change", () => handlePhotoFile(dom.photoInput.files?.[0]));
  dom.cameraInput.addEventListener("change", () => handlePhotoFile(dom.cameraInput.files?.[0]));

  dom.dropZone.addEventListener("click", (event) => {
    if (event.target.closest("button")) return;
    dom.photoInput.click();
  });
  dom.dropZone.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      dom.photoInput.click();
    }
  });
  ["dragenter", "dragover"].forEach((name) => dom.dropZone.addEventListener(name, (event) => {
    event.preventDefault();
    dom.dropZone.classList.add("is-dragging");
  }));
  ["dragleave", "drop"].forEach((name) => dom.dropZone.addEventListener(name, (event) => {
    event.preventDefault();
    dom.dropZone.classList.remove("is-dragging");
  }));
  dom.dropZone.addEventListener("drop", (event) => handlePhotoFile(event.dataTransfer?.files?.[0]));

  dom.canvas.addEventListener("pointerdown", onPointerDown);
  dom.canvas.addEventListener("pointermove", onPointerMove);
  dom.canvas.addEventListener("pointerup", onPointerUp);
  dom.canvas.addEventListener("pointercancel", onPointerUp);
  dom.canvas.addEventListener("lostpointercapture", onPointerUp);
  dom.canvas.addEventListener("contextmenu", (event) => event.preventDefault());

  dom.markHoleBtn.addEventListener("click", enterAnchorMode);
  dom.flipBtn.addEventListener("click", () => {
    if (!state.earring) return;
    invalidateLocalRender();
    state.transform.flipX = !state.transform.flipX;
    requestDraw();
  });
  dom.removeBtn.addEventListener("click", removeEarring);

  dom.sizeRange.addEventListener("input", () => {
    invalidateLocalRender();
    state.transform.sizePercent = Number(dom.sizeRange.value);
    updateRangeOutputs();
    requestDraw();
  });
  dom.rotationRange.addEventListener("input", () => {
    invalidateLocalRender();
    state.transform.rotation = Number(dom.rotationRange.value);
    updateRangeOutputs();
    requestDraw();
  });
  dom.opacityRange.addEventListener("input", () => {
    invalidateLocalRender();
    state.transform.opacity = Number(dom.opacityRange.value) / 100;
    updateRangeOutputs();
    requestDraw();
  });

  dom.nudgeButtons.forEach((button) => button.addEventListener("click", () => nudge(button.dataset.nudge)));

  dom.catalogSearch.addEventListener("input", () => {
    state.filters.query = dom.catalogSearch.value.trim();
    renderCatalog();
  });
  dom.typeFilter.addEventListener("change", () => {
    state.filters.type = dom.typeFilter.value;
    renderCatalog();
  });
  dom.audienceButtons.forEach((button) => button.addEventListener("click", () => {
    state.filters.audience = button.dataset.audience;
    dom.audienceButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    renderCatalog();
  }));

  dom.customEarringBtn.addEventListener("click", () => dom.customEarringInput.click());
  dom.customEarringInput.addEventListener("change", () => handleCustomEarring(dom.customEarringInput.files?.[0]));
  dom.downloadBtn.addEventListener("click", downloadImage);

  dom.priceSettingsButtons.forEach((button) => button.addEventListener("click", openPriceDialog));
  dom.closePriceDialogBtn?.addEventListener("click", closePriceDialog);
  dom.clearPricesBtn?.addEventListener("click", clearAllPrices);
  dom.priceForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (savePricesFromEditor()) closePriceDialog();
  });
  dom.priceDialog?.addEventListener("click", (event) => {
    if (event.target === dom.priceDialog) closePriceDialog();
  });
  dom.priceDialog?.addEventListener("close", () => state.priceDialogLastFocus?.focus?.());

  document.addEventListener("keydown", (event) => {
    if (state.renderBusy || !state.earring || document.activeElement?.matches("input, select, textarea")) return;
    const keyMap = { ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right" };
    if (keyMap[event.key]) {
      event.preventDefault();
      nudge(keyMap[event.key]);
    }
    if (event.key === "Delete" || event.key === "Backspace") {
      event.preventDefault();
      removeEarring();
    }
  });

  window.addEventListener("resize", requestDraw, { passive: true });
  window.addEventListener("beforeunload", () => {
    if (state.backgroundObjectUrl) URL.revokeObjectURL(state.backgroundObjectUrl);
    state.customObjectUrls.forEach((url) => URL.revokeObjectURL(url));
  });
}

populateTypeFilter();
renderCatalog();
setupSiteUpdateNotification();
attachEvents();
updateRangeOutputs();
