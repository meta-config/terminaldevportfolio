const TerminalHeader = ({ title = 'samarsingh@portfolio: ~' }) => {
  return (
    <div className="bg-[#1a1a1a] px-4 py-2 border-b border-neutral-800">
      <div className="flex items-center">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 bg-red-500" aria-hidden />
          <span className="w-2.5 h-2.5 bg-yellow-500" aria-hidden />
          <span className="w-2.5 h-2.5 bg-green-500" aria-hidden />
        </div>
        <div className="flex-1 text-center text-sm text-red-500 font-mono">
          {title}
        </div>
        <div className="w-[44px]" />
      </div>
    </div>
  )
}

export default TerminalHeader
