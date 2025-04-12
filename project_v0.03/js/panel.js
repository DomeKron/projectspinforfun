const characters = ["Воин", "Маг", "Ассасин", "Лучник", "Танк", "Хилер"];
const slotItems = document.getElementById("slot-items");
const result = document.getElementById("result");
const slotHeight = 100;
let spinning = false;
let interval;
let currentOffset = 0;

// Звуки
const startSounds = [
  new Audio("../assets/sounds/start_spin/S1.mp3"),
  new Audio("../assets/sounds/start_spin/S2.mp3"),
  new Audio("../assets/sounds/start_spin/S3.mp3"),
];
const scrollSounds = [
  new Audio("../assets/sounds/spin/k1.mp3"),
  new Audio("../assets/sounds/spin/k4.mp3"),
];

function getRandomSound(soundsArray) {
  return soundsArray[Math.floor(Math.random() * soundsArray.length)];
}

function getRandomCharacter() {
  return characters[Math.floor(Math.random() * characters.length)];
}

function createSlotItem(text) {
  const div = document.createElement("div");
  div.className = "slot-item";
  div.textContent = text;
  return div;
}

function fillInitialItems() {
  for (let i = 0; i < 6; i++) {
    const item = createSlotItem(getRandomCharacter());
    slotItems.appendChild(item);
  }
}

function startSpinning() {
  spinning = true;
  result.textContent = "";

  const startSound = getRandomSound(startSounds);
  startSound.play();

  const scrollSound = getRandomSound(scrollSounds);

  let transitionDuration = 1.0;
  slotItems.style.transition = `transform ${transitionDuration}s linear`;

  let speedUp = setInterval(() => {
    if (transitionDuration > 0.3) {
      transitionDuration -= 0.1;
      slotItems.style.transition = `transform ${transitionDuration}s linear`;
    } else {
      clearInterval(speedUp);
    }
  }, 100);

  interval = setInterval(() => {
    const newItem = createSlotItem(getRandomCharacter());
    slotItems.appendChild(newItem);
    currentOffset += slotHeight;
    slotItems.style.transform = `translateY(-${currentOffset}px)`;

    if (scrollSound) {
      scrollSound.currentTime = 0;
      scrollSound.play();
    }
  }, 100);
}

function stopSpinning() {
  spinning = false;
  clearInterval(interval);

  requestAnimationFrame(() => {
    const container = document.querySelector(".slot-machine-container");
    const containerRect = container.getBoundingClientRect();
    const centerY = containerRect.top + containerRect.height / 2;

    const items = document.querySelectorAll(".slot-item");
    let closestItem = null;
    let smallestDistance = Infinity;

    items.forEach(item => {
      const rect = item.getBoundingClientRect();
      const itemCenter = rect.top + rect.height / 2;
      const distance = Math.abs(centerY - itemCenter);

      if (distance < smallestDistance) {
        smallestDistance = distance;
        closestItem = item;
      }
    });

    if (closestItem) {
      const offsetY = closestItem.offsetTop;
      currentOffset = offsetY - (containerRect.height / 2 - slotHeight / 2);
      slotItems.style.transition = 'transform 0.4s ease-out';
      slotItems.style.transform = `translateY(-${currentOffset}px)`;

      setTimeout(() => {
        result.textContent = `🎉 Выпало: ${closestItem.textContent}`;
      }, 400);
    }
  });
}

document.getElementById("slot-machine").addEventListener("click", () => {
  if (spinning) {
    stopSpinning();
  } else {
    startSpinning();
  }
});

fillInitialItems();