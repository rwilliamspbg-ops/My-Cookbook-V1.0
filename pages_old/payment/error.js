// pages/payment/error.js
import Link from "next/link";

export default function PaymentError() {
  return (
    <main style={{ padding: "2rem" }}>
      <h1>Payment Error</h1>
      <p>There was a problem processing your payment. Please try again.</p>
      <Link href="/pricing" className="btn-pill primary">
  Try Again
</Link>
    </main>
  );
}
