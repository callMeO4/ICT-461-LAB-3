
 // Helper function to handle Fetch requests to the API.
export async function fetchHelper(url, method = 'GET', data = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(url, options);
        // We will parse the response in app.js depending on the status code
        return response; 
    } catch (error) {
        console.error("Network error:", error);
        throw error;
    }
}