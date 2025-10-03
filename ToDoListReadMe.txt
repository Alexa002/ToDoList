Todo List Application - .NET & Angular
A full-stack Todo List application built with .NET 8 Web API backend and Angular 19 frontend, featuring user authentication and task management.


Prerequisites
.NET 8 SDK

Node.js 18+

Angular CLI 19+

SQLite (included, no setup required)

Local Development
Backend (.NET API)
# Clone and setup
git clone <repository-url>
cd todo-list-app/api

# Restore dependencies
dotnet restore

# Run the application
dotnet run

Frontend (Angular)
bash
# In a new terminal
cd todo-list-app/client

# Install dependencies
npm install

# Start development server
ng serve

┌─────────────────┐    HTTP/REST     ┌──────────────────┐
│   Angular       │ ◄──────────────► │   .NET 8 Web API │
│   Frontend      │                  │   Backend        │
│  (Port 4200)    │                  │  (Port 5129)
└─────────────────┘                  └──────────────────┘
                                              │
                                              ▼
                                      ┌──────────────────┐
                                      │   SQLite         │
                                      │   Database       │
                                      └──────────────────┘

Backend (ASP.NET Core Web API)
Folders:

Controllers/
Handles HTTP requests (e.g., AccountController, TaskController).

Entities/
Data models (e.g., User.cs, TaskToDo.cs).

DTOs/
Data Transfer Objects for requests/responses.

Data/
Database context (DataContext.cs), migrations.

Interfaces/
Service interfaces (e.g., ITokenService.cs).

Services/
Token logic (e.g., TokenService.cs).

Program.cs
App startup/configuration.

Frontend (Angular Standalone App)
Folders:

src/app/components/

login/
register/
task-list/
task-form/
Each folder contains its component, HTML, and CSS.
src/app/services/
API services (account.service.ts, task.service.ts).

src/app/models/
TypeScript interfaces/models (task.ts, user.ts).

src/app/guards/
Route guards (auth.guard.ts).

src/app/interceptors/
HTTP interceptors (auth-interceptor.ts).

src/app/app.routes.ts
Route definitions.

src/app/app.config.ts
Application configuration/providers.

Key Technical Decisions & Trade-offs
1. Standalone Components (Angular 19)
Decision: Use Angular 19 standalone components without NgModules

Pros:

Reduced boilerplate code

Faster build times

Better tree-shaking

Modern Angular approach

Cons:

Learning curve for developers used to NgModules

Some third-party libraries may not be fully compatible

2. Authentication Strategy
Decision: JWT tokens with SHA256 password hashing

Pros:

Stateless authentication

Scalable across multiple servers

Secure token-based approach

Cons:

Token management complexity

No built-in token refresh in this implementation

3. Database Choice: SQLite
Decision: SQLite for development, easily swappable for production

Pros:

Zero configuration

Fast development setup

File-based, easy to backup

Cons:

Limited concurrent connections

Not suitable for high-traffic production

Trade-off: Easy to switch to SQL Server/PostgreSQL via Entity Framework

4. State Management
Decision: Service-based state management with BehaviorSubject

Pros:

Simple to implement and understand

No external dependencies

Sufficient for small-medium applications

Cons:

Can become complex in larger apps

Manual state synchronization

5. API Design
Decision: RESTful API with resource-based endpoints

text
GET    /api/tasks          # List tasks
POST   /api/tasks          # Create task  
PUT    /api/tasks/{id}     # Update task
DELETE /api/tasks/{id}     # Delete task
PATCH  /api/tasks/{id}/toggle  # Toggle completion




















