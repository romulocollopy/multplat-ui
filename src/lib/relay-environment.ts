import {
  Environment,
  Network,
  RecordSource,
  Store,
  RequestParameters,
  Variables,
} from 'relay-runtime';
import axios from 'axios';

const API_URL = import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:8000/graphql/';

axios.defaults.withCredentials = true;

async function fetchGraphQL(params: RequestParameters, variables: Variables) {
  // Extract the query text from the RequestParameters
  const queryText = params.text;

  if (!queryText) {
    throw new Error('No query text provided to fetchGraphQL');
  }

  const response = await axios.post(
    `${API_URL}`,
    {
      query: queryText,
      variables,
    },
    {
      headers: {
        'X-CSRFToken': getCSRFTokenFromCookie() || '',
      },
    }
  );

  return response.data;
}

function getCSRFTokenFromCookie(): string | null {
  const name = 'csrftoken';

  // Handle cases where cookie might have spaces or special encoding
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }

  return null;
}

async function ensureCSRFToken(): Promise<void> {
  if (!getCSRFTokenFromCookie()) {
    try {
      // Make a HEAD request to Django to set the CSRF cookie
      await axios.head(`${API_URL}`, {});
    } catch (error) {
      console.warn('Failed to ensure CSRF token:', error);
      // Continue without CSRF token
    }
  }
}

const network = Network.create(fetchGraphQL);
const store = new Store(new RecordSource());

export const environment = new Environment({
  network,
  store,
});
