// Global variables
var searchHistory = [];
var stockApiRootUrl = 'https://www.alphavantage.co';
var stockApiKey = 'N901EFW75FPBB75M';

// DOM element references
var searchForm = document.querySelector('#search-form');
var searchInput = document.querySelector('#search-input');
var stockContainer = document.querySelector('#currentStocks');
var searchHistoryContainer = document.querySelector('#history');

function renderSearchHistory() { 
    searchHistoryContainer.innerHTML = '';
  
    // Start at end of history array and count down to show the most recent at the top.
    for (var i = searchHistory.length - 1; i >= 0; i--) {
      var btn = document.createElement('button');
      btn.setAttribute('type', 'button');
      btn.setAttribute('aria-controls', 'stock-table-list');
      btn.classList.add('history-btn', 'btn-history');
  
      // `data-search` allows access to city name when click handler is invoked
      btn.setAttribute('data-search', searchHistory[i]);
      btn.textContent = searchHistory[i];
      searchHistoryContainer.append(btn);
    }
  }

//   testing, this is where USER types in stock in search bar and we use ${Search} to grab USER input and place it into the apiURL variable
  function fetchStock(search) {
    var apiUrl = `${stockApiRootUrl}/query?function=GLOBAL_QUOTE&symbol=${search}&apikey=${stockApiKey}`;
    // var apiUrl = 'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${search}&apikey=N901EFW75FPBB75M';
  
    fetch(apiUrl)
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        if (!data[0]) {
          alert('Location not found');
        } else {
          appendToHistory(search);
          fetchWeather(data[0]);
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
    fetchStock(search);
    searchInput.value = '';
  }
  
  function handleSearchHistoryClick(e) {
    // Don't do search if current elements is not a search history button
    if (!e.target.matches('.btn-history')) {
      return;
    }
  
    var btn = e.target;
    var search = btn.getAttribute('data-search');
    fetchCoords(search);
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

searchForm.addEventListener('submit', handleSearchFormSubmit);
searchHistoryContainer.addEventListener('click', handleSearchHistoryClick);