const memoryStore = new Map();
const safeStorage = {
  getItem(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      return memoryStore.has(key) ? memoryStore.get(key) : null;
    }
  },
  setItem(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (error) {
      memoryStore.set(key, String(value));
    }
  }
};

const neighborhoods = [
  "Todos os bairros",
  "Vila",
  "Farol",
  "Chapéu Virado",
  "Murubira",
  "Ariramba",
  "São Francisco",
  "Carananduba",
  "Maracajá",
  "Baía do Sol",
  "Paraíso",
  "Praia Grande",
  "Porto Arthur",
  "Sucurijuquara",
  "Aeroporto",
  "Bonfim"
];

const baseAds = [
  {
    id: 1,
    title: "Casa com piscina a 300m da Praia do Farol",
    type: "Casa",
    purpose: "Venda",
    neighborhood: "Farol",
    price: 320000,
    rooms: 4,
    area: 180,
    description: "Imóvel amplo, área gourmet, quintal e excelente acesso para veraneio ou moradia.",
    featured: true,
    paid: true,
    plan: "Destaque 30 dias",
    createdAt: "2026-06-08T12:00:00"
  },
  {
    id: 2,
    title: "Terreno murado próximo à Praia Grande",
    type: "Terreno",
    purpose: "Venda",
    neighborhood: "Praia Grande",
    price: 85000,
    rooms: 0,
    area: 360,
    description: "Terreno plano, documentado e pronto para construir casa de praia em localização valorizada.",
    featured: true,
    paid: true,
    plan: "Avulso 24h",
    createdAt: "2026-06-09T09:30:00"
  },
  {
    id: 3,
    title: "Casa mobiliada para temporada no Murubira",
    type: "Casa",
    purpose: "Temporada",
    neighborhood: "Murubira",
    price: 650,
    rooms: 3,
    area: 140,
    description: "Diária para família, churrasqueira, garagem e localização perto da praia.",
    featured: true,
    paid: true,
    plan: "Pacote 5 anúncios",
    createdAt: "2026-06-07T15:15:00"
  },
  {
    id: 4,
    title: "Casa térrea na Vila com excelente localização",
    type: "Casa",
    purpose: "Venda",
    neighborhood: "Vila",
    price: 210000,
    rooms: 3,
    area: 120,
    description: "Próxima a comércio, feira, transporte e principais serviços da ilha.",
    featured: false,
    paid: false,
    plan: "Grátis",
    createdAt: "2026-06-04T10:00:00"
  },
  {
    id: 5,
    title: "Apartamento compacto no Chapéu Virado",
    type: "Apartamento",
    purpose: "Aluguel",
    neighborhood: "Chapéu Virado",
    price: 1200,
    rooms: 2,
    area: 62,
    description: "Aluguel mensal, ambiente ventilado, vaga e fácil acesso à orla.",
    featured: false,
    paid: false,
    plan: "Grátis",
    createdAt: "2026-06-03T17:20:00"
  },
  {
    id: 6,
    title: "Chácara/Sítio com área verde em Carananduba",
    type: "Chácara/Sítio",
    purpose: "Venda",
    neighborhood: "Carananduba",
    price: 450000,
    rooms: 5,
    area: 1200,
    description: "Área ampla, casa principal, árvores frutíferas e potencial para pousada ou lazer.",
    featured: false,
    paid: false,
    plan: "Grátis",
    createdAt: "2026-06-01T11:45:00"
  }
];

