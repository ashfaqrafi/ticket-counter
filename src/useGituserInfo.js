import { useState } from "react";

export default function useGituserInfo() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUserData = async (username) => {
    const githubLink = `https://api.github.com/users/${username}`;
    setLoading(true);
    setError(null);

    try {
      const getData = await fetch(githubLink);
      if (!getData.ok) {
        throw new Error(`User with ${username} not found`);
      }
      const userData = await getData.json();
      setUser(userData);
    } catch (error) {
      setError(error.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, error, fetchUserData };
}
