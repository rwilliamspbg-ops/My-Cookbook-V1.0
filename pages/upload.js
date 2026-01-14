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
        formData.append('file', pdf

