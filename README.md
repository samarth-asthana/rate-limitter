# Overview

This Express server enforces a strict rate limit of 15 API requests per minute. If the limit is exceeded, the server imposes a one-minute penalty, blocking further requests. The server also uses a queue to manage requests and ensure they are processed at a controlled rate.

# Key Components

**Rate Limiting:**

- The server tracks requests each minute. If requests exceed 15, a one-minute penalty (`penaltyUntil`) is activated, blocking further requests.

**Penalty Period:**

- During the penalty period, all incoming requests are rejected with a "Rate limit exceeded" response.

**Request Queue:**

- Requests are added to a queue, which ensures they are processed at a safe rate, even when multiple requests are made simultaneously.

**Handling Exceeding Requests:**

- If more than 15 requests are made in a minute, the server resets the request counter, activates the penalty, and rejects further requests.
- If the queue exceeds 20 requests, additional requests are rejected with a "Queue is full" error.

**Flow of Execution:**

- The server checks if a request falls within the penalty period. If not, it processes the request or adds it to the queue if the rate limit allows. Requests in the queue are processed at regular intervals, ensuring the rate limit is respected.
