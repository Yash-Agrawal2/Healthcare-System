import React from 'react';
function Navbar() {

    return (
    <nav className="bg-blue-500 p-4 text-white">
      <h1 className="text-xl font-bold">Healthcare System DApp</h1>
      <div>
        <li>
          <a href="/">Home</a> 
        </li>
      </div>
    </nav>
  );
}

export default Navbar;