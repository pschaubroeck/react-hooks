// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import React from 'react';
import {ErrorBoundary} from 'react-error-boundary';
import {PokemonForm, fetchPokemon, PokemonInfoFallback, PokemonDataView} from '../pokemon';

function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState({ 
    status: pokemonName ? 'pending' : 'idle',
    pokemon: null,
    error: null
  });
  
  React.useEffect(() => {
    
    if (!pokemonName) {
      return;
    }

    setState({ status: 'pending' });
    fetchPokemon(pokemonName).then(pokemon => {
      setState({ status: 'resolved', pokemon });
    }, error => {
      setState({ status: 'rejected', error });
    });
  },[pokemonName]);
  
  if (state.status === 'idle') {
    return 'Submit a pokemon'
  } else if (state.status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />;
  } else if (state.status === 'resolved') {
    return <PokemonDataView pokemon={state.pokemon} />;
  } else if (state.status === 'rejected') {
    throw state.error;
  }
  
  return 'Unknown status';
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }
  
  function handleReset() {
    setPokemonName('');
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary FallbackComponent={PokemonInfoErrorFallback} resetKeys={[pokemonName]} onReset={handleReset}>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

function PokemonInfoErrorFallback({error, resetErrorBoundary}) {
  return (
    <div role="alert">
      There was an error: <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try Again</button>
    </div>
  );
}

export default App
