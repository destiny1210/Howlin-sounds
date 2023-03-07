import React from "react";
import useAuth from "./useAuth.js";
import { Container, Form } from "react-bootstrap";
import { useState, useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-node"
import TrackSearchResult from "./TrackSearchResult"
import Player from "./Player.js";
import axios from "axios";
import './App.css'

const spotifyApi = new SpotifyWebApi({
    clientId: 'cffb9ef440ed4bebb3d4fb97693afb09'
});
export default function Dashboard({code}) {
    const accessToken = useAuth(code)
    const [search, setSearch] = useState("")
    const [searchResults, setSearchResults] = useState([])
    const [playingTrack, setPlayingTrack] = useState()
    const [lyrics, setLyrics] = useState("")

    function chooseTrack(track) {
        setPlayingTrack(track)
        setSearch("")
        setLyrics("")
    }


    useEffect(() => {
        if (!playingTrack) return

        axios.get('http://localhost:3001/lyrics', {
            params: {
                track: playingTrack.title,
                artist: playingTrack.artist
            }
        }).then(res => {
            setLyrics(res.data.lyrics)
        })
    }, [playingTrack])
   

    useEffect(() => {
        if (!accessToken) return
        spotifyApi.setAccessToken(accessToken)
    }, [accessToken])



    useEffect(() =>{
        if(!search) return setSearchResults([])
        if(!accessToken) return 

        let cancel = false
        if(cancel) return
        spotifyApi.searchTracks(search).then(res => {
            setSearchResults(
            res.body.tracks.items.map(track => {
            const smallestAlbumImage = track.album.images.reduce((smallest,image) => {
                if (image.height < smallest.height) return image
                return smallest
            }, track.album.images[0])

        return {
            artist: track.artists[0].name,
            title: track.name,
            uri: track.uri,
            albumUrl: smallestAlbumImage.url
        }
    }))
    })
    return () => cancel = true
    }, [search, accessToken])
    

    return (
        <>
        <Container id="sidebar-wrapper">
        <div id="flex" class=" bg-white" >
                <div class="sidebar-heading border-bottom bg-light"><b>Playlists</b></div>
                <div class="list-group list-group-flush">
                    <a class="list-group-item list-group-item-action list-group-item-light p-3" href="#!">Country</a>
                    <a class="list-group-item list-group-item-action list-group-item-light p-3" href="#!">Classical</a>
                    <a class="list-group-item list-group-item-action list-group-item-light p-3" href="#!">Rock</a>
                    <a class="list-group-item list-group-item-action list-group-item-light p-3" href="#!">80's</a>
                    <a class="list-group-item list-group-item-action list-group-item-light p-3" href="#!">R&B</a>
                    <a class="list-group-item list-group-item-action list-group-item-light p-3" href="#!">Hip Hop</a>
                </div>
            </div>
        </Container>
        <Container className='searchBar'>
            <div className='db-logo'>
                <img src='./db-logo.png'/>
            </div>
            <Form.Control 
            type="search" 
            placeholder="Search" 
            value={search} 
            onChange={e => setSearch(e.target.value)}
            />
            
            <div className="flex-grow-1 my-2" style={{ overflowY: "auto"}}>
             {searchResults.map(track =>  (
                <TrackSearchResult 
                track={track} 
                key={track.uri} 
                chooseTrack={chooseTrack} 
                />
             ))}
             {searchResults.length === 0 && (
                <div className="lyrics">
                    {lyrics}
                </div>
             )}
            </div>
            <div>
                <Player accessToken={accessToken} trackUri={playingTrack?.uri} />
            </div>
        </Container>
        </>
        
    )
}

