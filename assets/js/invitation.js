// Chỉnh thông tin của từng cặp đôi tại đây.
const WEDDING_CONFIG = {
  brideName: "Nguyễn Nhung",
  groomName: "Hoàng Vinh",
  groomParents: {
    father: "Ông Hoàng Văn A",
    mother: "Bà Trần Thị B",
  },
  brideParents: {
    father: "Ông Nguyễn Văn C",
    mother: "Bà Lê Thị D",
  },
  weddingDate: {
    year: 2026,
    month: 12, // Tháng theo cách ghi thông thường: từ 1 đến 12.
    day: 20,
    hour: 12,
    minute: 0,
  },
  eventTimes: {
    groomArrival: "10:30",
    groomBanquet: "12:45",
    brideArrival: "08:00",
    brideCeremony: "09:00",
    brideBanquet: "10:00",
  },
  venues: {
    groomAddress: "Số 1, Đường ABC, Phường XYZ, Quận Cầu Giấy, Hà Nội",
    brideAddress: "Số 2, Đường DEF, Phường UVW, Quận Hoàn Kiếm, Hà Nội",
  },
  stories: {
    groom: {
      role: "Chú rể",
      text: "Anh từng nghĩ hạnh phúc còn xa lắm. Cho đến ngày gặp em.",
      image: "./assets/img/groom.jpg",
      imageAlt: "Chú rể Hoàng Vinh",
    },
    bride: {
      role: "Cô dâu",
      text: "Chỉ cần một người nắm tay em mỗi sáng thức dậy. Và người ấy, hóa ra, chính là anh.",
      image: "./assets/img/bride.jpg",
      imageAlt: "Cô dâu Nguyễn Nhung",
    },
  },
  images: {
    heroPortrait: {
      src: "./assets/img/hero1.jpg",
      alt: "Cô dâu chú rể trong khoảnh khắc thân mật",
    },
    heroScene: {
      src: "./assets/img/hero3.jpg",
      alt: "Cô dâu chú rể giữa khung cảnh thiên nhiên",
    },
    countdownMain: {
      src: "./assets/img/image14.jpg",
      alt: "Ảnh cưới",
    },
    countdown: [
      "./assets/img/hero1.jpg",
      "./assets/img/hero2.jpg",
      "./assets/img/hero3.jpg",
      "./assets/img/hero4.jpg",
    ],
    gallery: [
      "./assets/img/image1.jpg",
      "./assets/img/image2.jpg",
      "./assets/img/image3.jpg",
      "./assets/img/image4.jpg",
      "./assets/img/image5.jpg",
      "./assets/img/image6.jpg",
      "./assets/img/image7.jpg",
      "./assets/img/image8.jpg",
      "./assets/img/image9.jpg",
      "./assets/img/image10.jpg",
      "./assets/img/image11.jpg",
      "./assets/img/image12.jpg",
      "./assets/img/image13.jpg",
    ],
  },
  rsvpEndpoint: "",
};

const WEDDING = new Date(
  WEDDING_CONFIG.weddingDate.year,
  WEDDING_CONFIG.weddingDate.month - 1,
  WEDDING_CONFIG.weddingDate.day,
  WEDDING_CONFIG.weddingDate.hour,
  WEDDING_CONFIG.weddingDate.minute,
);

let invitationOpened = false;
const openQueue = [];

if ("scrollRestoration" in history) history.scrollRestoration = "manual";
window.scrollTo(0, 0);

