import logo from './logo.svg';
import {useEffect, useState} from 'react'
import './App.css';
import Layout from './components/common/layout';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('get-candidates')
      .then((response) => response.json())
      .then((data) => setMessage(data.message))
      .catch((error) => console.error('Error:', error));
  }, []);

  return (
    <div>
     <Layout>
        This is body
     </Layout>
    </div>
  );
}

export default App;


