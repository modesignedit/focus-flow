import { useState, useRef } from 'react';
import { Camera, Trash2, Loader2 } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AvatarUploadProps {
  avatarUrl: string | null;
  displayName: string | null;
  email: string;
  onUpload: (file: File) => Promise<{ error: string | null }>;
  onRemove: () => Promise<{ error: string | null }>;
}

// Avatar upload component with preview and actions
export function AvatarUpload({ avatarUrl, displayName, email, onUpload, onRemove }: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const initials = displayName
    ? displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : email[0].toUpperCase();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    await onUpload(file);
    setUploading(false);
    
    // Reset input
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleRemove = async () => {
    setRemoving(true);
    await onRemove();
    setRemoving(false);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Avatar with overlay */}
      <div className="relative group">
        <Avatar className="h-28 w-28 ring-4 ring-background shadow-lg">
          <AvatarImage src={avatarUrl || undefined} alt={displayName || email} />
          <AvatarFallback className="text-2xl bg-primary/10 text-primary">
            {initials}
          </AvatarFallback>
        </Avatar>

        {/* Upload overlay */}
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className={cn(
            'absolute inset-0 flex items-center justify-center rounded-full',
            'bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity',
            'cursor-pointer disabled:cursor-not-allowed'
          )}
        >
          {uploading ? (
            <Loader2 className="h-8 w-8 text-white animate-spin" />
          ) : (
            <Camera className="h-8 w-8 text-white" />
          )}
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Camera className="h-4 w-4 mr-2" />
              {avatarUrl ? 'Change' : 'Upload'}
            </>
          )}
        </Button>

        {avatarUrl && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            disabled={removing}
            className="text-destructive hover:text-destructive"
          >
            {removing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
