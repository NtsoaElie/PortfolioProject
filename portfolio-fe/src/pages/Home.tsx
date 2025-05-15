import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { db, auth } from "./firebaseConfig";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useTranslation } from "react-i18next";
import "./Home.css"; // Import the CSS file
import i18n from "./i18n";

const Home = () => {
  const { t } = useTranslation(); // Initialize i18next translation hook
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<
    { id: string; username: string; text: string; approved: boolean }[]
  >([]);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang); // Change language dynamically
  };

  useEffect(() => {
    // Check if user is logged in
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Check if user has admin role from token claims
        currentUser
          .getIdTokenResult()
          .then((idTokenResult) => {
            // Ensure we set a boolean value for isAdmin (true or false)
            setIsAdmin(idTokenResult.claims.admin === true);
          })
          .catch((error) => {
            // Handle error in case the token retrieval fails
            console.error("Error getting token result:", error);
            setIsAdmin(false); // Default to false if an error occurs
          });
      } else {
        setIsAdmin(false); // Set false if no user is logged in
      }
    });

    // Fetch comments in real-time and filter for approved ones
    const q = query(collection(db, "comments"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setComments(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as {
          id: string;
          username: string;
          text: string;
          approved: boolean;
        }[]
      );
    });

    return () => unsubscribe();
  }, []);

  const handleAddComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return alert(t("login_to_comment")); // Use translation for login prompt
    if (comment.trim() === "") return;

    await addDoc(collection(db, "comments"), {
      text: comment,
      username: user.displayName || "Anonymous",
      timestamp: new Date(),
      approved: false, // New comments are unapproved by default
    });

    setComment(""); // Reset comment input after submission
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleDeleteComment = async (id: string) => {
    try {
      await deleteDoc(doc(db, "comments", id));
    } catch (error) {
      console.error("Error deleting comment: ", error);
    }
  };

  return (
    <div className="page-container">
      <div className="content-wrapper">
        <header className="mb-12">
          <h1 className="header-title">{t("hello")}</h1>
          <p className="header-subtitle">{t("subtitle")}</p>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="grid-container"
        >
          <Link to="/about">
            <div className="card">
              <h2 className="card-title">{t("about_me")}</h2>
              <p className="card-text">{t("about_text")}</p>
            </div>
          </Link>
          <Link to="/projects">
            <div className="card">
              <h2 className="card-title">{t("projects")}</h2>
              <p className="card-text">{t("projects_text")}</p>
            </div>
          </Link>
          <Link to="/contact">
            <div className="card">
              <h2 className="card-title">{t("contact")}</h2>
              <p className="card-text">{t("contact_text")}</p>
            </div>
          </Link>
        </motion.div>

        {isAdmin && (
          <div className="admin-dashboard-link">
            <Link to="/admin">{t("admin_dashboard")}</Link>
          </div>
        )}

        <div className="auth-and-language">
          {user ? (
            <div className="user-icon">
              <img
                src={user.photoURL || "default-avatar.png"}
                alt="User Icon"
                className="user-avatar"
              />
              <button onClick={handleLogout} className="logout-button">
                {t("logout")}
              </button>
            </div>
          ) : (
            <Link to="/login">
              <button className="login-button">{t("login")}</button>
            </Link>
          )}

          <div className="language-switcher">
            <button onClick={() => handleLanguageChange("en")}>English</button>
            <button onClick={() => handleLanguageChange("fr")}>Français</button>
          </div>
        </div>

        <div className="comment-section">
          <h2>{t("comments")}</h2>
          {user ? (
            <form onSubmit={handleAddComment} className="comment-form">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={t("write_comment")}
                className="comment-input"
              />
              <button type="submit" className="comment-button">
                {t("post_comment")}
              </button>
            </form>
          ) : (
            <p>{t("login_to_comment")}</p>
          )}

          <div className="comments-list">
            {comments
              .filter((c) => c.approved)
              .map((c) => (
                <div key={c.id} className="comment">
                  <div className="comment-avatar">
                    {c.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="comment-content">
                    <div className="comment-header">
                      <span className="comment-user">{c.username}</span>
                      {isAdmin && (
                        <button
                          onClick={() => handleDeleteComment(c.id)}
                          className="delete-button"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                    <p className="comment-text">{c.text}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <footer className="footer">
          {t("footer_text")} {new Date().getFullYear()}.
        </footer>
      </div>
    </div>
  );
};

export default Home;