function whenOpened(fn) {
  if (invitationOpened) {
    safeRun(fn);
  } else {
    openQueue.push(fn);
  }
}

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
  setText('[data-family="groom-father"]', WEDDING_CONFIG.groomParents.father);
  setText('[data-family="groom-mother"]', WEDDING_CONFIG.groomParents.mother);
  setText('[data-family="bride-father"]', WEDDING_CONFIG.brideParents.father);
  setText('[data-family="bride-mother"]', WEDDING_CONFIG.brideParents.mother);
  setText('[data-venue="groom"]', WEDDING_CONFIG.venues.groomAddress);
  setText('[data-venue="bride"]', WEDDING_CONFIG.venues.brideAddress);
  setText('[data-hero-date="day"]', String(WEDDING.getDate()).padStart(2, "0"));
  setText('[data-hero-date="month"]', String(WEDDING.getMonth() + 1).padStart(2, "0"));

  const dateLabel = `${vietnameseWeekday(WEDDING)} · ${String(WEDDING.getDate()).padStart(2, "0")}.${String(
    WEDDING.getMonth() + 1,
  ).padStart(2, "0")}.${WEDDING.getFullYear()}`;
  const longDateLabel = `Ngày ${WEDDING.getDate()} tháng ${WEDDING.getMonth() + 1} năm ${WEDDING.getFullYear()}`;
  const weddingTime = `${String(WEDDING.getHours()).padStart(2, "0")}:${String(WEDDING.getMinutes()).padStart(2, "0")}`;
  setText("[data-wedding-date]", dateLabel);
  setText("[data-wedding-date-long]", longDateLabel);
  setText('[data-event-time="wedding"]', weddingTime);
  setText("[data-wd-weekday]", vietnameseWeekday(WEDDING));
  setText("[data-wd-day]", String(WEDDING.getDate()).padStart(2, "0"));
  setText("[data-wd-month]", `${String(WEDDING.getMonth() + 1).padStart(2, "0")}`);
  setText("[data-wd-year]", String(WEDDING.getFullYear()));

  Object.entries(WEDDING_CONFIG.eventTimes).forEach(([event, time]) => {
    setText(`[data-event-time="${event.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}"]`, time);
  });

  document.querySelectorAll("[data-image]").forEach((image) => {
    const imageConfig = WEDDING_CONFIG.images[image.dataset.image];
    if (!imageConfig) return;
    image.src = imageConfig.src;
    image.alt = imageConfig.alt;
  });

  document.querySelectorAll("[data-story-image]").forEach((image) => {
    const story = WEDDING_CONFIG.stories[image.dataset.storyImage];
    if (!story) return;
    image.src = story.image;
    image.alt = story.imageAlt;
  });

  document.querySelectorAll("[data-story-card]").forEach((card) => {
    const story = WEDDING_CONFIG.stories[card.dataset.storyCard];
    if (!story) return;
    setText(`[data-story-role="${card.dataset.storyCard}"]`, story.role);
    const name = card.dataset.storyCard === "bride" ? WEDDING_CONFIG.brideName : WEDDING_CONFIG.groomName;
    setText(`[data-story-name="${card.dataset.storyCard}"]`, name);
    setText(`[data-story-text="${card.dataset.storyCard}"]`, story.text);
  });

  document.querySelectorAll("[data-countdown-image]").forEach((image) => {
    const index = Number(image.dataset.countdownImage);
    const src = WEDDING_CONFIG.images.countdown[index];
    if (src) image.src = src;
  });

  const galleryCards = document.querySelector(".gallery .cards");
  if (galleryCards) {
    galleryCards.replaceChildren(
      ...WEDDING_CONFIG.images.gallery.map((src) => {
        const card = document.createElement("li");
        card.style.backgroundImage = `url("${src}")`;
        return card;
      }),
    );
  }
}

