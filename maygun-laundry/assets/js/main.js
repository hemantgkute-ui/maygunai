/* =========================================================
   Maygun Laundry — Main JavaScript
   Vanilla JS, no dependencies
========================================================= */
(function () {
  "use strict";

  /* ---------- Config ---------- */
  var WHATSAPP_NUMBER = "918989898989"; // Temporary number 8989898989 with India country code

  /* ---------- Utilities ---------- */
  function qs(sel, ctx) { return (ctx || document).querySelector(sel); }
  function qsa(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  function buildWhatsAppUrl(message) {
    return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);
  }

  /* ---------- Year in footer ---------- */
  qsa("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Sticky Navbar ---------- */
  var navbar = qs(".navbar");
  function handleNavScroll() {
    if (!navbar) return;
    if (window.scrollY > 12) navbar.classList.add("scrolled");
    else navbar.classList.remove("scrolled");
  }
  handleNavScroll();
  window.addEventListener("scroll", handleNavScroll, { passive: true });

  /* ---------- Mobile Nav Toggle ---------- */
  var navToggle = qs(".nav-toggle");
  var navMenu = qs(".nav-menu");
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      navToggle.classList.toggle("open");
      navMenu.classList.toggle("mobile-open");
      document.body.style.overflow = navMenu.classList.contains("mobile-open") ? "hidden" : "";
    });
    qsa("a", navMenu).forEach(function (link) {
      link.addEventListener("click", function () {
        navToggle.classList.remove("open");
        navMenu.classList.remove("mobile-open");
        document.body.style.overflow = "";
      });
    });
  }

  /* ---------- Active Nav Link ---------- */
  (function setActiveNav() {
    var path = window.location.pathname.split("/").pop() || "index.html";
    qsa(".nav-menu a[data-page]").forEach(function (link) {
      if (link.getAttribute("data-page") === path) link.classList.add("active");
    });
  })();

  /* ---------- Scroll Reveal Animations ---------- */
  var revealEls = qsa(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in-view"); });
  }

  /* ---------- Back to Top ---------- */
  var backToTop = qs(".back-to-top");
  if (backToTop) {
    window.addEventListener(
      "scroll",
      function () {
        if (window.scrollY > 480) backToTop.classList.add("show");
        else backToTop.classList.remove("show");
      },
      { passive: true }
    );
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- Hero Bubbles ---------- */
  var bubbleField = qs(".hero-bubbles");
  if (bubbleField) {
    var bubbleCount = window.innerWidth < 720 ? 8 : 16;
    for (var i = 0; i < bubbleCount; i++) {
      var b = document.createElement("span");
      b.className = "bubble";
      var size = Math.random() * 40 + 10;
      b.style.width = size + "px";
      b.style.height = size + "px";
      b.style.left = Math.random() * 100 + "%";
      b.style.animationDuration = Math.random() * 12 + 10 + "s";
      b.style.animationDelay = Math.random() * 10 + "s";
      bubbleField.appendChild(b);
    }
  }

  /* ---------- Testimonials Slider ---------- */
  var track = qs(".testimonial-track");
  if (track) {
    var cards = qsa(".testimonial-card", track);
    var dotsWrap = qs(".testimonial-dots");
    var prevBtn = qs(".testimonial-controls .prev");
    var nextBtn = qs(".testimonial-controls .next");
    var index = 0;

    function perView() {
      if (window.innerWidth <= 720) return 1;
      if (window.innerWidth <= 1024) return 2;
      return 3;
    }

    function maxIndex() {
      return Math.max(0, cards.length - perView());
    }

    function renderDots() {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = "";
      var total = maxIndex() + 1;
      for (var d = 0; d < total; d++) {
        var dot = document.createElement("span");
        if (d === index) dot.classList.add("active");
        (function (dIndex) {
          dot.addEventListener("click", function () { goTo(dIndex); });
        })(d);
        dotsWrap.appendChild(dot);
      }
    }

    function update() {
      var cardWidth = cards[0].getBoundingClientRect().width + 24;
      track.style.transform = "translateX(-" + index * cardWidth + "px)";
      renderDots();
    }

    function goTo(i) {
      index = Math.min(Math.max(i, 0), maxIndex());
      update();
    }

    if (prevBtn) prevBtn.addEventListener("click", function () { goTo(index - 1 < 0 ? maxIndex() : index - 1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { goTo(index + 1 > maxIndex() ? 0 : index + 1); });

    window.addEventListener("resize", update);
    update();

    var autoSlide = setInterval(function () {
      goTo(index + 1 > maxIndex() ? 0 : index + 1);
    }, 5000);
    track.addEventListener("mouseenter", function () { clearInterval(autoSlide); });
  }

  /* ---------- Pricing Tabs ---------- */
  var pricingTabs = qsa(".pricing-tab");
  if (pricingTabs.length) {
    pricingTabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        var target = tab.getAttribute("data-target");
        pricingTabs.forEach(function (t) { t.classList.remove("active"); });
        tab.classList.add("active");
        qsa(".pricing-panel").forEach(function (panel) {
          panel.classList.toggle("active", panel.id === target);
        });
      });
    });
  }

  /* ---------- Gallery Filters ---------- */
  var galleryFilters = qsa(".gallery-filter");
  var galleryItems = qsa(".gallery-item");
  if (galleryFilters.length) {
    galleryFilters.forEach(function (filter) {
      filter.addEventListener("click", function () {
        var cat = filter.getAttribute("data-filter");
        galleryFilters.forEach(function (f) { f.classList.remove("active"); });
        filter.classList.add("active");
        galleryItems.forEach(function (item) {
          var show = cat === "all" || item.getAttribute("data-category") === cat;
          item.style.display = show ? "flex" : "none";
        });
      });
    });
  }

  /* ---------- Gallery Lightbox ---------- */
  var lightbox = qs(".lightbox");
  if (lightbox) {
    var lbIcon = qs(".lb-icon", lightbox);
    var lbTitle = qs(".lightbox-box h3", lightbox);
    var lbDesc = qs(".lightbox-box p", lightbox);
    galleryItems.forEach(function (item) {
      item.addEventListener("click", function () {
        var iconHtml = qs("svg", item).outerHTML;
        lbIcon.outerHTML = iconHtml.replace("<svg", '<svg class="lb-icon"');
        lbIcon = qs(".lb-icon", lightbox);
        lbTitle.textContent = item.getAttribute("data-title") || "Maygun Laundry";
        lbDesc.textContent = item.getAttribute("data-desc") || "";
        lightbox.classList.add("open");
        document.body.style.overflow = "hidden";
      });
    });
    qsa("[data-close-lightbox]").forEach(function (btn) {
      btn.addEventListener("click", closeLightbox);
    });
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeLightbox();
    });
    function closeLightbox() {
      lightbox.classList.remove("open");
      document.body.style.overflow = "";
    }
  }

  /* ---------- WhatsApp Booking Form ---------- */
  qsa(".booking-form").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var name = qs('[name="name"]', form).value.trim();
      var phone = qs('[name="phone"]', form).value.trim();
      var address = qs('[name="address"]', form).value.trim();
      var serviceEl = qs('[name="service"]', form);
      var service = serviceEl ? serviceEl.options[serviceEl.selectedIndex].text : "";
      var dateEl = qs('[name="pickup_date"]', form);
      var pickupDate = dateEl ? dateEl.value : "";

      if (!name || !phone || !address || !pickupDate) {
        showFormMessage(form, "Please fill in all required fields.", false);
        return;
      }

      var phoneDigits = phone.replace(/\D/g, "");
      if (phoneDigits.length < 10) {
        showFormMessage(form, "Please enter a valid phone number.", false);
        return;
      }

      var formattedDate = pickupDate;
      try {
        var d = new Date(pickupDate + "T00:00:00");
        formattedDate = d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
      } catch (err) { /* keep raw value */ }

      var message =
        "Hello Maygun Laundry! I'd like to book a pickup.\n\n" +
        "Name: " + name + "\n" +
        "Phone: " + phone + "\n" +
        "Address: " + address + "\n" +
        "Service: " + service + "\n" +
        "Preferred Pickup Date: " + formattedDate;

      showFormMessage(form, "Redirecting you to WhatsApp...", true);

      window.open(buildWhatsAppUrl(message), "_blank");

      setTimeout(function () { form.reset(); }, 400);
    });
  });

  function showFormMessage(form, text, success) {
    var box = form.querySelector(".form-success");
    if (!box) return;
    box.textContent = text;
    box.classList.toggle("show", true);
    box.style.background = success ? "#e8f9f0" : "#fdeaea";
    box.style.color = success ? "#1fa463" : "#c0392b";
    setTimeout(function () { box.classList.remove("show"); }, 4500);
  }

  /* ---------- General Contact Form (mailto fallback) ---------- */
  var contactForm = qs(".contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = qs('[name="name"]', contactForm).value.trim();
      var email = qs('[name="email"]', contactForm).value.trim();
      var msg = qs('[name="message"]', contactForm).value.trim();

      if (!name || !email || !msg) {
        showFormMessage(contactForm, "Please fill in all fields.", false);
        return;
      }

      showFormMessage(contactForm, "Thank you! Redirecting to WhatsApp to complete your query.", true);
      var waMessage = "Hello Maygun Laundry, my name is " + name + " (" + email + ").\n\n" + msg;
      window.open(buildWhatsAppUrl(waMessage), "_blank");
      setTimeout(function () { contactForm.reset(); }, 400);
    });
  }

  /* ---------- Set minimum date for pickup date inputs to today ---------- */
  qsa('input[type="date"][name="pickup_date"]').forEach(function (input) {
    var today = new Date().toISOString().split("T")[0];
    input.setAttribute("min", today);
  });
})();
