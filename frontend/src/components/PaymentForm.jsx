import { useState, useRef } from "react";

// ─── Helpers ───────────────────────────────────────────────────────────────────

function formatCardNumber(value) {
    return value
        .replace(/\D/g, "")
        .slice(0, 16)
        .match(/.{1,4}/g)
        ?.join(" ") ?? "";
}

function formatExpiry(value) {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + "/" + digits.slice(2);
    return digits;
}

function maskCVV(value) {
    return "•".repeat(Math.min(value.length, 4));
}

const defaultCard = {
    number: "",
    name: "",
    expiry: "",
    cvv: "",
};

// ─── Card Visual ───────────────────────────────────────────────────────────────

function CardDisplay({ card, flipped }) {
    const numDisplay = card.number
        ? card.number.padEnd(19, " ").replace(/ /g, card.number.length < 19 ? "#" : " ")
        : "#### #### #### ####";

    // Build display string from raw digits
    const digits = card.number.replace(/\s/g, "");
    const padded = digits.padEnd(16, "#");
    const display = padded.match(/.{1,4}/g)?.join(" ") ?? "#### #### #### ####";

    return (
        <div className="w-80 h-48" style={{ perspective: "1000px" }}>
            <div
                className="relative w-full h-full transition-transform duration-700"
                style={{
                    transformStyle: "preserve-3d",
                    transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
                }}
            >
                {/* FRONT */}
                <div
                    className="absolute inset-0 rounded-2xl p-6 flex flex-col justify-between"
                    style={{
                        backfaceVisibility: "hidden",
                        background: "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #3b82f6 100%)",
                        boxShadow: "0 25px 50px rgba(30, 58, 138, 0.5), 0 10px 20px rgba(0,0,0,0.25)",
                    }}
                >
                    {/* Top row */}
                    <div className="flex items-center justify-between">
                        {/* Chip */}
                        <div
                            className="w-10 h-7 rounded-md relative overflow-hidden"
                            style={{
                                background: "linear-gradient(135deg, #fde68a, #d97706)",
                                boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.3)",
                            }}
                        >
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-full h-px bg-yellow-900/30" />
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="h-full w-px bg-yellow-900/30" />
                            </div>
                        </div>
                        {/* Network circles */}
                        <div className="flex items-center">
                            <div className="w-7 h-7 rounded-full bg-red-500 opacity-90" />
                            <div className="w-7 h-7 rounded-full bg-yellow-400 opacity-90 -ml-3" />
                        </div>
                    </div>

                    {/* Card Number */}
                    <div
                        className="text-white text-lg tracking-widest font-mono"
                        style={{ textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}
                    >
                        {display}
                    </div>

                    {/* Bottom row */}
                    <div className="flex items-end justify-between">
                        <div>
                            <p className="text-blue-200 text-xs uppercase tracking-widest mb-1">Card Holder</p>
                            <p className="text-white font-medium text-sm tracking-wide truncate max-w-36">
                                {card.name || "Full Name"}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-blue-200 text-xs uppercase tracking-widest mb-1">Expires</p>
                            <p className="text-white font-medium text-sm tracking-wide">
                                {card.expiry || "MM/YY"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* BACK */}
                <div
                    className="absolute inset-0 rounded-2xl flex flex-col justify-center"
                    style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                        background: "linear-gradient(135deg, #1d4ed8 0%, #1e3a8a 100%)",
                        boxShadow: "0 25px 50px rgba(30, 58, 138, 0.5), 0 10px 20px rgba(0,0,0,0.25)",
                    }}
                >
                    {/* Stripe */}
                    <div className="w-full h-12 bg-black/50 mb-4" />
                    <div className="px-6">
                        <p className="text-blue-200 text-xs uppercase tracking-widest mb-2">CVV</p>
                        <div className="bg-white rounded-md px-4 py-2 font-mono text-gray-800 tracking-widest text-base">
                            {card.cvv ? "•".repeat(card.cvv.length) : "•••"}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Input Field ───────────────────────────────────────────────────────────────

