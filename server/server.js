require('dotenv').config();
const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node')
const cors = require('cors');
const lyricsFinder = require('lyrics-finder')
const bodyParser = require('body-parser')
const lyricssearchermusixmatch = require('lyrics-searcher-musixmatch').default




const app = express();
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true}))

app.post('/refresh', (req,res) => {
    const refreshToken = req.body.refreshToken;
    const spotifyApi = new SpotifyWebApi({
        redirectUri: process.env.REDIRECT_URI,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken
    })

    spotifyApi
        .refreshAccessToken()
        .then(data => {
          res.json({
            accessToken: data.body.accessToken,
            expiresIn: data.body.expiresIn
          });
        })
        .catch(err => {
            console.log(err)
            res.sendStatus(400)
    })
})

app.post('/login', (req, res) => {
    const code = req.body.code;
    const spotifyApi = new SpotifyWebApi({
        redirectUri: process.env.REDIRECT_URI,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET
    })

    spotifyApi.authorizationCodeGrant(code).then(data => {
        res.json({
            accessToken: data.body.access_token,
            refreshToken: data.body.refresh_token,
            expiresIn: data.body.expires_in
        })
    })
    .catch(err =>{
        console.log(err)
        res.sendStatus(400)
    })
})

app.get('/lyrics', async (req,res) => {
    console.log("62", req.query.track)
    let lyrics = await lyricssearchermusixmatch(req.query.track)
    if (!lyrics) {lyrics = "No Lyrics Found!"}
    let lyrics2 = lyrics.lyrics
    console.log(lyrics2)
    res.json({ lyrics2 })
})


app.listen(3001)

