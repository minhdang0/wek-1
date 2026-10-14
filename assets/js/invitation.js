const WEDDING_CONFIG = {
  brideName: "Tên Cô Dâu",
  groomName: "Tên Chú Rể",
  brideFamily: "Ông/Bà [Tên cha mẹ cô dâu]",
  groomFamily: "Ông/Bà [Tên cha mẹ chú rể]",
  receptionTime: "",
  ceremonyTime: "12:00",
  venueName: "",
  venueAddress: "",
  giftQrImage: "",
};

const WEDDING = new Date(2050, 4, 20, 12, 0, 0);
const WISHES_KEY = "wedding-invitation-wishes";
const RSVP_KEY = "wedding-invitation-rsvps";

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
  setText('[data-family="bride"]', WEDDING_CONFIG.brideFamily);
  setText('[data-family="groom"]', WEDDING_CONFIG.groomFamily);
  setText("[data-wedding-weekday]", vietnameseWeekday(WEDDING));

  const dateLabel = `${vietnameseWeekday(WEDDING)} · ${String(
    WEDDING.getDate(),
  ).padStart(
    2,
    "0",
  )}.${String(WEDDING.getMonth() + 1).padStart(2, "0")}.${WEDDING.getFullYear()}`;
  setText("[data-wedding-date]", dateLabel);

  setText(
    '[data-time="reception"]',
    WEDDING_CONFIG.receptionTime || "Vui lòng cập nhật",
  );
  setText(
    '[data-time="ceremony"]',
    WEDDING_CONFIG.ceremonyTime || "Vui lòng cập nhật",
  );
  setText(
    "[data-venue-name]",
    WEDDING_CONFIG.venueName || "Địa điểm tổ chức sẽ được cập nhật",
  );
  setText(
    "[data-venue-address]",
    WEDDING_CONFIG.venueAddress || "Vui lòng quay lại xem thông tin địa chỉ.",
  );

  if (WEDDING_CONFIG.giftQrImage) {
    document.getElementById("gift-qr-image").src = WEDDING_CONFIG.giftQrImage;
    document.getElementById("gift-qr-card").hidden = false;
    setText("#gift-message", "Quét mã QR để gửi lời chúc mừng đến gia đình.");
  }

  if (WEDDING_CONFIG.venueName && WEDDING_CONFIG.venueAddress) {
    const directions = document.getElementById("directions-link");
    const query = encodeURIComponent(
      `${WEDDING_CONFIG.venueName}, ${WEDDING_CONFIG.venueAddress}`,
    );
    directions.href = `https://www.google.com/maps/search/?api=1&query=${query}`;
    directions.target = "_blank";
    directions.rel = "noopener noreferrer";
    directions.removeAttribute("aria-disabled");
    directions.classList.remove("is-disabled");
  }
}

function renderCalendar() {
  const calendar = document.getElementById("calendar");
  const weekdays = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  const firstDay = new Date(
    WEDDING.getFullYear(),
    WEDDING.getMonth(),
    1,
  ).getDay();
  const daysInMonth = new Date(
    WEDDING.getFullYear(),
    WEDDING.getMonth() + 1,
    0,
  ).getDate();

  weekdays.forEach((weekday) => {
    const cell = document.createElement("span");
    cell.className = "calendar-cell is-weekday";
    cell.textContent = weekday;
    calendar.append(cell);
  });

  for (let index = 0; index < firstDay; index += 1) {
    const spacer = document.createElement("span");
    spacer.className = "calendar-cell";
    spacer.setAttribute("aria-hidden", "true");
    calendar.append(spacer);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const cell = document.createElement("span");
    cell.className = "calendar-cell";
    cell.textContent = String(day);
    if (day === WEDDING.getDate()) {
      cell.classList.add("is-wedding-day");
      cell.setAttribute("aria-label", `${day} tháng 5, ngày cưới`);
    }
    calendar.append(cell);
  }
}

function updateCountdown() {
  const remaining = WEDDING.getTime() - Date.now();
  const secondsLeft = Math.max(0, Math.floor(remaining / 1000));
  const values = [
    Math.floor(secondsLeft / 86400),
    Math.floor((secondsLeft % 86400) / 3600),
    Math.floor((secondsLeft % 3600) / 60),
    secondsLeft % 60,
  ];
  ["days", "hours", "minutes", "seconds"].forEach((unit, index) => {
    document.getElementById(`count-${unit}`).textContent = String(
      values[index],
    );
  });
}

function announce(element, message) {
  element.textContent = message;
}

