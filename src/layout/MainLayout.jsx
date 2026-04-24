const MainLayout = ({ children }) => {
  return (
    <div className="w-full h-screen overflow-hidden bg-black p-2">
      <div className="w-full h-full transition-all duration-300 ease-out">
        <div className="w-full h-full overflow-hidden bg-black">
          {children}
        </div>
      </div>
    </div>
  )
}

export default MainLayout
