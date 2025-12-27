// Netlify Function para búsqueda de ciudades
// Sin restricciones CORS porque se ejecuta en el servidor

exports.handler = async (event, context) => {
  // Permitir CORS desde cualquier origen
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Manejar preflight request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Obtener query parameter
  const query = event.queryStringParameters.q;
  
  if (!query || query.length < 3) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Query debe tener al menos 3 caracteres' })
    };
  }

  try {
    // Hacer petición a Nominatim desde el servidor (sin CORS)
    const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&addressdetails=1`;
    
    const response = await fetch(nominatimUrl, {
      headers: {
        'User-Agent': 'Tarot28Arcanos/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data)
    };

  } catch (error) {
    console.error('Error en función geocode:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Error al buscar ciudades',
        message: error.message 
      })
    };
  }
};
