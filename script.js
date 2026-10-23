const controls = [
  {
    key: "callVolume",
    number: document.querySelector("#call-volume-number"),
    range: document.querySelector("#call-volume-range"),
  },
  {
    key: "costPerCall",
    number: document.querySelector("#cost-per-call-number"),
    range: document.querySelector("#cost-per-call-range"),
  },
  {
    key: "resolutionRate",
    number: document.querySelector("#resolution-rate-number"),
    range: document.querySelector("#resolution-rate-range"),
  },
];

const totalBenefit = document.querySelector("#total-benefit");
const yearValueElements = [1, 2, 3].map((year) =>
  document.querySelector(`#year-${year}-value`),
);
const yearBarElements = [1, 2, 3].map((year) =>
  document.querySelector(`#year-${year}-bar`),
);

// These rates model a gradual rollout. With the default inputs they produce
// approximately $854K, $4.17M, and $8.73M, matching the reference design.
const ADOPTION_RATES = [0.03795556, 0.18533333, 0.388];
const DEFAULT_RESOLUTION_RATE = 70;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function readInputs() {
  return Object.fromEntries(
    controls.map(({ key, number }) => [key, Number(number.value)]),
  );
}

function formatCurrency(value) {
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`;
  }

  if (value >= 1_000) {
    return `$${Math.round(value / 1_000)}K`;
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function setSliderFill(range) {
  const min = Number(range.min);
  const max = Number(range.max);
  const value = Number(range.value);
  const percent = ((value - min) / (max - min)) * 100;
  range.style.setProperty("--fill", `${percent}%`);
}

function calculateBenefits({ callVolume, costPerCall, resolutionRate }) {
  const annualCallCost = callVolume * costPerCall;
  const resolutionAdjustment = resolutionRate / DEFAULT_RESOLUTION_RATE;

  return ADOPTION_RATES.map(
    (adoptionRate) => annualCallCost * adoptionRate * resolutionAdjustment,
  );
}

function render() {
  const yearlyBenefits = calculateBenefits(readInputs());
  const total = yearlyBenefits.reduce((sum, value) => sum + value, 0);
  const chartMaximum = Math.max(...yearlyBenefits, 1);

  totalBenefit.textContent = formatCurrency(total);

  yearlyBenefits.forEach((value, index) => {
    yearValueElements[index].textContent = formatCurrency(value);
    yearBarElements[index].style.height = `${Math.max((value / chartMaximum) * 100, 3)}%`;
  });
}

controls.forEach(({ number, range }) => {
  setSliderFill(range);

  range.addEventListener("input", () => {
    number.value = range.value;
    setSliderFill(range);
    render();
  });

  number.addEventListener("input", () => {
    if (number.value === "") return;

    const nextValue = clamp(Number(number.value), Number(number.min), Number(number.max));
    range.value = String(nextValue);
    setSliderFill(range);
    render();
  });

  number.addEventListener("change", () => {
    const fallbackValue = Number(range.value);
    const parsedValue = Number(number.value);
    const nextValue = Number.isFinite(parsedValue)
      ? clamp(parsedValue, Number(number.min), Number(number.max))
      : fallbackValue;

    number.value = String(nextValue);
    range.value = String(nextValue);
    setSliderFill(range);
    render();
  });
});

render();
