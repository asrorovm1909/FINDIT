const SUPABASE_URL = "https://yclxqvxcrcgyglapvvzp.supabase.co";
const SUPABASE_KEY = "sb_publishable_ACqHlEBWGFozf7PQn1KHJg_d2q_jjll";

const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const $ = id => document.getElementById(id);

let currentUser = null;
let authMode = "login";
let currentLanguage = localStorage.getItem("topildi_lang") || "ru";
let allListings = [];

const translations = {
  ru: {
    heroTitle: "Потерял? Найди.",
    heroText: "Помогаем людям находить потерянные вещи.",
    loginTitle: "Вход",
    login: "Войти",
    register: "Регистрация",
    emailPlaceholder: "Gmail",
    passwordPlaceholder: "Пароль",
    passwordHint: "Минимум 6 символов",
    passwordShort: "Пароль должен содержать минимум 6 символов",
    verifyTitle: "Подтверждение email",
    verifyText: "Введите шестизначный код из письма.",
    codePlaceholder: "6-значный код",
    confirm: "Подтвердить",
    resend: "Отправить код повторно",
    back: "Назад",
    logout: "Выйти",
    publishTitle: "Опубликовать объявление",
    lost: "Потерял",
    found: "Нашёл",
    chooseCategory: "Выберите категорию",
    electronics: "Электроника",
    documents: "Документы",
    clothes: "Одежда",
    keys: "Ключи",
    animals: "Животные",
    other: "Другое",
    titlePlaceholder: "Название вещи",
    descriptionPlaceholder: "Описание",
    locationPlaceholder: "Где потеряли или нашли?",
    contactPlaceholder: "Ваш номер телефона или Telegram",
    photoLabel: "Фотография (необязательно)",
    publish: "Опубликовать",
    searchTitle: "Объявления",
    searchPlaceholder: "Поиск...",
    allTypes: "Все объявления",
    allCategories: "Все категории",
    delete: "Удалить",
    noListings: "Объявлений пока нет.",
    loading: "Загрузка...",
    registrationSuccess: "Код отправлен на вашу почту.",
    loginSuccess: "Вход выполнен!",
    published: "Объявление опубликовано!",
    deleted: "Объявление удалено.",
    error: "Ошибка: ",
    enterEmail: "Введите правильный email.",
    enterCode: "Введите шестизначный код.",
    noPermission: "Вы можете удалять только свои объявления.",
    confirmDelete: "Удалить это объявление?",
    emptyFields: "Заполните все обязательные поля.",
    noImage: "Без фотографии",
    lostBadge: "ПОТЕРЯНО",
    foundBadge: "НАЙДЕНО",
    resendSuccess: "Новый код отправлен."
  },

  uz: {
    heroTitle: "Yo‘qotdingizmi? Toping.",
    heroText: "Yo‘qolgan buyumlarni topishga yordam beramiz.",
    loginTitle: "Kirish",
    login: "Kirish",
    register: "Ro‘yxatdan o‘tish",
    emailPlaceholder: "Gmail",
    passwordPlaceholder: "Parol",
    passwordHint: "Kamida 6 ta belgi",
    passwordShort: "Parol kamida 6 ta belgidan iborat bo‘lishi kerak",
    verifyTitle: "Emailni tasdiqlash",
    verifyText: "Emailingizga kelgan 6 xonali kodni kiriting.",
    codePlaceholder: "6 xonali kod",
    confirm: "Tasdiqlash",
    resend: "Kodni qayta yuborish",
    back: "Orqaga",
    logout: "Chiqish",
    publishTitle: "E'lon joylashtirish",
    lost: "Yo‘qotdim",
    found: "Topdim",
    chooseCategory: "Kategoriyani tanlang",
    electronics: "Elektronika",
    documents: "Hujjatlar",
    clothes: "Kiyimlar",
    keys: "Kalitlar",
    animals: "Hayvonlar",
    other: "Boshqa",
    titlePlaceholder: "Buyum nomi",
    descriptionPlaceholder: "Tavsif",
    locationPlaceholder: "Qayerda yo‘qotildi yoki topildi?",
    contactPlaceholder: "Telefon raqamingiz yoki Telegram",
    photoLabel: "Rasm (ixtiyoriy)",
    publish: "Joylashtirish",
    searchTitle: "E'lonlar",
    searchPlaceholder: "Qidirish...",
    allTypes: "Barcha e'lonlar",
    allCategories: "Barcha kategoriyalar",
    delete: "O‘chirish",
    noListings: "Hozircha e'lonlar yo‘q.",
    loading: "Yuklanmoqda...",
    registrationSuccess: "Kod emailingizga yuborildi.",
    loginSuccess: "Tizimga kirdingiz!",
    published: "E'lon joylashtirildi!",
    deleted: "E'lon o‘chirildi.",
    error: "Xatolik: ",
    enterEmail: "To‘g‘ri email kiriting.",
    enterCode: "6 xonali kodni kiriting.",
    noPermission: "Faqat o‘z e'lonlaringizni o‘chirishingiz mumkin.",
    confirmDelete: "Bu e'lon o‘chirilsinmi?",
    emptyFields: "Barcha majburiy maydonlarni to‘ldiring.",
    noImage: "Rasm yo‘q",
    lostBadge: "YO‘QOTILDI",
    foundBadge: "TOPILDI",
    resendSuccess: "Yangi kod yuborildi."
  }
};

