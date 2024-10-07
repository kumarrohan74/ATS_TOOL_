import logo from './logo.svg';
import './App.css';
import Layout from './components/common/layout';
import { Router } from './components/routes';
function App() {


  return (
    <div>
      <Layout>
        <Router />
      </Layout>
    </div>
  );
}

export default App;


