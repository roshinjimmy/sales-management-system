# Sales Management System - Architecture Documentation

## 1. Backend Architecture

### Overview
The backend is built using Node.js with Express.js framework, following a layered architecture pattern with clear separation of concerns. It provides RESTful APIs for transaction data management and implements server-side filtering, sorting, pagination, and aggregation.

### Technology Stack
- **Runtime**: Node.js (CommonJS modules)
- **Framework**: Express.js 4.19.2
- **Database**: PostgreSQL (accessed via `pg` driver 8.16.3)
- **Additional Libraries**:
  - `cors`: Cross-origin resource sharing
  - `dotenv`: Environment variable management
  - `csv-parser`: CSV file parsing for data import
  - `nodemon`: Development server with auto-reload

### Architecture Layers

#### 1. Entry Point Layer (`src/index.js`)
- Application initialization and configuration
- Middleware setup (CORS, JSON parsing)
- Route registration
- Server startup and port binding
- Health check endpoint (`GET /`)

#### 2. Route Layer (`src/routes/`)
- **transactionRoutes.js**: Defines API endpoints for transactions
  - `GET /api/transactions` - Fetch paginated, filtered, and sorted transactions
  - `GET /api/transactions/stats` - Get aggregated statistics

#### 3. Controller Layer (`src/controllers/`)
- **transactionController.js**: Request/response handling and business logic orchestration
  - `getTransactions()`: Handles filtering, sorting, pagination logic
  - `getTransactionStats()`: Calculates aggregated metrics (total units, amount, discount)
  - Input validation and query parameter parsing
  - Error handling and response formatting

#### 4. Service Layer (`src/services/`)
- **transactionService.js**: Business logic and data access operations
  - Database query execution
  - Data transformation and mapping
  - Reusable business operations

#### 5. Utility Layer (`src/utils/`)
- **db.js**: Database connection pool management
  - PostgreSQL connection configuration
  - SSL/TLS support for secure connections
  - Connection pooling for performance optimization
  
- **importCsv.js**: Data import utility
  - CSV file parsing and validation
  - Batch insert operations
  - Progress tracking and error handling

### Database Schema
The system uses a `transactions` table with the following key columns:
- Transaction identifiers: `transaction_id`, `id`
- Customer data: `customer_id`, `customer_name`, `phone_number`, `gender`, `age`, `customer_region`, `customer_type`
- Product data: `product_id`, `product_name`, `brand`, `product_category`, `tags`
- Sales data: `quantity`, `price_per_unit`, `discount_percentage`, `total_amount`, `final_amount`
- Operational data: `date`, `payment_method`, `order_status`, `delivery_type`
- Store data: `store_id`, `store_location`, `salesperson_id`, `employee_name`

### API Design

#### GET /api/transactions
**Query Parameters**:
- `page`: Page number (default: 1)
- `limit`: Records per page (default: 20)
- `region`: Comma-separated customer regions
- `gender`: Comma-separated gender values
- `category`: Comma-separated product categories
- `payment`: Comma-separated payment methods
- `tags`: Comma-separated product tags
- `ageRange`: Age range (e.g., "18-25")
- `date`: Date range filter (e.g., "Last 7 Days")
- `search`: Multi-field search term
- `sortBy`: Field to sort by
- `sortOrder`: Sort direction (asc/desc)

**Response**:
```json
{
  "data": [
    {
      "transactionId": "...",
      "date": "...",
      "customerName": "...",
      ...
    }
  ],
  "totalPages": 50000
}
```

#### GET /api/transactions/stats
**Query Parameters**: Same filters as transactions endpoint

**Response**:
```json
{
  "total_units": 30000491,
  "total_amount": 757739460400,
  "total_discount": 189393924835
}
```

---

## 2. Frontend Architecture

### Overview
The frontend is built with Next.js 16 (React 19) using TypeScript, implementing a modern component-based architecture with client-side state management and server-side rendering capabilities.

### Technology Stack
- **Framework**: Next.js 16.0.7 (App Router)
- **UI Library**: React 19.2.0
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Icons**: react-icons 5.5.0
- **Build Tools**: ESLint, PostCSS

### Architecture Pattern: Component-Based with Hooks

