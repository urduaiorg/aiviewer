# AI Tool Finder: Quiz Logic Tree 2026

> **Prepared by:** Agent 4 (Research & Intelligence)
> **Goal:** High-converting, dynamic 5-question logic flow for `src/pages/finder/index.astro`. The goal is to capture high-intent users and route them to our best monetized guides or top-tier free tools to build trust.

## The Strategy: "Progressive Profiling"
Instead of asking 20 questions, we use 5 high-impact questions to bucket the user into a specific persona. The final recommendation provides a primary tool (often an affiliate link) and a secondary free/open-source alternative.

## The 5-Step Logic Flow

### Question 1: What is your primary role?
- **A)** Developer / Engineer *(Sets Persona: Technical)*
- **B)** Designer / Creative *(Sets Persona: Creative)*
- **C)** Marketer / Writer *(Sets Persona: Content)*
- **D)** Student / Educator *(Sets Persona: Academic)*
- **E)** Business Owner / Operations *(Sets Persona: Business)*

### Question 2: What is your main goal today?
*Dynamic routing based on Q1.*
- *If Q1=A:* 1) Write code faster, 2) Automate testing, 3) Build UI.
- *If Q1=B:* 1) Generate images, 2) Edit video, 3) UI/UX wireframes.
- *If Q1=C:* 1) Long-form articles, 2) Social media copy, 3) SEO optimization.
- *If Q1=D:* 1) Research/Summarization, 2) Writing help, 3) Lesson planning.
- *If Q1=E:* 1) Automate admin, 2) Customer support, 3) Data analysis.

### Question 3: How technical are you?
- **A)** Beginner (I just want it to work out of the box).
- **B)** Intermediate (I can handle some setup and prompt engineering).
- **C)** Advanced (I want to build workflows, use APIs, or run local models).
*(Modifiers: If C, heavily weight open-source or API-first tools like DeepSeek or Claude API. If A, heavily weight polished SaaS like ChatGPT Plus or Jasper).*

### Question 4: What is your budget?
- **A)** $0 (I only want free tools).
- **B)** $10-$30/month (Standard SaaS subscription).
- **C)** $50+/month (Enterprise / Team budgets).

### Question 5: Are you working solo or with a team?
- **A)** Solo (Just me).
- **B)** Team (I need collaboration features and shared workspaces).

---

## Result Routing Engine (The "Decision Matrix")

Once the 5 questions are answered, the JavaScript triggers a routing function to output **3 Tool Recommendations** (1 Primary Winner, 2 Alternatives).

### Example Outcomes:

**Scenario 1: The Indie Hacker**
- *Inputs:* Developer -> Write Code Faster -> Intermediate -> $10-$30/mo -> Solo
- *Winning Recommendation:* **Cursor** (Primary review link)
- *Runner Up:* **GitHub Copilot**
- *Free Alternative:* **Claude 3.5 Sonnet (Web UI)**

**Scenario 2: The Enterprise Marketer**
- *Inputs:* Marketer -> SEO Optimization -> Beginner -> $50+/mo -> Team
- *Winning Recommendation:* **Jasper AI** (Primary affiliate link)
- *Runner Up:* **Copy.ai**
- *Free Alternative:* **ChatGPT Free**

**Scenario 3: The Broke Student**
- *Inputs:* Student -> Research -> Beginner -> $0 -> Solo
- *Winning Recommendation:* **Perplexity AI** (Link to our review/guide)
- *Runner Up:* **Claude (Free Tier)**
- *Free Alternative:* **DeepSeek**

## Implementation Notes for Agent 2:
- You do not need a backend for this. Use a client-side JSON mapping object.
- At the end of the quiz, display the recommendations using our existing `<ToolPickBox>` component styling.
- Ensure the CTAs on the results page include `rel="sponsored"` if they route directly to a monetized partner.
