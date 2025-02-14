import React, { useState, useEffect } from "react";
import { db, auth, signIn } from "./firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { onSnapshot, query, orderBy } from "firebase/firestore";

interface Comment {
  id: string;          // Unique ID from Firestore
  username: string;    // Name of the commenter
  text: string;        // Comment text
  approved: boolean;   // Approval status (pending initially)
  timestamp: Date;     // Timestamp for sorting
}

const Comments = () => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // Query to get only approved comments, ordered by timestamp
    const q = query(
      collection(db, "comments"),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedComments = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() } as Comment))
        .filter((comment) => comment.approved); // Filter to include only approved comments

      setComments(fetchedComments); // Set the state with approved comments
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    await addDoc(collection(db, "comments"), {
      text: comment,
      username: user.displayName,
      userId: user.uid,
      timestamp: new Date(),
      approved: false // New comments are automatically set to pending (false)
    });

    setComment(""); // Reset comment field
  };

  return (
    <div>
      <h2>Comments</h2>
      {user ? (
        <>
          <p>Logged in as {user?.displayName}</p>
          <button onClick={() => signOut(auth)}>Logout</button>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment..."
            />
            <button type="submit">Post</button>
          </form>
        </>
      ) : (
        <button onClick={signIn}>Login with Google</button>
      )}

      <ul>
        {comments.map((c, index) => (
          <li key={index}>
            <strong>{c.username}</strong>: {c.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Comments;
