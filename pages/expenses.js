import { useState } from "react";
import { useRouter } from "next/router";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function Expenses() {
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [receiptFile, setReceiptFile] = useState(null);
  const [message, setMessage] = useState("");

  async function submit(e) {
    e.preventDefault();
    setMessage("");
    // prepare payload, include receipt as base64 if present
    let receiptData = null;
    if (receiptFile) {
      receiptData = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(receiptFile);
      });
    }
    const res = await fetch("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, amount, note, receipt: receiptData })
    });
    const data = await res.json();
    if (data.ok) {
      setMessage("Submitted for approval");
      setDate(""); setAmount(""); setNote("");
    } else {
      setMessage(data.message || "Failed");
    }
  }

  return (
    <main>
      <h1>Submit Expense</h1>
      <Card className="max-w-xl">
        <form onSubmit={submit} className="grid gap-3">
          <label className="text-sm font-medium text-gray-700">Date</label>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <label className="text-sm font-medium text-gray-700">Amount (GBP)</label>
          <Input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" />
          <label className="text-sm font-medium text-gray-700">Note</label>
          <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Reason or receipt info" />
          <label className="text-sm font-medium text-gray-700">Receipt (optional)</label>
          <input type="file" accept="image/*,application/pdf" onChange={(e) => setReceiptFile(e.target.files[0])} />
          <div>
            <Button type="submit">Submit expense</Button>
            {message && <div className="text-sm text-gray-600 mt-2">{message}</div>}
          </div>
        </form>
      </Card>
    </main>
  );
}


