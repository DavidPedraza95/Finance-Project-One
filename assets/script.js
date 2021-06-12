// Global variables
var searchHistory = [];
var stockApiRootUrl = 'https://www.alphavantage.co';
var stockApiKey = 'N901EFW75FPBB75M';

// DOM element references
var searchForm = document.querySelector('#search-form');
var searchInput = document.querySelector('#searchBar');
var stockContainer = document.querySelector('#currentStocks');
var searchHistoryContainer = document.querySelector('#history');
var todayContainer = document.querySelector('#today');


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

async function getStockData(search) {  
    let objectName = "Global Quote";
    var apiUrl = `${stockApiRootUrl}/query?function=GLOBAL_QUOTE&symbol=${search}&apikey=${stockApiKey}`;

    // var card = document.createElement('div');
    // var cardBody = document.createElement('div');
    // Create an unordered list
    var list = document.createElement('ul')
    // card.setAttribute('class', 'card');
    // cardBody.setAttribute('class', 'card-body');
    // card.append(cardBody);

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
    var apiUrl = `${stockApiRootUrl}/query?function=GLOBAL_QUOTE&symbol=${search}&apikey=${stockApiKey}`;

    const container = document.getElementById('cardBuilt');
    
    // apiResult.forEach((result, idx) => {    
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
      // })
    }
    
    //  clear storage & rerender table
    function removeCardButton() {
        var removeCard = document.getElementById("Card")
        removeCard.remove();
    }
    
    
 // Function to update history in local storage then updates displayed history.
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

 //WIp 
function renderItems(stockName, data) {
    //renderCurrentStock(stockName, data.symbol);
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
          //fetchSymbol(data['Global Quote']);
        }
      })
      .catch(function (err) {
        console.error(err);
      });
  }



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
  



  function handleSearchHistoryClick(e) {
    // Don't do search if current elements is not a search history button
    if (!e.target.matches('.btn-history')) {
      return;
    }
  
    var btn = e.target;
    var search = btn.getAttribute('data-search');
    fetchSearchedStock(search);
  }





function displayTime(){

    var timeNow = moment();
    $("#displayedTime").text(timeNow.format('MMMM Do YYYY, h:mm:ss a'));
    setTimeout(displayTime, 1000);
    
    }
    
    $(document).ready(function() {
        displayTime();
    });

//  clear storage & rerender table
function clearHistory() {
    localStorage.clear();
    window.location.reload();
}



initSearchHistory();
searchForm.addEventListener('submit', handleSearchFormSubmit);
searchHistoryContainer.addEventListener('click', handleSearchHistoryClick);