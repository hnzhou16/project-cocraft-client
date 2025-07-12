import React, {useActionState, useEffect, useState} from 'react';
import Link from 'next/link';
import {useAppSelector} from '@/store/hooks';
import {PUBLIC_ROLES} from '@/types';
import {registerAction} from "@/app/actions/registerAction";
import {button, cn, form, nav, typography} from "@/utils/classnames";
import {useRouter} from "next/navigation";

const RegisterForm: React.FC = () => {
  const router = useRouter()
  const {loading} = useAppSelector((state: any) => state.auth);
  const [state, formAction] = useActionState(registerAction, {error: '', success: false});

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  const [selectedRole, setSelectedRole] = useState('');
  const [showOptions, setShowOptions] = useState(false);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [usernameError, setUsernameError] = useState('');

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('')

  const isFormValid = username && email && password && confirmPassword && !passwordError && !confirmError && selectedRole;

  useEffect(() => {
    if (state.success) {
      router.push('/login')
    }
  }, [state.success]);

  function validatePassword(pw: string): string {
    if (pw.length < 8) return 'Password must be at least 8 characters.';
    if (!/[a-z]/.test(pw)) return 'Must include at least one lowercase letter.';
    if (!/[A-Z]/.test(pw)) return 'Must include at least one uppercase letter.';
    if (!/\d/.test(pw)) return 'Must include at least one number.';
    return '';
  }

  const handleSelectRole = (role) => {
    setSelectedRole(role);
    setShowOptions(false);
  }

  const handleUsernameBlur = () => {
    setUsernameError(username.trim() === '' ? 'Username is required.' : '');
  };

  const handleEmailBlur = () => {
    if (email.trim() === '') {
      setEmailError('Email is required.');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Enter a valid email address.');
    } else {
      setEmailError('');
    }
  };

  const handlePasswordBlur = () => {
    const error = validatePassword(password);
    setPasswordError(error);

    if (confirmPassword) {
      setConfirmError(password !== confirmPassword ? 'Passwords do not match.' : '');
    }
  }

  const handleConfirmBlur = () => {
    setConfirmError(password !== confirmPassword ? 'Passwords do not match.' : '');
  }

  return (
    <div className="bg-primary-background rounded-lg shadow-md p-6 w-full max-w-md mx-auto">

      {state.error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{state.error}</span>
        </div>
      )}

      <form action={formAction} className={form.container}>
        <div>
          <label htmlFor="username" className={form.label}>
            Username
          </label>
          <input
            name="username"
            type="text"
            className={form.input}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onBlur={handleUsernameBlur}
            placeholder="Required"
            required
          />
          {usernameError && <p className={typography.error}>{usernameError}</p>}
        </div>

        <div>
          <label htmlFor="email" className={form.label}>
            Email
          </label>
          <input
            name="email"
            type="email"
            className={form.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={handleEmailBlur}
            placeholder="Required"
            required
          />
          {emailError && <p className={typography.error}>{emailError}</p>}
        </div>

        <div>
          <label htmlFor="password" className={form.label}>
            Password
          </label>
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={handlePasswordBlur}
              className={form.input}
              placeholder="Required"
              autoComplete="new-password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute bottom-1/2 right-2 translate-y-1/2"
            >
              {showPassword
                ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                       stroke="currentColor" className={nav.icon}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"/>
                </svg>
                : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                       stroke="currentColor" className={nav.icon}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                </svg>
              }
            </button>
          </div>

          <p className={cn(passwordError ? typography.error : typography.p2, "mt-2")}>
            {passwordError || "At lease 8 characters, with 1 uppercase, 1 lowercase, and 1 number."}
          </p>
        </div>

        <div>
          <label htmlFor="confirmPassword" className={form.label}>
            Confirm Password
          </label>
          <div className="relative">
            <input
              name="confirmPassword"
              type={showConfirm ? "text" : "password"}
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={handleConfirmBlur}
              className={confirmError ? form.input : form.error}
              placeholder="Confirm your password"
              autoComplete="new-password"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirm((prev) => !prev)}
              className="absolute bottom-1/2 right-2 translate-y-1/2"
            >
              {showConfirm
                ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                       stroke="currentColor" className={nav.icon}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"/>
                </svg>
                : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                       stroke="currentColor" className={nav.icon}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                </svg>
              }
            </button>

          </div>

          {confirmError && (
            <p className={cn(confirmError ? typography.error : typography.p2, "mt-2")}>{confirmError}</p>
          )}
        </div>

        <div>
          <label htmlFor="role" className={form.label}>
            Role
          </label>
          <input
            name="role"
            type="hidden"
            value={selectedRole}
            required
          />

          <div className="relative bg-background">
            <button
              type="button"
              onClick={() => setShowOptions(prev => !prev)}
              className={cn(form.input, "h-10")}
            >
              <div>
                {selectedRole
                  ? <p className={typography.p1}>{selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}</p>
                  : <p className={cn(typography.p1, "text-secondary-foreground text-start")}>Select a role</p>
                }
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                     stroke="currentColor" className={cn(nav.icon, "absolute right-3 top-0 translate-y-1/2")}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5"/>
                </svg>
              </div>
            </button>
            {showOptions && (
              <div className="absolute w-full bg-primary-background border rounded">
                {PUBLIC_ROLES.map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleSelectRole(role)}
                    className={cn(button.sortDropDown, "text-center")}
                  >
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="bio" className={form.label}>
            Bio (Optional)
          </label>
          <textarea
            name="bio"
            id="bio"
            className={form.textarea}
            placeholder="Tell us about yourself"
            rows={3}
          />
        </div>

        <div className="mb-6">
          <label htmlFor="location" className={form.label}>
            Location (Optional)
          </label>
          <input
            name="location"
            type="text"
            className={form.input}
            placeholder="City, Country"
          />
        </div>

        <div className="flex items-center justify-between mb-4">
          <button
            type="submit"
            className={cn(button.primary, `w-full ${isFormValid ? '' : 'opacity-50 cursor-not-allowed'}`)}
            disabled={!isFormValid || loading}
          >
            Sign up
          </button>
        </div>

        <div className="text-center">
          <p className={typography.p2}>
            Already have an account?{' '}
            <Link href="/login" className={typography.link}>
              Login here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
