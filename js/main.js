// FAQ Accordion
document.querySelectorAll(".faq-toggle").forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.closest(".faq-item");
    if (!item) return;

    const wasOpen = item.classList.contains("is-open");

    document.querySelectorAll("#faq-container .faq-item").forEach((faqItem) => {
      faqItem.classList.remove("is-open");
      faqItem.querySelector(".faq-toggle")?.setAttribute("aria-expanded", "false");
    });

    if (!wasOpen) {
      item.classList.add("is-open");
      button.setAttribute("aria-expanded", "true");
    }
  });
});

// Mobile / tablet navigation
const mobileMenuBtn = document.getElementById("mobile-menu-btn");
const mobileMenu = document.getElementById("mobile-menu");
const mobileMenuIcon = document.getElementById("mobile-menu-icon");

function setMobileMenuOpen(isOpen) {
  if (!mobileMenu || !mobileMenuBtn) return;

  mobileMenu.classList.toggle("hidden", !isOpen);
  mobileMenuBtn.setAttribute("aria-expanded", String(isOpen));

  if (mobileMenuIcon) {
    mobileMenuIcon.textContent = isOpen ? "close" : "menu";
  }
}

if (mobileMenuBtn && mobileMenu) {
  mobileMenuBtn.addEventListener("click", () => {
    setMobileMenuOpen(mobileMenu.classList.contains("hidden"));
  });

  mobileMenu.querySelectorAll(".mobile-nav-link").forEach((link) => {
    link.addEventListener("click", () => setMobileMenuOpen(false));
  });

  window.addEventListener("resize", () => {
    if (window.matchMedia("(min-width: 1024px)").matches) {
      setMobileMenuOpen(false);
    }
  });
}

// Join as Professional modal form
const proModal = document.getElementById("pro-join-modal");
const proForm = document.getElementById("pro-join-form");
const proSuccess = document.getElementById("pro-join-success");
const proSubmitBtn = document.getElementById("pro-submit-btn");
const workAreaInput = document.getElementById("pro-work-area-input");

function openProModal() {
  if (!proModal) return;
  proModal.classList.add("is-open");
  proModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("pro-modal-open");
  setMobileMenuOpen(false);

  if (proForm) proForm.style.display = "";
  if (proSuccess) proSuccess.classList.remove("is-visible");

  window.setTimeout(() => {
    document.getElementById("pro-full-name")?.focus();
  }, 120);
}

function closeProModal() {
  if (!proModal) return;
  proModal.classList.remove("is-open");
  proModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("pro-modal-open");
}

function clearFieldError(field) {
  field.classList.remove("has-error");
  field.querySelector("input, select, textarea")?.classList.remove("is-invalid");
}

function setFieldError(field) {
  field.classList.add("has-error");
  field.querySelector("input, select, textarea")?.classList.add("is-invalid");
}

function validateProForm() {
  let isValid = true;
  const fullName = document.getElementById("pro-full-name");
  const phone = document.getElementById("pro-phone");
  const city = document.getElementById("pro-city");
  const pincode = document.getElementById("pro-pincode");
  const skill = document.getElementById("pro-skill");
  const experience = document.getElementById("pro-experience");
  const aadhaar = document.getElementById("pro-aadhaar");
  const consent = document.getElementById("pro-consent");

  const checks = [
    [fullName, () => fullName.value.trim().length >= 2],
    [phone, () => /^[6-9]\d{9}$/.test(phone.value.trim())],
    [city, () => city.value.trim().length >= 2],
    [pincode, () => /^[1-9]\d{5}$/.test(pincode.value.trim())],
    [skill, () => Boolean(skill.value)],
    [experience, () => Boolean(experience.value)],
    [aadhaar, () => /^\d{12}$/.test(aadhaar.value.trim())],
    [consent, () => consent.checked],
  ];

  checks.forEach(([el, test]) => {
    const field = el.closest(".pro-field");
    if (!field) return;
    clearFieldError(field);
    if (!test()) {
      setFieldError(field);
      isValid = false;
    }
  });

  return isValid;
}

document.querySelectorAll(".js-open-pro-form").forEach((trigger) => {
  trigger.addEventListener("click", (event) => {
    event.preventDefault();
    openProModal();
  });
});

proModal?.querySelectorAll("[data-pro-close]").forEach((el) => {
  el.addEventListener("click", closeProModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && proModal?.classList.contains("is-open")) {
    closeProModal();
  }
});

document.querySelectorAll("#pro-work-area .pro-chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    document.querySelectorAll("#pro-work-area .pro-chip").forEach((c) => {
      c.classList.remove("is-selected");
    });
    chip.classList.add("is-selected");
    if (workAreaInput) workAreaInput.value = chip.dataset.value || "rural";
  });
});

["pro-full-name", "pro-phone", "pro-city", "pro-pincode", "pro-skill", "pro-experience", "pro-aadhaar", "pro-consent"].forEach((id) => {
  const el = document.getElementById(id);
  el?.addEventListener("input", () => {
    const field = el.closest(".pro-field");
    if (field) clearFieldError(field);
  });
  el?.addEventListener("change", () => {
    const field = el.closest(".pro-field");
    if (field) clearFieldError(field);
  });
});

proForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!validateProForm()) {
    proForm.querySelector(".pro-field.has-error input, .pro-field.has-error select")?.focus();
    return;
  }

  if (proSubmitBtn) {
    proSubmitBtn.disabled = true;
    proSubmitBtn.textContent = "Submitting...";
  }

  window.setTimeout(() => {
    proForm.style.display = "none";
    proSuccess?.classList.add("is-visible");
    proForm.reset();
    document.querySelectorAll("#pro-work-area .pro-chip").forEach((c, i) => {
      c.classList.toggle("is-selected", i === 0);
    });
    if (workAreaInput) workAreaInput.value = "rural";
    if (proSubmitBtn) {
      proSubmitBtn.disabled = false;
      proSubmitBtn.textContent = "Submit application";
    }
  }, 700);
});
