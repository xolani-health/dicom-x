import React, { useState } from "react"

export default function SideBar() {
  const [shown, setShown] = useState(true)
  return (
    <aside className="bg-teal-400 w-1/6 p-3 flex flex-col">
      {/* Logo */}
      <div>
        <img />
      </div>
    </aside>
  )
}
