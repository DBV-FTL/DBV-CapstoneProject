import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './components/Navbar/Navbar'
import Hero from './components/Hero/Hero'
import Sidebar from './components/Sidebar/Sidebar'
import Register from './pages/Register/Register'
import Login from './pages/Login/Login'
import Shop from './pages/Shop/Shop'
import Footer from './components/Footer/Footer'
import Locations from'./components/Locations/Locations'
import Forsellers from './components/Forsellers/Forsellers'
import Aboutus from './components/Aboutus/Aboutus'
import Store from './pages/Store/Store'
import AddNewItem from './pages/AddNewItem/AddNewItem'
import apiClient from './services/apiClient'
import Menu from './components/Menu/Menu'

function App() {
  const [client, setClient]= useState('user') //client is either 'user' or 'provider'
  const [userState, setUserState] = useState({}) //all app state set here 


  const [providerState, setProviderState] = useState({})
  const [appState, setAppState] = useState({})

  
  
  // let appState
  // let setAppState

  // if (client==='user'){
  //   appState= userState
  //   setAppState= setUserState
  // } else if (client==='provider'){
  //   appState= providerState
  //   setAppState= setProviderState
  // }

  
  

  useEffect(()=>{
    //need to get token from local storage then decode token and fetch user 
    const loadInitialData = async () => {
      const token = localStorage.getItem('interzine_token')
  
      if (token) {
        apiClient.setToken(token)
        const fromToken= await apiClient.fetchUserFromToken()
        const appUser= fromToken?.data?.user
        console.log('loading initial data', appUser)
        
        if (appUser.client==='user'){
          const services= await apiClient.fetchServicesByZip(appUser.zip_code)
          setClient('user')
          setAppState({services: services?.data?.providers, user:appUser, isAuthenticated:true})
        } else if (appUser.client==='provider'){
          const menu= await apiClient.fetchMenuItems(appUser.id)
          setClient('provider')
          setAppState({menuItems: menu?.data?.menuItems, provider:appUser, isAuthenticated:true})
        }
      }
  
      // current problem is when reloading it stays logged in but since default client is user and not
      // provider, even when a service provider logs in, the client state switches to user when website refreshed;
      // only solution I can think of is adding that as a field in db/
      }

    loadInitialData()

  }, [])

  console.log('app state', appState, client)

  return (
    <div className='app'>
      <BrowserRouter>
      <Navbar appState={appState} logout={setAppState}/>
      <Hero/>
      <Sidebar/>
      <Routes>
        {
          appState.isAuthenticated ?
        (client==='user'&&
        <Route path='/' element={<Shop services={appState?.services} />}/>)||
        

        (client==='provider'&&
        <Route path='/' element={<Store appState={appState} updateMenu={setAppState}/>}/>
        )
          :
          <> Log in or sign up to continue</>
      
        }
        

        <Route path='/login' element={<Login client= {client} setClient= {setClient} login={setAppState} appState={appState}/>}/>
        <Route path='/register' element={<Register client= {client} setClient= {setClient} register={setAppState} appState={appState}/>}/>
        {/* <Route path= {`/menu:${id}`} element={<Menu menu={menu}/>} /> */}
        <Route path='/contact' element={<Aboutus/>}/>
      </Routes>
      <Aboutus/>
      <Forsellers/>
      <Locations/>
      <Footer/>
      </BrowserRouter>
      


      {/* yoooooooo */}
    </div>
  )
}

export default App
