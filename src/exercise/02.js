// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import React from 'react'

const useLocalStorageState = (key, defaultValue = '') => {

	const [state, setState] = React.useState(() => {

		let localStorageObject = window.localStorage.getItem(key);
		if (localStorageObject) {
			return JSON.parse(localStorageObject).value;
		}

		return typeof defaultValue === 'function' ? defaultValue() : defaultValue;
	});

	React.useEffect(() => {
		window.localStorage.setItem(key, JSON.stringify({ value: state }));
	}, [key, state]);

	return [state, setState];
}

function Greeting({initialName = ''}) {
  const [name, setName] = useLocalStorageState('name', initialName);

	function handleChange(event) {
		setName(event.target.value)
	}

  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input onChange={handleChange} id="name" value={name}/>
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting initialName="default"/>
}

export default App
