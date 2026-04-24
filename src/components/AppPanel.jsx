import AppHeader from './AppHeader'

/**
 * AppPanel - Reusable app panel component
 * 
 * @param {Object} props
 * @param {string} props.title - Panel title
 * @param {React.ReactNode} props.children - Panel content
 * @param {Function} props.onClose - Close handler
 */
const AppPanel = ({ title, children, onClose, headerActions }) => {
  return (
    <div className="w-full h-full flex flex-col bg-[#0a0a0a]">
      {/* Header */}
      <AppHeader title={title} onClose={onClose} actions={headerActions} />
      
      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6">
        {children}
      </div>
    </div>
  )
}

export default AppPanel
