import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import Register from './pages/Register/Register'
import Login from './pages/Login/Login'
import Shop from './pages/Shop/Shop'
import Store from './pages/Store/Store'
// import AddNewItem from './pages/AddNewItem/AddNewItem'
import apiClient from './services/apiClient'
import Menu from './components/Menu/Menu'
import FoodDetail from './components/FoodDetail/FoodDetail'
import Hero from './components/Hero/Hero'
import Bot from './components/Bot/Bot'
import Aboutus from './components/Aboutus/Aboutus'
import Forsellers from './components/Forsellers/Forsellers'
import Locations from './components/Locations/Locations'
import Footer from './components/Footer/Footer'
import Orders from './components/Orders/Orders'
import Profile from './components/Profile/Profile'

function App() {
  const [client, setClient]= useState('user') //client is either 'user' or 'provider'
  const [menus, setMenus] = useState([])
  const [appState, setAppState] = useState({})
  const [isOpen, setIsOpen]= useState(false)
  const [viewProfile, setViewProfile]= useState(false)
  

  
  

  useEffect(()=>{
    //need to get token from local storage then decode token and fetch user 
    const loadInitialData = async () => {
      const token = localStorage.getItem('interzine_token')
  
      if (token) {
        apiClient.setToken(token)
        const fromToken= await apiClient.fetchUserFromToken()
        const appUser= fromToken?.data?.user

        if (appUser.client === 'user') {
          const services = await apiClient.fetchServicesByZip(appUser.zip_code)
          const prevOrders= await apiClient.fetchOrders()
          setClient('user')
          setAppState({services: services?.data?.providers, user:appUser, isAuthenticated:true, cart:{}, prevOrders: prevOrders? prevOrders?.data?.listOrders : []})
        } else if (appUser.client==='provider'){
          const menu= await apiClient.fetchMenuItems(appUser.id)
          setClient('provider')
          setAppState({menuItems: menu?.data?.menuItems, provider:appUser, isAuthenticated:true})
        }
      }
    }

    loadInitialData()

  }, [])

  return (
    <div className='app'>
      <BrowserRouter>
      <Navbar appState={appState} logout={setAppState} setIsOpen={setIsOpen} setViewProfile={setViewProfile}/>
      <Sidebar setAppState={setAppState} setIsOpen= {setIsOpen} cart={appState?.cart} menus={menus} appState={appState} isOpen={isOpen} services={appState?.services}/>
      <Profile setViewProfile={setViewProfile} viewProfile={viewProfile}/> 
      <Routes>
        {
          appState.isAuthenticated ?
        (client==='user'&&
        <>
        <Route path='/' element={<Shop services={appState?.services}  menus={menus}/>}/>
        <Route path='menu/:id' element={<Menu setMenus={setMenus}/>}/>
        <Route path='food/:id' element={<FoodDetail cart={appState.cart} addToCart={setAppState}/>}/>
        <Route path='/orders' element={<Orders services={appState?.services} orders={appState?.prevOrders}/>}/>

        </>
        
        )||
        

        (client==='provider'&&
        <Route path='/' element={<Store appState={appState} updateMenu={setAppState}/>}/>
        )
          : 
          <Route path='/' element={
            <>
            <Hero />
            <Aboutus/>
            <Forsellers/>
            <Locations/>
            <Footer/>
            
            </>
          }/>
          // <> Log in or sign up to continue</>
      
        }
        

        <Route path='/login' element={<Login client= {client} setClient= {setClient} login={setAppState} appState={appState}/>}/>
        <Route path='/register' element={<Register client= {client} setClient= {setClient} register={setAppState} appState={appState}/>}/>
        <Route path='/about' element={<Aboutus/>}/>
        <Route path='/for-sellers' element={<Forsellers/>}/>
        <Route path='/locations' element={<Locations/>}/>
      </Routes>
      </BrowserRouter>
      


      {/* yoooooooo */}
    </div>
  )
}

export default App
