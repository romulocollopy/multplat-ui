import { Environment, Network, RecordSource, Store } from 'relay-runtime';

async function fetchGraphQL(text: string | null | undefined, variables: unknown) {
  const response = await fetch(
    import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:4000/graphql',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add authentication if needed
        Authorization: localStorage.getItem('token')
          ? `Bearer ${localStorage.getItem('token')}`
          : '',
      },
      body: JSON.stringify({
        query: text,
        variables,
      }),
    }
  );

  return await response.json();
}

const network = Network.create(fetchGraphQL);
const store = new Store(new RecordSource());

export const environment = new Environment({
  network,
  store,
});
