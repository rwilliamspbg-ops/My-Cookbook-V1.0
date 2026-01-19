export interface ParsedIngredient {
  input: string;
  parsedIngredient: {
    quantity?: number;
    unit?: string;
    ingredient: string;
    preparationNotes?: string;
  };
}

export async function parseIngredientsWithZestful(
  ingredients: string[]
): Promise<ParsedIngredient[]> {
  const apiKey = process.env.ZESTFUL_API_KEY;
  if (!apiKey) throw new Error('ZESTFUL_API_KEY not set');

  try {
    const response = await fetch('https://api.zestfuldata.com/parseIngredients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Zestful-Api-Key': apiKey,
      },
      body: JSON.stringify({ ingredients }),
    });

    if (!response.ok) throw new Error(`Zestful API error: ${response.status}`);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Zestful parsing failed:', error);
    // Fallback: return raw ingredients without parsing
    return ingredients.map((ing) => ({
      input: ing,
      parsedIngredient: { ingredient: ing },
    }));
  }
}
