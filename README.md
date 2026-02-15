# 📘 Eventually Consistent Form

A single-page React application demonstrating safe async submission,
eventual consistency, automatic retries, and duplicate-free processing
using a simulated API.

This project models real-world payment/workflow systems where network
failures and delayed processing are common.

------------------------------------------------------------------------

## 🚀 Features

-   Immediate pending UI feedback\
-   Mock API with randomized outcomes:
    -   fast success (200)
    -   temporary failure (503)
    -   delayed success (5--10 seconds)
-   Automatic retry with limit\
-   Strong duplicate submission prevention\
-   Clear UI state transitions

------------------------------------------------------------------------

## 🧩 Tech Stack

-   React (Create React App)
-   styled-components
-   In-memory mock API (frontend simulation)

------------------------------------------------------------------------

## ▶️ Running the App

npm install\
npm start

Open: http://localhost:3000

------------------------------------------------------------------------

# 🔄 State Transitions

idle → pending → success\
idle → pending → retrying → success\
idle → pending → retrying → error

------------------------------------------------------------------------

# 🔁 Retry Logic

-   Retries only on temporary failures
-   Max retries: 3
-   Linear backoff: 1s, 2s, 3s

------------------------------------------------------------------------

# 🚫 Duplicate Prevention

UI Layer: - Submit disabled during in-flight requests

API Layer: - Idempotency key using email + amount - Processed requests
stored in memory

------------------------------------------------------------------------

# ⏳ Eventual Consistency

Random success, failure, and delayed responses simulate real-world
systems.

------------------------------------------------------------------------

## ✅ Conclusion

Demonstrates safe async workflows with retries and idempotent handling.
