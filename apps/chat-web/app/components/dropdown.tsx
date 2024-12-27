import { useState } from 'react'

interface DropdownProps {
  title: string
  options: Array<{ title: string; action: () => void }>
}

export const Dropdown = (props: DropdownProps): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false)

  const handleOptionClick = (action: () => void) => {
    action()
    setIsOpen(false)
  }

  return (
    <div className="dropdown">
      <div
        tabIndex={0}
        role="button"
        className="btn m-1"
        onClick={() => setIsOpen(!isOpen)}
      >
        {props.title}
      </div>
      {isOpen && (
        <ul
          tabIndex={0}
          className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
        >
          {props.options.map((option, index) => (
            // eslint-disable-next-line @eslint-react/no-array-index-key
            <li key={index}>
              <div onClick={() => handleOptionClick(option.action)}>
                {option.title}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
