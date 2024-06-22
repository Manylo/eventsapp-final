"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Comment {
  _id: string;
  eventId: string;
  userId: string;
  username: string;
  content: string;
  createdAt: Date;
}

interface CommentsSectionProps {
  eventId: string;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ eventId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState<string>('');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`/api/comments?eventId=${eventId}`);
        setComments(response.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
  }, [eventId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const newComment: Omit<Comment, '_id' | 'createdAt'> = { 
        eventId, 
        userId: 'some-user-id', 
        username: 'SomeUser', 
        content 
      };
      const response = await axios.post('/api/comments', newComment);
      setComments([...comments, response.data]);
      setContent('');
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  return (
    <div className="comments-section">
      <h3>Commentaires</h3>
      <ul>
        {comments.map((comment) => (
          <li key={comment._id}>
            <strong>{comment.username}</strong>: {comment.content}
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Laissez un commentaire"
          required
        />
        <button type="submit">Publier</button>
      </form>
    </div>
  );
};

export default CommentsSection;