function readRecords(key, statusElement) {
  let stored;
  try {
    stored = localStorage.getItem(key);
  } catch (error) {
    if (!(error instanceof DOMException)) throw error;
    announce(statusElement, "Trình duyệt không cho phép đọc dữ liệu đã lưu.");
    return null;
  }

  if (!stored) return [];

  let records;
  try {
    records = JSON.parse(stored);
  } catch (error) {
    if (!(error instanceof SyntaxError)) throw error;
    announce(statusElement, "Dữ liệu đã lưu bị lỗi và không thể hiển thị.");
    return null;
  }
  if (!Array.isArray(records)) {
    announce(statusElement, "Dữ liệu đã lưu không đúng định dạng.");
    return null;
  }
  return records;
}

function saveRecord(key, record, statusElement) {
  const records = readRecords(key, statusElement);
  if (!records) return false;
  records.unshift(record);
  try {
    localStorage.setItem(key, JSON.stringify(records));
    return true;
  } catch (error) {
    if (!(error instanceof DOMException)) throw error;
    announce(
      statusElement,
      "Trình duyệt không thể lưu dữ liệu. Hãy bật bộ nhớ trang web rồi thử lại.",
    );
    return false;
  }
}

function renderWishes() {
  const status = document.getElementById("wish-status");
  const list = document.getElementById("wish-list");
  const wishes = readRecords(WISHES_KEY, status);
  if (!wishes) return;
  list.replaceChildren();

  wishes.forEach((wish) => {
    const item = document.createElement("article");
    item.className = "wish-item";
    const name = document.createElement("strong");
    name.textContent = wish.name;
    const message = document.createElement("p");
    message.textContent = wish.message;
    item.append(name, message);
    list.append(item);
  });
}

function setupForms() {
  const rsvpForm = document.getElementById("rsvp-form");
  const rsvpStatus = document.getElementById("rsvp-status");
  rsvpForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(rsvpForm);
    const attending = formData.get("attendance") === "yes";
    const saved = saveRecord(
      RSVP_KEY,
      {
        name: String(formData.get("name")).trim(),
        attendance: attending ? "yes" : "no",
        createdAt: new Date().toISOString(),
      },
      rsvpStatus,
    );
    if (!saved) return;
    rsvpForm.reset();
    announce(rsvpStatus, "Cảm ơn bạn, xác nhận đã được lưu trên thiết bị này.");
  });

  const wishForm = document.getElementById("wish-form");
  const wishStatus = document.getElementById("wish-status");
  wishForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(wishForm);
    const saved = saveRecord(
      WISHES_KEY,
      {
        name: String(formData.get("name")).trim(),
        message: String(formData.get("message")).trim(),
        createdAt: new Date().toISOString(),
      },
      wishStatus,
    );
    if (!saved) return;
    wishForm.reset();
    announce(wishStatus, "Cảm ơn bạn, lời chúc đã được lưu trên thiết bị này.");
    renderWishes();
  });

  renderWishes();
}

function setupEnvelopeAndMusic() {
  const screen = document.getElementById("opening-screen");
  const envelope = document.querySelector(".envelope");
  const openButton = document.getElementById("open-invitation");
  const content = document.getElementById("invitation-content");
  const audio = document.getElementById("bg-music");
  const musicButton = document.getElementById("music-toggle");

  async function playMusic() {
    try {
      await audio.play();
      musicButton.textContent = "Tắt nhạc";
      musicButton.setAttribute("aria-pressed", "true");
      musicButton.removeAttribute("title");
    } catch (error) {
      musicButton.textContent = "Không phát được nhạc";
      musicButton.setAttribute("aria-pressed", "false");
      musicButton.title = "Tệp nhạc không được trình duyệt này hỗ trợ.";
    }
  }

  openButton.addEventListener("click", () => {
    envelope.classList.add("is-opening");
    content.inert = false;
    document.body.classList.remove("is-closed");
    screen.classList.add("is-open");
    playMusic();
    window.setTimeout(() => screen.remove(), 550);
  });

  musicButton.addEventListener("click", async () => {
    if (!audio.paused) {
      audio.pause();
      musicButton.textContent = "Bật nhạc";
      musicButton.setAttribute("aria-pressed", "false");
      return;
    }
    await playMusic();
  });
}

function setupLoveLetterAnimation() {
  if (!window.gsap || !window.ScrollTrigger || !window.SplitText) return;

  document.fonts.ready.then(() => {
    // Tiêu đề: từng chữ nảy lên
    const title = SplitText.create(".love-letter .section-title", {
      type: "chars",
    });
    gsap.from(title.chars, {
      y: 40,
      rotation: 8,
      opacity: 0,
      duration: 0.9,
      ease: "back.out(2)",
      stagger: 0.04,
      scrollTrigger: {
        trigger: ".love-letter .section-title",
        start: "top 85%",
      },
    });

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
setupWeddingDetails();
renderCalendar();
updateCountdown();
window.setInterval(updateCountdown, 1000);
setupForms();
setupLoveLetterAnimation();
setupEnvelopeAndMusic();
