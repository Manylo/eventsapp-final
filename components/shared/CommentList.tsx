import React from 'react';
import { Comment } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale'; // Import French locale

type CommentListProps = {
  comments: Comment[];
};

const CommentList = ({ comments }: CommentListProps) => {
  if (!comments || comments.length === 0) {
    return <p>No comments available.</p>;
  }

  return (
    <ul className="comment-list">
      {comments.map((comment) => (
        <li key={comment._id} className="comment-item">
          <p><strong>User: {comment.user.username}</strong></p>
          <p>{comment.content}</p>
          <p className="comment-date"> {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: fr })}</p>
        </li>
      ))}
      <style jsx>{`
        .comment-list {
          margin: 0;
          padding: 0;
          list-style: none;
        }
        .comment-item {
          margin-bottom: 1.5rem;
          padding: 1rem;
          background: #fff;
          border: 1px solid #ddd;
          border-radius: 5px;
        }
        .comment-item p {
          margin: 0.5rem 0;
        }
        .comment-item p strong {
          display: inline-block;
          margin-bottom: 0.5rem;
        }
        .comment-date {
          font-size: 0.875rem;
          color: #666;
        }
      `}</style>
    </ul>
  );
};

export default CommentList;
