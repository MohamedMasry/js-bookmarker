//Global Variables
var siteName = document.getElementById("siteName");
var siteUrl = document.getElementById("siteUrl");
var websitesTable = document.getElementById("websitesTable");

var searchValue = document.getElementById("searchProd");

var siteNameInvalid = document.getElementById("siteNameInvalid");
var siteUrlInvalid = document.getElementById("siteUrlInvalid");

var addBtn = document.getElementById("addBtn");
var updateBtn = document.getElementById("updateBtn");
var BUTTONS = document.querySelectorAll("button");
var btnsArray = Array.from(BUTTONS);

var errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
var successModal = new bootstrap.Modal(document.getElementById('successModal'));

var nameRegex = /^[\p{L}\u0600-\u06FF0-9]+\s*(?:[\p{L}\u0600-\u06FF0-9]+\s*){2,}$/u;
var urlRegex = /^(?:https?:\/\/)?(?:www\.)?(?!www\.)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/|[a-zA-Z0-9.-])*$/;

var bookmark;
var sitesList = [];

if (localStorage.getItem("bookmarks") != null) {
    sitesList = JSON.parse(localStorage.getItem("bookmarks"));
    displayBookmarks();
}

var nameValid;
var urlValid;

////EVENTS
siteName.addEventListener("keyup", function () {
    nameValid = nameRegex.test(siteName.value);
    if (!nameValid) {
        siteName.classList.remove("is-valid")
        siteName.classList.add("is-invalid")
        siteNameInvalid.classList.remove("d-none")
    }
    else {
        siteName.classList.remove("is-invalid")
        siteName.classList.add("is-valid")
        siteNameInvalid.classList.add("d-none")
    }
})

siteUrl.addEventListener("keyup", function () {
    urlValid = urlRegex.test(siteUrl.value);
    if (!urlValid) {
        siteUrl.classList.remove("is-valid")
        siteUrl.classList.add("is-invalid")
        siteUrlInvalid.classList.remove("d-none")
    }
    else {
        siteUrl.classList.remove("is-invalid")
        siteUrl.classList.add("is-valid")
        siteUrlInvalid.classList.add("d-none")
    }
})

function siteValid() {
    siteName.classList.remove("is-valid")
    siteNameInvalid.classList.add("d-none")

    siteUrl.classList.remove("is-valid")
    siteUrlInvalid.classList.add("d-none")

    if (!siteUrl.value.startsWith('http://') && !siteUrl.value.startsWith('https://')) {
        siteUrl.value = 'http://' + siteUrl.value;
    }
    if (siteUrl.value == "https://" || siteUrl.value == "http://") {
        siteUrl.value = "";
        addBookmark();
    }

}

//// adding Func
function addBookmark() {
    if (!nameValid || !urlValid) {
        errorModal.toggle();
        setTimeout(() => {
            errorModal.hide();
        }, 8000)
    }
    else if(nameValid == "" || urlValid == ""){
        errorModal.toggle();
        setTimeout(() => {
            errorModal.hide();
        }, 8000)
    }
    else {
        siteValid()

        successModal.toggle();
        setTimeout(() => {
            successModal.hide();
        }, 2000)


        bookmark = {
            name: siteName.value,
            url: siteUrl.value,
        }

        sitesList.push(bookmark);
        localStorage.setItem("bookmarks", JSON.stringify(sitesList))

        displayBookmarks()
        clearForm()
    }
}

//// Displaing Func
function displayBookmarks() {
    var container = "";

    for (var i = 0; i < sitesList.length; i++) {

        container += `
        <tr>
        <td>${i + 1}</td>
        <td>${sitesList[i].name}</td>
        <td>
        <button class="btn btn-outline-success" onclick="visitSite(${i})"><i class="fa-solid fa-location-arrow"></i></button>
        </td>
        <td>
        <button class="btn btn-outline-warning" onclick="updateProducts(${i})"><i class="fa-regular fa-pen-to-square"></i></button>
        </td>
        <td>
            <button class="btn btn-outline-danger" onclick="deleteItem(${i})"><i class="fa-solid fa-trash"></i></button>
        </td>
        </tr>`
    }
    websitesTable.innerHTML = container;
}

