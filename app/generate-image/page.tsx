"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { apiCall } from '@/utils/apiUtils';
import { button, typography, cn } from '@/utils/classnames';

export default function GenerateImagePage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAppSelector((state: any) => state.auth);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState('');

  if (!loading && !isAuthenticated) {
    router.push('/login');
    return null;
  }

  const generateImage = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt for image generation');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const response = await apiCall<{ image_url: string }>('POST', '/ai/generate-image', {
        prompt: prompt.trim()
      });
      setGeneratedImage(response.image_url);
    } catch (err: any) {
      setError(err.message || 'Failed to generate image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = async () => {
    if (!generatedImage) return;
    
    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `generated-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download image:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className={typography.p1}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className={cn(typography.h1, "mb-4")}>AI Image Generator</h1>
        <p className={cn(typography.p1, "text-secondary-foreground")}>
          Create stunning images with AI. Describe what you want to see and let our AI bring your ideas to life.
        </p>
      </div>

      <div className="bg-card-background rounded-lg border p-6 mb-6">
        <div className="mb-4">
          <label htmlFor="prompt" className={cn(typography.h3, "mb-2 block")}>
            Describe your image
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., A modern kitchen with white cabinets, marble countertops, and pendant lighting..."
            className="w-full min-h-[100px] p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={isGenerating}
          />
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={generateImage}
            disabled={isGenerating || !prompt.trim()}
            className={cn(button.primary, isGenerating && "opacity-50 cursor-not-allowed")}
          >
            {isGenerating ? 'Generating...' : 'Generate Image'}
          </button>
          
          {prompt && (
            <button
              onClick={() => setPrompt('')}
              className={button.secondary}
              disabled={isGenerating}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {generatedImage && (
        <div className="bg-card-background rounded-lg border p-6">
          <h2 className={cn(typography.h2, "mb-4")}>Generated Image</h2>
          <div className="mb-4">
            <img
              src={generatedImage}
              alt={prompt}
              className="w-full max-w-2xl mx-auto rounded-lg shadow-lg"
            />
          </div>
          <div className="flex gap-3 justify-center">
            <button onClick={downloadImage} className={button.primary}>
              Download Image
            </button>
            <button onClick={() => setPrompt(prompt)} className={button.secondary}>
              Regenerate
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
