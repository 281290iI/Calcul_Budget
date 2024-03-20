// Data

const budget = [];

// DOM

const form = document.querySelector("#form");
const type = document.querySelector("#type");
const title = document.querySelector("#title");
const value = document.querySelector("#value");
const incomesList = document.querySelector("#incomes-list");
const expensesList = document.querySelector("#expenses-list");
const budgetEl = document.querySelector("#budget");
const totalIncomeEl = document.querySelector("#total-income");
const totalExpenseEl = document.querySelector("#total-expense");
const percentWrapper = document.querySelector("#expense-percents-wrapper");
const monthEl = document.querySelector("#month");
const yearEl = document.querySelector("#year");

// Function

const priceFormatter = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function insertTestData() {
  const testData = [
    { type: "inc", title: "Фриланс", value: 400 },
    { type: "inc", title: "ЗП", value: 700 },
    { type: "inc", title: "Бизнес", value: 900 },
    { type: "inc", title: "Услуги гида", value: 100 },
    { type: "exp", title: "Ресницы", value: 50 },
    { type: "exp", title: "Фитнес", value: 200 },
    { type: "exp", title: "Продукты", value: 400 },
  ];

  function getRendomInt(max) {
    return Math.floor(Math.random() * max);
  }

  const randomIndex = getRendomInt(testData.length);

  // Get random index от 0 до testData(length-1)

  const randomData = testData[randomIndex];
  type.value = randomData.type;
  title.value = randomData.title;
  value.value = randomData.value;
}

function clearForm() {
  form.reset();
}

function calcBudget() {
  // Считаем доходы
  const totalIncome = budget.reduce(function (total, element) {
    if (element.type === "inc") {
      return total + element.value;
    } else {
      return total;
    }
  }, 0);

  // Считаем расход
  const totalExpense = budget.reduce(function (total, element) {
    if (element.type === "exp") {
      return total + element.value;
    } else {
      return total;
    }
  }, 0);

  const totalBudget = totalIncome - totalExpense;

  let expensePercent = 0;
  if (totalIncome) {
    expensePercent = Math.round((totalExpense * 100) / totalIncome);
  }

  budgetEl.innerHTML = priceFormatter.format(totalBudget);
  totalIncomeEl.innerHTML = "+ " + priceFormatter.format(totalIncome);
  totalExpenseEl.innerHTML = "- " + priceFormatter.format(totalExpense);

  if (expensePercent) {
    const html = `<div class="badge">${expensePercent}%</div>`;
    percentWrapper.innerHTML = html;
  } else {
    percentWrapper.innerHTML = "";
  }

  //percentWrapper.innerHTML =
}

function displayMonth() {
  const now = new Date();
  const year = now.getFullYear(); // 2024

  const timeFormatter = new Intl.DateTimeFormat("ru-RU", {
    month: "long",
  });
  const month = timeFormatter.format(now);
  monthEl.innerHTML = month;
  yearEl.innerHTML = year;
}
// Actions
displayMonth();
insertTestData();
calcBudget();

// Добавление
form.addEventListener("submit", function (e) {
  e.preventDefault();

  // Проверка формы на заполненность
  if (title.value.trim() === "") {
    title.classList.add("form__input--error");
    return;
  } else {
    title.classList.remove("form__input--error");
  }

  if (value.value.trim() === "" || +value.value <= 0) {
    value.classList.add("form__input--error");
    return;
  } else {
    value.classList.remove("form__input--error");
  }

  // Расчёт id
  let id = 1;
  if (budget.length > 0) {
    // Последний элемент
    const lastElement = budget[budget.length - 1];

    // ID последнего элемента
    const lastElId = lastElement.id;

    //Сформировать новый id = старый + 1
    id = lastElId + 1;
  }

  // Формируем запись
  const record = {
    id: id,
    type: type.value,
    title: title.value.trim(),
    value: +value.value,
  };

  // Добавляем запись вданные
  budget.push(record);

  // Отображаем доход на странице
  if (record.type === "inc") {
    const html = `<li data-id='${
      record.id
    }' class="budget-list__item item item--income">
    <div class="item__title">${record.title}</div>
    <div class="item__right">
        <div class="item__amount">+ ${priceFormatter.format(record.value)}</div>
        <button class="item__remove">
            <img src="./img/circle-green.svg" alt="delete" />
        </button>
    </div>
</li>`;
    incomesList.insertAdjacentHTML("afterbegin", html);
  }

  // Отображаем расход на странице
  if (record.type === "exp") {
    const html = `<li data-id='${
      record.id
    }' class="budget-list__item item item--expense">
    <div class="item__title">${record.title}</div>
    <div class="item__right">
        <div class="item__amount">
            - ${priceFormatter.format(record.value)}
        </div>
        <button class="item__remove">
            <img src="./img/circle-red.svg" alt="delete" />
        </button>
    </div>
</li>`;

    expensesList.insertAdjacentHTML("afterbegin", html);
  }

  // Пересчитать бюджет
  calcBudget();
  clearForm();
  insertTestData();
});

//Удаление
document.body.addEventListener("click", function (e) {
  // Кнопка Удалить
  if (e.target.closest("button.item__remove")) {
    const recordElement = e.target.closest("li.budget-list__item");
    const id = +recordElement.dataset.id;

    const index = budget.findIndex(function (elem) {
      if (id === elem.id) {
        return true;
      }
    });

    // Remove from array
    budget.splice(index, 1);

    //Remove from page
    recordElement.remove();

    // Пересчитать бюджет
    calcBudget();
  }
});
