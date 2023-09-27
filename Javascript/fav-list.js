let cardContainer = document.getElementById('container');
// Event listener
window.addEventListener("load", function () {
     let favourites = localStorage.getItem("favouriteCharacters"); 
     if (favourites == null) {
          cardContainer.innerHTML = "<a href=\"./index.html\"><p class=\"no-characters\"><b>Oops...! No </b><font color=\"red\"><b>Marvel</b><sup><b>&#174</b></sup></font><b> Superheroes Are present Here...&nbsp;<i class=\"fa-regular fa-face-frown fa-shake fa-xl\" style=\"color: #ff1900;\"></i></b></p><br><button class=\"btn no-hero-btn pointer\"><i class=\"fa-solid fa-plus fa-bounce fa-xl\" style=\"color: #00ff2a;\"></i> &nbsp; <b>Click Here To Add Into Favourites...!</b></button></a>"
          return;
     }
     else {
          favourites = JSON.parse(this.localStorage.getItem("favouriteCharacters"));
     }
     if (favourites.length == 0) {
          cardContainer.innerHTML = "<a href=\"./index.html\"><p class=\"no-characters\"><b>Oops...! No </b><font color=\"red\"><b>Marvel</b><sup><b>&#174</b></sup></font><b> Superheroes Are present Here...&nbsp;<i class=\"fa-regular fa-face-frown fa-shake fa-xl\" style=\"color: #ff1900;\"></i></b></p><br><button class=\"btn no-hero-btn pointer\"><i class=\"fa-solid fa-plus fa-bounce fa-xl\" style=\"color: #00ff2a;\"></i> &nbsp; <b>Click Here To Add Into Favourites...!</b></button></a>";
          return;
     }
     cardContainer.innerHTML = "";
     favourites.forEach(character => {
          cardContainer.innerHTML +=
               `
               <div class="flex-col card">
                    <img src="${character.squareImage}" alt="">
                    <span class="name">${character.name}</span>
                    <span class="id">Id : ${character.id}</span>
                    <span class="comics">Comics : ${character.comics}</span>
                    <span class="series">Series : ${character.series}</span>
                    <span class="stories">Stories : ${character.stories}</span>
                    <a class="character-info" href="./get-info.html">
                         <button class="btn buttonstyle"><i class="fa-solid fa-circle-info fa-flip fa-xl" style="color: #00ff40;"></i> &nbsp;<b>Get More Info</b></button>
                    </a>
                    <div style="display:none;">
                         <span>${character.id}</span>
                         <span>${character.name}</span>
                         <span>${character.comics}</span>
                         <span>${character.series}</span>
                         <span>${character.stories}</span>
                         <span>${character.description}</span>
                         <span>${character.landscapeImage}</span>
                         <span>${character.portraitImage}</span>
                         <span>${character.squareImage}</span>
                    </div>
                    <button class="btn remove-btn buttonstyle"><i class="fa-solid fa-heart-circle-xmark fa-shake fa-xl" style="color: #ff0000;"></i> &nbsp; <b>Remove From Favourites</b></button>
               </div>
          `

     })
     addEvent();
})

//attacthing eventListener to buttons
function addEvent() {
     let removeBtn = document.querySelectorAll(".remove-btn");
     removeBtn.forEach((btn) => btn.addEventListener("click", removeCharacterFromFavourites))
     let characterInfo = document.querySelectorAll(".character-info");
     characterInfo.forEach((character) => character.addEventListener("click", addInfoInLocalStorage));
}


function removeCharacterFromFavourites() {
     let idOfCharacterToBeDeleted = this.parentElement.children[2].innerHTML.substring(5);
     let favourites = JSON.parse(localStorage.getItem("favouriteCharacters"));
     let favouritesCharacterIDs = new Map(JSON.parse(localStorage.getItem("favouritesCharacterIDs")));
     favouritesCharacterIDs.delete(`${idOfCharacterToBeDeleted}`);
     // deleting the character
     favourites.forEach(function (favourite, index) {
          if (favourite.id == idOfCharacterToBeDeleted) {
               favourites.splice(index, 1);
          }
     });
     if (favourites.length == 0) {
          cardContainer.innerHTML = "<a href=\"./index.html\"><p class=\"no-characters\"><b>Oops...! No </b><font color=\"red\"><b>Marvel</b><sup><b>&#174</b></sup></font><b> Superheroes Are present Here...&nbsp;<i class=\"fa-regular fa-face-frown fa-shake fa-xl\" style=\"color: #ff1900;\"></i></b></p><br><button class=\"btn no-hero-btn pointer\"><i class=\"fa-solid fa-plus fa-bounce fa-xl\" style=\"color: #00ff2a;\"></i> &nbsp; <b>Click Here To Add Into Favourites...!</b></button></a>";
     }
     // Updating the new arrays in localStorage
     localStorage.setItem("favouriteCharacters", JSON.stringify(favourites));
     localStorage.setItem("favouritesCharacterIDs", JSON.stringify([...favouritesCharacterIDs]));
     // Removing the element from DOM
     this.parentElement.remove();
     document.querySelector(".remove-toast").setAttribute("data-visiblity", "show");
     setTimeout(function () {
          document.querySelector(".remove-toast").setAttribute("data-visiblity", "hide");
     }, 2000);
}
function addInfoInLocalStorage() {
     let heroInfo = {
          name: this.parentElement.children[7].children[1].innerHTML,
          description: this.parentElement.children[7].children[5].innerHTML,
          comics: this.parentElement.children[7].children[2].innerHTML,
          series: this.parentElement.children[7].children[3].innerHTML,
          stories: this.parentElement.children[7].children[4].innerHTML,
          portraitImage: this.parentElement.children[7].children[7].innerHTML,
          id: this.parentElement.children[7].children[0].innerHTML,
          landscapeImage: this.parentElement.children[7].children[6].innerHTML
     }

     localStorage.setItem("heroInfo", JSON.stringify(heroInfo));
}