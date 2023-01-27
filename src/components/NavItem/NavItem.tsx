import { v4 as uuidv4 } from "uuid"

type NavItemBase = {
  icon: string
  title: string
  name: string | null
  clickFunc?: () => void
}

type NavItemProps = NavItemBase & {
  children?: NavItemBase[]
  showChildren?: boolean
}
export default function NavItem({
  icon,
  title,
  name,
  children = [],
  showChildren = false,
  clickFunc,
}: NavItemProps) {
  const childrenContainerHeight = children.length * 10
  return (
    <div className="relative shrink-0" onClick={clickFunc}>
      {/* Main NavItem */}
      <div
        className="p-2 cursor-pointer hover:bg-teal-500 hover:rounded-md ease-linear duration-200 hover:p-4 flex justify-center items-center"
        title={title}>
        <span className="material-symbols-outlined">{icon}</span>
        {children && children.length ? (
          <span className="material-symbols-outlined">arrow_drop_down</span>
        ) : (
          <></>
        )}
      </div>

      {/* Children */}
      {children.length ? (
        <div
          className={`absolute z-10 ease-linear duration-200 bg-black/90 rounded-md flex flex-col gap-2 ${
            showChildren
              ? `${
                  children.length > 2 ? "h-[10.5rem]" : "h-[6.75rem]"
                } overflow-y-hidden items-center`
              : "h-0 overflow-hidden"
          }`}>
          {children.map(({ icon, name, title }) => (
            // <NavItem key={uuidv4()} title={title} icon={icon} name={name} />
            <div className="border-b-2 cursor-pointer p-3 flex w-full">
              <span className="material-symbols-outlined mr-2">{icon}</span>
              <span className="text-sm whitespace-nowrap">{title}</span>
            </div>
          ))}
        </div>
      ) : (
        <></>
      )}
    </div>
  )
}
