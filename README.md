# FinSight

FinSight is a web application for personal financial management that imports bank data (CSV), automatically categorizes transactions, provides analytical dashboards, and generates insights and recommendations using generative AI — functioning as a mini financial copilot.

## Idea

1. The user creates an account and logs in.
2. The user uploads a CSV file from their bank or enters expenses manually.
3. The system:
   - automatically classifies transactions (transportation, food, etc.)
   - displays dashboards of spending by category and by month
   - uses AI to generate summaries and recommendations

---

## Functionalities

1. Basic Authentication
    - Sign-up/registration, login, logout
    - Each user can only see their own transactions
2. Transaction management
    - Create/edit/delete transactions manually (date, description, amount, type: expense/income)
    - Listing and search
3. CSV file import
    - Upload file
    - Column mapping (columns "description","amount", "date").
    - Parse and store in the database
4. Automatic classification
    - Simple Heuristics + AI:
        - Rules, then refine with AI and allow the user to correct the category.
5. Analytical dashboard
    - Pie/bar chart: expenses by category
    - Line chart: balance evolution or expenses per month
    - Quick KPIs: total income, total expenses, savings for the month.
6. Final summary with AI
    - Endpoint that aggregates the month's data and sends it to OpenAI.

### Extras
- Set budget
- Mark expenses and "fixed" or "variable"
- Dark Mode
- Multi-currency
- Export to CSV/Excel

--- 

## Tecnology Used

### Frontend/Web App
- Laravel Blade templates
- Vue components inside Laravel
- Chart.js for interactive charts

### Backend 
- Laravel (PHP) responsible for:
    - user authentication, Transaction CRUD, CSV import, Calculating finantial statistocs, Exposing a REST API for frontend and communicating with the AI microservice

### AI Microservice
- FastAPI (Python)
- OpenAI API responsible for: classifying transactions using AI and generating financial summaries and recommendations

### Database
- MySQL/PostgreSQL/SQLite

### Other Tools
- GitHub, Docker and Swagger UI

---

## Architecture

The system is split into two services:

1. Laravel (Main Application)
- Handles all user-related operations
- Stores and manages all financial data
- Performs calculations for statistics
- Calls the Python microservice when AI is needed
- Sends clean data to the microservice
- Receives AI results and returns them to the frontend

2. AI Microserive (FastAI + Python + OpenAI)
- does not have its own database
- exposes internal endpoints 
- builds prompts and talks to OpenAI
- Returns JSON responses only

```
Browser (User)
       |
       v
Laravel Application  <---->  Database
       |
  (HTTP REST)
       |
       v
AI Microservice (FastAPI)
       |
       v
     OpenAI
```