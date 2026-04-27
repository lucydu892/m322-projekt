const agendaEvents = [
  { date: "12.02.2026", title: "Start Fasnacht 2026", place: "Kriens", kind: "auftritt" },
  { date: "13.02.2026", title: "Fasnachtsprogramm und Sujetpin", place: "Luzern", kind: "info" },
  { date: "15.11.2026", title: "Offene Probe", place: "Chriens", kind: "probe" },
  { date: "04.12.2026", title: "Neumitglieder-Abend", place: "Vereinslokal", kind: "info" },
  { date: "16.01.2027", title: "Vorfasnachtsauftritt", place: "Region Luzern", kind: "auftritt" }
];

const labels = {
  probe: "Probe",
  auftritt: "Auftritt",
  info: "Info"
};

const page = document.body.dataset.page;
const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const dropdowns = Array.from(document.querySelectorAll("[data-dropdown]"));

document.querySelectorAll("[data-page-link]").forEach((link) => {
  link.classList.toggle("is-active", link.dataset.pageLink === page);
});

document.querySelectorAll("[data-page-group]").forEach((button) => {
  const group = button.dataset.pageGroup?.split(" ") ?? [];
  button.classList.toggle("is-active", Boolean(page && group.includes(page)));
});

document.querySelectorAll("[data-dropdown-toggle]").forEach((button) => {
  button.addEventListener("click", () => {
    const dropdown = button.closest("[data-dropdown]");
    const isOpen = dropdown?.classList.toggle("is-open") ?? false;

    dropdowns.forEach((item) => {
      if (item !== dropdown) item.classList.remove("is-open");
    });

    button.setAttribute("aria-expanded", String(isOpen));
  });
});

navToggle?.addEventListener("click", () => {
  const isOpen = nav?.classList.toggle("is-open") ?? false;
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

nav?.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    nav.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
    dropdowns.forEach((item) => item.classList.remove("is-open"));
  }
});

document.addEventListener("click", (event) => {
  if (!event.target.closest("[data-dropdown]")) {
    dropdowns.forEach((item) => item.classList.remove("is-open"));
  }
});

const agendaList = document.querySelector("[data-agenda-list]");
const filterButtons = Array.from(document.querySelectorAll("[data-filter]"));

function renderAgenda(filter = "all") {
  if (!agendaList) return;

  const events = filter === "all" ? agendaEvents : agendaEvents.filter((event) => event.kind === filter);
  agendaList.innerHTML = events
    .map(
      (event) => `
        <article class="agenda-item">
          <time>${event.date}</time>
          <div>
            <h3>${event.title}</h3>
            <p>${event.place}</p>
          </div>
          <span class="agenda-item__tag">${labels[event.kind]}</span>
        </article>
      `
    )
    .join("");
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    renderAgenda(filter);
  });
});

renderAgenda();

const lightbox = document.querySelector("[data-lightbox-modal]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const lightboxCaption = document.querySelector("[data-lightbox-caption]");
const lightboxClose = document.querySelector("[data-lightbox-close]");

document.querySelectorAll("[data-lightbox]").forEach((button) => {
  button.addEventListener("click", () => {
    if (!lightbox || !lightboxImage || !lightboxCaption) return;

    lightboxImage.src = button.dataset.lightbox ?? "";
    lightboxCaption.textContent = button.dataset.caption ?? "";
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
  });
});

function closeLightbox() {
  lightbox?.classList.remove("is-open");
  lightbox?.setAttribute("aria-hidden", "true");
}

lightboxClose?.addEventListener("click", closeLightbox);
lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeLightbox();
});

const contactForm = document.querySelector("[data-contact-form]");
const formStatus = document.querySelector("[data-form-status]");

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(contactForm);
  const name = String(formData.get("name") ?? "").trim();

  if (formStatus) {
    formStatus.textContent = name
      ? `Danke, ${name}. Im echten Formular wuerde die Nachricht jetzt verschickt.`
      : "Danke. Im echten Formular wuerde die Nachricht jetzt verschickt.";
  }

  contactForm.reset();
});
