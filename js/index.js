"use strict";

const wrapper = document.getElementById("js-wrapper");
const box = document.getElementById("js-box");
const body = document.getElementById("body");
const fragment = document.createDocumentFragment();
const articles = [];

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
  const profiles = datas.results;
  const article = document.createElement("article");
  article.classList.add("article");
  profiles.forEach((profile) => {
    const firstPageNumName = profile.name.firstPageNum;
    const lastName = profile.name.last;
    const gender = profile.gender;
    const email = profile.email;
    const phone = profile.phone;
    const thumbnail = profile.picture.thumbnail;
    const country = profile.location.country;
    const city = profile.location.city;

    const div = `<div class="article__box">
      <img src="${thumbnail}" width="120" height="120">
      <div class="article__box">
        <h2 id="js-name">Name:${firstPageNumName}&nbsp${lastName}</h2>
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

function addOption(select) {
  const selectOptions = [
    { val: "all", txt: "全て" },
    { val: "male", txt: "男性" },
    { val: "female", txt: "女性" },
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

function resetSort() {
  const sortButton = document.getElementById("sortButton");
  sortButton.value = "all";
}

function showPaginationElement() {
  const paginationList = document.createElement("ul");
  paginationList.id = "js-pagination";
  paginationList.classList.add("pagination");

  const paginationElement = `
    <li id="js-prev" class="prev"></li>
      <p id="js-count" class="count"></p>
    <li id="js-next" class="next"></li>
   `;

  paginationList.innerHTML = paginationElement;
  return paginationList;
}

const showPagination = () => {
  wrapper.appendChild(showPaginationElement());

  let page = 1; // 現在のページ（何ページ目か）
  const step = 5; // ステップ数（1ページに表示する項目数）

  // 現在のページ/全ページ を表示
  function showPageCount(page, step) {
    const pageCount = document.getElementById("js-count");
    // 全ページ数 menuリストの総数/ステップ数の余りの有無で場合分け
    const totalPageCount = articles.length % step == 0 ? articles.length / step : Math.floor(articles.length / step) + 1;
    pageCount.innerText = page + "/" + totalPageCount + "ページ";
  }

  // ページを表示
  function showProfiles(page, step) {
    while (box.lastChild) {
      box.removeChild(box.lastChild);
    }

    const firstPageNum = (page - 1) * step + 1;
    const lastPageNum = page * step;

    articles.forEach((item, i) => {
      if (i < firstPageNum - 1 || i > lastPageNum - 1) return;
      createProfile(item);
      box.appendChild(fragment);
    });
    showPageCount(page, step);
  }

  // 最初に1ページ目を表示
  showProfiles(page, step);

  const prevBtn = document.getElementById("js-prev");
  prevBtn.addEventListener("click", () => {
    if (page <= 1) return;
    page = page - 1;
    resetSort();
    showProfiles(page, step);
  });

  const nextBtn = document.getElementById("js-next");
  nextBtn.addEventListener("click", () => {
    if (page >= articles.length / step) return;
    page = page + 1;
    resetSort();
    showProfiles(page, step);
  });
};

function showLoading() {
  const img = document.createElement("img");
  img.classList.add("loading");
  img.id = "js-loading";
  img.src = "../img/loading-circle.gif";
  body.appendChild(img);
}

function removeLoading() {
  const loadingImage = document.getElementById("js-loading");
  loadingImage.remove();
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

function insertSelectBox() {
  wrapper.insertBefore(createSelectBox(), box);
}

function sortGenderHandler(e) {
  const articles = document.querySelectorAll(".article");
  const optionValue = e.target.value;
  articles.forEach((article) => {
    const articleGender = article.querySelectorAll(".gender")[0].dataset.gender;
    sortGender(article, articleGender, optionValue);
  });
}

async function init(requestCount) {
  showLoading();
  for (let i = 0; i < requestCount; i++) {
    const datas = await fetchData();
    articles.push(datas);

    if (articles.length === requestCount) {
      removeLoading();
    }
  }

  showPagination(articles);
  insertSelectBox();

  const sortButton = document.getElementById("sortButton");
  sortButton.addEventListener("change", (e) => {
    sortGenderHandler(e);
  });
}

init(10);
