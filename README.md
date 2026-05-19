# MediPlus — Dossiers Médicaux

A secure medical records management system for hospitals. Doctors and admins can manage patients and encrypted medical documents, with tamper-proof integrity guaranteed by an Ethereum blockchain.

---

## Test Credentials

| Role | Email | Password |
|---|---|---|
| Admin | `mbabah3450@gmail.com` | `Admin@1234` |
| Doctor | `mhamed.bbh01@gmail.com` | `Doctor@1234` |

> Login requires OTP verification — a 6-digit code will be sent to the account's email after entering credentials.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Django REST Framework |
| Database | MongoDB (via Djongo) |
| Frontend | React (Vite) + Tailwind CSS + Material UI |
| Authentication | JWT + OTP 2FA (email) |
| Blockchain | Ethereum (Web3.py + Ganache) |
| Encryption | AES-256 (documents) + SHA-256 (integrity hashing) |

---

## Features

### Authentication
- Two roles: **Admin** and **Doctor**
- Email-based OTP two-factor authentication (6-digit, SHA-256 hashed, 5-minute expiry)
- Login lockout after repeated failures (escalating: 1 → 3 → 5 minutes)
- Admin creates doctor accounts — doctors receive a registration link + OTP via email

### Patient Management
- Add, edit, view, and list patients
- Patient fields: national ID, full name, date of birth, sex, phone number
- Search by name or ID number, filter by sex

### Medical Documents
- Documents are structured by **categories** (e.g., Lab Results, X-Ray, Consultation)
- Each category has configurable **fields**: text, number, date, textarea, select, file
- Document content is **AES-256 encrypted** before storage in MongoDB
- A **SHA-256 hash** of the encrypted content is stored on the **Ethereum blockchain** via a smart contract
- On retrieval, the document is decrypted and the hash is verified against the blockchain (`is_valid: true/false`)

### Admin Dashboard
- System-wide statistics: total categories, hospitals, documents, doctors
- Hospital management (CRUD)
- Category and field management (dynamic form builder)
- Doctor management: create, assign to hospitals, delete

### Security
- AES-256 encryption for all document content
- Blockchain-backed tamper detection
- API rate throttling: 30 req/min (authenticated), 10 req/min (anonymous)
- CORS restricted to configured frontend origins

---

## Security Architecture

```
User Input → AES-256 Encrypt → Base64 → MongoDB
                  ↓
           SHA-256 Hash → Ethereum Smart Contract
                  ↓
On Read:  Decrypt + Verify hash on blockchain → is_valid flag
```

---

## Prerequisites

- Python 3.10+
- Pipenv
- Node.js & npm
- MongoDB (running locally on port 27017)
- Ganache (local Ethereum node on port 7545)

---

## Environment Variables

Create a `.env` file in the project root with:

```env
AES_KEY=<64-character hex string for AES-256>
CONTRACT_ADDRESS=<deployed smart contract address>
PRIVATE_KEY=<Ethereum account private key>
RPC_URL=http://127.0.0.1:7545
```

---

## Setup

### Backend (Django)

```bash
# Install dependencies
pipenv install

# Activate virtual environment
pipenv shell

# Apply migrations
python manage.py makemigrations
python manage.py migrate

# Create an admin superuser
python manage.py createsuperuser

# Start the backend server
python manage.py runserver
```

### Frontend (React)

```bash
cd frontendR
npm install
npm run dev
```

### MongoDB

```bash
sudo systemctl start mongod
sudo systemctl status mongod
```

### Blockchain (Ganache)

Start Ganache on port `7545`, deploy the `DocumentRegistry` smart contract, then set the contract address and private key in `.env`.

---

## Running the Application

| Service | URL |
|---|---|
| Backend API | `http://localhost:8000/api/` |
| Frontend | `http://localhost:5175/` |

---

## API Overview

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register/` | Complete doctor registration |
| POST | `/api/auth/login/` | Login (triggers OTP email) |
| POST | `/api/auth/verify-otp/` | Verify OTP, receive JWT |
| POST | `/api/auth/create-doctor/` | Admin: create a doctor account |
| PUT | `/api/auth/create-doctor/<id>/` | Admin: update doctor's hospital |
| DELETE | `/api/auth/create-doctor/<id>/` | Admin: delete a doctor |

### Patients
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/patients/` | List all patients |
| POST | `/api/patients/` | Add a patient |
| GET/PUT/DELETE | `/api/patients/<id>/` | Retrieve, update, or delete a patient |

### Documents
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/documents/` | Create an encrypted document |
| GET | `/api/documents/<id>/` | Retrieve and decrypt a document |
| GET | `/api/documents/history/` | Document history by patient + category |
| GET | `/api/documents/<id>/verify/` | Verify document integrity |

### Admin
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/dashboard/` | Admin dashboard statistics |
| GET/POST/... | `/api/hospitals/` | Manage hospitals |
| GET/POST/... | `/api/categories/` | Manage categories |
| GET/POST/... | `/api/categories/<id>/fields/` | Manage fields for a category |

---

## Frontend Routes

| Route | Description |
|---|---|
| `/login` | Login page |
| `/register` | Doctor registration |
| `/verify-otp` | OTP verification |
| `/home` | Patient list |
| `/add` | Add a patient |
| `/edit/:id` | Edit a patient |
| `/details/:id` | Patient details and document history |
| `/patients/:id/documents/new` | Create a medical document |
| `/documents/:documentId` | View a document (decrypted + verified) |
| `/dashboard` | Admin statistics dashboard |
| `/hospitals` | Manage hospitals |
| `/categories` | Manage categories |
| `/category/:pk/fields` | Manage fields for a category |
| `/hospitals/:id/doctors` | View doctors in a hospital |
| `/add-doctor` | Admin: manage doctors |
