# AI Usage Note

## Tools Used

This project was built with the assistance of **Antigravity (Google DeepMind)**, an AI coding assistant operating inside the IDE. The AI helped plan and scaffold the entire project from scratch, including the component architecture, TypeScript types, custom hook design, Tailwind CSS theme tokens, and all validation logic. It generated complete, production-style code for every file, wrote the README documentation, and produced this usage note — all within a single session without any backend or external music APIs.

## How AI Assistance Was Used Responsibly

The AI was given a detailed product specification and used it as a strict scope boundary — no features were added beyond what was requested, and every risk control in the brief (no login, no external APIs, no overengineered state) was explicitly respected. All generated code was structured to be readable, reviewable, and maintainable: component responsibilities are clearly separated, the state hook is unit-testable in isolation, and naming conventions are consistent throughout. The AI did not introduce unnecessary dependencies or fragile assumptions. The role of AI here was to accelerate implementation of a well-defined spec, not to make open-ended design choices — those were resolved by the spec itself. The output is production-style code that a developer could confidently review, extend, and own.
