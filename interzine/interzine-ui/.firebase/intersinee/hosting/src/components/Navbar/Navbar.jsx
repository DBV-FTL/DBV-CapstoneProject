import React, { useState } from 'react'
import './Navbar.css'
import { useNavigate, Link } from 'react-router-dom'
import apiClient from '../../services/apiClient'
import Profile from '../Profile/Profile'

function Navbar({appState, logout, setViewProfile, setIsOpen}) {
    // const [isOpen, setIsOpen] = useState(false)
    const navigate= useNavigate()

    function routeToLogin() {
        navigate('/login')
    }

    async function routeToLogout() {
        await apiClient.logoutUser()
        logout({...appState, isAuthenticated: false})
        navigate('/')
    }

    function routeToRegister() {
        navigate('/register')
    }

    function handleMouseOver() {
        setViewProfile(true)
    }

    function handleMouseOut() {
        // setViewProfile(false)

    }

    return (
        <nav className='topnavbar'>
            <div className="cart">
                <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
                <i onClick={() => setIsOpen(true)} className="material-icons md-36">add_shopping_cart</i>
            </div>

            <ul>
                <li><Link to="/for-sellers">For Sellers</Link></li>
                <li><Link to="/about">About us</Link></li>
                <li><Link to="/locations">Locations</Link></li>
            </ul>

            <div className='logo-and-location'>
            <Link to='/'> <p className='header'>Inter<strong className='z'>Sínee</strong></p> </Link>
            <h6> by DB & V </h6>

               
            </div>

            {
                appState.isAuthenticated ?
                <div>
                    <button className="button-log" onClick={routeToLogout} > Log Out</button> 
                    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0" />
                    <span onMouseOver={handleMouseOver} onMouseLeave={()=>console.log('left')} onMouseOut={handleMouseOut} class="material-symbols-outlined">
                        account_circle
                    </span>
                </div> 
                
                :
                    <div className='access-buttons'>
                        <button className="button-log access-button1" onClick={routeToLogin}> Log In</button>
                        <button className="button-log access-button2" onClick={routeToRegister}> Sign Up</button>
                    </div>
            }
            

        </nav >
    )
}

export default Navbar
