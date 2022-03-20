const baseUrl = 'https://free-to-play-games-database.p.rapidapi.com/api'
const fetchInit = {
  headers: {
    'x-rapidapi-host': 'free-to-play-games-database.p.rapidapi.com',
    'x-rapidapi-key': 'b9ac6fa12bmshf9cdae3ce829f3fp166584jsn3fac0801918a'
  }
}

/**
 * Returns a response containing the games list
 * query can be tags, platform, category, sort-by
 */
const fetchList = (url, query = '', body) => {
  return fetch(`${baseUrl}/${url}${query}`, {...fetchInit, method: 'GET', ...body}).then(res => {
    return res.json()
  }).then(list => {
    return list
  }).catch(err => {
    console.log(err)
  })
}

const fetchSingle = id => {
  return fetch(`${baseUrl}/game?id=${id}`, {...fetchInit, method: 'GET' }).then(res => {
    return res.json()
  }).then(list => {
    return list
  }).catch(err => {
    console.log(err)
  })
}

export {
  fetchList,
  fetchSingle
}