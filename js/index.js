"use strict";

const wrapper = document.getElementById("js-wrapper");
const box = document.getElementById("js-box");
const body = document.getElementById("body");
const fragment = document.createDocumentFragment();

async function request() {
  const url = "https://randomuser.me/api/";
  const response = await fetch(url);
  return response.json();
}

async function fetchData() {
  let results;
  try {
    results = await request();
  } catch (error) {
    results = [];
    console.log(error);
  } finally {
    return results;
  }
}

function createProfile(datas) {
  const article = document.createElement("article");
  article.classList.add("article");
  datas.forEach((data) => {
    // console.log(data);
    const firstName = data.name.first;
    const lastName = data.name.last;
    const gender = data.gender;
    const email = data.email;
    const phone = data.phone;
    const thumbnail = data.picture.thumbnail;
    const country = data.location.country;
    const city = data.location.city;

    const div = `<div class="article__box">
      <img src="${thumbnail}" width="120" height="120">
      <div class="article__box">
        <h2 id="js-name">Name:${firstName}&nbsp${lastName}</h2>
        <p class="gender" id="js-gender" data-gender="${gender}">Gender:${gender}</p>
        <p id="js-email">Email:${email}</p>
        <p id="js-phone">Phone:${phone}</p>
        <p id="js-country">Country:${country}</p>
        <p id="js-city">City:${city}</p>
      </div>
    </div>`;

    article.innerHTML = div;
    return fragment.appendChild(article);
  });
}

function createProfileHandler(datas) {
  const personalDatas = datas.results;
  createProfile(personalDatas);
}

function addOption(select) {
  const selectOptions = [
    { val: "male", txt: "男性" },
    { val: "female", txt: "女性" },
    { val: "all", txt: "全て" },
  ];

  selectOptions.forEach((selectOption) => {
    let option = document.createElement("option");
    option.value = selectOption.val;
    option.text = selectOption.txt;
    select.appendChild(option);
  });
}

function createSelectBox() {
  const select = document.createElement("select");
  const p = document.createElement("p");
  p.textContent = "性別で絞る";
  select.id = "sortButton";
  addOption(select);
  p.appendChild(select);
  return p;
}

function createPagenation() {
  const ul = document.createElement("ul");
}

function showLoading() {
  const img = document.createElement("img");
  img.src = "../img/loading-circle.gif";
  body.appendChild(img);
}

function sortGender(article, gender, option) {
  if (option === "all") {
    article.classList.remove("hide");
  } else if (option !== gender) {
    article.classList.add("hide");
  } else {
    article.classList.remove("hide");
  }
}

async function init() {
  showLoading();
  for (let i = 0; i < 20; i++) {
    const datas = await fetchData();
    createProfileHandler(datas);
  }

  wrapper.insertBefore(createSelectBox(), box);
  // wrapper.appendChild(createPagenation());
  box.appendChild(fragment);

  const articles = document.querySelectorAll(".article");
  const sortButton = document.getElementById("sortButton");

  sortButton.addEventListener("change", (e) => {
    const optionValue = e.target.value;
    Array.from(articles).forEach((article) => {
      const articleGender = article.querySelectorAll(".gender")[0].dataset.gender;
      sortGender(article, articleGender, optionValue);
    });
  });
}

init();