//// Clearing  Func
function clearForm() {
    siteName.value = "";
    siteUrl.value = "";
}

function clearTable() {
    localStorage.removeItem("bookmarks");
    sitesList = [];
    websitesTable.innerHTML = "";
}

//// deleting Func
function deleteItem(atIndex) {
    sitesList.splice(atIndex, 1);
    localStorage.setItem("bookmarks", JSON.stringify(sitesList))
    displayBookmarks()
}

//// Visiting Func
function visitSite(atIndex) {
    window.open(sitesList[atIndex].url, '_blank');
}

//// Searching Func
function searchProducts() {
    var term = searchValue.value;
    var container = "";

    for (var i = 0; i < sitesList.length; i++) {

        if (sitesList[i].name.toLowerCase().includes(term.toLowerCase())) {
            container += `
            <tr>
            <td>${i + 1}</td>
            <td>${sitesList[i].name}</td>
            <td>
            <button class="btn btn-outline-success" onclick="visitSite(${i})"><i class="fa-solid fa-location-arrow"></i></button>
            </td>
            <td>
            <button class="btn btn-outline-warning" onclick="updateProducts(${i})"><i class="fa-regular fa-pen-to-square"></i></button>
            </td>
            <td>
                <button class="btn btn-outline-danger" onclick="deleteItem(${i})"><i class="fa-solid fa-trash"></i></button>
            </td>
            </tr>`
        }
    }
    websitesTable.innerHTML = container;
}


////Update functions with declearing currentSite for the both funcs
var currentSite
function updateProducts(index) {
    addBtn.style.display = "none";
    updateBtn.style.display = "initial";

    currentSite = sitesList[index];

    siteName.value = currentSite.name;
    siteUrl.value = currentSite.url;

}

function setUpdate() {
    nameValid = nameRegex.test(siteName.value);
    urlValid = urlRegex.test(siteUrl.value);

    if (!nameValid || !urlValid) {
        errorModal.toggle();
        setTimeout(() => {
            errorModal.hide();
        }, 8000)
    }
    else {
        siteValid()

        currentSite.name = siteName.value;
        currentSite.url = siteUrl.value;

        addBtn.style.display = "initial";
        updateBtn.style.display = "none";

        localStorage.setItem("bookmarks", JSON.stringify(sitesList))
        displayBookmarks()
        clearForm()
    }
}


////darkmode
var darkBall = document.querySelector(".dark-ball");

//Checking on refresh what darkmode state was be last time and excute it #حركات
if (localStorage.getItem("darkmode") == null) {
    localStorage.setItem("darkmode", "false")
}
else if (localStorage.getItem("darkmode") == "true") {
    darkMode();
}

//darkmode main function 
function darkMode() {
    document.querySelector("body").classList.toggle("dark-mode");
    document.querySelector(".table-responsive").classList.toggle("bg-light");
    document.querySelector(".search-area span.input-group-text").classList.toggle("bg-light");
    for (var i = 0; i < btnsArray.length; i++) {
        if (btnsArray[i].classList.contains("btn-dark")) {
            btnsArray[i].classList.replace("btn-dark", "btn-info")
        }
        else {
            btnsArray[i].classList.replace("btn-info", "btn-dark")
        }
    }

    // dark toggle ball movement
    if (!darkBall.classList.contains("d-ball-on") && !darkBall.classList.contains("d-ball-off")) {
        darkBall.classList.add("d-ball-on")
    }
    else if (darkBall.classList.contains("d-ball-on")) {
        darkBall.classList.replace("d-ball-on", "d-ball-off")
    }
    else {
        darkBall.classList.replace("d-ball-off", "d-ball-on")
    }

}

//function to check and set the darkmode state to false and true on local storage
function darkToggle() {
    if (localStorage.getItem("darkmode") == "false") {
        darkMode();
        localStorage.setItem("darkmode", "true")
    }
    else if (localStorage.getItem("darkmode") == "true") {
        darkMode();
        localStorage.setItem("darkmode", "false")
    }
}



