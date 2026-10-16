const WEDDING_CONFIG = {
  brideName: "Nguyễn Nhung",
  groomName: "Hoàng Vinh",
};

const WEDDING = new Date(2050, 4, 20, 12, 0, 0);

function setText(selector, value) {
  document.querySelectorAll(selector).forEach((element) => {
    element.textContent = value;
  });
}

function vietnameseWeekday(date) {
  const weekday = date.toLocaleDateString("vi-VN", { weekday: "long" });
  return weekday.charAt(0).toLocaleUpperCase("vi-VN") + weekday.slice(1);
}

function setupWeddingDetails() {
  setText('[data-name="bride"]', WEDDING_CONFIG.brideName);
  setText('[data-name="groom"]', WEDDING_CONFIG.groomName);
  const dateLabel = `${vietnameseWeekday(WEDDING)} · ${String(WEDDING.getDate()).padStart(2, "0")}.${String(
    WEDDING.getMonth() + 1,
  ).padStart(2, "0")}.${WEDDING.getFullYear()}`;
  setText("[data-wedding-date]", dateLabel);
    setText("[data-wd-weekday]", vietnameseWeekday(WEDDING));
  setText("[data-wd-day]", String(WEDDING.getDate()).padStart(2, "0"));
  setText("[data-wd-month]", `Tháng ${String(WEDDING.getMonth() + 1).padStart(2, "0")}`);
  setText("[data-wd-year]", String(WEDDING.getFullYear()));
}

function setupEnvelope() {
  const screen = document.getElementById("opening-screen");
  const envelope = document.querySelector(".envelope");
  const openButton = document.getElementById("open-invitation");
  const content = document.getElementById("invitation-content");

  openButton.addEventListener("click", () => {
    envelope.classList.add("is-opening");
    content.inert = false;
    document.body.classList.remove("is-closed");
    screen.classList.add("is-open");
    window.setTimeout(() => screen.remove(), 550);
  });
}

function setupLoveLetterAnimation() {
  if (!window.gsap || !window.ScrollTrigger || !window.SplitText) return;

  document.fonts.ready.then(() => {
    document.querySelectorAll(".confession-content").forEach((block) => {
      const isReverse = block.classList.contains("is-reverse");
      const img = block.querySelector("img");
      const role = block.querySelector(".role");
      const who = SplitText.create(block.querySelector(".who"), {
        type: "chars",
      });
      const story = SplitText.create(block.querySelector(".story"), {
        type: "words",
      });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: block, start: "top 78%", once: true },
      });

      // Ảnh: mở dần từ trên xuống + zoom nhẹ
      tl.from(block.querySelector(".image-confession"), {
        clipPath: "inset(0 0 100% 0)",
        duration: 1.2,
        ease: "power3.out",
      })
        .from(img, { scale: 1.3, duration: 1.8, ease: "power2.out" }, "<")
        // Nhãn + tên
        .from(role, { opacity: 0, y: 10, duration: 0.6 }, "-=1.2")
        .from(
          who.chars,
          {
            opacity: 0,
            y: 30,
            rotation: isReverse ? -10 : 10,
            duration: 0.8,
            ease: "back.out(2)",
            stagger: 0.05,
          },
          "-=0.9",
        )
        // Lời tỏ tình: từng từ hiện lên, đổi stagger để chậm/nhanh
        .from(
          story.words,
          {
            opacity: 0,
            y: 18,
            filter: "blur(4px)",
            duration: 0.7,
            ease: "power2.out",
            stagger: 0.06,
          },
          "-=0.5",
        );
    });
  });
}

function setupIconRotation() {
  if (!window.gsap) return;

  const mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    gsap.utils.toArray(".icon-title-main").forEach((icon) => {
      // Xuất hiện: phóng to từ 0
      gsap.from(icon, {
        scale: 0,
        duration: 0.9,
        ease: "back.out(2)",
        scrollTrigger: { trigger: icon, start: "top 90%", once: true },
      });

      // Xoay tròn liên tục, chỉ chạy khi icon đang trong màn hình
      gsap.to(icon, {
        rotation: 360,
        duration: 8,
        ease: "none",
        repeat: -1,
        scrollTrigger: {
          trigger: icon,
          toggleActions: "play pause resume pause",
        },
      });
    });
  });
}

