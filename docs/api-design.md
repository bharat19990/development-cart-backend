# API Design — Required Flows

Base URL: `http://localhost:3000`

---

## 1. User Registration

**Endpoint:** `POST /auth/register`  
**Auth:** None

### Sample request

```json
{
  "email": "learner@example.com",
  "password": "password123"
}
```

### Sample response `201`

```json
{
  "accessToken": "eyJhbG...",
  "user": {
    "id": "uuid",
    "email": "learner@example.com",
    "role": "USER",
    "profileCompleted": false
  }
}
```

### Validations

| Field | Rules |
|-------|--------|
| email | Valid email, unique |
| password | Min 8 characters |
| role | Not accepted — always `USER` |

---

## 2. Complete Profile (admin-dependent)

**Endpoint:** `POST /users/complete-profile`  
**Auth:** Bearer JWT (USER)

### Sample request

No body.

### Sample response `200`

```json
{
  "message": "Profile completed successfully",
  "user": { "profileCompleted": true },
  "activeSession": { "id": "...", "adminId": "...", "status": "ACTIVE" }
}
```

### Validations

| Rule | Error |
|------|-------|
| Authenticated | 401 |
| Active non-expired admin session exists | 404 |
| Profile not already completed | 400 |

---

## 3. Session Enrollment

**Endpoint:** `POST /enroll`  
**Auth:** Bearer JWT (USER)

### Sample request (self-pay $100)

```json
{
  "paymentType": "SELF",
  "amount": 100
}
```

### Sample request (sponsored)

```json
{
  "paymentType": "SPONSORED",
  "organizationId": "org-uuid"
}
```

### Sample response `201`

```json
{
  "message": "Enrolled successfully",
  "enrollment": {
    "paymentType": "SELF",
    "paymentStatus": "PAID",
    "amount": "100"
  }
}
```

### Validations

| Rule | Error |
|------|-------|
| Active session | 404 |
| Duplicate enrollment | 409 |
| SELF: amount must equal 100 | 400 |
| SPONSORED: sponsorship must exist | 404 |

---

## 4. Organization Sponsorship

**Endpoint:** `POST /sponsor`  
**Auth:** Bearer JWT (`ORGANIZATION`)

### Sample request

```json
{
  "userId": "user-uuid",
  "amount": 100,
  "paymentStatus": "PAID"
}
```

### Sample response `201`

```json
{
  "message": "User sponsored successfully",
  "sponsorship": {
    "enrollmentId": "...",
    "paymentStatus": "PAID"
  }
}
```

### Validations

| Rule | Error |
|------|-------|
| ORGANIZATION role + linked org | 403 |
| Active session | 404 |
| Duplicate sponsorship (org, user, session) | 409 |
| User already self-paid | 409 |
| Creates/links enrollment | — |
