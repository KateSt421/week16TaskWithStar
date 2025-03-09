const brandSelect = document.getElementById("brand");
const modelSelect = document.getElementById("model");
const engineInput = document.getElementById("engine");
const ownersGroup = document.getElementById("ownersGroup");
const resultDisplay = document.getElementById("priceDisplay");

const models = {
  Reno: ["Sandero", "Logan", "Duster"],
  Opel: ["Astra", "Insignia", "Mokka"],
  Mazda: ["Mazda3", "Mazda6", "CX-5"],
  Jaguar: ["F-Pace", "XE", "XF"],
};

// Обновление списка моделей в зависимости от выбранной марки
brandSelect.addEventListener("change", function () {
  const selectedBrand = this.value;

  modelSelect.innerHTML =
    '<option value="" disabled selected hidden>Выберите модель</option>';

  if (models[selectedBrand]) {
    models[selectedBrand].forEach((model) => {
      const option = document.createElement("option");
      option.value = model;
      option.textContent = model;
      modelSelect.appendChild(option);
    });
    modelSelect.disabled = false;
  } else {
    modelSelect.disabled = true;
  }

  calculatePrice();
});

// Отображение состояния автомобиля
document.querySelectorAll('input[name="condition"]').forEach((input) => {
  input.addEventListener("change", function () {
    if (this.value === "подержанный") {
      ownersGroup.style.display = "block";
    } else {
      ownersGroup.style.display = "none";
      document
        .querySelectorAll('input[name="owners"]')
        .forEach((owner) => (owner.checked = false));
    }
    calculatePrice();
  });
});

// Функция для расчета стоимости
function calculatePrice() {
  let price = 0;

  // Получаем значения
  const brand = brandSelect.value;
  const model = modelSelect.value;
  const fuelType = document.querySelector('input[name="fuel"]:checked')?.value;
  const engineVolume = parseFloat(engineInput.value);
  const condition = document.querySelector(
    'input[name="condition"]:checked'
  )?.value;

  // Проверка объема двигателя
  function checkEngineVolume(engineVolume) {
    // Проверяем, находится ли объем двигателя в допустимом диапазоне
    if (engineVolume < 1.1 || engineVolume > 3.5) {
      document.getElementById("engineError").style.display = "block";
      return; // Завершаем выполнение функции
    }

    // Если да, то добавляем к цене объем двигателя, умноженный на 100000
    price += engineVolume * 100000;
  }

  // Вызов функции с заданным объемом двигателя
  checkEngineVolume(engineVolume);

  // Добавляем стоимость в зависимости от марки и модели
  if (brand === "Reno") price += 500000;
  else if (brand === "Opel") price += 600000;
  else if (brand === "Mazda") price += 700000;
  else if (brand === "Jaguar") price += 1000000;

  if (condition === "подержанный") {
    const owners = document.querySelector(
      'input[name="owners"]:checked'
    )?.value;
    if (owners === "более 3-х")
      price -= 100000; // Скидка для более чем трех владельцев
    else price -= 50000; // Скидка для одного-двух владельцев
  }

  // Добавляем стоимость в зависимости от типа топлива
  if (fuelType === "электричество") price += 200000; // Доплата за электрические автомобили

  resultDisplay.textContent = price.toLocaleString(); // Обновляем отображение цены
}

// Обработчик изменения для всех элементов
document.querySelectorAll("select, input").forEach((input) => {
  input.addEventListener("change", calculatePrice);
});

// Кнопка сброса
document.getElementById("resetButton").addEventListener("click", function () {
  brandSelect.selectedIndex = 0;
  modelSelect.innerHTML =
    '<option value="" disabled selected hidden>Сначала выберите марку</option>';
  modelSelect.disabled = true;

  document
    .querySelectorAll("input[type=radio]")
    .forEach((input) => (input.checked = false));

  engineInput.value = "";

  ownersGroup.style.display = "none";

  resultDisplay.textContent = "0"; // Сброс стоимости
});
