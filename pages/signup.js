import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function submit(e) {
    e.preventDefault();
    setMessage("");
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.ok) {
      router.push("/login");
    } else {
      setMessage(data.message || "Signup failed");
    }
  }

  return (
    <main className="min-h-[70vh] flex items-center justify-center">
      <Head><title>Create account — Social Organisation</title></Head>
      <Card className="max-w-xl w-full">
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-2xl font-bold">Create account</h2>
            <p className="text-sm text-gray-500">Register a staff account to access scheduling tools</p>
          </div>

          <form onSubmit={submit} className="grid gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Password</label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Choose a password" />
            </div>

            {message && <div className="text-sm text-red-600">{message}</div>}

            <div className="flex flex-col sm:flex-row items-center sm:items-stretch justify-between gap-3 mt-3">
              <Button className="w-full sm:w-auto" type="submit">Create account</Button>
              <a className="text-sm text-gray-500" href="/login">Already have an account?</a>
            </div>
          </form>
        </div>
      </Card>
    </main>
  );
}


