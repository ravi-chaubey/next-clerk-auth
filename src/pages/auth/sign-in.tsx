'use client';

import React, { useState } from 'react';
import { useSignIn, useSignUp } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { formatPhoneNumber } from '@/lib/utils';

type AuthStep = 'checkUser' | 'signIn' | 'signUp' | 'verifySignIn' | 'verifySignUp';

interface APIError {
  message: string;
  status?: number;
}

interface APIErrorResponse {
  response?: {
    data?: APIError;
    status?: number;
  };
  message: string;
}

export default function AuthPage() {
  const { isLoaded: isSignInLoaded, signIn, setActive: setSignInActive } = useSignIn();
  const { isLoaded: isSignUpLoaded, signUp, setActive: setSignUpActive } = useSignUp();
  const router = useRouter();

  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [step, setStep] = useState<AuthStep>('checkUser');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if User Exists via Server-Side API
  const checkUserExists = async (formattedPhone: string): Promise<boolean> => {
    try {
      const response = await axios.post<{ exists: boolean }>('/api/check-user', { phoneNumber: formattedPhone });
      return response.data.exists;
    } catch (err) {
      const error = err as APIErrorResponse;
      console.error('Error checking user existence:', error);
      throw new Error(error.response?.data?.message || 'Failed to check user existence');
    }
  };

  // Handle Initial Form Submission
  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const formattedPhone = formatPhoneNumber(phone);
    if (!formattedPhone) {
      setError('Invalid phone number format.');
      return;
    }

    try {
      setLoading(true);
      const userExists = await checkUserExists(formattedPhone);
      setLoading(false);

      if (userExists) {
        setStep('signIn');
      } else {
        setStep('signUp');
      }
    } catch (err) {
      setLoading(false);
      const error = err as Error;
      setError(error.message || 'An error occurred. Please try again.');
    }
  };

  // Handle Sign-In Form Submission
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isSignInLoaded) {
      setError('Sign-in is not loaded yet. Please try again later.');
      return;
    }

    setError(null);
    const formattedPhone = formatPhoneNumber(phone);
    try {
      setLoading(true);
      const signInAttempt = await signIn.create({ identifier: `${formattedPhone}` });

      if (signInAttempt.status === 'needs_first_factor') {
        const phoneCodeFactor = signInAttempt.supportedFirstFactors?.find(
          (factor) => factor.strategy === 'phone_code'
        );

        if (phoneCodeFactor) {
          await signIn.prepareFirstFactor({
            strategy: 'phone_code',
            phoneNumberId: phoneCodeFactor.phoneNumberId,
          });
          setStep('verifySignIn');
        } else {
          throw new Error('Phone code verification is not supported');
        }
      } else {
        throw new Error('Unexpected sign-in status');
      }

      setLoading(false);
    } catch (err) {
      setLoading(false);
      const error = err as Error;
      console.error('Error during sign-in:', error);
      setError('An error occurred during sign-in. Please try again.');
    }
  };

  // Handle Sign-Up Form Submission
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isSignUpLoaded) {
      setError('Sign-up is not loaded yet. Please try again later.');
      return;
    }

    setError(null);
    const formattedPhone = formatPhoneNumber(phone);
    try {
      setLoading(true);
      await signUp.create({
        phoneNumber: `${formattedPhone}`,
        firstName,
        lastName,
      });
      await signUp.preparePhoneNumberVerification({
        strategy: 'phone_code',
      });
      setLoading(false);
      setStep('verifySignUp');
    } catch (err) {
      setLoading(false);
      const error = err as Error;
      console.error('Error during sign-up:', error);
      setError('An error occurred during sign-up. Please try again.');
    }
  };

  // Handle Verification Code Submission
  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);
      if (step === 'verifySignIn') {
        if (!signIn) {
          setError('Sign-in is not available. Please try again later.');
          setLoading(false);
          return;
        }
        const signInAttempt = await signIn.attemptFirstFactor({
          strategy: 'phone_code',
          code,
        });
        if (signInAttempt.status === 'complete') {
          await setSignInActive({ session: signInAttempt.createdSessionId });
          router.push('/');
        } else {
          console.error('Sign-in incomplete:', signInAttempt);
          setError('Sign-in incomplete. Please try again.');
        }
      } else if (step === 'verifySignUp') {
        if (!signUp) {
          setError('Sign-up is not available. Please try again later.');
          setLoading(false);
          return;
        }
        const signUpAttempt = await signUp.attemptPhoneNumberVerification({ code });
        if (signUpAttempt.status === 'complete') {
          await setSignUpActive({ session: signUpAttempt.createdSessionId });
          router.push('/');
        } else {
          console.error('Sign-up incomplete:', signUpAttempt);
          setError('Sign-up incomplete. Please try again.');
        }
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      const error = err as Error;
      console.error('Error during verification:', error);
      setError('An error occurred during verification. Please try again.');
    }
  };

  return (
    <div>
      {/* Step 1: Check if User Exists */}
      {step === 'checkUser' && (
        <form onSubmit={handleInitialSubmit}>
          <h1>Enter Your Phone Number</h1>
          <label htmlFor="phone">Phone Number:</label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+919149321482"
            required
          />
          <div id="clerk-captcha"></div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? 'Checking...' : 'Continue'}
          </button>
        </form>
      )}

      {/* Step 2: Sign-In */}
      {step === 'signIn' && (
        <form onSubmit={handleSignIn}>
          <h1>Sign In</h1>
          <input type="tel" value={formatPhoneNumber(phone) || ''} readOnly/>
          <p>We will send a verification code to your phone number.</p>
          <div id="clerk-captcha"></div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? 'Loading...' : 'Send Verification Code'}
          </button>
        </form>
      )}

      {/* Step 3: Sign-Up */}
      {step === 'signUp' && (
        <form onSubmit={handleSignUp}>
          <h1>Sign Up</h1>
          <label htmlFor="first_name">First Name:</label>
          <input
            type="text"
            id="first_name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <label htmlFor="last_name">Last Name:</label>
          <input
            type="text"
            id="last_name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <input type="hidden" value={phone} />
          <div id="clerk-captcha"></div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Continue'}
          </button>
        </form>
      )}

      {/* Step 4: Verification */}
      {(step === 'verifySignIn' || step === 'verifySignUp') && (
        <form onSubmit={handleVerification}>
          <h1>Verify Phone</h1>
          <label htmlFor="code">Verification Code:</label>
          <input
            type="text"
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
          <div id="clerk-captcha"></div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </form>
      )}
    </div>
  );
}