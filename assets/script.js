// Global variables
var searchHistory = [];
var stockApiRootUrl = 'https://www.alphavantage.co';
var stockApiKey = 'N901EFW75FPBB75M';
var chartUrl = 'https://widget.finnhub.io/widgets/stocks/chart?symbol=${search}'; 

// DOM element references
var searchForm = document.querySelector('#search-form');
var searchInput = document.querySelector('#searchBar');
var stockContainer = document.querySelector('#currentStocks');
var searchHistoryContainer = document.querySelector('#history');
var todayContainer = document.querySelector('#today');
var chartHere = document.getElementById('chartHere');


//FUNCTIONS HERE INCLUDE
//getStockData which fetchs the list of stock data from Global Quote endpoint
//createCard which creates the cards dynamically around getStockData
//populateSearchedChart which dynamically changes the chart as a stock is searched
//fetchSearchedStock which is the bread & butter, it takes in all 3 functions above when user searchs a Stock


async function getStockData(search) {  
    let objectName = "Global Quote";
    var apiUrl = `${stockApiRootUrl}/query?function=GLOBAL_QUOTE&symbol=${search}&apikey=${stockApiKey}`;

    // Create an unordered list
    var list = document.createElement('ul')

    //utilizing async/await to handle promises when building card then list
    const res = await fetch(apiUrl)
    const data = await res.json();
    
        for (objectName in data) {

          for (const [key, value] of Object.entries(data[objectName])) {
          console.log(`${key}: ${value}`);
          var li = document.createElement('li');
          li.textContent = `${key}: ${value}`;
          list.appendChild(li);    

         }                       
       }

    return list.innerHTML;
          
}

async function createCard(search){
    const container = document.getElementById('cardBuilt');
    
      // Create card element
      const card = document.createElement('div');
      card.classList = 'card-body';
    
      // Construct card content
      const content = `
        <div class="card" id="Card">
        <div class="card-header" id="heading">
          <h5 class="mb-0">
            <button 
    
            type="button"
            class="btn btn-link" 
            id="removeButton" 
            data-toggle="removeCard" 
            data-target="#removeCard" 
            aria-expanded="true" 
            aria-controls="removeCard"
            onclick="removeCardButton()"
            >
              
            Remove 
            </button>
          </h5>
        </div>
    
        <div id="collapse" class="collapse show" aria-labelledby="heading" data-parent="#cardBuilt">
          <div class="card-body">
    
            
            
            ${await getStockData(search)}
            
    
          </div>
        </div>
      </div>
      `;
    
      // Append newyly created card element to the container
      container.innerHTML += content;    

}

function populateSearchedChart(search) {
   chartHere.setAttribute('src', `https://widget.finnhub.io/widgets/stocks/chart?symbol=${search}&watermarkColor=%231db954&backgroundColor=%23222222&textColor=white%22%3E`);
}


function fetchSearchedStock(search) {
    //var apiUrl = `${stockApiRootUrl}/query?function=SYMBOL_SEARCH&keywords=${search}&apikey=${stockApiKey}`;
    var apiUrl = `${stockApiRootUrl}/query?function=GLOBAL_QUOTE&symbol=${search}&apikey=${stockApiKey}`;
  
    fetch(apiUrl)
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        if (!data['Global Quote']) {
          alert('Symbol not found');
        } else {
          appendToHistory(search);
          createCard(search);
          populateSearchedChart(search); 
          //fetchSymbol(data['Global Quote']);
        }
      })
      .catch(function (err) {
        console.error(err);
      });
} 


//BUTTON FUNCTIONS BELOW


//handles input of searched stock soon as User types into searchBar  
function handleSearchFormSubmit(e) {
    // Don't continue if there is nothing in the search form
    if (!searchInput.value) {
      return;
    }
  
    e.preventDefault();
    var search = searchInput.value.trim();
    fetchSearchedStock(search);
    searchInput.value = '';
}
  

//searchHistory Buttons of stocks
function handleSearchHistoryClick(e) {
    // Don't do search if current elements is not a search history button
    if (!e.target.matches('.btn-history')) {
      return;
    }
  
    var btn = e.target;
    var search = btn.getAttribute('data-search');
    fetchSearchedStock(search);
}

//clear storage & rerender table
function clearHistory() {
    localStorage.clear();
    window.location.reload();
}

//remove Card when clicked
function removeCardButton() {
    var removeCard = document.getElementById("Card")
    removeCard.remove();
}


//TIME FUNCTION

//displayTime by clear button
function displayTime(){

    var timeNow = moment();
    $("#displayedTime").text(timeNow.format('MMMM Do YYYY, h:mm:ss a'));
    setTimeout(displayTime, 1000);
    
    }
    
    $(document).ready(function() {
        displayTime();
});


//INIT or saves search history after button presses

function renderSearchHistory() { 
    searchHistoryContainer.innerHTML = '';
  
    // Start at end of history array and count down to show the most recent at the top.
    for (var i = searchHistory.length - 1; i >= 0; i--) {
      var btn = document.createElement('button');
      btn.setAttribute('type', 'button');
      btn.setAttribute('aria-controls', 'today stock');
      btn.classList.add('history-btn', 'btn-history');
  
      // `data-search` allows access to city name when click handler is invoked
      btn.setAttribute('data-search', searchHistory[i]);
      btn.textContent = searchHistory[i];
      searchHistoryContainer.append(btn);
    }
}

//Function to update history in local storage then updates displayed history.
function appendToHistory(search) {
    // If there is no search term return the function
    if (searchHistory.indexOf(search) !== -1) {
      return;
    }
    searchHistory.push(search);
  
    localStorage.setItem('search-history', JSON.stringify(searchHistory));
    renderSearchHistory();
} 

// Function to get search history from local storage
function initSearchHistory() {
    var storedHistory = localStorage.getItem('search-history');
    if (storedHistory) {
      searchHistory = JSON.parse(storedHistory);
    }
    renderSearchHistory();
}  


initSearchHistory();
searchForm.addEventListener('submit', handleSearchFormSubmit);
searchHistoryContainer.addEventListener('click', handleSearchHistoryClick);