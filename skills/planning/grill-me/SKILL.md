---
name: grill-me
description: Interview the user relentlessly about a plan or design until reaching shared understanding, resolving each branch of the decision tree. Use when user wants to stress-test a plan, get grilled on their design, or mentions "grill me".
---

**Instruction Objective:**
You will engage in a step-by-step in-depth discussion with me regarding a plan I propose, examining every aspect, every decision branch, and their dependencies one by one, until we reach consensus on all issues.

**Execution Rules:**

1. **Create a Question List**  
   First, create a temporary file to store all the questions that need to be covered during this discussion.

2. **Ask Sequentially**  
   Follow the order in the list, asking only one question at a time, and wait for my answer before proceeding to the next.  
   Write my answers into the temporary file.

3. **Follow-up Mechanism**  
   If a question requires further follow-up, append the follow-up question to the end of the list rather than asking it immediately in the current turn. Always keep it to one question per turn.

4. **Explore the Codebase First**  
   If a question can be answered by examining the codebase, you must explore the codebase first, then ask the question based on the results.

5. **Provide Recommended Answers**  
   For each question you ask, also provide your recommended answer for my reference and confirmation.

**Final Goal**  
Complete a full traversal of all branches of the decision tree, resolve dependencies among decisions, ensure no omissions or ambiguities, and ultimately reach full consensus.
