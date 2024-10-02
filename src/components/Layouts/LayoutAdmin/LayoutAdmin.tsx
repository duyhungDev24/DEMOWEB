import Footer from '@/Landings/Footer'
import { Outlet } from 'react-router-dom'
import Sidebar from '../Sidebar/Sidebar'



const LayoutAdmin = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-grow">
        <Sidebar />
        <div className="flex-grow p-8">
          <div>
            <h1 className='text-3xl font-sans'>Chào Mừng ADMIN !</h1>
          </div>
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default LayoutAdmin