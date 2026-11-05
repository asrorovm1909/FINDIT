
const SUPABASE_URL = "https://yclxqvxcrcgyglapvvzp.supabase.co";
const SUPABASE_KEY = "sb_publishable_ACqHlEBWGFozf7PQn1KHJg_d2q_jjll";

const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const $ = (id) => document.getElementById(id);

let currentUser = null;
let listings = [];
let currentEmail = "";
let language = localStorage.getItem("topildi-language") || "ru";

const translations = {
  ru: {
    home:"Главная", listings:"Объявления", how:"Как работает", login:"Войти", logout:"Выйти",
    heroTitle:'Потерял? <em>Найдём!</em>', heroText:"Помогаем людям находить потерянные вещи и возвращать найденные владельцам.",
    viewListings:"Смотреть объявления", publish:"Разместить объявление", freeNote:"Просто, удобно и бесплатно",
    online:"Сервис работает", keys:"Ключи", phones:"Телефоны", total:"Всего объявлений",
    lost:"Потеряно", found:"Найдено", createTitle:"Разместить объявление",
    needLogin:"Войдите, чтобы разместить объявление",
    needLoginText:"Вход осуществляется по электронной почте и коду подтверждения.",
    lostType:"Потерял", foundType:"Нашёл", titleLabel:"Название вещи *",
    categoryLabel:"Категория *", chooseCategory:"Выберите категорию",
    electronics:"Электроника", documents:"Документы", clothes:"Одежда", pets:"Животные", other:"Другое",
    descriptionLabel:"Описание *", locationLabel:"Место *", contactLabel:"Контакт *",
    photoLabel:"Фотография", photoHint:"JPG, PNG или WEBP. Максимум 5 МБ.",
    submit:"Опубликовать объявление", allListings:"Последние объявления",
    allTypes:"Все объявления", allCategories:"Все категории",
    loading:"Загрузка объявлений...", noListings:"Объявлений пока нет.",
    noResults:"Ничего не найдено.", howTitle:"Найти вещь стало проще",
    step1Title:"Создай объявление", step1Text:"Расскажи, что потерял или нашёл.",
    step2Title:"Найди совпадение", step2Text:"Ищи объявления других людей.",
    step3Title:"Свяжись", step3Text:"Свяжись с человеком и верни вещь.",
    footer:"Помогаем находить потерянное.", authTitle:"Вход в аккаунт",
    authDescription:"Введите email, чтобы получить код.", emailLabel:"Электронная почта",
    sendCode:"Получить код", codeTitle:"Подтвердите email",
    codeDescription:"Введите шестизначный код из письма.", verify:"Подтвердить", back:"Назад",
    sending:"Отправляем код...", sent:"Код отправлен на вашу почту.",
    verifying:"Проверяем код...", logged:"Вы успешно вошли!",
    invalidEmail:"Введите правильный email.", invalidCode:"Введите шестизначный код.",
    loginFirst:"Сначала войдите в аккаунт.", titleRequired:"Введите название вещи.",
    success:"Объявление опубликовано!", deleting:"Удаляем...",
    deleted:"Объявление удалено.", deleteConfirm:"Удалить это объявление?",
    uploadError:"Ошибка загрузки фотографии.", genericError:"Произошла ошибка: ",
    contact:"Контакт", place:"Место", date:"Дата",
    lostBadge:"ПОТЕРЯНО", foundBadge:"НАЙДЕНО", delete:"Удалить",
    imageTooLarge:"Фотография должна быть не больше 5 МБ."
  },
  uz: {
    home:"Bosh sahifa", listings:"E'lonlar", how:"Qanday ishlaydi", login:"Kirish", logout:"Chiqish",
    heroTitle:'Yo‘qotdingizmi? <em>Topamiz!</em>', heroText:"Yo‘qolgan buyumlarni topish va topilgan narsalarni egalariga qaytarishga yordam beramiz.",
    viewListings:"E'lonlarni ko‘rish", publish:"E'lon joylashtirish", freeNote:"Oddiy, qulay va bepul",
    online:"Xizmat ishlamoqda", keys:"Kalitlar", phones:"Telefonlar", total:"Jami e'lonlar",
    lost:"Yo‘qolgan", found:"Topilgan", createTitle:"E'lon joylashtirish",
    needLogin:"E'lon joylashtirish uchun tizimga kiring",
    needLoginText:"Elektron pochta va tasdiqlash kodi orqali kirasiz.",
    lostType:"Yo‘qotdim", foundType:"Topdim", titleLabel:"Buyum nomi *",
    categoryLabel:"Kategoriya *", chooseCategory:"Kategoriyani tanlang",
    electronics:"Elektronika", documents:"Hujjatlar", clothes:"Kiyimlar", pets:"Hayvonlar", other:"Boshqa",
    descriptionLabel:"Tavsif *", locationLabel:"Joy *", contactLabel:"Aloqa *",
    photoLabel:"Rasm", photoHint:"JPG, PNG yoki WEBP. Maksimum 5 MB.",
    submit:"E'lonni joylashtirish", allListings:"So‘nggi e'lonlar",
    allTypes:"Barcha e'lonlar", allCategories:"Barcha kategoriyalar",
    loading:"E'lonlar yuklanmoqda...", noListings:"Hozircha e'lonlar yo‘q.",
    noResults:"Hech narsa topilmadi.", howTitle:"Buyumni topish endi oson",
    step1Title:"E'lon yarating", step1Text:"Yo‘qotgan yoki topgan narsangizni yozing.",
    step2Title:"Mos e'lonni toping", step2Text:"Boshqa odamlarning e'lonlarini qidiring.",
    step3Title:"Bog‘laning", step3Text:"Odam bilan bog‘lanib, buyumni qaytaring.",
    footer:"Yo‘qolgan narsalarni topishga yordam beramiz.", authTitle:"Hisobga kirish",
    authDescription:"Kod olish uchun emailingizni kiriting.", emailLabel:"Elektron pochta",
    sendCode:"Kod olish", codeTitle:"Emailni tasdiqlang",
    codeDescription:"Xatdan olti xonali kodni kiriting.", verify:"Tasdiqlash", back:"Orqaga",
    sending:"Kod yuborilmoqda...", sent:"Kod emailingizga yuborildi.",
    verifying:"Kod tekshirilmoqda...", logged:"Siz tizimga kirdingiz!",
    invalidEmail:"To‘g‘ri email kiriting.", invalidCode:"Olti xonali kod kiriting.",
    loginFirst:"Avval tizimga kiring.", titleRequired:"Buyum nomini kiriting.",
    success:"E'lon joylashtirildi!", deleting:"O‘chirilmoqda...",
    deleted:"E'lon o‘chirildi.", deleteConfirm:"Ushbu e'lonni o‘chirmoqchimisiz?",
    uploadError:"Rasmni yuklashda xatolik.", genericError:"Xatolik: ",
    contact:"Aloqa", place:"Joy", date:"Sana",
    lostBadge:"YO‘QOLGAN", foundBadge:"TOPILGAN", delete:"O‘chirish",
    imageTooLarge:"Rasm hajmi 5 MB dan oshmasligi kerak."
  }
};

