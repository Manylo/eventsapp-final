'use client';

import { useState, useEffect } from 'react';
import CommentList from './CommentList';
import CommentForm from './CommentForm';
import { Comment } from '@/types';

type CommentSectionProps = {
  eventId: string;
  role: any; 
};

const CommentSection = ({ eventId,role }: CommentSectionProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/comments?eventId=${eventId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch comments');
        }
        const data = await response.json();
        setComments(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      }
    };

    fetchComments();
  }, [eventId]);

  const handleCommentSubmit = async (newComment: Comment) => {
    try {
      const response = await fetch(`/api/comments?eventId=${eventId}`);
      const data = await response.json();
      setComments(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  return (
    <div className="comment-section">
      <h2>Commentaires</h2>
      {error ? <p className="error">{error}</p> : <CommentList comments={comments} />}
      {(role!="" && role==="participant") && <CommentForm eventId={eventId} onCommentSubmit={handleCommentSubmit} />}
      
      <style jsx>{`
        .comment-section {
          padding: 1.5rem;
          background: #f1f1f1;
          border-radius: 8px;
          margin-top: 2rem;
        }
        .comment-section h2 {
          margin-bottom: 1rem;
          font-size: 1.5rem;
          color: #333;
        }
        .comment-section ul {
          list-style: none;
          padding: 0;
        }
        .comment-section li {
          margin-bottom: 1rem;
          padding: 1rem;
          background: white;
          border: 1px solid #ddd;
          border-radius: 5px;
        }
        .comment-section li p {
          margin: 0;
        }
        .comment-section li p strong {
          display: block;
          margin-bottom: 0.5rem;
        }
        .comment-section form {
          margin-top: 2rem;
          display: flex;
          flex-direction: column;
        }
        .comment-section textarea {
          padding: 1rem;
          border: 1px solid #ddd;
          border-radius: 5px;
          margin-bottom: 1rem;
          resize: vertical;
          min-height: 150px;
          width: 100%;
        }
        .comment-section button {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 5px;
          background: #0070f3;
          color: white;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.3s;
          align-self: flex-end;
        }
        .comment-section button:hover {
          background: #005bb5;
        }
        .error {
          color: red;
          margin-bottom: 1rem;
        }
      `}</style>
    </div>
  );
};

export default CommentSection;