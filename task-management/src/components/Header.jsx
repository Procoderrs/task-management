import React, { useContext, useState, useRef, useEffect } from "react";
 import { BoardContext } from "../context/boardContext"; 
 const Header = () => { const { user, logout, addBoard } = useContext(BoardContext); 
 const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef();
   const handleAddBoard = () => { const title = prompt("Enter board name:"); 
    if (title) addBoard(title); };
     // Close the profile menu when clicking outside
     // 
      useEffect(() => { const handleClickOutside = (event) => { if (menuRef.current && !menuRef.current.contains(event.target)) 
      { setShowProfileMenu(false); } };
       document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside); }, []); 
        return ( 
          
          <header className="bg-linear-to-br from-pink-100 to-purple-100 shadow-2xl px-6 py-4 flex justify-between items-center">
          
           {/* Left side: title + add board */} <div className="flex items-center gap-3"> <h1 className="text-2xl text-purple-800 font-black">Task Management</h1> 


           <button onClick={handleAddBoard} className="bg-purple-800 text-white px-4 py-2 rounded hover:bg-purple-500 transition" > + Add Board </button> 
           </div>
           
            {/* Right side: user/login */}
            
             <div className="relative flex items-center gap-4" ref={menuRef}> 
             
             {user ? (
              
               <> <img src="./profile.jpg" alt="Profile" className="w-12 h-12 rounded-full cursor-pointer" onClick={() => setShowProfileMenu(!showProfileMenu)} />
               
                {/* Profile dropdown */} {showProfileMenu &&
                
                 ( <div className="absolute right-0 mt-36 w-36 bg-white border rounded shadow-lg px-2 py-2 z-50">
                 
                  <p className="font-bold text-purple-800 text-center mb-2">Hi {user.name}</p> 
                  
                  <button onClick={logout} className="w-full bg-red-500 hover:bg-red-600 text-white
                  
                   py-1 rounded" > Logout </button> </div> )} </> )
                  
                   : ( <a href="/login" className="underline"> Login </a> )} </div> </header>
                   
                  ); }; export default Header;