"use client";
import React from 'react';
import { useUser, useClerk } from '@clerk/nextjs';

export default function Logout() {
  const { signOut } = useClerk();
  const { isSignedIn, user} = useUser();

  const handleLogout = async () => {
    try {
      await signOut();
      // Optionally, you can add any post-logout logic here
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <>
      {isSignedIn ? (
        <div>
          <p>Hi {user.firstName}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <p>You are not signed in</p>
      )}
    </>
  );
}
