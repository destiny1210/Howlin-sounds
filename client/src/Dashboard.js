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

        axios.get('/lyrics', {
            params: {
                track: playingTrack.title,
                artistName: playingTrack.artist
            }
        }).then(res => {
            console.log(res.data.lyrics2)
            setLyrics(res.data.lyrics2)
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

