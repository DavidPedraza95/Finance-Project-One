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
var forecastContainer = document.querySelector('#forecast');

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

//so we got the functionality of this function below wrong. This function below should be used to
//fetch data for the stock like high, lows, percentage changes, etc, I believe

// function fetchSymbolData(stockName, search) {
//     // var { search }  = symbol;
//     var stockSymbol = stockName.symbol;
//     var apiUrl = `${stockApiRootUrl}/query?function=GLOBAL_QUOTE&symbol=${search}&apikey=${stockApiKey}`;
    
//     fetch(apiUrl)
//       .then(function (res) {
//         return res.json();
//       })
//       .then(function (data) {
//         renderItems(stockSymbol, data);
//       })
//       .catch(function (err) {
//         console.error(err);
//       });
// }

function fetchSearchedStock(search) {
    //var apiUrl = `${stockApiRootUrl}/query?function=SYMBOL_SEARCH&keywords=${search}&apikey=${stockApiKey}`;
    var apiUrl = `${stockApiRootUrl}/query?function=GLOBAL_QUOTE&symbol=${search}&apikey=${stockApiKey}`;
    //var apiUrl = `${weatherApiRootUrl}/geo/1.0/direct?q=${search}&limit=5&appid=${weatherApiKey}`;
  
    fetch(apiUrl)
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        if (!data['Global Quote']) {
          alert('Symbol not found');
        } else {
          appendToHistory(search);
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


    
    
    // var currentStock = "AMC";
    // var requestUrl = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol="+ currentStock + "&apikey=N901EFW75FPBB75M"

    // function getStock(requestUrl) {
    //     fetch(requestUrl)
    //       .then(function (response) {
    //         console.log(response);
    //         if (response.status === 200) {
    //           responseText.textContent = response.status;
    //         }
    //         return response.json();
    //     });
    //   }
      
    //   getStock(requestUrl);

initSearchHistory();
searchForm.addEventListener('submit', handleSearchFormSubmit);
searchHistoryContainer.addEventListener('click', handleSearchHistoryClick);