#### 1. Application Layer (`src/app/`)
- **page.tsx**: Main application page (wrapped in Suspense boundary)
  - URL-driven state management using `useSearchParams`
  - Client-side routing with `useRouter`
  - State management with React hooks
  - API integration for data fetching
  
- **layout.tsx**: Root layout component
  - Font configuration (Geist Sans, Geist Mono)
  - Global metadata
  - Global styles import

- **globals.css**: Global styling and Tailwind configuration

#### 2. Component Layer (`src/components/`)

**Data Display Components**:
- **TransactionTable.tsx**: Data grid component
- **SummaryCard.tsx**: Metrics display component
- **Loader.tsx**: Loading state indicator

**User Input Components**:
- **FilterDropdown.tsx**: Multi-select/single-select filter
- **SearchBar.tsx**: Debounced search input (400ms delay)
- **SortingDropdown.tsx**: Sort field and order selector
- **Pagination.tsx**: Page navigation control

**Layout Components**:
- **Sidebar.tsx**: Navigation sidebar

### State Management Strategy

#### Local State (useState)
- **filters**: All filter values (region, gender, age, category, tags, payment, date, search, sortBy, sortOrder)
- **page**: Current page number
- **transactions**: Fetched transaction data
- **totalPages**: Total page count
- **loading**: Loading state indicator
- **stats**: Aggregated statistics

#### URL State (useSearchParams + useRouter)
- All filter values and pagination state are synchronized with URL
- Enables shareable links and browser back/forward navigation
- Persists state across page reloads
- Implemented via `updateURL()` function

---

## 3. Data Flow

### Complete Request-Response Cycle

```
User Action (Filter/Search/Sort/Page)
  ↓
Component Event Handler
  ↓
State Update (setFilters/setPage)
  ↓
URL Update (router.push with query params)
  ↓
useEffect Trigger
  ↓
API Request (fetchTransactions/fetchStats)
  ↓
Backend Route Handler
  ↓
Controller Validation & Processing
  ↓
Dynamic SQL Query Construction
  ↓
Database Query Execution
  ↓
Result Transformation
  ↓
JSON Response
  ↓
Frontend State Update
  ↓
React Re-render
  ↓
UI Update
```

### Data Transformation Pipeline

#### Backend Transformation
1. **Query Parameters** → Parsed and validated
2. **Filter Arrays** → SQL ANY() clauses
3. **Search Term** → ILIKE pattern matching
4. **Age Range** → BETWEEN clause
5. **Date Range** → Interval calculations
6. **Database Row** → Camel-case JSON object
7. **Count Query** → Total pages calculation

#### Frontend Transformation
1. **URL Params** → Initial state object
2. **Filter State** → Query string parameters
3. **API Response** → React state
4. **State** → Component props
5. **Props** → Rendered JSX

### API Communication

#### Request Format
```
GET http://localhost:5000/api/transactions?
  page=2&
  limit=20&
  region=North,South&
  gender=Male&
  category=Electronics,Clothing&
  search=John&
  sortBy=customer_name&
  sortOrder=asc
```

#### Response Format
```json
{
  "data": [
    {
      "transactionId": "TXN123",
      "date": "2023-03-23",
      "customerId": "CUST-40823",
      "customerName": "John Doe",
      "phone": "9876543210",
      "gender": "Male",
      "age": 32,
      "category": "Electronics",
      "quantity": 2,
      "amount": 15000,
      "region": "North",
      "productId": "PRD-001",
      "employee": "Jane Smith"
    }
  ],
  "totalPages": 1250
}
```

---

## 4. Folder Structure