function setupEnvelope() {
  const screen = document.getElementById("opening-screen");
  const envelope = document.getElementById("open-invitation");
  const content = document.getElementById("invitation-content");
  const music = document.getElementById("wedding-music");
  const musicToggle = document.getElementById("music-toggle");

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const OPEN_MS = reduce ? 0 : 1000;
  const FADE_MS = 550;

  function updateMusicButton() {
    const isPlaying = !music.paused;
    musicToggle.classList.toggle("is-playing", isPlaying);
    musicToggle.setAttribute("aria-pressed", String(isPlaying));
    musicToggle.setAttribute("aria-label", isPlaying ? "Tắt nhạc" : "Bật nhạc");
    musicToggle.title = isPlaying ? "Tắt nhạc" : "Bật nhạc";
  }

  function playMusic() {
    music.play().catch((error) => {
      console.error("Không thể phát nhạc thiệp cưới:", error);
      updateMusicButton();
    });
  }

  music.addEventListener("play", updateMusicButton);
  music.addEventListener("pause", updateMusicButton);
  music.addEventListener("error", () => {
    console.error("Không thể tải tệp nhạc thiệp cưới:", music.error);
    updateMusicButton();
  });
  musicToggle.addEventListener("click", () => {
    if (music.paused) playMusic();
    else music.pause();
  });

  function openInvitation() {
    if (invitationOpened) return;
    invitationOpened = true;

    playMusic(); // phải gọi ngay trong lần chạm thì trình duyệt mới cho phát nhạc
    envelope.classList.add("is-opening");

    // phong bì mở xong -> cả màn mờ dần để lộ thiệp
    window.setTimeout(() => {
      content.inert = false;
      document.body.classList.remove("is-closed");
      screen.classList.add("is-open");
    }, OPEN_MS);

    window.setTimeout(() => {
      screen.remove();
      openQueue.splice(0).forEach(safeRun);
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    }, OPEN_MS + FADE_MS);
  }

  envelope.addEventListener("click", openInvitation);
  envelope.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openInvitation();
    }
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
        )
        .add(() => startImageWave(block.querySelector(".image-confession")));
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
      const pin = side.querySelector(".venue-pin");
      const hint = side.querySelector(".venue-hint");

      timeline
        .from(
          side.querySelectorAll(".info-role, .info-side, .info-family, .split-details > div, .split-addr"),
          { y: 14, opacity: 0, duration: 0.6, ease: "power2.out", stagger: 0.08 },
          0.7 + index * 0.1,
        )
        .fromTo(
          pin,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.7,
            ease: "back.out(2.6)",
            clearProps: "transform,opacity", // trả nút về CSS thuần sau khi xong
          },
          1.4 + index * 0.1,
        )
        .fromTo(
          hint,
          { opacity: 0 },
          { opacity: 1, duration: 0.5, clearProps: "opacity" },
          1.6 + index * 0.1,
        );
    });

    timeline.eventCallback("onComplete", () => {
      gsap.set(split.querySelectorAll(".venue-pin, .venue-hint"), { clearProps: "transform,opacity" });
    });
  });
}
function setupBlockTitleAnimation() {
  if (!window.gsap || !window.ScrollTrigger) return;

  const mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    gsap.utils.toArray(".block-title").forEach((title) => {
      gsap.from(title.children, {
        y: 24,
        opacity: 0,
        filter: "blur(5px)",
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.18,
        scrollTrigger: {
          trigger: title,
          start: "top 85%",
          once: true,
        },
      });
    });
  });
}