function t(key) {
  return translations[language][key] || translations.ru[key] || key;
}

function showMessage(element, message, isError = false) {
  element.textContent = message;
  element.style.color = isError ? "#ff7777" : "#22c58b";
}

function setLanguage(lang) {
  if (!translations[lang]) return;
  language = lang;
  localStorage.setItem("topildi-language", lang);
  document.documentElement.lang = lang;

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    if (translations[lang][key]) {
      el.innerHTML = translations[lang][key];
    }
  });

  document.querySelectorAll(".lang").forEach(button => {
    button.classList.toggle("active", button.dataset.lang === lang);
  });

  $("searchInput").placeholder = lang === "ru" ? "Поиск объявлений..." : "E'lonlarni qidirish...";
  renderListings();
}

document.querySelectorAll(".lang").forEach(button => {
  button.addEventListener("click", () => setLanguage(button.dataset.lang));
});

/* Authentication */

function openAuth() {
  $("authModal").classList.remove("hidden");
  $("authMessage").textContent = "";
}

function closeAuth() {
  $("authModal").classList.add("hidden");
}

$("authButton").addEventListener("click", openAuth);
$("authPanelButton").addEventListener("click", openAuth);
$("closeAuth").addEventListener("click", closeAuth);

$("authModal").addEventListener("click", event => {
  if (event.target === $("authModal")) closeAuth();
});

