# ZARlytics Production Setup Guide

Professional Flutter-style web application for Profit Tracking & Business Reporting.

## 🚀 Deployment Instructions

### 1. Database Setup (Supabase)
Create a new project on [Supabase](https://supabase.com) and run this script in the **SQL Editor**:

```sql
-- Create Business Units
CREATE TABLE businesses (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Staff/User Accounts
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user', -- 'admin' or 'user'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Sales Records
CREATE TABLE sales (
  id TEXT PRIMARY KEY,
  business_id TEXT REFERENCES businesses(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  sales_amount NUMERIC NOT NULL,
  profit_percent NUMERIC NOT NULL,
  profit_amount NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Expense Records
CREATE TABLE expenses (
  id TEXT PRIMARY KEY,
  business_id TEXT REFERENCES businesses(id) ON DELETE CASCADE,
  month TEXT NOT NULL, -- Format: YYYY-MM
  expense_amount NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Initial Administrator
INSERT INTO users (id, name, email, password, role)
VALUES ('admin-001', 'System Admin', 'admin@zar.co.za', 'password123', 'admin');
```

### 2. Environment Variables
When deploying to Vercel or Netlify, add the following variables in the **Settings > Environment Variables** tab:

| Variable | Source | Description |
| :--- | :--- | :--- |
| `SUPABASE_URL` | Supabase API Settings | Your project URL |
| `SUPABASE_ANON_KEY` | Supabase API Settings | Your anonymous public key |
| `API_KEY` | [AI Studio](https://aistudio.google.com/) | Google Gemini API Key for AI Insights |

### 3. Local Development
To run this locally, ensure you have an `.env` file with the variables above.

## 🛠 Tech Stack
- **Frontend:** React 19 + Tailwind CSS
- **Icons:** Lucide React
- **Charts:** Recharts
- **Database:** Supabase (PostgreSQL)
- **AI Engine:** Google Gemini (gemini-3-flash-preview)
- **Currency:** ZAR (South African Rand)
