import React from 'react';
import {Container} from 'react-bootstrap'
import './App.css'

const AUTH_URL = "https://accounts.spotify.com/authorize?client_id=cffb9ef440ed4bebb3d4fb97693afb09&response_type=code&redirect_uri=http://localhost:3000&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state"

export default function Login() {
    return (
        <Container>
            <div className='logo'>
                <img src='./logo2.png'/>
            </div>
            <div class="wrap">
                <button className="login">
                    <a className='login' href={AUTH_URL}>
                        Login to Howlin' Sounds
                    </a>
                </button>
            </div>
            <div className='cs'>
                <img src='./cs2.png'/>
            </div>
            
        </Container>
        
    )
}