function setUpCountDown() {
  if (window.__countdownTimer) clearInterval(window.__countdownTimer);

  const els = {
    days: document.querySelector('.time-count[data-unit="days"]'),
    hours: document.querySelector('.time-count[data-unit="hours"]'),
    minutes: document.querySelector('.time-count[data-unit="minutes"]'),
    seconds: document.querySelector('.time-count[data-unit="seconds"]'),
  };
  if (Object.values(els).some((el) => !el)) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pad = (n) => String(n).padStart(2, "0");

  const DIR = 1;                 // 1 = số mới rơi từ trên xuống (đếm ngược); -1 = trồi từ dưới lên
  const DURATION = 520;
  const EASE = "cubic-bezier(0.2, 0.8, 0.2, 1)";

  function buildSlot(ch) {
    const slot = document.createElement("span");
    slot.className = "digit";
    slot.setAttribute("aria-hidden", "true");
    const a = document.createElement("span");
    const b = document.createElement("span");
    a.className = b.className = "d";
    a.textContent = ch;
    b.textContent = "";
    b.style.opacity = "0";
    slot.append(a, b);
    slot.dataset.cur = "0";
    return slot;
  }

  function swap(slot, ch) {
    const cur = slot.children[Number(slot.dataset.cur)];
    const nxt = slot.children[1 - Number(slot.dataset.cur)];
    slot.dataset.cur = String(1 - Number(slot.dataset.cur));

    [cur, nxt].forEach((n) => n.getAnimations().forEach((a) => a.cancel()));

    nxt.textContent = ch;
    nxt.style.opacity = "1";
    cur.style.opacity = "0";
    if (reduce) return;

    const off = 70 * DIR; // %
    const opts = { duration: DURATION, easing: EASE };
    nxt.animate(
      [
        { transform: `translateY(${-off}%) scale(0.92)`, opacity: 0, filter: "blur(4px)" },
        { transform: "translateY(0) scale(1)", opacity: 1, filter: "blur(0)" },
      ],
      opts,
    );
    cur.animate(
      [
        { transform: "translateY(0) scale(1)", opacity: 1, filter: "blur(0)" },
        { transform: `translateY(${off}%) scale(0.92)`, opacity: 0, filter: "blur(4px)" },
      ],
      opts,
    );
  }

  function render(el, value) {
    const str = pad(value);
    const prev = el.dataset.value;
    if (prev === str) return;
    el.dataset.value = str;
    el.setAttribute("aria-label", str);

    if (!prev || prev.length !== str.length) {
      el.replaceChildren(...[...str].map(buildSlot));
      return;
    }
    [...str].forEach((ch, i) => {
      if (prev[i] !== ch) swap(el.children[i], ch);
    });
  }

  function tick() {
    const diff = WEDDING.getTime() - Date.now();
    if (diff <= 0) {
      Object.values(els).forEach((el) => render(el, 0));
      clearInterval(window.__countdownTimer);
      return;
    }
    const total = Math.floor(diff / 1000);
    render(els.days, Math.floor(total / 86400));
    render(els.hours, Math.floor((total % 86400) / 3600));
    render(els.minutes, Math.floor((total % 3600) / 60));
    render(els.seconds, total % 60);
  }

  tick();
  window.__countdownTimer = setInterval(tick, 1000);
}
function setupCountdownAnimation() {
  if (!window.gsap || !window.ScrollTrigger) return;

  const mm = gsap.matchMedia();
  mm.add("(prefers-reduced-motion: no-preference)", () => {
    const wrap = document.querySelector(".count-wrap");
    if (!wrap) return;

    const img = wrap.querySelector(".main-image > img");
    const texts = wrap.querySelectorAll(".sub-text-item");
    const items = wrap.querySelectorAll(".sub-item");
    const labels = wrap.querySelectorAll(".title-count");
    const nums = wrap.querySelectorAll(".time-count");

    gsap
      .timeline({ scrollTrigger: { trigger: wrap, start: "top 80%", once: true } })
      // ảnh mở dần từ trên xuống + zoom nhẹ
      .from(img, { clipPath: "inset(0 0 100% 0)", duration: 1.3, ease: "power3.out" })
      .from(img, { scale: 1.25, duration: 1.8, ease: "power2.out" }, "<")
      .fromTo(
        ".count-wrap .sub-text",
        { "--shade": 0 },
        { "--shade": 1, duration: 0.8, ease: "power1.out" },
        "-=0.9",
      )
      // 4 từ "Forever Starts Very Soon" hiện lần lượt
      .from(texts, { y: 26, opacity: 0, duration: 0.9, ease: "power2.out", stagger: 0.18 }, "-=0.9")
      // 4 ô đếm nổi lên
      .from(items, { y: 60, opacity: 0, scale: 0.9, duration: 0.9, ease: "back.out(1.6)", stagger: 0.12 }, "-=0.5")
      .from(labels, { opacity: 0, duration: 0.6, stagger: 0.1 }, "-=0.6")
      .from(nums, { opacity: 0, scale: 0.8, duration: 0.7, ease: "back.out(2)", stagger: 0.1 }, "<");
  });
}

