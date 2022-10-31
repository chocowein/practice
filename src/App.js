import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import Tasks from './pages/Tasks';
import Statuses from './pages/Statuses';

function App () {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Tasks/>}/>
        <Route path="status" element={<Statuses/>}/>
        <Route path="*" element={<Navigate to="/"/>}/>
      </Routes>
    </Router>
  )
};

export default App;