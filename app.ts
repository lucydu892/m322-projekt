type AgendaKind = "probe" | "auftritt" | "info";

type AgendaEvent = {
  date: string;
  title: string;
  place: string;
  kind: AgendaKind;
};

const agendaEvents: AgendaEvent[] = [
  { date: "12.02.2026", title: "Start Fasnacht 2026", place: "Kriens", kind: "auftritt" },
  { date: "13.02.2026", title: "Fasnachtsprogramm und Sujetpin", place: "Luzern", kind: "info" },
  { date: "15.11.2026", title: "Offene Probe", place: "Chriens", kind: "probe" },
  { date: "04.12.2026", title: "Neumitglieder-Abend", place: "Vereinslokal", kind: "info" },
  { date: "16.01.2027", title: "Vorfasnachtsauftritt", place: "Region Luzern", kind: "auftritt" }
];

const labels: Record<AgendaKind, string> = {
  probe: "Probe",
  auftritt: "Auftritt",
  info: "Info"
};

const page = document.body.dataset.page;
const navToggle = document.querySelector<HTMLButtonElement>("[data-nav-toggle]");
const nav = document.querySelector<HTMLElement>("[data-nav]");
const dropdowns = ([] as HTMLElement[]).slice.call(
  document.querySelectorAll<HTMLElement>("[data-dropdown]")
);

document.querySelectorAll<HTMLElement>("[data-page-link]").forEach((link) => {
  link.classList.toggle("is-active", link.dataset.pageLink === page);
});

document.querySelectorAll<HTMLButtonElement>("[data-page-group]").forEach((button) => {
  const group = button.dataset.pageGroup?.split(" ") ?? [];
  button.classList.toggle("is-active", Boolean(page && group.indexOf(page) !== -1));
});

document.querySelectorAll<HTMLButtonElement>("[data-dropdown-toggle]").forEach((button) => {
  button.addEventListener("click", () => {
    const dropdown = button.closest<HTMLElement>("[data-dropdown]");
    const isOpen = dropdown?.classList.toggle("is-open") ?? false;

    dropdowns.forEach((item) => {
      if (item !== dropdown) item.classList.remove("is-open");
    });

    button.setAttribute("aria-expanded", String(isOpen));
  });
});

navToggle?.addEventListener("click", () => {
  const isOpen = nav?.classList.toggle("is-open") ?? false;
  navToggle.classList.toggle("is-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

nav?.addEventListener("click", (event) => {
  if ((event.target as HTMLElement).matches("a")) {
    nav.classList.remove("is-open");
    navToggle?.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
    dropdowns.forEach((item) => item.classList.remove("is-open"));
  }
});

document.addEventListener("click", (event) => {
  if (!(event.target as HTMLElement).closest("[data-dropdown]")) {
    dropdowns.forEach((item) => item.classList.remove("is-open"));
  }
});

const agendaList = document.querySelector<HTMLElement>("[data-agenda-list]");
const filterButtons = ([] as HTMLButtonElement[]).slice.call(
  document.querySelectorAll<HTMLButtonElement>("[data-filter]")
);

function renderAgenda(filter: AgendaKind | "all" = "all"): void {
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
    const filter = button.dataset.filter as AgendaKind | "all";
    filterButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    renderAgenda(filter);
  });
});

renderAgenda();

const lightbox = document.querySelector<HTMLElement>("[data-lightbox-modal]");
const lightboxImage = document.querySelector<HTMLImageElement>("[data-lightbox-image]");
const lightboxCaption = document.querySelector<HTMLElement>("[data-lightbox-caption]");
const lightboxClose = document.querySelector<HTMLButtonElement>("[data-lightbox-close]");

document.querySelectorAll<HTMLButtonElement>("[data-lightbox]").forEach((button) => {
  button.addEventListener("click", () => {
    if (!lightbox || !lightboxImage || !lightboxCaption) return;

    lightboxImage.src = button.dataset.lightbox ?? "";
    lightboxCaption.textContent = button.dataset.caption ?? "";
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
  });
});

function closeLightbox(): void {
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

const contactForm = document.querySelector<HTMLFormElement>("[data-contact-form]");
const formStatus = document.querySelector<HTMLElement>("[data-form-status]");

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
