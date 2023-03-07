import React from "react";
import './App.css'

export default function TrackSearchResult({track, chooseTrack}) {
    function handlePlay() {
        chooseTrack(track)
    }
    return (
        <div className="albums" onClick={handlePlay}>
            <img src={track.albumUrl}/>
            <div className="at">
                <div>{track.title}</div>
                <div className="text-muted">{track.artist}</div>
            </div>
        </div>
    )
}