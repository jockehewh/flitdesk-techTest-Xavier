const express = require('express')
const fetch = require('node-fetch')
const bodyParser = require('body-parser')
const app = express()
const seasonsURL = "http://stapi.co/api/v1/rest/episode/search"
const uidURL = "http://stapi.co/api/v1/rest/episode?uid="


app.use(bodyParser.json())


app.get('/episodes/seasons', (req, res)=>{
  starTrekSeasons = []

  res.statusCode = 200

  fetch(seasonsURL).then(r=> r.json()).then(json =>{
    for (let i = 1; i < 10; i++){
      let currentSeason = {
        seasonNumber: i,
        episodes:[]
      }
      json.episodes.forEach(ep=>{
        if(ep.seasonNumber == i){
          currentSeason.episodes.push({
            episodeUid: ep.uid,
            episodeTitle: ep.title,
            episodeNumber: ep.episodeNumber,
            episodeSerialNumber: ep.productionSerialNumber
          })
        }
      })
      starTrekSeasons.push(currentSeason)
    }
    res.send(starTrekSeasons)
  })
})

app.post('/episodes/comment', (req, res)=>{
  res.statusCode = 200
  let reqBody = req.body
  if(reqBody.episodeUid){
    fetch(uidURL+reqBody.episodeUid).then(r => r.json()).then(json =>{
      let commentToLog = {
        episodeUid: reqBody.episodeUid,
        episodeTitle: json.episode.title,
        episodeNumber: json.episode.episodeNumber,
        episodeSerialNumber: json.episode.productionSerialNumber,
        comment: reqBody.comment
      }
      console.log(commentToLog)
      res.send(commentToLog)
    })
  }else{
    res.send('missing data, provide the following model: {comment: text, episodeUid: number}')
  }
})
app.listen(2020)