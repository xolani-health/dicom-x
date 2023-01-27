import { useEffect, useState } from "react"
import { v4 as uuidv4 } from "uuid"
import NavItem from "../NavItem/NavItem"

const SCHEMA = [
  {
    name: "Magnify",
    title: "Magnify",
    icon: "loupe",
    children: [],
  },

  { name: "Zoom", title: "Zoom", icon: "zoom_in", children: [] },

  { name: "EllipticalRoi", title: "Ellipse", icon: "all_out", children: [] },

  { name: "TextMarker", title: "Text", icon: "edit_note", children: [] },

  {
    name: "Rotate",
    title: "Rotate",
    icon: "rotate_90_degrees_cw",
    children: [],
  },

  { name: "Pan", title: "Pan", icon: "open_with", children: [] },

  {
    name: null,
    title: "Angle",
    icon: "square_foot",
    children: [
      { name: "Angle", title: "Regular", icon: "chevron_left" },
      { name: "CobbAngle", title: "Cobb", icon: "ssid_chart" },
    ],
  },

  {
    name: null,
    title: "Freehand",
    icon: "polyline",
    children: [
      { name: "FreehandRoi", title: "Regular", icon: "gesture" },
      {
        name: "EllipticalRoi",
        title: "Elliptical ROI",
        icon: "check_box_outline_blank",
      },
      {
        name: "RectangleRoi",
        title: "Rectangular ROI",
        icon: "radio_button_unchecked",
      },
    ],
  },

  {
    name: null,
    title: "Length",
    icon: "settings_ethernet",
    children: [
      {
        name: "ArrowAnnotate",
        title: "Arrow Anotate",
        icon: "arrow_right_alt ",
      },
      { name: "Length", title: "Length", icon: "straighten" },
      {
        name: "Bidirectional",
        title: "Bidirectional",
        icon: "grid_goldenratio",
      },
    ],
  },

  {
    name: null,
    title: "Probe",
    icon: "radio_button_checked",
    children: [
      { name: "Probe", title: "Regular", icon: "adjust" },
      { name: "DragProbe", title: "Drag", icon: "adjust" },
    ],
  },

  {
    name: null,
    title: "WWWC",
    icon: "invert_colors",
    children: [
      { name: "Wwwc", title: "WWWC", icon: "invert_colors" },
      { name: "WwwcRegion", title: "Region", icon: "check_box_outline_blank" },
    ],
  },

  {
    name: null,
    title: "Scissors",
    icon: "highlight",
    children: [
      { name: "FreehandScissors", title: "Freehand", icon: "content_cut" },
      { name: "CircleScissors", title: "Circle", icon: "join_full" },
      { name: "RectangleScissors", title: "Rectangle", icon: "rectangle" },
    ],
  },

  {
    name: "Reset",
    title: "Reset",
    icon: "restart_alt",
    children: [],
  },

  // {
  //   name: null,
  //   title: "Hide/Show Mask",
  //   icon: "visibility",
  //   children: [],
  // },

  // {
  //   name: null,
  //   title: "Fullscreen",
  //   icon: "fullscreen",
  //   children: [],
  // },

  // {
  //   name: null,
  //   title: "Help",
  //   icon: "help_outline",
  //   children: [],
  // },

  // {
  //   name: null,
  //   title: "User",
  //   icon: "account_circle",
  //   children: [
  //     { name: null, title: "Profile", icon: "account_circle" },
  //     { name: null, title: "Logout", icon: "logout" },
  //   ],
  // },
].map((item) => {
  return { ...item, id: uuidv4() }
})

export default function NavBar() {
  const [shownChildren, setShownChildren] = useState<string | null>(null)
  useEffect(() => {
    console.log(shownChildren)
  }, [shownChildren])
  return (
    <nav className="border-b-2 shadow-md shadow-black shrink-0">
      <div className="p-3 flex justify-between items-center gap-4">
        {SCHEMA.map(({ id, icon, title, name, children }) => (
          <NavItem
            key={id}
            icon={icon}
            title={title}
            name={name}
            children={children}
            showChildren={id === shownChildren}
            clickFunc={() =>
              setShownChildren(() => (id === shownChildren ? null : id))
            }
          />
        ))}
      </div>
    </nav>
  )
}
