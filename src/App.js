import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from "react";
import Spinner from 'react-bootstrap/Spinner';
import HeroCard from './HeroCard';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';

function fetchResults(searchTerm) {
  const key = '06fe8b4b28a28284281bb8dca41372f5';
  const params = new URLSearchParams({
    apikey: key,
    limit: 20,
  });
  if (searchTerm !== '') {
    params.append("nameStartsWith", searchTerm);
  }
  return fetch(`https://gateway.marvel.com/v1/public/characters?` + params, {
    method: "GET",
  })
    .then(response => response.json())
    .then(json => json.data.results)
    .catch(error => {
      console.log(error);
      return [];
    })
}

function useDebounce(value, delay) {

  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay] // Only re-call effect if value or delay changes
  );
  return debouncedValue;

}

function App() {

  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 1000);

  useEffect(() => {
    setIsLoading(true);
    fetchResults(searchTerm).then(results => {
      //console.log(results);
      console.log('request made');
      setResults(results);
      setIsLoading(false);
    })
  }, [debouncedSearchTerm]);

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  }

  return (
    <div className="App">
      <Container>
        <h1>Welcome to my React - Marvel API page!</h1>

        <Row className='heros-container'>
          <Form.Label htmlFor="heroName" id="heroLabel">Hero name</Form.Label>
          <Form.Control type="text" id="heroName" placeholder="Enter hero name" onChange={handleInputChange} />

        </Row>

        {isLoading && <Spinner animation="border" variant="primary" />}
        <Row >
          {results.map(hero =>
            <Col xs={3} key={hero.id}>
              <HeroCard hero={hero}>
              </HeroCard>
            </Col>

          )}

        </Row>
      </Container>


    </div>
  );
}

export default App;
