---
name: to-slice
description: Break a plan, spec, or PRD into independently-grabbable issues on the project issue tracker using tracer-bullet vertical slices.
disable-model-invocation: true
---

# Converting to Specs

Use vertical slices (tracer bullets) to split a plan into independently fetchable and actionable specs.

The spec tracker and taxonomy/label vocabulary should already have been provided to you—if not, run `/setup-matt-pocock-skills`.

## Process

### 1. Gather Context

Work based on what already exists in the conversation. If the user passes an spec reference (number, URL, or path) as a parameter, pull that issue from the issue tracker and read its full body and comments.

### 2. Explore the Codebase (Optional)

If you have not explored the codebase yet, explore it to understand the current state of the code. The spec titles and descriptions should use the project's domain glossary vocabulary and follow the architecture decision records for the relevant areas.

### 3. Draft Vertical Slices

Split the plan into **tracer bullet** specs. Each slice is a thin vertical slice that cuts end‑to‑end through **all** integration layers, rather than being a horizontal slice of a single layer.

Slices can be "HITL" (human‑in‑the‑loop) or "AFK" (automated, no human interaction required). HITL slices require human interaction, such as architectural decisions or design reviews. AFK slices can be implemented and merged without human intervention. Prefer AFK over HITL whenever possible.

<vertical-slice-rules>
- Each slice provides a narrow but **complete** path through every layer (schema, API, UI, tests)
- A completed slice should be demonstrable or verifiable on its own
- Prefer many thin slices over a few thick ones
</vertical-slice-rules>

### 4. Ask the User for Feedback

Present the proposed split as a numbered list. For each slice, show:

- **Title**: A short descriptive name
- **Type**: HITL / AFK
- **Blocked by**: Which other slices (if any) must be completed first
- **Covered user stories**: Which user stories this slice addresses (if present in the source material)

Ask the user:

- Does the granularity feel right? (Too coarse / too fine?)
- Are the dependencies correct?
- Should any slices be merged or split further?
- Are the HITL / AFK labels correct?

Iterate until the user approves the split.

### 5. Publish Specs to the spec Tracker

For each approved slice, publish a new spec in the issue tracker. Use the issue body template below. These specs are considered ready for AFK agents to work on, so unless instructed otherwise, publish them with the correct labels.

Publish specs in dependency order (blockers first) so you can reference real spec identifiers in the "Blocked by" fields.

<spec-template>
## Parent spec

Reference the parent spec on the issue tracker (if the source is an existing issue; otherwise omit this section).

## What to Build

Directly quote or concisely paraphrase **the product manager's requirements**, describing the business goal, user scenario, or feature intent. Keep the original context of the requirements; do not add technical implementation details or break them down here.

Examples:

- "As a user, I want to confirm the order items and total price, and choose a payment method, after clicking checkout on the shopping cart page."
- "As a user, I want to apply a coupon to deduct from the order amount, and the system automatically calculates the discounted payable amount."

## Acceptance Criteria

All acceptance criteria must be defined with **specific, verifiable examples**, using a multi‑paragraph instance‑based style similar to BDD—break each criterion into "Precondition", "Action", "Result" (or similar sections), giving concrete inputs, actions, and verifiable expected outputs. The section labels do not have to be Given/When/Then, but the structure must be clear and instantiated to the point where no guesswork is needed.

Examples:

- [ ] **Precondition**: User `zhangsan` is registered with password `123456`  
      **Action**: On the login page, enter username `zhangsan`, password `123456`, and click Login  
      **Result**: Redirected to the personal center page, with "Hello, Zhang San" displayed at the top

- [ ] **Precondition**: User `zhangsan` is registered with password `123456`  
      **Action**: On the login page, enter username `zhangsan`, password `wrongpwd`, and click Login  
      **Result**: Stay on the login page, with a red error message "Incorrect username or password" below the password field

- [ ] **Precondition**: The feature module is `login`  
      **Action**: Run `npm test -- --coverage login`  
      **Result**: All unit and integration tests related to this feature pass

- [ ] **Precondition**: Branch `feat/login` has been pushed  
      **Action**: CI pipeline runs  
      **Result**: All three stages—`lint`, `build`, `deploy`—pass without errors

- [ ] **Precondition**: The feature module is `login`  
      **Action**: Run the coverage check  
      **Result**: Branch coverage for new code is ≥ 80%

> If you cannot write concrete multi‑paragraph examples or verifiable conditions, the requirement is not yet clear enough—clarify the requirement first; do not fill in with vague language.

## Blocked By

- Reference blocking tickets (if any)

If there are no blockers, write "None—can start immediately."

</spec-template>

Do not close or modify any parent spec.
