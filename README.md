# Sales Management System

## Live Demo

- **Frontend**: [https://sales-management-system-rj.vercel.app/](https://sales-management-system-rj.vercel.app/)
- **Backend API**: [https://sales-management-system-5bz9.onrender.com](https://sales-management-system-5bz9.onrender.com)

## Overview

A full-stack web application for managing and analyzing sales transactions. The system provides comprehensive filtering, searching, sorting, and pagination capabilities for transaction data. Built with a Next.js frontend and Node.js/Express backend with PostgreSQL database, it enables users to efficiently browse through large datasets and gain insights through real-time statistics.

## Tech Stack

**Frontend:**
- Next.js 16.0.7 (React 19.2.0)
- TypeScript
- Tailwind CSS 4
- Client-side state management with React hooks

**Backend:**
- Node.js with Express 4.19.2
- PostgreSQL with pg driver
- CSV parsing for data import
- CORS enabled for cross-origin requests

## Search Implementation Summary

The search functionality allows users to search across multiple fields simultaneously. When a user enters a search term, the backend performs a case-insensitive pattern match using PostgreSQL's `ILIKE` operator across seven fields: transaction ID, customer name, phone number, product name, product category, tags, and employee name. The search is implemented with SQL's `OR` clause to return results matching any of these fields. The search query is debounced on the frontend to optimize performance and reduce unnecessary API calls.

## Filter Implementation Summary

Multi-criteria filtering is implemented with support for eight filter types: region, gender, age range, product category, payment method, tags, and date range. Filters are applied server-side using parameterized SQL queries to prevent SQL injection. Multiple values can be selected for categorical filters (region, gender, category, payment, tags) using PostgreSQL's `ANY` operator for array matching. Age filtering uses a `BETWEEN` clause with min/max values. Date filtering supports predefined ranges (Last 7 Days, Last 30 Days, This Year) using PostgreSQL interval arithmetic. All filters are applied cumulatively using `AND` conditions, and filter states are maintained in the frontend's React state.

## Sorting Implementation Summary

Sorting functionality supports five sortable columns: customer name, date, quantity, total amount, and transaction ID. Users can toggle between ascending and descending order by clicking the sort dropdown. The backend implements sorting using SQL `ORDER BY` with proper type casting for numeric fields (quantity, total_amount) to ensure correct sorting behavior. String sorting is case-insensitive using PostgreSQL's `LOWER()` function. The sort state (field and direction) is maintained in the frontend and passed to the backend as query parameters. Default sorting is by ID in ascending order.

## Pagination Implementation Summary

Server-side pagination is implemented to handle large datasets efficiently. The system displays 20 records per page with configurable limit and offset parameters. The backend calculates total page count by executing a separate `COUNT(*)` query with the same filter conditions. Navigation controls allow users to move between pages, jump to first/last page, and see the current page number. Page state is managed in the frontend and synchronized with the URL query parameters. When filters change, pagination automatically resets to page 1 to show relevant results.

## Setup Instructions

**Prerequisites:**
- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn package manager

**Backend Setup:**
1. Navigate to the backend directory: `cd backend`
2. Install dependencies: `npm install`
3. Create a `.env` file with your database configuration:
   ```
   DATABASE_URL="your-database-url"
   SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

   ```
4. Import the CSV data: `node src/utils/importCsv.js`
5. Start the server: `npm run dev` (development) or `npm start` (production)

**Frontend Setup:**
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Create a `.env` file with the API URL:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```
4. Start the development server: `npm run dev`
5. Open your browser to `http://localhost:3000`

**Database Schema:**
The application expects a `transactions` table with columns for transaction_id, date, customer_id, customer_name, phone_number, gender, age, product_category, quantity, total_amount, customer_region, product_id, employee_name, and related fields.