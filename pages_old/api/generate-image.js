// pages/api/generate-image.js
// API endpoint to generate AI dish images using Replicate or fallback to Unsplash

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { recipeName } = req.body;

  if (!recipeName) {
    return res.status(400).json({ error: 'Recipe name is required' });
  }

  try {
    // Option 1: Use Unsplash API (free, no key needed for basic usage)
    // Construct a search query for the dish
    const searchQuery = encodeURIComponent(`${recipeName} food dish`);
    const unsplashUrl = `https://api.unsplash.com/photos/random?query=${searchQuery}&w=800&h=600&fit=crop&fm=jpg`;
    
    // For production, use an environment variable for Unsplash access key
    const headers = {};
    if (process.env.UNSPLASH_ACCESS_KEY) {
      headers['Authorization'] = `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`;
    }

    const response = await fetch(unsplashUrl, { headers });
    
    if (!response.ok) {
      // Fallback to a generic placeholder image if Unsplash fails
      return res.status(200).json({
        imageUrl: `https://via.placeholder.com/800x600?text=${encodeURIComponent(recipeName)}`,
        source: 'placeholder'
      });
    }

    const data = await response.json();
    
    return res.status(200).json({
      imageUrl: data.urls.regular,
      source: 'unsplash',
      photographer: data.user?.name || 'Unknown',
      photographerUrl: data.user?.links?.html || '#'
    });
  } catch (error) {
    console.error('Error generating image:', error);
    
    // Return a fallback placeholder image
    return res.status(200).json({
      imageUrl: `https://via.placeholder.com/800x600?text=${encodeURIComponent(recipeName)}&bg=f39c12&text_color=ffffff`,
      source: 'placeholder',
      error: error.message
    });
  }
}
