import React from 'react'
import Navbar from "../components/Homepage/Navbar"
import Sliderbar from '../components/Homepage/Sliderbar'
import Footer from '../components/Homepage/Footer'
import { getAuth } from 'firebase/auth'

const Home = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  return (
    <div className="flex flex-col min-h-screen">
      
      <Navbar/>

      <Sliderbar/>

        <main className="flex flex-grow container justify-center mx-auto px-4 py-8">
          <div className=' flex justify-center items-center flex-col'>
            {/* Add your page content here */}
            <h1 className="text-3xl font-bold">Welcome to Meeting Point</h1>
            <p className="mt-4">Connecting people for meaningful meetings and conversations.</p>
            {/* More content... */}
          </div>

        </main>
      <Footer/>
    </div>
  )
}

export default Home
