import styled from 'styled-components';
import './App.css';
import GroceryList from './components/GroceryList';

function App() {
  return (
    <DIV className="App">
      <GroceryList/>
    </DIV>
  );
}

export default App;

const DIV=styled.div`
  background-image: linear-gradient(15deg, #13547a 0%, #80d0c7 100%);
`