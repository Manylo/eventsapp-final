// components/shared/CommentForm.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { Comment } from '@/types';

type CommentFormProps = {
  eventId: string;
  onCommentSubmit: (comment: Comment) => void;
};

const CommentForm = ({ eventId, onCommentSubmit }: CommentFormProps) => {
  const { userId } = useAuth();
  const [content, setContent] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      alert('You need to be logged in to post a comment.');
      return;
    }

    const commentData = { eventId, userId, content };
    console.log('Sending comment data:', commentData);

    const response = await fetch('/api/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(commentData),
    });

    if (response.ok) {
      const newComment: Comment = await response.json();
      setContent('');
      onCommentSubmit(newComment);
    } else {
      console.error('Failed to post comment');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your comment..."
        required
      />
      <button type="submit">Publish</button>
    </form>
  );
};

export default CommentForm;