$("emailForm").addEventListener("submit", async event => {
  event.preventDefault();

  const email = $("emailInput").value.trim().toLowerCase();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showMessage($("authMessage"), t("invalidEmail"), true);
    return;
  }

  currentEmail = email;
  $("sendCodeButton").disabled = true;
  showMessage($("authMessage"), t("sending"));

  try {
    const { error } = await db.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true }
    });

    if (error) throw error;

    $("emailStep").classList.add("hidden");
    $("codeStep").classList.remove("hidden");
    showMessage($("authMessage"), t("sent"));
    $("codeInput").focus();
  } catch (error) {
    showMessage($("authMessage"), t("genericError") + error.message, true);
  } finally {
    $("sendCodeButton").disabled = false;
  }
});

$("backToEmail").addEventListener("click", () => {
  $("codeStep").classList.add("hidden");
  $("emailStep").classList.remove("hidden");
  $("authMessage").textContent = "";
});

$("codeForm").addEventListener("submit", async event => {
  event.preventDefault();

  const token = $("codeInput").value.trim();

  if (!/^\d{6}$/.test(token)) {
    showMessage($("authMessage"), t("invalidCode"), true);
    return;
  }

  showMessage($("authMessage"), t("verifying"));

  try {
    const { data, error } = await db.auth.verifyOtp({
      email: currentEmail,
      token,
      type: "email"
    });

    if (error) throw error;

    currentUser = data.user;
    closeAuth();
    await updateAuthUI();
    await loadListings();
    alert(t("logged"));
  } catch (error) {
    showMessage($("authMessage"), t("genericError") + error.message, true);
  }
});

async function updateAuthUI() {
  const { data } = await db.auth.getSession();
  currentUser = data.session?.user || null;

  $("authButton").classList.toggle("hidden", !!currentUser);
  $("logoutButton").classList.toggle("hidden", !currentUser);
  $("authPanel").classList.toggle("hidden", !!currentUser);
  $("listingForm").classList.toggle("hidden", !currentUser);
}

$("logoutButton").addEventListener("click", async () => {
  const { error } = await db.auth.signOut();
  if (error) {
    alert(t("genericError") + error.message);
    return;
  }

  currentUser = null;
  await updateAuthUI();
  await loadListings();
});

/* Listings */

async function loadListings() {
  $("listingsGrid").textContent = t("loading");

  const { data, error } = await db
    .from("listings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    $("listingsGrid").textContent = t("genericError") + error.message;
    return;
  }

  listings = data || [];
  renderListings();
  updateStats();
}

function updateStats() {
  $("totalCount").textContent = listings.length;
  $("lostCount").textContent = listings.filter(item => item.type === "lost").length;
  $("foundCount").textContent = listings.filter(item => item.type === "found").length;
}

function renderListings() {
  const query = $("searchInput").value.toLowerCase().trim();
  const type = $("typeFilter").value;
  const category = $("categoryFilter").value;

  const filtered = listings.filter(item => {
    const text = [
      item.title, item.description, item.location, item.category
    ].join(" ").toLowerCase();

    return text.includes(query) &&
      (type === "all" || item.type === type) &&
      (category === "all" || item.category === category);
  });

  $("resultCount").textContent = filtered.length;
  $("listingsGrid").innerHTML = "";

  if (!filtered.length) {
    $("listingsGrid").textContent = listings.length ? t("noResults") : t("noListings");
    return;
  }

  filtered.forEach(item => {
    const card = document.createElement("article");
    card.className = "listing-card";

    if (item.image_url) {
      const image = document.createElement("img");
      image.className = "listing-image";
      image.src = item.image_url;
      image.alt = item.title;
      image.loading = "lazy";
      card.appendChild(image);
    }

    const content = document.createElement("div");
    content.className = "listing-content";

    const badge = document.createElement("span");
    badge.className = "listing-badge " + (item.type === "lost" ? "lost" : "found");
    badge.textContent = item.type === "lost" ? t("lostBadge") : t("foundBadge");

    const title = document.createElement("h3");
    title.textContent = item.title;

    const description = document.createElement("p");
    description.textContent = item.description;

    const place = document.createElement("p");
    place.textContent = "📍 " + t("place") + ": " + item.location;

    const contact = document.createElement("p");
    contact.textContent = "☎ " + t("contact") + ": " + item.contact;

    const date = document.createElement("p");
    date.textContent = "📅 " + t("date") + ": " +
      new Date(item.created_at).toLocaleDateString(language === "ru" ? "ru-RU" : "uz-UZ");

    content.append(badge, title, description, place, contact, date);

    if (currentUser && currentUser.id === item.user_id) {
      const deleteButton = document.createElement("button");
      deleteButton.className = "delete-btn";
      deleteButton.textContent = t("delete");
      deleteButton.addEventListener("click", () => deleteListing(item));
      content.appendChild(deleteButton);
    }

    card.appendChild(content);
    $("listingsGrid").appendChild(card);
  });
}

