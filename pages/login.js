import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function submit(e) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.ok) {
      router.push("/");
    } else {
      setError(data.message || "Login failed");
    }
  }

  return (
    <main className="min-h-[70vh] flex items-center justify-center">
      <Head><title>Sign in — Social Organisation</title></Head>
      <Card className="max-w-xl w-full">
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-2xl font-bold">Welcome back</h2>
            <p className="text-sm text-gray-500">Sign in to continue to the staff portal</p>
          </div>

          <form onSubmit={submit} className="grid gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Password</label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" />
            </div>

            {error && <div className="text-sm text-red-600">{error}</div>}

            <div className="flex flex-col sm:flex-row items-center sm:items-stretch justify-between gap-3 mt-3">
              <Button className="w-full sm:w-auto" type="submit">Sign in</Button>
              <a className="text-sm text-gray-500" href="/signup">Create account</a>
            </div>
          </form>

          <div className="mt-4 p-3 bg-gray-50 rounded-md border border-gray-100">
            <div className="text-sm text-gray-600 mb-2">Demo accounts (use to preview staff experience):</div>
            <ul className="text-sm text-gray-800 list-disc list-inside space-y-1">
              <li><strong>Admin</strong>: <code>admin</code> / <code>admin</code></li>
              <li><strong>Staff 1</strong>: <code>staff1@example.com</code> / <code>password</code></li>
              <li><strong>Staff 2</strong>: <code>staff2@example.com</code> / <code>password</code></li>
            </ul>
          </div>
        </div>
      </Card>
    </main>
  );
}


