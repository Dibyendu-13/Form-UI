import { useState, useRef } from "react";
import styled, { keyframes } from "styled-components";

/* -------- Mock API -------- */

const processed = new Set();

function mockApi({ email, amount }) {
  const key = `${email}-${amount}`;

  return new Promise((resolve, reject) => {
    if (processed.has(key)) return resolve({ status: 200, duplicate: true });

    const r = Math.random();

    if (r < 0.4) {
      processed.add(key);
      return setTimeout(() => resolve({ status: 200 }), 800);
    }

    if (r < 0.7) {
      return setTimeout(() => reject({ status: 503 }), 800);
    }

    const delay = 5000 + Math.random() * 5000;
    setTimeout(() => {
      processed.add(key);
      resolve({ status: 200, delayed: true });
    }, delay);
  });
}

/* -------- Animations -------- */

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

/* -------- Styled Components -------- */

const Page = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #6366f1, #22d3ee);
`;

const Card = styled.div`
  background: white;
  padding: 28px;
  border-radius: 18px;
  width: 340px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.15);
  animation: fadeIn 0.4s ease;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const Title = styled.h1`
  font-size: 22px;
  text-align: center;
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 95%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
  margin-bottom: 14px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #6366f1;
  }
`;

const Button = styled.button`
  display: block;
  margin: 12px auto 0;
  padding: 10px 28px;
  background: #6366f1;
  color: white;
  border: none;
  border-radius: 999px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 14px rgba(99,102,241,0.4);
  }
`;


const Status = styled.div`
  margin-top: 14px;
  font-size: 14px;
  text-align: center;
  color: ${({ state }) =>
    state === "success" ? "#16a34a" :
      state === "error" ? "#dc2626" :
        state === "retrying" ? "#d97706" :
          "#555"};
`;

const Spinner = styled.div`
  width: 18px;
  height: 18px;
  border: 3px solid #ddd;
  border-top: 3px solid #6366f1;
  border-radius: 50%;
  margin: 12px auto;
  animation: ${spin} 1s linear infinite;
`;

const Message = styled.div`
  text-align: center;
  margin-top: 6px;
  font-size: 13px;
  color: #555;
`;

/* -------- App -------- */

export default function App() {
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const inFlight = useRef(false);
  const retryCount = useRef(0);
  const MAX_RETRIES = 3;

  const submit = async () => {
    if (inFlight.current) return;

    inFlight.current = true;
    setStatus("pending");
    setMessage("Submitting...");

    try {
      const res = await mockApi({ email, amount });

      setStatus("success");
      setMessage(
        res.duplicate
          ? "Already processed — no duplicate created"
          : res.delayed
            ? "Success after delay"
            : "Success"
      );

      retryCount.current = 0;
      inFlight.current = false;
    } catch {
      if (retryCount.current < MAX_RETRIES) {
        retryCount.current++;
        setStatus("retrying");
        setMessage(`Retrying ${retryCount.current}/${MAX_RETRIES}...`);
        setTimeout(submit, 1000 * retryCount.current);
      } else {
        setStatus("error");
        setMessage("Failed after retries");
        retryCount.current = 0;
        inFlight.current = false;
      }
    }
  };

  return (
    <Page>
      <Card>
        <Title>💳 Payment Form</Title>

        <Input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <Input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={e => setAmount(e.target.value)}
        />

        <Button
          disabled={!email || !amount || status === "pending" || status === "retrying"}
          onClick={submit}
        >
          Submit
        </Button>

        {(status === "pending" || status === "retrying") && <Spinner />}

        <Status state={status}>
          <strong>Status:</strong> {status}
        </Status>

        <Message>{message}</Message>
      </Card>
    </Page>
  );
}