```
sales-management-system/
│
├── backend/
│   ├── src/
│   │   ├── controllers/          # Request handlers and business logic
│   │   │   └── transactionController.js
│   │   ├── routes/               # API route definitions
│   │   │   └── transactionRoutes.js
│   │   ├── services/             # Business logic layer
│   │   │   └── transactionService.js
│   │   ├── utils/                # Helper utilities
│   │   │   ├── db.js            # Database connection pool
│   │   │   └── importCsv.js     # CSV import script
│   │   └── index.js              # Application entry point
│   ├── .env                      # Environment variables
│   ├── .gitignore               
│   ├── package.json             
│   └── package-lock.json        
│
├── frontend/
│   ├── src/
│   │   ├── app/                 # Next.js App Router pages
│   │   │   ├── page.tsx         # Main page component
│   │   │   ├── layout.tsx       # Root layout
│   │   │   └── globals.css      # Global styles
│   │   └── components/          # Reusable React components
│   │       ├── FilterDropdown.tsx
│   │       ├── SearchBar.tsx
│   │       ├── SortingDropdown.tsx
│   │       ├── TransactionTable.tsx
│   │       ├── Pagination.tsx
│   │       ├── SummaryCard.tsx
│   │       ├── Loader.tsx
│   │       └── Sidebar.tsx
│   ├── .env                     
│   ├── .gitignore              
│   ├── .next/                  
│   ├── node_modules/           
│   ├── eslint.config.mjs       
│   ├── next.config.ts          
│   ├── next-env.d.ts           
│   ├── package.json            
│   ├── package-lock.json       
│   ├── postcss.config.mjs      
│   └── tsconfig.json           
│
├── docs/                       
│   └── architecture.md         
│
├── .git/                       
└── README.md                   
```

---

## 5. Module Responsibilities

### Backend Modules

#### index.js
**Responsibilities**:
- Express application initialization
- Middleware registration (CORS, JSON parser)
- Route mounting
- Server startup and port binding
- Environment configuration loading

#### transactionRoutes.js
**Responsibilities**:
- Define transaction-related API endpoints
- Map HTTP methods and paths to controller functions
- Export router for mounting in main app

#### transactionController.js
**Responsibilities**:
- Parse and validate query parameters
- Build dynamic SQL queries with filters
- Execute database queries via pool
- Transform database results to API response format
- Calculate pagination metadata
- Handle errors and send appropriate responses
- Implement filtering logic (region, gender, category, payment, tags, age, date)
- Implement search logic (multi-field ILIKE matching)
- Implement sorting logic (with type casting)
- Aggregate statistics (SUM operations)

#### transactionService.js
**Responsibilities**:
- Encapsulate business logic for transaction operations
- Provide reusable database query methods

#### db.js
**Responsibilities**:
- Create and export PostgreSQL connection pool
- Configure SSL/TLS settings
- Load database credentials from environment
- Manage connection lifecycle

#### importCsv.js
**Responsibilities**:
- Read CSV file from disk
- Parse CSV rows into structured data
- Validate and transform data types
- Batch insert into PostgreSQL database
- Track progress and report errors

### Frontend Modules

#### page.tsx (Main Page)
**Responsibilities**:
- Application state management (filters, page, transactions, stats)
- URL synchronization (read/write query parameters)
- API integration (fetch transactions and stats)
- Orchestrate component interactions
- Handle user actions (filter changes, search, sort, pagination)
- Suspense boundary for async operations

#### layout.tsx
**Responsibilities**:
- Define page structure and meta tags
- Configure fonts
- Wrap application with providers
- Apply global styles

#### FilterDropdown.tsx
**Responsibilities**:
- Render dropdown UI with options
- Manage dropdown open/close state
- Handle single or multi-select modes
- Synchronize with parent state via props
- Emit onChange events on selection

#### SearchBar.tsx
**Responsibilities**:
- Render search input with icon
- Implement debounce (400ms delay)
- Emit onSearch events
- Synchronize input value with external state

#### SortingDropdown.tsx
**Responsibilities**:
- Display current sort field and direction
- Render sort options dropdown
- Emit onChange events on selection
- Visual indicators for sort direction

#### TransactionTable.tsx
**Responsibilities**:
- Render data grid with columns
- Handle horizontal scroll for wide tables
- Display empty state when no data
- Truncate long cell values with tooltips

#### Pagination.tsx
**Responsibilities**:
- Calculate visible page range (show 7 pages max)
- Render page number buttons
- Handle first/last page navigation
- Display ellipsis for truncated ranges
- Emit onPageChange events

#### SummaryCard.tsx
**Responsibilities**:
- Display metric title and value
- Format numbers for display

#### Loader.tsx
**Responsibilities**:
- Display animated loading spinner
- Provide visual feedback during data fetching

#### Sidebar.tsx
**Responsibilities**:
- Display application navigation
- Show user profile information
- Render menu sections
