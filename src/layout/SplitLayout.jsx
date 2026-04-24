import { useLayout } from './LayoutContext'

const SplitLayout = ({ leftPanel, rightPanel }) => {
  const { isAppOpen } = useLayout()

  return (
    <div className="w-full h-screen overflow-hidden bg-black p-2">
      <div className={`flex h-full w-full gap-2 ${isAppOpen ? 'md:flex-row flex-col' : 'flex-col md:flex-row'}`}>
        {/* Left Panel - Terminal */}
        <div
          className={`min-w-0 overflow-hidden transition-all duration-300 ease-out ${
            isAppOpen ? 'w-full md:w-1/2 h-1/2 md:h-full' : 'w-full h-full'
          }`}
        >
          <div className="w-full h-full overflow-hidden border border-neutral-900 bg-black">
            {leftPanel}
          </div>
        </div>

        {/* Right Panel - App */}
        <div
          className={`min-w-0 overflow-hidden transition-all duration-300 ease-out ${
            isAppOpen
              ? 'w-full md:w-1/2 h-1/2 md:h-full opacity-100 translate-x-0'
              : 'w-0 md:w-0 h-0 md:h-full opacity-0 translate-x-2 pointer-events-none'
          }`}
        >
          <div className="w-full h-full overflow-hidden border border-neutral-800 bg-[#0a0a0a]">
            {rightPanel}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SplitLayout
