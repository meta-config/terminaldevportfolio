const AppHeader = ({ title, onClose, actions = [] }) => {
  return (
    <div className="bg-[#0a0a0a] px-4 py-2 flex items-center justify-between border-b border-neutral-800">
      <div className="text-sm text-red-500 font-mono">
        {title}
      </div>
      <div className="flex items-center gap-2">
        {actions.map((action) => (
          <button
            key={action.label}
            type="button"
            onClick={action.onClick}
            className="px-2 py-0.5 border border-neutral-700 text-red-500 hover:bg-neutral-900 text-xs"
            aria-label={action.label}
          >
            {action.icon || action.label}
          </button>
        ))}
        <button
          type="button"
          onClick={onClose}
          className="px-2 py-0.5 border border-neutral-700 text-red-500 hover:bg-neutral-900"
          aria-label="Close app"
        >
          ✕
        </button>
      </div>
    </div>
  )
}

export default AppHeader
