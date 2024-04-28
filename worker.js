addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {

  const url = 'WEBHOOK_URL';
  
  const headers = new Headers({
    'Content-Type': 'text/plain',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers });
  }

  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { headers, status: 405 });
  }

  const contentType = request.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    return new Response('Unsupported Media Type', { headers, status: 415 });
  }

  try {
    const requestBody = await request.json();
    const content = requestBody.content;

    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });

    return new Response('Success.', { headers, status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return new Response('Internal Server Error', { headers, status: 500 });
  }
}