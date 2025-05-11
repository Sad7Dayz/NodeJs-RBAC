# 🔐 Node.js Secure REST API Boilerplate (RBAC, JWT, MongoDB)

## 🔐 What is RBAC (Role-Based Access Control)?
**RBAC (Role-Based Access Control)** is a security mechanism that restricts access to resources based on the roles assigned to users within a system. Instead of assigning permissions to individual users, permissions are grouped by role, and users are assigned to these roles.

> 🎥 **Watch Full Tutorial Series on YouTube:**  
[![YouTube Video](https://img.shields.io/badge/Watch-YouTube-red?logo=youtube)](https://https://youtube.com/playlist?list=PLQDioScEMUhl3n7ibx-sl-Y_d__dFrTSr&si=nE8kXGlPx8dL0gi8)

---

### 🔧 Key Concepts

- **Role**: A named set of permissions 
- **User**: An individual who is assigned one or more roles
- **Permission**: An action that can be performed on a resource 

### ✅ Benefits of RBAC

- 🔐 **Improved Security**: Limits access only to what's necessary
- 🧩 **Scalability**: Easy to manage as the number of users grows
- 📋 **Policy Enforcement**: Enforces consistent access policies across systems
- 🔄 **Separation of Duties**: Helps maintain compliance by assigning specific responsibilities

### 🧠 Example

| Role   | Permissions                   |
|--------|-------------------------------|
| Admin  | create, read, update, delete  |
| Editor | read, update                  |
| Viewer | read                          |

A user with the `Editor` role can update content but cannot delete it. This ensures that only users with the appropriate role can perform sensitive actions.



