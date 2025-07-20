"use client";

import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {useAppSelector, useAppDispatch} from '@/store/hooks';
import {generateAIImage, clearError, clearHistory, setCurrentImage} from '@/store/slices/imageSlice';
import {button, typography, cn, ui, layout, form} from '@/utils/classnames';
import {ImageGenerationHistory} from '@/types';

export default function GenerateImagePage() {
  const [mounted, setMounted] = useState(false); // !!! must be at the top level to avoid SSR hydration error
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {isAuthenticated, loading: authLoading} = useAppSelector(state => state.auth);
  const {history, isGenerating, error, currentImage} = useAppSelector(state => state.image);
  const [prompt, setPrompt] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [router, mounted, authLoading, isAuthenticated]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleGenerateImage = async () => {
    if (!prompt.trim()) {
      return;
    }

    dispatch(generateAIImage({prompt: prompt.trim()}));
  };

  const handleRegenerateImage = (historyItem: ImageGenerationHistory) => {
    setPrompt(historyItem.prompt);
    dispatch(generateAIImage({prompt: historyItem.prompt}));
  };

  const handleSelectImage = (imageUrl: string) => {
    dispatch(setCurrentImage(imageUrl));
  };

  const downloadImage = async (imageUrl: string, prompt: string) => {
    try {
      const res = await fetch(`/api/download?url=${encodeURIComponent(imageUrl)}&prompt=${encodeURIComponent(prompt)}`);
      if (!res.ok) {
        throw new Error('Download failed');
      }

      // convert the response into a Blob (binary data the browser understands)
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      // create a temporary <a> element for download
      const link = document.createElement('a');
      link.href = url;
      link.download = `${prompt.slice(0, 30).replace(/[^a-zA-Z0-9]/g, '-')}-${Date.now()}.png`;

      // trigger download by "clicking"
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
      alert('Failed to download image.');
    }
  };

  const handleClearHistory = () => {
    dispatch(clearHistory());
  };

  if (!mounted || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className={ui.busy}></div>
          <p className={typography.p1}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={layout.container}>
      <div className="mb-8">
        <p className={cn(typography.h1, "mb-4")}>AI Image Generator</p>
        <p className={cn(typography.p1, "text-secondary-foreground")}>
          Create stunning images with AI. Describe what you want to see and let our AI bring your ideas to life.
        </p>
      </div>

      {/* Input Section */}
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
            className={cn(form.textarea, "min-h-[70px]")}
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
            onClick={handleGenerateImage}
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

      {/* Current/Selected Image Display */}
      {currentImage && (
        <div className="bg-card-background rounded-lg border p-6">
          <h2 className={cn(typography.h2, "mb-4")}>Current Image</h2>
          <div className="mb-4 h-[20rem]">
            <img
              src={currentImage}
              alt="Generated image"
              className="h-full bg-contain rounded-lg shadow-lg"
            />
          </div>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => downloadImage(currentImage, prompt || 'generated-image')}
              className={button.primary}
            >
              Download Image
            </button>
            {prompt && (
              <button
                onClick={() => handleGenerateImage()}
                className={button.secondary}
                disabled={isGenerating}
              >
                Regenerate
              </button>
            )}
          </div>
        </div>
      )}

      {/* Conversation History */}
      {history.length > 0 && (
        <div className="bg-card-background rounded-lg border p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
          <h2 className={cn(typography.h2)}>Generation History</h2>
            <button
              onClick={handleClearHistory}
              className={cn(button.secondary, "text-sm")}
              disabled={isGenerating}
            >
              Clear History
            </button>
          </div>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {history.map((item: ImageGenerationHistory) => (
              <div key={item.id} className="border rounded-lg p-4 bg-background">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="md:w-1/3">
                    <img
                      src={item.image_url}
                      alt={item.prompt}
                      className={cn(
                        "w-full h-32 object-cover rounded cursor-pointer transition-opacity",
                        currentImage === item.image_url ? "ring-2 ring-primary" : "hover:opacity-80"
                      )}
                      onClick={() => handleSelectImage(item.image_url)}
                    />
                  </div>
                  <div className="md:w-2/3">
                    <p className={cn(typography.p2, "mb-2 font-medium")}>Prompt:</p>
                    <p className={cn(typography.p2, "text-secondary-foreground mb-3")}>{item.prompt}</p>
                    <p className={cn(typography.p3, "text-muted-foreground mb-3")}>
                      Generated: {new Date(item.created_at).toLocaleString()}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRegenerateImage(item)}
                        className={cn(button.secondary, "text-sm")}
                        disabled={isGenerating}
                      >
                        Regenerate
                      </button>
                      <button
                        onClick={() => downloadImage(item.image_url, item.prompt)}
                        className={cn(button.secondary, "text-sm")}
                      >
                        Download
                      </button>
                      <button
                        onClick={() => handleSelectImage(item.image_url)}
                        className={cn(button.secondary, "text-sm")}
                      >
                        View Large
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}