function t(key) {
  return translations[currentLanguage][key] || translations.ru[key] || key;
}

function setLanguage(lang) {
  if (!translations[lang]) return;

  currentLanguage = lang;
  localStorage.setItem("topildi_lang", lang);
  document.documentElement.lang = lang;

  document.querySelectorAll("[data-i18n]").forEach(element => {
    const key = element.dataset.i18n;
    element.textContent = t(key);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach(element => {
    const key = element.dataset.i18nPlaceholder;
    element.placeholder = t(key);
  });

  document.querySelectorAll(".lang-btn").forEach(button => {
    button.classList.toggle("active", button.dataset.lang === lang);
  });

  $("authTitle").textContent =
    authMode === "login" ? t("loginTitle") : t("register");

  renderListings();
}

document.querySelectorAll(".lang-btn").forEach(button => {
  button.addEventListener("click", () => setLanguage(button.dataset.lang));
});

// ПЕРЕКЛЮЧЕНИЕ ВХОДА И РЕГИСТРАЦИИ

function setAuthMode(mode) {
  authMode = mode;

  $("showLogin").classList.toggle("active", mode === "login");
  $("showRegister").classList.toggle("active", mode === "register");

  $("authTitle").textContent =
    mode === "login" ? t("loginTitle") : t("register");

  $("authSubmit").textContent =
    mode === "login" ? t("login") : t("register");

  $("passwordHint").classList.toggle("hidden", mode === "login");
}

$("showLogin").addEventListener("click", () => setAuthMode("login"));
$("showRegister").addEventListener("click", () => setAuthMode("register"));

function showMessage(id, message, error = false) {
  const element = $(id);
  element.textContent = message;
  element.style.color = error ? "#ff6464" : "#22c55e";
}

// РЕГИСТРАЦИЯ И ВХОД

$("authForm").addEventListener("submit", async event => {
  event.preventDefault();

  const email = $("authEmail").value.trim();
  const password = $("authPassword").value;

  if (!email) {
    showMessage("authMessage", t("enterEmail"), true);
    return;
  }

  if (password.length < 6) {
    showMessage("authMessage", t("passwordShort"), true);
    return;
  }

  $("authSubmit").disabled = true;
  showMessage("authMessage", t("loading"));

  try {
    if (authMode === "register") {
      const { error } = await db.auth.signUp({
        email,
        password
      });

      if (error) throw error;

      $("verifyEmail").value = email;
      $("authSection").classList.add("hidden");
      $("verifySection").classList.remove("hidden");

      showMessage("verifyMessage", t("registrationSuccess"));

    } else {
      const { error } = await db.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      showMessage("authMessage", t("loginSuccess"));
      await refreshSession();
    }

  } catch (error) {
    showMessage("authMessage", t("error") + error.message, true);
  } finally {
    $("authSubmit").disabled = false;
  }
});

// ПОДТВЕРЖДЕНИЕ КОДА

$("verifyForm").addEventListener("submit", async event => {
  event.preventDefault();

  const email = $("verifyEmail").value.trim();
  const token = $("verifyCode").value.trim();

  if (!/^\d{6}$/.test(token)) {
    showMessage("verifyMessage", t("enterCode"), true);
    return;
  }

  $("verifyForm").querySelector("button").disabled = true;

  try {
    const { error } = await db.auth.verifyOtp({
      email,
      token,
      type: "signup"
    });

    if (error) throw error;

    await refreshSession();

  } catch (error) {
    showMessage("verifyMessage", t("error") + error.message, true);
  } finally {
    $("verifyForm").querySelector("button").disabled = false;
  }
});

$("resendCode").addEventListener("click", async () => {
  const email = $("verifyEmail").value.trim();

  try {
    const { error } = await db.auth.resend({
      type: "signup",
      email
    });

    if (error) throw error;

    showMessage("verifyMessage", t("resendSuccess"));

  } catch (error) {
    showMessage("verifyMessage", t("error") + error.message, true);
  }
});

$("backToAuth").addEventListener("click", () => {
  $("verifySection").classList.add("hidden");
  $("authSection").classList.remove("hidden");
});

// ЭКРАН АККАУНТА

async function refreshSession() {
  const { data, error } = await db.auth.getSession();

  if (error) {
    showMessage("authMessage", t("error") + error.message, true);
    return;
  }

  currentUser = data.session?.user || null;
  updateAccountScreen();
}

function updateAccountScreen() {
  const loggedIn = Boolean(currentUser);

  $("authSection").classList.toggle("hidden", loggedIn);
  $("verifySection").classList.add("hidden");
  $("loggedSection").classList.toggle("hidden", !loggedIn);

  if (loggedIn) {
    $("userEmail").textContent = currentUser.email;
    loadListings();
  }
}

$("logoutBtn").addEventListener("click", async () => {
  const { error } = await db.auth.signOut();

  if (error) {
    showMessage("listingMessage", t("error") + error.message, true);
    return;
  }

  currentUser = null;
  updateAccountScreen();
});

// ПУБЛИКАЦИЯ ОБЪЯВЛЕНИЯ

$("listingForm").addEventListener("submit", async event => {
  event.preventDefault();

  if (!currentUser) return;

  const title = $("listingTitle").value.trim();
  const description = $("listingDescription").value.trim();
  const location = $("listingLocation").value.trim();
  const contact = $("listingContact").value.trim();
  const imageFile = $("listingImage").files[0];

  if (!title || !description || !location || !contact) {
    showMessage("listingMessage", t("emptyFields"), true);
    return;
  }

  $("publishBtn").disabled = true;
  showMessage("listingMessage", t("loading"));

  try {
    let imageUrl = null;

    if (imageFile) {
      if (!imageFile.type.startsWith("image/")) {
        throw new Error("Please select an image file.");
      }

      if (imageFile.size > 5 * 1024 * 1024) {
        throw new Error("Image must be smaller than 5 MB.");
      }

      const extension = imageFile.name.split(".").pop().toLowerCase();
      const fileName = `${currentUser.id}/${crypto.randomUUID()}.${extension}`;

      const { error: uploadError } = await db.storage
        .from("listing-images")
        .upload(fileName, imageFile, {
          upsert: false,
          contentType: imageFile.type
        });

      if (uploadError) throw uploadError;

      const { data } = db.storage
        .from("listing-images")
        .getPublicUrl(fileName);

      imageUrl = data.publicUrl;
    }

    const { error } = await db.from("listings").insert({
      user_id: currentUser.id,
      type: $("listingType").value,
      category: $("listingCategory").value,
      title,
      description,
      location,
      contact,
      image_url: imageUrl
    });

    if (error) throw error;

    $("listingForm").reset();
    showMessage("listingMessage", t("published"));
    await loadListings();

  } catch (error) {
    showMessage("listingMessage", t("error") + error.message, true);
  } finally {
    $("publishBtn").disabled = false;
  }
});

// ЗАГРУЗКА ОБЪЯВЛЕНИЙ

async function loadListings() {
  const grid = $("listingsGrid");
  grid.textContent = t("loading");

  const { data, error } = await db
    .from("listings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    grid.textContent = t("error") + error.message;
    return;
  }

  allListings = data || [];
  renderListings();
}

// ЭКРАНИРОВАНИЕ ТЕКСТА

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

// ОТОБРАЖЕНИЕ ОБЪЯВЛЕНИЙ

function renderListings() {
  const grid = $("listingsGrid");
  if (!grid) return;

  const search = $("searchInput").value.toLowerCase().trim();
  const type = $("filterType").value;
  const category = $("filterCategory").value;

  const filtered = allListings.filter(item => {
    const matchesSearch = [
      item.title,
      item.description,
      item.location,
      item.category
    ].some(value => String(value || "").toLowerCase().includes(search));

    const matchesType = type === "all" || item.type === type;
    const matchesCategory =
      category === "all" || item.category === category;

    return matchesSearch && matchesType && matchesCategory;
  });

  grid.innerHTML = "";

  if (!filtered.length) {
    grid.textContent = t("noListings");
    return;
  }

  filtered.forEach(item => {
    const card = document.createElement("article");
    card.className = "listing-card";

    const isOwner = currentUser && item.user_id === currentUser.id;
    const badge = item.type === "lost" ? t("lostBadge") : t("foundBadge");

    card.innerHTML = `
      ${item.image_url
        ? `<img class="listing-image" src="${escapeHTML(item.image_url)}" alt="">`
        : ""}
      <div class="listing-content">
        <span class="listing-badge ${item.type === "lost" ? "lost" : "found"}">
          ${escapeHTML(badge)}
        </span>
        <h3>${escapeHTML(item.title)}</h3>
        <p>${escapeHTML(item.description)}</p>
        <p><strong>${escapeHTML(item.category)}</strong></p>
        <p>📍 ${escapeHTML(item.location)}</p>
        <p>☎ ${escapeHTML(item.contact)}</p>
        ${isOwner
          ? `<button class="delete-btn" data-delete-id="${escapeHTML(item.id)}">${escapeHTML(t("delete"))}</button>`
          : ""}
      </div>
    `;

    grid.appendChild(card);
  });
}

// УДАЛЕНИЕ ТОЛЬКО СВОИХ ОБЪЯВЛЕНИЙ

$("listingsGrid").addEventListener("click", async event => {
  const button = event.target.closest("[data-delete-id]");
  if (!button) return;

  const id = button.dataset.deleteId;
  const listing = allListings.find(item => item.id === id);

  if (!listing || !currentUser || listing.user_id !== currentUser.id) {
    alert(t("noPermission"));
    return;
  }

  if (!confirm(t("confirmDelete"))) return;

  const { error } = await db.from("listings")
    .delete()
    .eq("id", id)
    .eq("user_id", currentUser.id);

  if (error) {
    alert(t("error") + error.message);
    return;
  }

  showMessage("listingMessage", t("deleted"));
  await loadListings();
});

// ПОИСК И ФИЛЬТРЫ

$("searchInput").addEventListener("input", renderListings);
$("filterType").addEventListener("change", renderListings);
$("filterCategory").addEventListener("change", renderListings);

// ЗАПУСК

setLanguage(currentLanguage);
setAuthMode("login");
refreshSession();

db.auth.onAuthStateChange((_event, session) => {
  currentUser = session?.user || null;
  updateAccountScreen();
});
