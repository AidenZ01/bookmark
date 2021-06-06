const modal = document.querySelector("#modal");
const modalShow = document.querySelector("#show-modal");
const modalClose = document.querySelector("#close-modal");
const bookmarkForm = document.querySelector("#bookmark-form");
const websiteNameEl = document.querySelector("#website-name");
const websiteUrlEl = document.querySelector("#website-url");
const bookmarksContainer = document.querySelector("#bookmarks-container");

let bookmarks = {};

// show modal
function showModal() {
  modal.classList.add("show-modal");
  websiteNameEl.focus();
}

modalShow.addEventListener("click", showModal);
modalClose.addEventListener("click", () =>
  modal.classList.remove("show-modal")
);
window.addEventListener("click", (e) =>
  e.target === modal ? modal.classList.remove("show-modal") : false
);

// handle data from form
function storeBookmark(e) {
  e.preventDefault();
  const nameValue = websiteNameEl.value;
  let urlValue = websiteUrlEl.value;
  if (!urlValue.includes("http://" && "https://")) {
    urlValue = `https://${urlValue}`;
  }
  if (!validate(nameValue, urlValue)) {
    return false;
  }
  const bookmark = {
    name: nameValue,
    url: urlValue,
  };
  bookmarks[urlValue] = bookmark;
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  fetchBookmarks();
  bookmarkForm.reset();
  websiteNameEl.focus();
  modal.classList.remove("show-modal");
}

// validate form
function validate(name, url) {
  const expression =
    /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
  const regex = new RegExp(expression);
  if (!name || !url) {
    alert("Please submit values for both fields.");
    return;
  }

  if (!url.trim().match(regex)) {
    alert("Please provide a valid web address.");
    return false;
  }
  return true;
}

// build bookmarks DOM
function buildBookmarks() {
  bookmarksContainer.textContent = "";
  Object.keys(bookmarks).forEach((id) => {
    const { name, url } = bookmarks[id];
    const item = document.createElement("div");
    item.classList.add("item");
    const closeIcon = document.createElement("i");
    closeIcon.classList.add("fas", "fa-times-circle");
    closeIcon.setAttribute("title", "Delete Bookmark");
    closeIcon.setAttribute("onclick", `deleteBookmark('${id}')`);
    const linkInfo = document.createElement("div");
    linkInfo.classList.add("name");
    const favicon = document.createElement("img");
    favicon.setAttribute(
      "src",
      `https://s2.googleusercontent.com/s2/favicons?domain=${url}`
    );
    favicon.setAttribute("alt", "Favicon");
    const link = document.createElement("a");
    link.setAttribute("href", `${url}`);
    link.setAttribute("target", "_blank");
    link.textContent = name;
    linkInfo.append(favicon, link);
    item.append(closeIcon, linkInfo);
    bookmarksContainer.appendChild(item);
  });
}

//  fetch bookmarks
function fetchBookmarks() {
  if (localStorage.getItem("bookmarks")) {
    bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
  } else {
    const id = `https://www.google.com/`;
    (bookmarks[id] = {
      name: "Google",
      url: "https://www.google.com/",
    }),
      localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  }
  buildBookmarks();
}

// delete bookmark
function deleteBookmark(id) {
  // Loop through the bookmarks array
  if (bookmarks[id]) {
    delete bookmarks[id];
  }
  // Update bookmarks array in localStorage, re-populate DOM
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  fetchBookmarks();
}

bookmarkForm.addEventListener("submit", storeBookmark);

fetchBookmarks();
