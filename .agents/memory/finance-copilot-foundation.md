---
name: Finance Copilot foundation
description: Architectural decisions for the first financial product increment.
---

The financial engine remains authoritative for balances, totals, and future projections; the AI layer should explain or orchestrate these deterministic results rather than calculating them independently.

**Why:** Financial data must remain trustworthy as the product grows toward conversational and agentic features.

**How to apply:** Add new financial capabilities behind typed API contracts and aggregated engine endpoints before exposing them to an LLM or the frontend.