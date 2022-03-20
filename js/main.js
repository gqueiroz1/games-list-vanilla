import { fetchList } from "./api.js";

let selectedFilters = {}

let filterQuery = window.location.search

let pagination = 0

let gamesList = []

constructInitialFilters()

function filterGamesByPage () {
  clearGamesOnScreen()
  appendGamesOnScreen()
}

/**
 * Fetching games list initially and by fiters click
 */
await fetchGamesList()

/**
 * Preparing filters on window load
 */
function constructInitialFilters () {
  if (!filterQuery) return

  const queryList =  filterQuery.split('&')
  
  const paginationIndex = queryList.findIndex(item => {
    return item.includes('p=')
  })

  if (pagination) {
    pagination = +queryList[paginationIndex].slice(2, queryList[paginationIndex].length)
    queryList.splice(paginationIndex, 1)
    filterQuery = queryList
  }


  
  queryList.forEach(item => {
    const key = item.split('=')[0]
    const value = item.split('=')[1]
    
    selectedFilters[key] = value
    document.querySelector(`div[name="${value}"]`)?.classList.add('selected-filter')
  })
}

async function fetchGamesList (query = filterQuery) {
  const url = query.length ? 'filter' : 'games'

  try {
    gamesList = await fetchList(url, query)
    appendGamesOnScreen()
  } catch (e) {
    console.log(e)
  }
}

function appendGamesOnScreen () {
  const gamesContainer = document.querySelector('.games-list-cards')

  const pageNumber = pagination === 1 ? 0 : pagination

  for (let i = 12 * pageNumber; i < 12 * (pageNumber + 1); i++) {
    let game = gamesList[i]

    const gamesTemplate = document.querySelector('template#game-card').content.cloneNode(true)
    gamesTemplate.querySelector('.game-card').setAttribute('id', game.id)
    gamesTemplate.querySelector('.game-card-header-image').setAttribute('src', game?.thumbnail)
    gamesTemplate.querySelector('.game-card-genre-tag').innerText = game.genre
    gamesTemplate.querySelector('.game-card-title').innerText = game.title
    gamesTemplate.querySelector('.game-card-description').innerText = game.short_description
    gamesTemplate.querySelector('.game-card-release-info').innerText = `${game.developer} - ${game.release_date}`
    gamesTemplate.querySelector('.game-card-platform').innerText = game.platform
    gamesContainer.appendChild(gamesTemplate)
  }

  const cards = document.querySelectorAll('.game-card')
  cards.forEach(card => {
    card.addEventListener('click', function (e) {
      const id = e.target.closest('.game-card').getAttribute('id')
      console.log(e.target.closest('.game-card').getAttribute('id'))
      window.location.href = `//127.0.0.1:5500/show.html?id=${id}`
    })
  })

  appendPagination()
}

function appendPagination () {
  clearPagination()

  let pageQuantity = Math.floor(gamesList.length / 12)

  if (pageQuantity > 10) pageQuantity = 10

  if (pageQuantity) {
    document.querySelector('.games-list-pagination').classList.remove('d-none')
  }

  for (let i = 1; i <= pageQuantity; i++ ) {
    const paginationItensTemplate = document.querySelector('template#pagination-itens-template').content.cloneNode(true)
    paginationItensTemplate.querySelector('.pagination-element').innerText = i
    document.querySelector('.games-list-pagination').append(paginationItensTemplate)
  }

  document.querySelector('.games-list-pagination .pagination-element').classList.add('primary-text')

  if (pagination) {
    const paginationElements = document.querySelectorAll('.pagination-element')
    paginationElements.forEach(item => {
      if (+item.innerText === pagination) {
        document.querySelector('.pagination-element.primary-text').classList.remove('primary-text')
        item.classList.add('primary-text')
      }  
    })
  }


  const paginationElements = document.querySelectorAll('.pagination-element')

  paginationElements.forEach(element => {
    element.addEventListener('click', handlePageNumberClick)
  })
}

/**
 * Making filters enter the screen on click/touch
 */
const selectedFiltersList = document.querySelectorAll('.games-list-advanced-filter-selected')

selectedFiltersList.forEach(filter => {
  filter.addEventListener('click', function () {
    const alreadySelectedFilterBox = document.querySelector('.enter-bottom') 
    const clickedFilter = document.querySelector(`#${this.parentElement.id} .games-list-advanced-filter-items`)

    clickedFilter.classList.toggle('enter-bottom')

    if (alreadySelectedFilterBox) alreadySelectedFilterBox.classList.remove('enter-bottom')
  })
});

/**
 * Toggling selected filter item and pushing query on history state
 */
const filterItensList = document.querySelectorAll('.filter-item')

filterItensList.forEach(item => {
  item.addEventListener('click', function () {
    const selectedFilter = item.closest('.games-list-advanced-filter-box').id.split('-')[1]
    
    if (Object.keys(selectedFilters).includes(selectedFilter)) {
      document.querySelector(`#filter-${selectedFilter} .selected-filter`)?.classList.remove('selected-filter')
    }

    if (selectedFilters[selectedFilter] === this.getAttribute('name')) {
      delete selectedFilters[selectedFilter]
      this.classList.remove('selected-filter')
    } else {
      selectedFilters[selectedFilter] = this.getAttribute('name')
      this.classList.add('selected-filter')
      item.closest('.games-list-advanced-filter-items').classList.remove('enter-bottom')
      document.querySelector(`#filter-${selectedFilter} .selected-filter-text`).innerText = selectedFilters[selectedFilter]
    }

    clearGamesOnScreen()

    fetchGamesList(constructFilterQuery(selectedFilters))
  })
})

function clearGamesOnScreen () {
  const gamesElements = document.querySelectorAll('.games-list-cards .game-card')
  gamesElements.forEach(element => {
    element.remove()
  })
}

function clearPagination () {
  const gamesElements = document.querySelectorAll('.pagination-element')
  gamesElements.forEach(element => {
    element.remove()
  })
}


function constructFilterQuery (filters) {
  filterQuery = ''

  for (const key of Object.keys(filters)) {
    console.log(filterQuery)
    filterQuery += `${!filterQuery.includes('?') ? '?' : ''}${filterQuery ? '&' : ''}${key}=${filters[key]}`
  }

  history.pushState('', '', filterQuery)

  return filterQuery
}

function handlePageNumberClick (evt) {  
  const element = evt.target

  document.querySelector('.pagination-element.primary-text').classList.remove('primary-text')
  element.classList.add('primary-text')

  selectedFilters.p = element.innerText
  pagination = +element.innerText

  clearGamesOnScreen()
  history.pushState('', '', constructFilterQuery(selectedFilters))
  filterGamesByPage()
}