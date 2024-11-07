import React from 'react'
import Navbar from "../components/Homepage/Navbar"
import Sliderbar from '../components/Homepage/Sliderbar'
import Footer from '../components/Homepage/Footer'
import Events from '../components/Homepage/Events'
import Cards from '../components/Homepage/Cards'

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      
      <Navbar/>

      <br></br>

      <Sliderbar/>

      <br></br>
      <br></br>

        <main className="flex flex-grow container justify-center mx-auto px-4 py-8">
          <div className=' flex justify-center items-center flex-col'>
            {/* Add your page content here */}
            <h1 className="text-3xl font-bold">Welcome to Meeting Point</h1>
            <p className="mt-4">Connecting people for meaningful meetings and conversations.</p>
            {/* More content... */}
          </div>

        </main>
        
        <br></br>

      
      <Events/>



      <div className=' text-gray-600 font-bold text-3xl flex justify-center '> There Are Some Beautiful Places In INDIA</div>

      <Cards/>

        <br></br>
        <br></br>      
        <br></br>      
        <br></br>      

      <Footer/>
    </div>
  )
}

export default Home