function startImageWave(figure) {
  if (!figure || figure.querySelector(".wave")) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const d = "M0 60 Q75 20 150 60 T300 60 T450 60 T600 60 T750 60 T900 60 T1050 60 T1200 60 V120 H0 Z";
  const svg = (cls) =>
    `<svg class="${cls}" viewBox="0 0 1200 120" preserveAspectRatio="none" aria-hidden="true"><path d="${d}"/></svg>`;

  const wave = document.createElement("div");
  wave.className = "wave";
  wave.setAttribute("aria-hidden", "true");
  wave.innerHTML = svg("wave-back") + svg("wave-front");
  figure.append(wave);

  const back = wave.querySelector(".wave-back");
  const front = wave.querySelector(".wave-front");

  gsap.set(wave, { yPercent: 100 });

  const tweens = [
    gsap.to(back, { xPercent: -50, duration: 7, ease: "none", repeat: -1 }),
    gsap.fromTo(front, { xPercent: -50 }, { xPercent: 0, duration: 5, ease: "none", repeat: -1 }),
    // sóng dâng lên rồi rút xuống, nghỉ một nhịp rồi vỗ tiếp
    gsap.to(wave, {
      yPercent: 38,
      duration: 3.2,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      repeatDelay: 0.6,
    }),
  ];

  if (window.ScrollTrigger) {
    ScrollTrigger.create({
      trigger: figure,
      onToggle: (self) => tweens.forEach((t) => (self.isActive ? t.play() : t.pause())),
    });
  }
}
function setupRsvp() {
  const form = document.getElementById("rsvpForm");
  if (!form) return;

  const status = form.querySelector(".rsvp-status");
  const submit = form.querySelector(".rsvp-submit");
  const extra = form.querySelector("[data-when-attend]");
  const nameInput = document.getElementById("rsvpName");
  const thanks = document.getElementById("rsvpThanks");
  let previousBodyOverflow = "";
  let previousFocus = null;

  // chọn "không thể" thì ẩn ô nhà trai/gái và số người
  form.addEventListener("change", (e) => {
    if (e.target.name === "attend") extra.hidden = e.target.value === "no";
  });

  function closeThanks({ focusMessage = false } = {}) {
    thanks.hidden = true;
    document.body.style.overflow = previousBodyOverflow;
    form.elements.message.value = "";
    submit.disabled = false;
    status.textContent = "";

    if (focusMessage) form.elements.message.focus();
    else previousFocus?.focus();
  }

  thanks.addEventListener("click", (e) => {
    if (e.target === thanks || e.target.closest("[data-rsvp-close]")) closeThanks();
  });

  thanks.querySelector("[data-rsvp-again]")?.addEventListener("click", () => {
    closeThanks({ focusMessage: true });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !thanks.hidden) closeThanks();
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (form.elements.website.value) return; // bot

    const data = Object.fromEntries(new FormData(form));
    const guestName = (data.guestName || "").trim();
    if (!guestName) {
      status.textContent = "Bạn vui lòng nhập tên nhé.";
      nameInput.focus();
      return;
    }

    const attending = data.attend === "yes";
    const payload = {
      name: guestName,
      attend: attending ? "Tham dự" : "Không tham dự",
      side: attending ? data.side : "",
      guests: attending ? data.guests : "",
      message: (data.message || "").trim(),
    };

    if (!WEDDING_CONFIG.rsvpEndpoint) {
      status.textContent = "Chưa kết nối RSVP. Vui lòng cấu hình URL Google Apps Script trong WEDDING_CONFIG.";
      console.error("[rsvp] Chưa cấu hình WEDDING_CONFIG.rsvpEndpoint.");
      return;
    }

    submit.disabled = true;
    status.textContent = "Đang gửi...";

    try {
      await fetch(WEDDING_CONFIG.rsvpEndpoint, {
        method: "POST",
        mode: "no-cors",
        body: new URLSearchParams(payload),
      });

      thanks.querySelector(".rsvp-thanks-text").textContent = attending
        ? `${guestName} ơi, cảm ơn bạn đã phản hồi và chúng mình rất mong gặp bạn trong ngày vui.`
        : `${guestName} ơi, cảm ơn bạn đã gửi lời chúc. Chúng mình rất tiếc không được gặp bạn hôm đó.`;

      previousBodyOverflow = document.body.style.overflow;
      previousFocus = document.activeElement;
      document.body.style.overflow = "hidden";
      showRsvpThanks(thanks);
      thanks.querySelector("[data-rsvp-close]").focus();
    } catch (err) {
      console.error("[rsvp]", err);
      status.textContent = "Chưa gửi được, bạn thử lại giúp chúng mình nhé.";
      submit.disabled = false;
    }
  });
}

