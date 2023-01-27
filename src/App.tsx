import { useState } from "react"
import Main from "./components/Main/Main"
import NavBar from "./components/NavBar/NavBar"
import SideBar from "./components/SideBar/SideBar"

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(true)
  return (
    <div className="text-white h-full border-2 rounded-md shadow-black shadow-md font-roboto">
      <div className="w-full h-full flex">
        <SideBar />
        <div className="flex flex-col w-full h-full">
          <NavBar />
          <Main />
        </div>
      </div>
    </div>
  )
}
