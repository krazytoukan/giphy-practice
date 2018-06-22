require('dotenv').config()

const
  express = require('express'),
  app = express(),
  logger = require('morgan'),
  PORT = 3000,
  axios = require('axios')

app.use(express.json())

const apiKey = `${process.env.API_KEY}`
//Builds object that can make HTTP requests:
const apiClient = axios.create()

app.get("/", (req, res) => {
  console.log("Request received, contacting NASA.")
  const apiURL = "http://api.open-notify.org/iss-now.json";
  apiClient({ method: "get", url: apiURL}).then((dataThatCameBack) => {
    res.json(dataThatCameBack.data.iss_position)
  })
})

app.get("/random", (req, res) => {
    const apiUrl = `https://api.giphy.com/v1/gifs/random?api_key=${apiKey}&tag=&rating=R`
    apiClient({method: "get", url: apiUrl}).then((apiResponse) => {
        const imgUrl = apiResponse.data.data.image_original_url
        res.send(`<img src ="${imgUrl}">`)
    })
})

app.get("/search/:term", (req, res) => {
    const apiUrl = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${req.params.term}&limit=25&offset=0&rating=R&lang=en`;
    console.log(apiUrl);
    apiClient({method: "get", url: apiUrl}).then((apiResponse) => {
            // let imgUrl = apiResponse.data.data[1].images.original.url
            let results = ""
            apiResponse.data.data.forEach((r) => {
                const imgUrl = r.images.original.url
                results += `<img src ="${imgUrl}">`
            })
            res.send(results)
    })
})

app.listen(PORT, (err) => {
  console.log(err || `Server running on ${PORT}.`)
})