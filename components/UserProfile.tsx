import { useEffect, useState } from "react";

interface UserProfileProps {
  accountId: string;
  sessionId: string;
}

interface UserDetails {
  username: string;
  email: string;
  // Add more fields as needed
}

const UserProfile = ({ accountId, sessionId }: UserProfileProps) => {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`/api/auth/get-user-details?account_id=${accountId}&session_id=${sessionId}`);
        const data = await response.json();

        if (response.ok) {
          setUserDetails(data);
        } else {
          setError(data.error);
        }
      } catch (err) {
        console.error("Error fetching user details:", err);
        setError("Error fetching user details");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [accountId, sessionId]);

  if (loading) return <p>Loading user details...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>User Details</h1>
      {userDetails && (
        <div>
          <p>Username: {userDetails.username}</p>
          <p>Email: {userDetails.email}</p>
          {/* Add more fields as needed */}
        </div>
      )}
    </div>
  );
};

export default UserProfile;
