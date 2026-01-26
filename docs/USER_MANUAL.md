# CORRAD Application Framework - User Manual

**Version 1.0.0**  
**Last Updated:** 2024

---

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Authentication](#authentication)
4. [Dashboard](#dashboard)
5. [Account Code Management](#account-code-management)
6. [User Management](#user-management)
7. [Development Tools](#development-tools)
8. [Troubleshooting](#troubleshooting)
9. [Support](#support)

---

## 1. Introduction

### 1.1 About CORRAD Application Framework

CORRAD Application Framework (corradAF) is a comprehensive Nuxt.js-based application framework designed for rapid application development. It provides a complete foundation with essential development tools, authentication system, and modern UI components.

### 1.2 Key Features

- **Complete Authentication System** - Secure login, registration, password recovery, and logout
- **User Management** - Comprehensive user and role management with CRUD operations
- **Development Tools Suite** - Built-in tools for rapid development
- **Modern UI Components** - Beautiful, responsive interface built with TailwindCSS
- **API Management** - Design and test API endpoints
- **Content Management** - Dynamic content and template management
- **Menu Configuration** - Easy navigation structure management
- **Code Playground** - In-browser code testing and prototyping
- **ORM Integration** - Database schema management tools

### 1.3 System Requirements

- **Web Browser:** Chrome, Firefox, Safari, or Edge (latest versions)
- **Internet Connection:** Required for accessing the application
- **Screen Resolution:** Minimum 1024x768 pixels recommended

---

## 2. Getting Started

### 2.1 Accessing the Application

1. Open your web browser
2. Navigate to the application URL provided by your administrator
3. You will be redirected to the login page if not already authenticated

### 2.2 First-Time Login

1. If you don't have an account, click on the **Register** link
2. Fill in the registration form with your details
3. Submit the form to create your account
4. Log in with your credentials

### 2.3 Navigation Overview

The application features a modern, intuitive interface with:

- **Top Navigation Bar:** Contains user profile, notifications, and logout
- **Sidebar Menu:** Main navigation menu with collapsible sections
- **Breadcrumb Navigation:** Shows your current location in the application
- **Content Area:** Main workspace where content is displayed

---

## 3. Authentication

### 3.1 Logging In

1. Navigate to the login page
2. Enter your **Username** or **Email**
3. Enter your **Password**
4. Click the **Login** button
5. Upon successful authentication, you will be redirected to the Dashboard

### 3.2 Registration

1. Click on the **Register** link from the login page
2. Fill in all required fields:
   - Full Name
   - Email Address
   - Username
   - Password (must meet security requirements)
   - Confirm Password
3. Accept the terms and conditions if applicable
4. Click **Register** to create your account
5. You will be automatically logged in after successful registration

### 3.3 Password Recovery

If you forget your password:

1. Click on **Forgot Password** link on the login page
2. Enter your registered email address
3. Click **Send Reset Link**
4. Check your email for password reset instructions
5. Follow the link in the email to reset your password
6. Enter your new password and confirm it
7. Log in with your new password

### 3.4 Logging Out

1. Click on your **User Profile** icon in the top navigation bar
2. Select **Logout** from the dropdown menu
3. You will be logged out and redirected to the login page

---

## 4. Dashboard

### 4.1 Overview

The Dashboard is your main landing page after logging in. It provides:

- **Quick Statistics:** Overview of key metrics
- **Development Tools Access:** Quick links to all available tools
- **Framework Information:** Details about the application framework
- **Getting Started Guide:** Step-by-step instructions for new users

### 4.2 Dashboard Features

#### Quick Stats Cards

The dashboard displays quick statistics including:
- Number of Development Tools available
- Total Components count
- Authentication System status
- Framework version information

#### Development Tools Section

Access all development tools directly from the dashboard:
- Click on any tool card to navigate to that tool
- Each tool card shows:
  - Tool name
  - Brief description
  - Color-coded icon

#### Framework Features

View all available framework features in an organized list format.

#### Getting Started Guide

For new users, the dashboard includes a step-by-step getting started guide with:
- Installation instructions
- Configuration steps
- Development server setup

---

## 5. Account Code Management

### 5.1 Overview

The Account Code Management module allows you to view, search, and manage account codes in the system.

### 5.2 Accessing Account Codes

1. Navigate to **Setup** in the sidebar menu
2. Click on **Account Code**
3. The Account Code page will display

### 5.3 Filtering Account Codes

Use the Top Filter section to search and filter account codes:

#### Available Filters

- **Fund Type:** Filter by fund type (e.g., "E01 - ZAKAT")
- **Account Type:** Filter by account type (e.g., "ASET", "LIABILITI")
- **Account Class:** Filter by account class (e.g., "ASSET", "LIABILITY")
- **Account Code:** Search by specific account code

#### Using Filters

1. Enter or select values in the filter fields
2. Click the **Search** button to apply filters
3. The table will update to show matching results

### 5.4 Account Code Table

The table displays the following information:

- **No:** Sequential number
- **Account Code:** The account code identifier (e.g., "A0552102")
- **Account Code Description:** Description of the account (highlighted in yellow)
- **Account Level:** Hierarchical level of the account
- **Account Type:** Type of account (ASET, LIABILITI, etc.)
- **Account Class:** Classification of the account
- **Fund Type:** Associated fund type
- **Statement Item:** Financial statement item code (e.g., "BS" for Balance Sheet)
- **Account Status:** Current status (ACTIVE, INACTIVE, etc.)

### 5.5 Exporting Data

#### Download CSV

1. Apply any desired filters
2. Click the **Download CSV** button
3. A CSV file will be downloaded with the current filtered data

#### Download PDF

1. Apply any desired filters
2. Click the **Download PDF** button
3. A PDF file will be generated and downloaded with the current filtered data

### 5.6 Table Features

- **Sorting:** Click on column headers to sort data
- **Pagination:** Navigate through multiple pages of results (10 items per page)
- **Responsive Design:** Table adapts to different screen sizes

---

## 6. User Management

### 6.1 Overview

The User Management module (available to administrators and developers) allows you to manage users and roles in the system.

### 6.2 Accessing User Management

1. Navigate to **Pentadbiran** (Administration) in the sidebar menu
2. Click on **Urus Pengguna** (User Management)
3. Select either:
   - **Senarai Pengguna** (User List) - Manage users
   - **Senarai Peranan** (Role List) - Manage roles

### 6.3 Managing Users

#### Viewing Users

1. Navigate to **Senarai Pengguna** (User List)
2. View all registered users in the system
3. Use search and filter options to find specific users

#### Creating a New User

1. Click the **Add User** or **Create User** button
2. Fill in the user form:
   - Full Name
   - Email Address
   - Username
   - Password
   - Role Assignment
   - Status (Active/Inactive)
3. Click **Save** to create the user

#### Editing a User

1. Find the user in the list
2. Click the **Edit** button or icon
3. Modify the user information
4. Click **Save** to update

#### Deleting a User

1. Find the user in the list
2. Click the **Delete** button or icon
3. Confirm the deletion
4. The user will be removed from the system

### 6.4 Managing Roles

#### Viewing Roles

1. Navigate to **Senarai Peranan** (Role List)
2. View all available roles in the system

#### Creating a New Role

1. Click the **Add Role** or **Create Role** button
2. Enter role details:
   - Role Name
   - Description
   - Permissions
3. Click **Save** to create the role

#### Editing a Role

1. Find the role in the list
2. Click the **Edit** button
3. Modify role information and permissions
4. Click **Save** to update

#### Deleting a Role

1. Find the role in the list
2. Click the **Delete** button
3. Confirm the deletion
4. The role will be removed (ensure no users are assigned to this role)

---

## 7. Development Tools

### 7.1 Overview

The Development Tools suite provides powerful tools for developers and administrators to manage and configure the application.

**Note:** Development Tools are typically restricted to users with "Developer" role.

### 7.2 Menu Editor

#### Purpose

The Menu Editor allows you to configure the application's navigation structure.

#### Accessing Menu Editor

1. Navigate to **Pentadbiran** (Administration)
2. Click on **Penyunting Menu** (Menu Editor)

#### Features

- **Create Menu Items:** Add new navigation items
- **Edit Menu Items:** Modify existing menu items
- **Delete Menu Items:** Remove menu items
- **Reorder Menu Items:** Drag and drop to reorganize
- **Set Permissions:** Configure which roles can see each menu item
- **Hierarchical Structure:** Create nested menu structures

#### Using Menu Editor

1. View the current menu structure
2. Click **Add** to create a new menu item
3. Configure:
   - Menu Title
   - Path/URL
   - Icon
   - Parent Menu (for sub-items)
   - Permissions
4. Save the menu item
5. Use drag-and-drop to reorder items

### 7.3 API Editor

#### Purpose

The API Editor allows you to design, test, and document API endpoints.

#### Accessing API Editor

1. Navigate to **Pentadbiran** (Administration)
2. Click on **Penyunting API** (API Editor)

#### Features

- **Create API Endpoints:** Design new API endpoints
- **Test APIs:** Send requests and view responses
- **API Documentation:** Generate and view API documentation
- **Request/Response Testing:** Test different HTTP methods (GET, POST, PUT, DELETE)
- **Parameter Configuration:** Set up query parameters, headers, and body

#### Using API Editor

1. View existing API endpoints
2. Click **Create** to add a new endpoint
3. Configure:
   - Endpoint URL
   - HTTP Method
   - Request Headers
   - Request Body (for POST/PUT)
   - Expected Response
4. Click **Test** to send a request
5. View the response in the response panel

### 7.4 Content Editor

#### Purpose

The Content Editor allows you to manage dynamic content and templates.

#### Accessing Content Editor

1. Navigate to **Dashboard**
2. Click on **Content Editor** under Dashboard submenu
   OR
3. Navigate to **Pentadbiran** (Administration) if available

#### Features

- **Create Content:** Add new content pages
- **Edit Content:** Modify existing content
- **Template Management:** Create and edit templates
- **Content Versioning:** Track content changes
- **Rich Text Editing:** Use WYSIWYG editor for formatting

#### Using Content Editor

1. View list of content items
2. Click **Create** to add new content
3. Enter content details:
   - Title
   - Content Body (using rich text editor)
   - Template Selection
   - Metadata
4. Save and publish content

### 7.5 Code Playground

#### Purpose

The Code Playground provides an in-browser environment to test and prototype code.

#### Accessing Code Playground

1. Navigate to **Pentadbiran** (Administration)
2. Click on **Code Playground** (if available in menu)

#### Features

- **Multiple Language Support:** Test code in various programming languages
- **Real-time Execution:** See results instantly
- **Code Sharing:** Share code snippets
- **Syntax Highlighting:** Enhanced code readability

### 7.6 ORM Tools

#### Purpose

ORM Tools provide database schema management and query capabilities.

#### Accessing ORM Tools

1. Navigate to **Pentadbiran** (Administration)
2. Click on **ORM Tools** (if available in menu)

#### Features

- **Schema Management:** View and modify database schemas
- **Query Builder:** Build database queries visually
- **Migration Tools:** Manage database migrations
- **Data Browser:** Browse and edit database records

### 7.7 Configuration

#### Purpose

The Configuration tool allows you to manage system settings and environment variables.

#### Accessing Configuration

1. Navigate to **Pentadbiran** (Administration)
2. Click on **Configuration** (if available in menu)

#### Features

- **Environment Variables:** View and edit environment settings
- **System Settings:** Configure application-wide settings
- **Feature Toggles:** Enable/disable features
- **Theme Configuration:** Customize application appearance

### 7.8 Developer Guide

#### Purpose

The Developer Guide provides documentation and resources for developers.

#### Accessing Developer Guide

1. Navigate to **Pentadbiran** (Administration)
2. Click on **Panduan Pembangun** (Developer Guide)

#### Features

- **Framework Documentation:** Learn about the framework
- **API Documentation:** Reference for available APIs
- **Code Examples:** Sample code snippets
- **Best Practices:** Development guidelines

---

## 8. Troubleshooting

### 8.1 Common Issues

#### Cannot Log In

**Problem:** Unable to log in with correct credentials

**Solutions:**
1. Verify your username/email and password are correct
2. Check if Caps Lock is enabled
3. Clear browser cache and cookies
4. Try using password recovery to reset your password
5. Contact your administrator if the issue persists

#### Page Not Loading

**Problem:** Pages are not loading or showing errors

**Solutions:**
1. Check your internet connection
2. Refresh the page (F5 or Ctrl+R)
3. Clear browser cache
4. Try a different browser
5. Check if the application is under maintenance

#### Data Not Appearing

**Problem:** Tables or lists are empty when they should have data

**Solutions:**
1. Check if filters are applied that might hide data
2. Clear filters and search again
3. Verify you have proper permissions to view the data
4. Refresh the page
5. Check if there are any error messages

#### Export Not Working

**Problem:** CSV or PDF download is not working

**Solutions:**
1. Check if pop-up blockers are enabled and disable them
2. Verify you have proper permissions
3. Check browser download settings
4. Try a different browser
5. Ensure you have applied filters correctly

### 8.2 Browser Compatibility

The application works best with:
- **Chrome** (latest version) - Recommended
- **Firefox** (latest version)
- **Safari** (latest version)
- **Edge** (latest version)

### 8.3 Performance Tips

- Clear browser cache regularly
- Close unnecessary browser tabs
- Disable browser extensions that might interfere
- Use a stable internet connection
- Keep your browser updated

---

## 9. Support

### 9.1 Getting Help

If you need assistance:

1. **Check Documentation:** Review this user manual and other available documentation
2. **Contact Administrator:** Reach out to your system administrator
3. **Developer Support:** For technical issues, contact the development team
4. **Issue Reporting:** Report bugs or issues through the appropriate channels

### 9.2 Contact Information

For support inquiries, please contact:
- **System Administrator:** [Your Administrator Contact]
- **Development Team:** [Development Team Contact]
- **Support Email:** [Support Email Address]

### 9.3 Feedback

We welcome your feedback to improve the application. Please provide:
- Feature requests
- Bug reports
- Usability suggestions
- General feedback

---

## Appendix A: Keyboard Shortcuts

- **Ctrl + K:** Quick search (if available)
- **Esc:** Close modals/dialogs
- **F5:** Refresh page
- **Ctrl + F:** Find on page

## Appendix B: Glossary

- **Account Code:** A unique identifier for financial accounts
- **API:** Application Programming Interface
- **CRUD:** Create, Read, Update, Delete operations
- **ORM:** Object-Relational Mapping
- **RBAC:** Role-Based Access Control
- **WYSIWYG:** What You See Is What You Get (editor)

---

## Document Information

**Document Version:** 1.0.0  
**Last Updated:** 2024  
**Framework Version:** corradAF 1.0.0  
**Application:** CORRAD Application Framework

---

*This user manual is provided as a guide to help you effectively use the CORRAD Application Framework. For the most up-to-date information, please refer to the application's built-in help system or contact your administrator.*