const planDetails = {
  free: {
    title: "Plano grátis selecionado.",
    text: "Seu anúncio ficará na lista normal. Limite: 1 anúncio gratuito por mês por e-mail cadastrado.",
    paid: false
  },
  "Plano Avulso 24h - R$ 3": {
    title: "Plano Avulso 24h - R$ 3,00",
    text: "1 anúncio em destaque por 24 horas, contadas após a confirmação do pagamento online.",
    paid: true
  },
  "Pacote 5 anúncios 24h - R$ 10": {
    title: "Pacote 5 anúncios 24h - R$ 10,00",
    text: "Use 5 inserções por 24 horas: mais de um anúncio no mesmo dia ou o mesmo anúncio nos dias escolhidos.",
    paid: true
  },
  "Plano Corretor 20 anúncios 24h - R$ 30": {
    title: "Plano Corretor - R$ 30,00",
    text: "20 anúncios por 24 horas cada, ideal para corretores com carteira ativa.",
    paid: true
  },
  "Destaque 10 anúncios 30 dias - R$ 50": {
    title: "Destaque 10 anúncios por 30 dias - R$ 50,00",
    text: "10 anúncios com destaque por 30 dias, aparecendo no topo da página inicial.",
    paid: true
  },
  "Imobiliária 30 anúncios 30 dias - R$ 100": {
    title: "Imobiliária 30 anúncios por 30 dias - R$ 100,00",
    text: "30 anúncios com destaque por 30 dias para imobiliárias e equipes comerciais.",
    paid: true
  },
  "Master 50 anúncios 30 dias - R$ 150": {
    title: "Master 50 anúncios por 30 dias - R$ 150,00",
    text: "50 anúncios com destaque por 30 dias e máxima exposição na página inicial.",
    paid: true
  }
};

let ads = loadAds();
let currentFilters = {
  text: "",
  neighborhood: "",
  type: "",
  purpose: "",
  price: ""
};

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0
});

function loadAds() {
  try {
    const stored = JSON.parse(safeStorage.getItem("imoveisMosqueiroAds") || "[]");
    return [...stored, ...baseAds];
  } catch (error) {
    return [...baseAds];
  }
}

function saveUserAd(ad) {
  const stored = JSON.parse(safeStorage.getItem("imoveisMosqueiroAds") || "[]");
  stored.unshift(ad);
  safeStorage.setItem("imoveisMosqueiroAds", JSON.stringify(stored));
}

function monthKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function hasUsedFreeAd(email) {
  const key = `freeAd:${normalizeEmail(email)}:${monthKey()}`;
  return safeStorage.getItem(key) === "used";
}

function markFreeAdUsed(email) {
  const key = `freeAd:${normalizeEmail(email)}:${monthKey()}`;
  safeStorage.setItem(key, "used");
}

function populateNeighborhoodSelects() {
  const search = document.getElementById("searchNeighborhood");
  const post = document.getElementById("postNeighborhood");

  neighborhoods.forEach((item, index) => {
    const option = document.createElement("option");
    option.value = index === 0 ? "" : item;
    option.textContent = item;
    search.appendChild(option);
  });

  neighborhoods.slice(1).forEach((item) => {
    const option = document.createElement("option");
    option.value = item;
    option.textContent = item;
    post.appendChild(option);
  });
}

function formatPrice(ad) {
  const label = currency.format(ad.price);
  if (ad.purpose === "Aluguel") return `${label}/mês`;
  if (ad.purpose === "Temporada") return `${label}/diária`;
  return label;
}

function priceMatches(price, range) {
  if (!range) return true;
  if (range === "ate-100k") return price <= 100000;
  if (range === "100-250k") return price >= 100000 && price <= 250000;
  if (range === "250-500k") return price >= 250000 && price <= 500000;
  if (range === "acima-500k") return price > 500000;
  return true;
}

function applyFilters(list) {
  const text = currentFilters.text.toLowerCase().trim();

  return list.filter((ad) => {
    const textMatch = !text || [ad.title, ad.description, ad.neighborhood, ad.type, ad.purpose]
      .join(" ")
      .toLowerCase()
      .includes(text);

    return (
      textMatch &&
      (!currentFilters.neighborhood || ad.neighborhood === currentFilters.neighborhood) &&
      (!currentFilters.type || ad.type === currentFilters.type) &&
      (!currentFilters.purpose || ad.purpose === currentFilters.purpose) &&
      priceMatches(ad.price, currentFilters.price)
    );
  });
}

