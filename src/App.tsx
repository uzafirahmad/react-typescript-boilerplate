import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import React from "react";
import { Routes, Route } from "react-router-dom";
import { Provider } from "./components/AppContext";
import PrivateRoutes from "./PrivateRoutes";

function App() {
  return (
    <div className="App">
      <Provider>
        <Routes>
          <Route element={<PrivateRoutes />}>
            <Route path="/" element={<Home />} />
          </Route>

          <Route path="/login" element={<Login />} />
        </Routes>
      </Provider>
    </div>
  );
}

export default App;

// import React from 'react';
// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.tsx</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
