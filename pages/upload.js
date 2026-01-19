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
  const [parsedRecipe, setParsedRecipe] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setParsedRecipe(null);

    try {
      const formData = new FormData();
      formData.append('inputType', inputMethod);

      if (inputMethod === 'pdf') {
        if (!pdfFile) {
          setMessage({ type: 'error', text: 'Please select a PDF file.' });
          setLoading(false);
          return;
        }
        formData.append('file', pdfFile); // key must be "file"
      } else if (inputMethod === 'url') {
        formData.append('url', urlInput);
      } else if (inputMethod === 'text') {
        formData.append('text', textInput);
      }

      // Let axios set Content-Type + boundary automatically
      const response = await axios.post('/api/parse-recipe', formData);

      if (response.data.success) {
        setParsedRecipe(response.data.recipe);
        setMessage({ type: 'success', text: '✅ Recipe parsed successfully!' });
      } else {
        setMessage({ type: 'error', text: '❌ Failed to parse recipe' });
      }
    } catch (error) {
      console.error('Parse error:', error);

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 422 && error.response?.data?.recipe) {
          setParsedRecipe(error.response.data.recipe);
          setMessage({
            type: 'error',
            text:
              '⚠️ ' +
              (error.response.data.error ||
                'Weak recipe format. Please review and edit manually.'),
          });
        } else {
          setMessage({
            type: 'error',
            text: `❌ Error: ${error.response?.data?.error || error.message}`,
          });
        }
      } else {
        setMessage({
          type: 'error',
          text: '❌ Unexpected error while parsing recipe.',
        });
      }
    } finally {
      setLoading(false);
    }
  };