function showRsvpThanks(thanks) {
  thanks.hidden = false;
  if (!window.gsap) return;

  const card = thanks.querySelector(".rsvp-thanks-card");
  const q = (selector) => thanks.querySelector(selector);

  gsap.fromTo(thanks, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: "power1.out" });
  gsap
    .timeline()
    .from(card, { opacity: 0, y: 30, scale: 0.92, duration: 0.8, ease: "power3.out" })
    .from(q(".rsvp-thanks-seal"), { scale: 0, rotation: -180, duration: 0.9, ease: "back.out(2)" }, "-=0.3")
    .from(
      [q(".rsvp-thanks-kicker"), q(".rsvp-thanks-title")],
      { y: 16, opacity: 0, filter: "blur(4px)", duration: 0.7, stagger: 0.15 },
      "-=0.4",
    )
    .from(q(".rsvp-thanks-line"), { scaleX: 0, duration: 0.7, ease: "power2.out" }, "-=0.3")
    .from(q(".rsvp-thanks-text"), { y: 12, opacity: 0, duration: 0.7 }, "-=0.3");

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    for (let i = 0; i < 16; i++) {
      const petal = document.createElement("span");
      petal.className = "rsvp-petal";
      card.append(petal);
      gsap.fromTo(
        petal,
        { x: 0, y: 0, scale: gsap.utils.random(0.6, 1.2), rotation: gsap.utils.random(0, 360), opacity: 1 },
        {
          x: gsap.utils.random(-150, 150),
          y: gsap.utils.random(-30, 200),
          rotation: "+=" + gsap.utils.random(120, 360),
          opacity: 0,
          duration: gsap.utils.random(1.4, 2.4),
          delay: 0.5,
          ease: "power2.out",
          onComplete: () => petal.remove(),
        },
      );
    }
  }
}

function setupRsvpAnimation() {
  if (!window.gsap || !window.ScrollTrigger) return;

  const mm = gsap.matchMedia();
  mm.add("(prefers-reduced-motion: no-preference)", () => {
    const section = document.querySelector(".rsvp-section");
    if (!section) return;

    const intro = section.querySelector(".rsvp-intro");
    const fields = section.querySelectorAll(
      ".rsvp-form > *:not(.rsvp-hp):not(.rsvp-submit):not(.rsvp-status)",
    );

    gsap.from(intro, {
      y: 18,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: { trigger: intro, start: "top 88%", once: true },
    });

    gsap.from(fields, {
      y: 24,
      opacity: 0,
      duration: 0.7,
      ease: "power2.out",
      stagger: 0.1,
      scrollTrigger: { trigger: ".rsvp-form", start: "top 85%", once: true },
    });
  });
}

function setupCountdownNote() {
  if (!window.gsap || !window.ScrollTrigger || !window.SplitText) return;

  const mm = gsap.matchMedia();
  mm.add("(prefers-reduced-motion: no-preference)", () => {
    const note = document.querySelector(".count-note");
    if (!note) return;

    const line = note.querySelector(".count-note-line");
    const text = note.querySelector(".count-note-text");
    const date = note.querySelector(".count-note-date");

    document.fonts.ready.then(() => {
      const words = SplitText.create(text, { type: "words" });

      gsap
        .timeline({ scrollTrigger: { trigger: note, start: "top 90%", once: true } })
        .from(line, { scaleX: 0, duration: 0.9, ease: "power2.out" })
        .from(
          words.words,
          { opacity: 0, y: 14, filter: "blur(4px)", duration: 0.7, ease: "power2.out", stagger: 0.05 },
          "-=0.4",
        )
        .from(
          date,
          { opacity: 0, y: 10, letterSpacing: "0.1em", duration: 0.9, ease: "power2.out" },
          "-=0.3",
        );
    });
  });
}

function safeRun(fn) {
  try {
    fn();
  } catch (err) {
    console.error("[" + fn.name + "]", err);
  }
}

[
  setUpCountDown,
  setupWeddingDetails,
  setupEnvelope,
  setupMapLinks,
  setupRsvp,
].forEach(safeRun);

[
  setupAlbumCarousel,
  setupIconRotation,
  setupLoveLetterAnimation,
  setupFallingLeaves,
  setupInfoAnimation,
  setupBlockTitleAnimation,
  setupCountdownAnimation,
  setupCountdownNote,
  setupRsvpAnimation,
].forEach(whenOpened);