function Field({ label, id, error, children }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label htmlFor={id} className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {label}
            </label>
            {children}
            {error && (
                <p className="text-xs text-red-500 animate-pulse">{error}</p>
            )}
        </div>
    );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function PaymentForm() {
    const [card, setCard] = useState(defaultCard);
    const [errors, setErrors] = useState({});
    const [cvvFocused, setCvvFocused] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // Input classes helper
    const inputClass = (field) =>
        [
            "w-full px-4 py-2.5 rounded-xl border text-sm font-medium outline-none transition-all duration-200",
            "bg-gray-50 text-gray-900 placeholder-gray-400",
            errors[field]
                ? "border-red-400 ring-2 ring-red-100"
                : card[field]
                    ? "border-green-400 ring-2 ring-green-50"
                    : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 hover:border-gray-300",
        ].join(" ");

    // Handlers
    const handleNumber = (e) => {
        const formatted = formatCardNumber(e.target.value);
        setCard((c) => ({ ...c, number: formatted }));
        if (errors.number) setErrors((er) => ({ ...er, number: "" }));
    };

    const handleExpiry = (e) => {
        const formatted = formatExpiry(e.target.value);
        setCard((c) => ({ ...c, expiry: formatted }));
        if (errors.expiry) setErrors((er) => ({ ...er, expiry: "" }));
    };

    const handleCVV = (e) => {
        const v = e.target.value.replace(/\D/g, "").slice(0, 4);
        setCard((c) => ({ ...c, cvv: v }));
        if (errors.cvv) setErrors((er) => ({ ...er, cvv: "" }));
    };

    const handleName = (e) => {
        setCard((c) => ({ ...c, name: e.target.value }));
        if (errors.name) setErrors((er) => ({ ...er, name: "" }));
    };

    // Validation
    const validate = () => {
        const newErrors = {};
        const digits = card.number.replace(/\s/g, "");
        if (digits.length !== 16) newErrors.number = "Numéro de carte invalide (16 chiffres requis).";

        const [mm, yy] = card.expiry.split("/");
        if (!mm || !yy || parseInt(mm) < 1 || parseInt(mm) > 12 || yy.length !== 2)
            newErrors.expiry = "Date d'expiration invalide.";

        if (card.cvv.length < 3) newErrors.cvv = "CVV requis (3-4 chiffres).";
        if (!card.name.trim()) newErrors.name = "Nom du titulaire requis.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePay = () => {
        if (!validate()) return;
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSuccess(true);
        }, 1800);
    };

    const reset = () => {
        setCard(defaultCard);
        setErrors({});
        setSuccess(false);
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-6">
            <div className="flex flex-col lg:flex-row items-center gap-10 w-full max-w-3xl">

                {/* ── Card Visual ── */}
                <div className="flex-shrink-0">
                    <CardDisplay card={card} flipped={cvvFocused} />
                </div>

                {/* ── Form ── */}
                <div className="bg-white rounded-3xl shadow-2xl shadow-blue-100/60 border border-gray-100 p-8 w-full max-w-sm">

                    {!success ? (
                        <>
                            {/* Header */}
                            <div className="mb-7">
                                <h2 className="text-xl font-bold text-gray-900">Secure Checkout</h2>
                                <p className="text-sm text-gray-400 flex items-center gap-1.5 mt-1">
                                    <svg className="w-3.5 h-3.5 text-green-500" viewBox="0 0 24 24" fill="none"
                                        stroke="currentColor" strokeWidth="2.5">
                                        <rect x="3" y="11" width="18" height="11" rx="2" />
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                    SSL encrypted · Safe & secure
                                </p>
                            </div>

                            {/* Fields */}
                            <div className="flex flex-col gap-4">
                                <Field label="Card Number" id="cardNumber" error={errors.number}>
                                    <input
                                        id="cardNumber"
                                        type="text"
                                        inputMode="numeric"
                                        placeholder="1234 5678 9012 3456"
                                        value={card.number}
                                        onChange={handleNumber}
                                        maxLength={19}
                                        className={inputClass("number")}
                                    />
                                </Field>

                                <div className="flex gap-3">
                                    <div className="flex-1">
                                        <Field label="Expiry" id="expiry" error={errors.expiry}>
                                            <input
                                                id="expiry"
                                                type="text"
                                                inputMode="numeric"
                                                placeholder="MM/YY"
                                                value={card.expiry}
                                                onChange={handleExpiry}
                                                maxLength={5}
                                                className={inputClass("expiry")}
                                            />
                                        </Field>
                                    </div>
                                    <div className="flex-1">
                                        <Field label="CVV" id="cvv" error={errors.cvv}>
                                            <input
                                                id="cvv"
                                                type="text"
                                                inputMode="numeric"
                                                placeholder="•••"
                                                value={card.cvv}
                                                onChange={handleCVV}
                                                onFocus={() => setCvvFocused(true)}
                                                onBlur={() => setCvvFocused(false)}
                                                maxLength={4}
                                                className={inputClass("cvv")}
                                            />
                                        </Field>
                                    </div>
                                </div>

                                <Field label="Cardholder Name" id="cardName" error={errors.name}>
                                    <input
                                        id="cardName"
                                        type="text"
                                        placeholder="John Doe"
                                        value={card.name}
                                        onChange={handleName}
                                        className={inputClass("name")}
                                    />
                                </Field>

                                {/* Pay button */}
                                <button
                                    onClick={handlePay}
                                    disabled={loading}
                                    className="mt-2 w-full py-3 rounded-2xl font-semibold text-white text-sm tracking-wide
                    transition-all duration-200 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed
                    flex items-center justify-center gap-2"
                                    style={{
                                        background: "linear-gradient(135deg, #1d4ed8, #1e3a8a)",
                                        boxShadow: "0 8px 24px rgba(29, 78, 216, 0.4)",
                                    }}
                                >
                                    {loading ? (
                                        <>
                                            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"
                                                stroke="currentColor" strokeWidth="2.5">
                                                <circle cx="12" cy="12" r="10" strokeOpacity="0.3" />
                                                <path d="M12 2a10 10 0 0 1 10 10" />
                                            </svg>
                                            Processing…
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"
                                                stroke="currentColor" strokeWidth="2.5">
                                                <rect x="1" y="4" width="22" height="16" rx="2" />
                                                <line x1="1" y1="10" x2="23" y2="10" />
                                            </svg>
                                            Complete Payment
                                        </>
                                    )}
                                </button>
                            </div>
                        </>
                    ) : (
                        /* ── Success State ── */
                        <div className="flex flex-col items-center text-center py-6 gap-4">
                            <div
                                className="w-16 h-16 rounded-full flex items-center justify-center"
                                style={{
                                    background: "linear-gradient(135deg, #059669, #065f46)",
                                    boxShadow: "0 8px 24px rgba(5, 150, 105, 0.4)",
                                    animation: "popIn 0.5s cubic-bezier(.2,1.4,.4,1)",
                                }}
                            >
                                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Payment Successful!</h3>
                                <p className="text-sm text-gray-400 mt-1">Your transaction has been processed securely.</p>
                            </div>
                            <button
                                onClick={reset}
                                className="text-sm text-blue-600 hover:text-blue-800 underline underline-offset-4 transition-colors"
                            >
                                Make another payment
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* pop-in keyframe */}
            <style>{`
        @keyframes popIn {
          from { transform: scale(0); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }
      `}</style>
        </div>
    );
}