function setupMomentsHeadingAnimation() {
  if (!window.gsap || !window.ScrollTrigger) return;

  const mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    const section = document.querySelector(".moments-section");
    const heading = section?.querySelector(".block-title");
    if (!heading) return;

    gsap.from(heading.children, {
      y: 24,
      opacity: 0,
      filter: "blur(5px)",
      duration: 0.8,
      ease: "power2.out",
      stagger: 0.18,
      scrollTrigger: {
        trigger: heading,
        start: "top 85%",
        once: true,
      },
    });
  });
}

function setupAlbumCarousel() {
  if (!window.gsap || !window.Draggable) return;

  const gallery = document.querySelector(".gallery");
  const proxy = document.querySelector(".drag-proxy");
  const wrapEl = document.querySelector(".album-wrap");
  const cards = gsap.utils.toArray(".gallery .cards li");
  if (!gallery || !proxy || !wrapEl || !cards.length) return;

  const n = cards.length;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const wrapDistance = gsap.utils.wrap(-n / 2, n / 2);
  const state = { pos: 0 };
  const intro = { v: reduce ? 1 : 0 };
  if (!reduce) state.pos = .5;
  let target = 0;
  let step = 0;
  const gust = (power) =>
    wrapEl.dispatchEvent(new CustomEvent("album:gust", { detail: { power } }));

  function measure() {
    step = cards[0].offsetWidth * 0.6;
    render();
  }

  function render() {
    const k = intro.v;
    cards.forEach((card, i) => {
      const d = wrapDistance(i - state.pos);
      const a = Math.abs(d);
      card.classList.toggle("is-active", k > 0.95 && a < 0.5);
      gsap.set(card, {
        x: d * step * k,
        scale: (1 - Math.min(a, 3) * 0.1) * (0.85 + 0.15 * k),
        rotation: d * 5 * k,
        opacity: (a > 2.5 ? 0 : 1 - a * 0.28) * Math.min(1, k * 1.6),
        zIndex: Math.round(100 - a * 10),
        pointerEvents: a > 2.5 || k < 0.95 ? "none" : "auto",
      });
    });
  }

  function goTo(index) {
    const diff = index - target;
    if (diff !== 0) gust(-Math.sign(diff) * 1.6);
    target = index;
    gsap.to(state, {
      pos: target,
      duration: reduce ? 0 : 0.8,
      ease: "power3.out",
      overwrite: true,
      onUpdate: render,
    });
  }

  function handleCardClick(card) {
    const i = cards.indexOf(card);
    if (i < 0) return;
    const d = Math.round(wrapDistance(i - Math.round(state.pos)));
    goTo(Math.round(state.pos) + (d === 0 ? 1 : d));
  }

  let startPos = 0;
  Draggable.create(proxy, {
    type: "x",
    trigger: gallery,
    dragClickables: false,
    onPress() {
      gsap.killTweensOf(state);
      startPos = state.pos;
    },
    onDrag() {
      state.pos = startPos - (this.x - this.startX) / step;
      gust(Math.sign(this.deltaX) * 0.12);
      render();
    },
    onRelease() {
      goTo(Math.round(state.pos));
    },
    onClick() {
      const card = this.pointerEvent.target.closest(".cards li");
      if (card) handleCardClick(card);
    },
  });
  if (!reduce && window.ScrollTrigger) {
    const navBtns = wrapEl.querySelectorAll(".nav-btn");
    if (navBtns.length) gsap.set(navBtns, { opacity: 0 });

    const tl = gsap.timeline({
      paused: true,
      onComplete: () => {
        state.pos = Math.round(state.pos);
        render();
      },
    });
    tl.to(intro, { v: 1, duration: 1.5, ease: "power3.out", onUpdate: render }, 0)
      .to(state, { pos: 0, duration: 1.9, ease: "power3.out", onUpdate: render }, 0);
    if (navBtns.length) {
      tl.to(navBtns, { opacity: 1, duration: 0.8, stagger: 0.12, clearProps: "opacity" }, 1.0);
    }

    ScrollTrigger.create({
      trigger: wrapEl,
      start: "top 75%",
      once: true,
      onEnter: () => tl.play(),
    });
  }
  window.addEventListener("resize", measure);
  measure();
}
function setupFallingLeaves() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const canvas = document.createElement("canvas");
  canvas.className = "page-leaves";
  canvas.setAttribute("aria-hidden", "true");
  document.body.append(canvas);
  const ctx = canvas.getContext("2d");

  const SHAPES = {
    leaf: new Path2D("M0 -1C0.7 -0.4 0.6 0.5 0 1C-0.6 0.5 -0.7 -0.4 0 -1Z"),
    petal: new Path2D("M0 -0.8C0.9 -1 1 0.3 0 1C-1 0.3 -0.9 -1 0 -0.8Z"),
  };
  const COLORS = ["#BF953F", "#D4AF5A", "#E6CB86", "#B76E79", "#E3B7AE", "#A67C2E"];

  let w = 0, h = 0, dpr = 1;
  let wind = 0;
  let raf = 0, last = 0;
  let scrollDy = 0, lastY = window.scrollY;
  const rand = gsap.utils.random;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function spawn(p, initial) {
    const z = rand(0.45, 1.15); // độ sâu: nhỏ = xa
    p.z = z;
    p.len = rand(9, 15) * z + 3;
    p.x = rand(0, w);
    p.y = initial ? rand(-20, h) : rand(-120, -20);
    p.vy = rand(20, 36) * z;
    p.amp = rand(16, 36) * z;
    p.freq = rand(0.5, 1.1);
    p.phase = rand(0, Math.PI * 2);
    p.flipSpeed = rand(1.2, 2.8);
    p.flipPhase = rand(0, Math.PI * 2);
    p.rot = rand(0, Math.PI * 2);
    p.spin = rand(-0.9, 0.9);
    p.t = 0;
    p.kind = Math.random() < 0.3 ? "petal" : "leaf";
    p.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    return p;
  }

  resize();
  const count = w < 420 ? 18 : w < 900 ? 24 : 32;
  const parts = Array.from({ length: count }, () => spawn({}, true));
  parts.sort((a, b) => a.z - b.z); // lá xa vẽ trước, lá gần vẽ sau

  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
    last = now;
    wind += (0 - wind) * Math.min(1, dt * 1.4);

    const dy = scrollDy; // quãng cuộn kể từ khung hình trước
    scrollDy = 0;

    ctx.clearRect(0, 0, w, h);

    for (const p of parts) {
      p.t += dt;
      const sway = Math.cos(p.t * p.freq + p.phase) * p.amp * p.freq;
      p.x += (sway + wind * (50 + 90 * p.z)) * dt;
      p.y += (p.vy - Math.abs(wind) * 28 * p.z) * dt;
      p.y -= dy * 0.35 * p.z; // thị sai khi cuộn: lá gần trôi nhanh hơn
      p.rot += (p.spin + wind * 1.6) * dt;

      if (p.y < -80) { // cuộn ngược lên quá xa: cho lá vòng xuống dưới
        p.y = h + 30;
        p.x = rand(0, w);
      }
      if (p.y > h + 30 || p.x < -60 || p.x > w + 60) {
        spawn(p, false);
        if (Math.abs(wind) > 0.5) p.x = wind > 0 ? rand(-40, w * 0.3) : rand(w * 0.7, w + 40);
        continue;
      }

      const flip = Math.cos(p.t * p.flipSpeed + p.flipPhase);
      const face = Math.abs(flip);
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.scale(p.len * 0.5 * (0.25 + 0.75 * face), p.len);
      ctx.globalAlpha = (0.3 + 0.45 * p.z) * (0.6 + 0.4 * face);
      if (p.z > 1) {
        ctx.shadowColor = "rgba(212,175,90,0.7)";
        ctx.shadowBlur = 8 * face;
      }
      ctx.fillStyle = p.color;
      ctx.fill(SHAPES[p.kind]);
      ctx.shadowBlur = 0;
      ctx.globalAlpha *= 0.55 + 0.45 * face;
      ctx.strokeStyle = "rgba(255,248,225,0.8)";
      ctx.lineWidth = 0.07;
      ctx.beginPath();
      ctx.moveTo(0, -0.85);
      ctx.lineTo(0, 0.85);
      ctx.stroke();
      ctx.restore();
    }
    raf = requestAnimationFrame(frame);
  }

  window.addEventListener("resize", resize);
  window.addEventListener(
    "scroll",
    () => {
      const y = window.scrollY;
      scrollDy += y - lastY;
      lastY = y;
    },
    { passive: true },
  );
  window.addEventListener("album:gust", (e) => {
    wind = gsap.utils.clamp(-3, 3, wind + e.detail.power);
  });

  raf = requestAnimationFrame(frame);
}
function setupMapLinks() {
  document.querySelectorAll("[data-map]").forEach((link) => {
    const card = link.closest(".venue-card");
    const address = card?.querySelector(".venue-address")?.textContent.trim();
    const custom = link.dataset.mapUrl;
    if (!custom && !address) return;

    link.href =
      custom ||
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });
}

