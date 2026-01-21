import Link from "next/link";

export default function PaymentSuccess() {
  return (
    <main style={{ padding: "2rem" }}>
      <h1>Payment Successful</h1>
      <p>Your subscription is now active. You can access all premium features.</p>
     <Link href="/" className="btn-pill primary">
  Go to Dashboard
</Link>
    </main>
  );
}