function sortAds(list) {
  const sort = document.getElementById("sortSelect").value;
  const copy = [...list];

  if (sort === "priceLow") return copy.sort((a, b) => a.price - b.price);
  if (sort === "priceHigh") return copy.sort((a, b) => b.price - a.price);
  if (sort === "newest") return copy.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return copy.sort((a, b) => {
    if (a.featured !== b.featured) return Number(b.featured) - Number(a.featured);
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
}

function cardTemplate(ad) {
  const icon = ad.type === "Terreno" ? "🌿" : ad.type === "Apartamento" ? "🏢" : ad.type === "Ponto comercial" ? "🏪" : "🏠";
  const badgeText = ad.featured ? "DESTAQUE PAGO" : "GRÁTIS";
  const roomsText = ad.rooms && Number(ad.rooms) > 0 ? `${ad.rooms} quarto${Number(ad.rooms) > 1 ? "s" : ""}` : "Sem quartos";
  const areaText = ad.area && Number(ad.area) > 0 ? `${ad.area} m²` : "Área a consultar";

  return `
    <article class="ad-card ${ad.featured ? "featured" : ""}">
      <div class="ad-media">
        <div class="badge-row">
          <span class="badge">${badgeText}</span>
          <span class="badge secondary">${ad.purpose}</span>
        </div>
        <span class="house-icon" aria-hidden="true">${icon}</span>
      </div>
      <div class="ad-body">
        <h3>${escapeHTML(ad.title)}</h3>
        <div class="ad-location">📍 ${escapeHTML(ad.neighborhood)} • Mosqueiro/PA</div>
        <p class="ad-price">${formatPrice(ad)}</p>
        <p class="ad-desc">${escapeHTML(ad.description)}</p>
        <div class="ad-meta">
          <span>${escapeHTML(ad.type)}</span>
          <span>${roomsText}</span>
          <span>${areaText}</span>
        </div>
        <div class="ad-footer">
          <small>${escapeHTML(ad.plan || "Plano não informado")}</small>
          <a class="whatsapp-btn" href="#cadastro" aria-label="Entrar em contato pelo WhatsApp">Contato</a>
        </div>
      </div>
    </article>
  `;
}

function renderAds() {
  const filtered = sortAds(applyFilters(ads));
  const grid = document.getElementById("adsGrid");
  const resultsCount = document.getElementById("resultsCount");
  const featuredGrid = document.getElementById("featuredAds");

  if (!filtered.length) {
    grid.innerHTML = `
      <div class="empty-state">
        <h3>Nenhum imóvel encontrado</h3>
        <p>Tente alterar bairro, tipo, finalidade ou faixa de valor.</p>
      </div>
    `;
  } else {
    grid.innerHTML = filtered.map(cardTemplate).join("");
  }

  const featured = ads
    .filter((ad) => ad.featured)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);

  featuredGrid.innerHTML = featured.length
    ? featured.map(cardTemplate).join("")
    : `<div class="empty-state"><h3>Espaço disponível para destaques</h3><p>Contrate um plano pago para aparecer aqui.</p></div>`;

  const total = filtered.length;
  resultsCount.textContent = `${total} anúncio${total === 1 ? " encontrado" : "s encontrados"} em Mosqueiro.`;
}

function escapeHTML(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function showMessage(element, text, type = "success") {
  element.textContent = text;
  element.className = `form-message show ${type}`;
}

function updateQuotaText(email) {
  const text = document.getElementById("freeQuotaText");
  if (!email) {
    text.textContent = "1 anúncio grátis disponível este mês";
    return;
  }
  text.textContent = hasUsedFreeAd(email)
    ? "Anúncio grátis do mês já utilizado"
    : "1 anúncio grátis disponível este mês";
}

function initSearch() {
  document.getElementById("searchForm").addEventListener("submit", (event) => {
    event.preventDefault();
    currentFilters = {
      text: document.getElementById("searchText").value,
      neighborhood: document.getElementById("searchNeighborhood").value,
      type: document.getElementById("searchType").value,
      purpose: document.getElementById("searchPurpose").value,
      price: document.getElementById("searchPrice").value
    };
    renderAds();
    document.getElementById("destaques").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  document.getElementById("clearFilters").addEventListener("click", () => {
    document.getElementById("searchForm").reset();
    currentFilters = { text: "", neighborhood: "", type: "", purpose: "", price: "" };
    renderAds();
  });

  document.getElementById("sortSelect").addEventListener("change", renderAds);
}

function initForms() {
  const registerForm = document.getElementById("registerForm");
  const registerMessage = document.getElementById("registerMessage");
  const postEmail = document.getElementById("postEmail");
  const postPlan = document.getElementById("postPlan");
  const paymentPreview = document.getElementById("paymentPreview");
  const postMessage = document.getElementById("postMessage");

  registerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const user = {
      name: document.getElementById("regName").value.trim(),
      profile: document.getElementById("regProfile").value,
      email: normalizeEmail(document.getElementById("regEmail").value),
      phone: document.getElementById("regPhone").value.trim(),
      createdAt: new Date().toISOString()
    };

    const users = JSON.parse(safeStorage.getItem("imoveisMosqueiroUsers") || "[]");
    const index = users.findIndex((item) => item.email === user.email);
    if (index >= 0) users[index] = user;
    else users.push(user);
    safeStorage.setItem("imoveisMosqueiroUsers", JSON.stringify(users));

    postEmail.value = user.email;
    updateQuotaText(user.email);
    showMessage(registerMessage, `Cadastro criado para ${user.name}. Agora você já pode publicar seu anúncio.`, "success");
  });

  postEmail.addEventListener("input", () => updateQuotaText(postEmail.value));

  postPlan.addEventListener("change", () => {
    const detail = planDetails[postPlan.value] || planDetails.free;
    paymentPreview.classList.toggle("paid", detail.paid);
    paymentPreview.innerHTML = `<strong>${detail.title}</strong><span>${detail.text}</span>${detail.paid ? "<span><b>Simulação:</b> depois do pagamento confirmado, o anúncio ganha selo dourado e sobe para os destaques.</span>" : ""}`;
  });

  document.querySelectorAll(".choose-plan").forEach((button) => {
    button.addEventListener("click", () => {
      const plan = button.dataset.plan;
      postPlan.value = plan;
      postPlan.dispatchEvent(new Event("change"));
    });
  });

  document.getElementById("postForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const email = normalizeEmail(postEmail.value);
    const selectedPlan = postPlan.value;
    const detail = planDetails[selectedPlan] || planDetails.free;

    if (selectedPlan === "free" && hasUsedFreeAd(email)) {
      showMessage(
        postMessage,
        "O limite de 1 anúncio gratuito por mês já foi utilizado para este e-mail. Escolha um plano pago para publicar mais anúncios.",
        "error"
      );
      return;
    }

    const ad = {
      id: Date.now(),
      title: document.getElementById("postTitle").value.trim(),
      type: document.getElementById("postType").value,
      purpose: document.getElementById("postPurpose").value,
      neighborhood: document.getElementById("postNeighborhood").value,
      price: Number(document.getElementById("postPrice").value),
      rooms: Number(document.getElementById("postRooms").value || 0),
      area: Number(document.getElementById("postArea").value || 0),
      description: document.getElementById("postDescription").value.trim(),
      featured: detail.paid,
      paid: detail.paid,
      plan: selectedPlan === "free" ? "Grátis" : selectedPlan,
      createdAt: new Date().toISOString(),
      ownerEmail: email
    };

    if (selectedPlan === "free") markFreeAdUsed(email);

    ads.unshift(ad);
    saveUserAd(ad);
    renderAds();
    updateQuotaText(email);

    const paymentText = detail.paid
      ? " Em uma versão real, a publicação aguardaria a confirmação do pagamento online antes de iniciar a contagem do prazo."
      : " Seu anúncio gratuito do mês foi consumido.";

    showMessage(postMessage, `Anúncio publicado com sucesso no modelo demonstrativo.${paymentText}`, "success");
    event.target.reset();
    postEmail.value = email;
    postPlan.value = "free";
    postPlan.dispatchEvent(new Event("change"));
    document.getElementById("destaques").scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

function initMenu() {
  const button = document.getElementById("menuButton");
  const nav = document.getElementById("mainNav");

  button.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    button.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      button.setAttribute("aria-expanded", "false");
    });
  });
}

function initBackToTop() {
  const button = document.getElementById("backToTop");
  window.addEventListener("scroll", () => {
    button.classList.toggle("visible", window.scrollY > 520);
  });
  button.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

populateNeighborhoodSelects();
initMenu();
initSearch();
initForms();
initBackToTop();
renderAds();
