import Link from "next/link";

export default function PaymentCancel() {
  return (
    <main style={{ padding: "2rem" }}>
      <h1>Payment Canceled</h1>
      <p>Your payment was canceled and no charges were made.</p>
      <Link href="/pricing">
        <button>Return to Pricing</button>
      </Link>
    </main>
  );
}
