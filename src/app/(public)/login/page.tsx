import { LoginForm } from './_components/login-form';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-6 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">PR Review Pulse</h1>
          <p className="mt-2 text-muted-foreground">
            Log in with your GitHub account
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