$("searchInput").addEventListener("input", renderListings);
$("typeFilter").addEventListener("change", renderListings);
$("categoryFilter").addEventListener("change", renderListings);

/* Create listing */

document.querySelectorAll(".type-option input").forEach(input => {
  input.addEventListener("change", () => {
    document.querySelectorAll(".type-option").forEach(label => {
      label.classList.toggle("selected", label.querySelector("input").checked);
    });
  });
});

$("listingForm").addEventListener("submit", async event => {
  event.preventDefault();

  if (!currentUser) {
    openAuth();
    return;
  }

  const title = $("listingTitle").value.trim();
  const category = $("listingCategory").value;
  const description = $("listingDescription").value.trim();
  const location = $("listingLocation").value.trim();
  const contact = $("listingContact").value.trim();
  const type = document.querySelector('input[name="type"]:checked').value;
  const file = $("listingImage").files[0];

  if (!title || !category || !description || !location || !contact) {
    showMessage($("formMessage"), t("titleRequired"), true);
    return;
  }

  if (file && file.size > 5 * 1024 * 1024) {
    showMessage($("formMessage"), t("imageTooLarge"), true);
    return;
  }

  $("submitButton").disabled = true;
  showMessage($("formMessage"), t("sending"));

  try {
    let imageUrl = null;

    if (file) {
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(file.type)) throw new Error(t("uploadError"));

      const extension = file.name.split(".").pop().toLowerCase();
      const filePath = `${currentUser.id}/${crypto.randomUUID()}.${extension}`;

      const { error: uploadError } = await db.storage
        .from("listing-images")
        .upload(filePath, file, { contentType: file.type });

      if (uploadError) throw uploadError;

      const { data: publicData } = db.storage
        .from("listing-images")
        .getPublicUrl(filePath);

      imageUrl = publicData.publicUrl;
    }

    const { error } = await db.from("listings").insert({
      user_id: currentUser.id,
      type,
      category,
      title,
      description,
      location,
      contact,
      image_url: imageUrl
    });

    if (error) throw error;

    $("listingForm").reset();
    document.querySelector('.type-option input[value="lost"]').checked = true;
    document.querySelectorAll(".type-option").forEach(label => {
      label.classList.toggle("selected", label.querySelector("input").checked);
    });

    showMessage($("formMessage"), t("success"));
    await loadListings();

  } catch (error) {
    showMessage($("formMessage"), t("genericError") + error.message, true);
  } finally {
    $("submitButton").disabled = false;
  }
});

/* Delete own listing */

async function deleteListing(item) {
  if (!currentUser || currentUser.id !== item.user_id) {
    alert(t("loginFirst"));
    return;
  }

  if (!confirm(t("deleteConfirm"))) return;

  try {
    const { error } = await db
      .from("listings")
      .delete()
      .eq("id", item.id)
      .eq("user_id", currentUser.id);

    if (error) throw error;

    await loadListings();
  } catch (error) {
    alert(t("genericError") + error.message);
  }
}

/* Start */

async function startApp() {
  setLanguage(language);
  await updateAuthUI();
  await loadListings();

  db.auth.onAuthStateChange((_event, session) => {
    currentUser = session?.user || null;
    updateAuthUI();
    loadListings();
  });
}

startApp();
