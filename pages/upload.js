import { useState } from 'react';
import Link from 'next/link';
import SharedStyles from '../components/SharedStyles';
import axios from 'axios';

export default function UploadPage() {
  const [urlInput, setUrlInput] = useState('');
  const [textInput, setTextInput] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [inputMethod, setInputMethod] = useState('url');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

   const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const formData = new FormData();

      if (inputMethod === 'url' && urlInput) {
        formData.append('inputType', 'url');
        formData.append('url', urlInput);
      } else if (inputMethod === 'text' && textInput) {
        formData.append('inputType', 'text');
        formData.append('text', textInput);
      } else if (inputMethod === 'pdf' && pdfFile) {
        formData.append('inputType', 'pdf');
        formData.append('file', pdfFile);
      } else {
        setMessage({ type: 'error', text: 'Please provide recipe input.' });
        setLoading(false);
        return;
      }

      // 1. Parse with OpenAI
      const parseResponse = await axios.post('/api/parse-recipe', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const parsed = parseResponse.data?.recipe;
      if (!parsed) {
        setMessage({ type: 'error', text: 'No recipe returned from parser.' });
        setLoading(false);
        return;
      }

      // 2. Save parsed recipe to DB
      await axios.post('/api/recipes', {
        title: parsed.title,
        description: parsed.description,
        ingredients: parsed.ingredients,
        instructions: parsed.instructions,
        prepTime: parsed.prepTime,
        cookTime: parsed.cookTime,
        servings: parsed.servings,
        category: parsed.category,
      });

      setMessage({ type: 'success', text: 'Recipe parsed and saved!' });
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    } catch (error) {
      console.error('Upload/parse error:', error);
      setMessage({
        type: 'error',
        text:
          error.response?.data?.error ||
          'Failed to parse and save recipe. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

