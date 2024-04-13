// Picking up elements by id from DOM
let searchBar = document.getElementById("search-bar");
let searchResults = document.getElementById("search-results");
let ts = "1";
let publicKey = "a9ab971c8efd48b76bb3f698372e5fa7";
let hashVal = "0356a675df19e21e4e2882a2e56a5ef7";
const [timestamp, apiKey, hashValue] = [ts, publicKey, hashVal];
console.log([timestamp, apiKey, hashValue]);
// EventListener for search bar
searchBar.addEventListener("input", () => searchHeros(searchBar.value));
// API calling Function
async function searchHeros(textSearched) {
     console.log(textSearched);
     // if no text in the search bar then nothing is displayed 
     if (textSearched.length == 0) {
          searchResults.innerHTML = ``;
          return;
     }
     // API call to get the data 
     await fetch(`https://gateway.marvel.com:443/v1/public/characters?ts=${timestamp}&apikey=${apiKey}&hash=${hashValue}&nameStartsWith=${textSearched}`)
          //Converting into JSON format
     .then(res => res.json()) 
//sending the results to HTML
          .then(data => showSearchedResults(data.data.results)) 
}
// Function for displaying the searched results in DOM. SearchedHero is the array of objects which matches the string entered in the searched bar
function showSearchedResults(searchedHero) {
     // If the id exist in the array then we display "Remove from favourites" button otherwise we display "Add to favourites button" 
     let favouritesCharacterIDs = localStorage.getItem("favouritesCharacterIDs");
     if(favouritesCharacterIDs == null){
          favouritesCharacterIDs = new Map();
     }
     else if(favouritesCharacterIDs != null){
          favouritesCharacterIDs = new Map(JSON.parse(localStorage.getItem("favouritesCharacterIDs")));
     }
     searchResults.innerHTML = ``;
     // count is used to count the result displayed in DOM
     let count = 1;
     for (const key in searchedHero) {
          if (count <= 5) {
               let hero = searchedHero[key];
               searchResults.innerHTML +=
                    `
               <li class="flex-row single-search-result">
                    <div class="flex-row img-info">
                         <img src="${hero.thumbnail.path+'/portrait_medium.' + hero.thumbnail.extension}" alt="">
                         <div class="hero-info">
                              <a class="character-info" href="./get-info.html">
                                   <span class="hero-name">${hero.name}</span>
                              </a>
                         </div>
                    </div>
                    <div class="flex-col buttons">
                         <button class="btn add-to-fav-btn buttonstyle">${favouritesCharacterIDs.has(`${hero.id}`) ? "<i class=\"fa-solid fa-heart-circle-xmark fa-shake fa-xl\" style=\"color: #ff0000;\"></i> &nbsp; <b>Remove From Favourites</b>" :"<i class=\"fa-solid fa-heart fa-fade fa-xl\" style=\"color: #f53100;\"></i> &nbsp; <b>Add To Favourites</b></button>"}
                    </div>
                    <div style="display:none;">
                         <span>${hero.name}</span>
                         <span>${hero.description}</span>
                         <span>${hero.comics.available}</span>
                         <span>${hero.series.available}</span>
                         <span>${hero.stories.available}</span>
                         <span>${hero.thumbnail.path+'/portrait_uncanny.' + hero.thumbnail.extension}</span>
                         <span>${hero.id}</span>
                         <span>${hero.thumbnail.path+'/landscape_incredible.' + hero.thumbnail.extension}</span>
                         <span>${hero.thumbnail.path+'/standard_fantastic.' + hero.thumbnail.extension}</span>
                    </div>
               </li>
            `
          }
          count++;
     }
     events();
}
// Attacthing eventListener to buttons
function events() {
     let favouriteButton = document.querySelectorAll(".add-to-fav-btn");
     favouriteButton.forEach((btn) => btn.addEventListener("click", addToFavourites));
     let characterInfo = document.querySelectorAll(".character-info");
     characterInfo.forEach((character) => character.addEventListener("click", addInfoInLocalStorage))
}
// Function will invoke when "Add to Favourites" button or "Remvove from favourites" button is clicked.
function addToFavourites() {
     // If add to favourites button is cliked then
     if (this.innerHTML == '<i class="fa-solid fa-heart fa-fade fa-xl" style="color: #f53100;"></i> &nbsp; <b>Add To Favourites</b>') {
          // We cretate a new object containg revelent info of hero and push it into favouritesArray
          let heroInfo = {
               name: this.parentElement.parentElement.children[2].children[0].innerHTML,
               description: this.parentElement.parentElement.children[2].children[1].innerHTML,
               comics: this.parentElement.parentElement.children[2].children[2].innerHTML,
               series: this.parentElement.parentElement.children[2].children[3].innerHTML,
               stories: this.parentElement.parentElement.children[2].children[4].innerHTML,
               portraitImage: this.parentElement.parentElement.children[2].children[5].innerHTML,
               id: this.parentElement.parentElement.children[2].children[6].innerHTML,
               landscapeImage: this.parentElement.parentElement.children[2].children[7].innerHTML,
               squareImage: this.parentElement.parentElement.children[2].children[8].innerHTML
          }
          let favouritesArray = localStorage.getItem("favouriteCharacters");
          if (favouritesArray == null) {
               // favourites array is null so we create a new array
               favouritesArray = [];
          } else { 
               favouritesArray = JSON.parse(localStorage.getItem("favouriteCharacters"));
          }
          let favouritesCharacterIDs = localStorage.getItem("favouritesCharacterIDs");
          if (favouritesCharacterIDs == null) {
          // If favouritesCharacterIDs is not found then iniitalize it with empty map
               favouritesCharacterIDs = new Map();
          } else {
               favouritesCharacterIDs = new Map(JSON.parse(localStorage.getItem("favouritesCharacterIDs")));
          }
          favouritesCharacterIDs.set(heroInfo.id, true);
          favouritesArray.push(heroInfo);
          localStorage.setItem("favouritesCharacterIDs", JSON.stringify([...favouritesCharacterIDs]));
          localStorage.setItem("favouriteCharacters", JSON.stringify(favouritesArray));
          // Convering the "Add to Favourites" button to "Remove from Favourites"
          this.innerHTML = '<i class="fa-solid fa-heart-circle-xmark fa-shake fa-xl" style="color: #ff0000;"></i> &nbsp; <b>Remove From Favourites</b>';
          // Displaying the "Added to Favourites" toast to DOM
          document.querySelector(".fav-toast").setAttribute("data-visiblity","show");
          // Deleting the "Added to Favourites" toast from DOM after 2 seconds
          setTimeout(function(){
               document.querySelector(".fav-toast").setAttribute("data-visiblity","hide");
          },2000);
     }
     //removing the character form favourites array
     else{ 
          let idOfCharacterToBeRemoveFromFavourites = this.parentElement.parentElement.children[2].children[6].innerHTML;
          let favouritesArray = JSON.parse(localStorage.getItem("favouriteCharacters"));
          let favouritesCharacterIDs = new Map(JSON.parse(localStorage.getItem("favouritesCharacterIDs")));
          let newFavouritesArray = [];
          favouritesCharacterIDs.delete(`${idOfCharacterToBeRemoveFromFavourites}`);
          favouritesArray.forEach((favourite) => {
               if(idOfCharacterToBeRemoveFromFavourites != favourite.id){
                    newFavouritesArray.push(favourite);
               };
          });
          localStorage.setItem("favouriteCharacters",JSON.stringify(newFavouritesArray));
          localStorage.setItem("favouritesCharacterIDs", JSON.stringify([...favouritesCharacterIDs]));
          // Convering the "Remove from Favourites" button to "Add to Favourites" 
          this.innerHTML = '<i class="fa-solid fa-heart fa-fade fa-xl" style="color: #f53100;"></i> &nbsp; <b>Add To Favourites</b>';
          // Displaying the "Remove from Favourites" toast to DOM
          document.querySelector(".remove-toast").setAttribute("data-visiblity","show");
          // Deleting the "Remove from Favourites" toast from DOM after 2 seconds
          setTimeout(function(){
               document.querySelector(".remove-toast").setAttribute("data-visiblity","hide");
          },2000);
          // console.log();
     }     
}
function addInfoInLocalStorage() {
     // This stores the data of character in localStorage. 
     let heroInfo = {
          name: this.parentElement.parentElement.parentElement.children[2].children[0].innerHTML,
          description: this.parentElement.parentElement.parentElement.children[2].children[1].innerHTML,
          comics: this.parentElement.parentElement.parentElement.children[2].children[2].innerHTML,
          series: this.parentElement.parentElement.parentElement.children[2].children[3].innerHTML,
          stories: this.parentElement.parentElement.parentElement.children[2].children[4].innerHTML,
          portraitImage: this.parentElement.parentElement.parentElement.children[2].children[5].innerHTML,
          id: this.parentElement.parentElement.parentElement.children[2].children[6].innerHTML,
          landscapeImage: this.parentElement.parentElement.parentElement.children[2].children[7].innerHTML,
          squareImage: this.parentElement.parentElement.parentElement.children[2].children[8].innerHTML
     }

     localStorage.setItem("heroInfo", JSON.stringify(heroInfo));
}