function setupInfoAnimation() {
  if (!window.gsap || !window.ScrollTrigger) return;

  const mm = gsap.matchMedia();
  mm.add("(prefers-reduced-motion: no-preference)", () => {
    const section = document.querySelector(".info-section");
    if (!section) return;

    const once = (trigger, start = "top 85%") => ({ trigger, start, once: true });
    const title = section.querySelector(".block-title");
    if (title) {
      gsap.from(title.children, {
        y: 24,
        opacity: 0,
        filter: "blur(5px)",
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.18,
        scrollTrigger: once(title),
      });
    }

    const invite = section.querySelector(".info-invite");
    if (invite) {
      gsap.from(invite, {
        y: 18,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: once(invite),
      });
    }

    const couple = section.querySelector(".info-couple");
    const [groom, bride] = section.querySelectorAll(".info-person");
    const coupleAmp = couple?.querySelector(".info-amp");
    if (couple && groom && bride && coupleAmp) {
      gsap.timeline({ scrollTrigger: once(couple) })
        .from(groom, { x: -36, opacity: 0, duration: 0.9, ease: "power3.out" }, 0)
        .from(bride, { x: 36, opacity: 0, duration: 0.9, ease: "power3.out" }, 0)
        .from(coupleAmp, { scale: 0, rotation: -40, opacity: 0, duration: 0.8, ease: "back.out(2.4)" }, 0.35);
    }

    const date = section.querySelector(".info-date");
    if (date) {
      const weekday = date.querySelector(".info-weekday");
      const day = date.querySelector(".info-day");
      const month = date.querySelector(".info-month");
      const year = date.querySelector(".info-year");
      const lunar = date.querySelector(".info-lunar");
      const timeline = gsap.timeline({ scrollTrigger: once(date, "top 88%") });
      if (weekday) timeline.from(weekday, { y: 12, opacity: 0, duration: 0.6, ease: "power2.out" });
      if (day) timeline.from(day, { scale: 0.4, opacity: 0, duration: 1, ease: "back.out(1.8)" }, "-=0.3");
      if (month) timeline.from(month, { x: -20, opacity: 0, duration: 0.7, ease: "power2.out" }, "-=0.7");
      if (year) timeline.from(year, { x: 20, opacity: 0, duration: 0.7, ease: "power2.out" }, "<");
      if (lunar) timeline.from(lunar, { opacity: 0, duration: 0.6 }, "-=0.2");
    }

    const split = section.querySelector(".info-split");
    const sideG = split?.querySelector(".split-side--groom");
    const sideB = split?.querySelector(".split-side--bride");
    const splitAmp = split?.querySelector(".split-amp");
    if (!split || !sideG || !sideB || !splitAmp) return;

    const stacked = window.matchMedia("(max-width: 380px)").matches;
    const timeline = gsap.timeline({ scrollTrigger: once(split, "top 82%") });
    timeline
      .from(split, { opacity: 0, duration: 0.5, ease: "power1.out" })
      .from(
        sideG,
        stacked
          ? { clipPath: "inset(0 0 100% 0)", duration: 1, ease: "power3.out" }
          : { clipPath: "inset(0 0 0 100%)", duration: 1, ease: "power3.out" },
        0,
      )
      .from(
        sideB,
        stacked
          ? { clipPath: "inset(100% 0 0 0)", duration: 1, ease: "power3.out" }
          : { clipPath: "inset(0 100% 0 0)", duration: 1, ease: "power3.out" },
        0,
      )
      .from(splitAmp, { scale: 0, rotation: -90, duration: 0.8, ease: "back.out(2.4)" }, 0.6);

    [sideG, sideB].forEach((side, index) => {
      timeline
        .from(
          side.querySelectorAll(".info-role, .info-side, .info-family, .split-details > div, .split-addr"),
          { y: 14, opacity: 0, duration: 0.6, ease: "power2.out", stagger: 0.08 },
          0.7 + index * 0.1,
        )
        .from(
          side.querySelector(".venue-pin"),
          { scale: 0, opacity: 0, duration: 0.7, ease: "back.out(2.6)" },
          1.4 + index * 0.1,
        )
        .from(side.querySelector(".venue-hint"), { opacity: 0, duration: 0.5 }, 1.6 + index * 0.1);
    });
  });
}
setupAlbumCarousel();
setupIconRotation();
setupMomentsHeadingAnimation();
setupWeddingDetails();
setupLoveLetterAnimation();
setupEnvelope();
setupFallingLeaves();   
setupMapLinks();
setupInfoAnimation();
