import { fetchSingle } from "./api.js";

document.querySelector('.header h1').addEventListener('click', function () {
  window.location.href = "//127.0.0.1:5500/index.html"
})

const gameId = window.location.search.split('=')[1]

fetchGame()

async function fetchGame () {
  const game = await fetchSingle(gameId)
  appendGameInfo(game)
}

function appendGameInfo (game) {
  createImages(game)
  loadGameTexts(game)
}

function createImages (game) {
  const gameImagesList = game.screenshots
  const imagesWrapper = document.querySelector('.game-images-wrapper')

  gameImagesList.forEach(image => {
    const newImage = document.createElement('img')
    newImage.setAttribute('src', image.image)
    imagesWrapper.appendChild(newImage)
  });

  const firstImage = document.querySelector('.game-images-wrapper img')
  firstImage.classList.add('opacity-1')
  const backgroundImageUrl = firstImage.getAttribute('src')
  setBackgroundImage (backgroundImageUrl)

  const allImages = document.querySelectorAll('.game-images-wrapper img')
  allImages.forEach(image => {
    image.addEventListener('click', function (e) {
      setBackgroundImage(e.target.src)
    })
  })
}

function setBackgroundImage (url) {
  document.querySelector('.game-background').setAttribute(
    'style',
    `background: linear-gradient(to right, rgba(255,255,255, .95) 25%, rgba(255,255,255, .65) 50%, rgba(255,255,255, 0)),
    url('${url}');`)

  const selectedImage = document.querySelector(`.game-background img[src="${url}"]`)
  if (document.querySelector('img.opacity-1')) document.querySelector('img.opacity-1').classList.remove('opacity-1')
  
  selectedImage.classList.add('opacity-1')
}

function loadGameTexts (game) {
  document.querySelector('.game-title').textContent = game.title
  document.querySelector('.game-genre-tag').textContent = game.genre
  document.querySelector('.game-genre-platform').textContent = game.platform
  document.querySelector('.game-creator').textContent = `${game.publisher}`
  document.querySelector('span[name="gpu"]').textContent = `${game.minimum_system_requirements.graphics}`
  document.querySelector('span[name="cpu"]').textContent = `${game.minimum_system_requirements.processor}`
  document.querySelector('span[name="ram"]').textContent = `${game.minimum_system_requirements.memory}`
  document.querySelector('span[name="storage"]').textContent = `${game.minimum_system_requirements.storage}`
  document.querySelector('.description').textContent = `${game.description}`
}
