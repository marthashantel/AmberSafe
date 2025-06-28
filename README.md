# 📢 AmberSafe – Emergency Alert Web App

AmberSafe is a simple, responsive web application that allows users to add emergency contacts and send AMBER alerts with their real-time geolocation. Built using HTML, CSS, JavaScript, and JSON Server, the app is fully functional and works locally.

## 🚀 Features

- ✅ Add & manage emergency contacts (name and phone number)
- ✅ Delete contacts with confirmation
- ✅ Send alert with current location (using Geolocation API)
- ✅ Alert includes a Google Maps link
- ✅ Form validation and user-friendly status messages
- ✅ Minimalist, professional design
- ✅ Mobile-friendly interface

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6)
- **Backend (Mock API)**: [JSON Server](https://github.com/typicode/json-server)

## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/marthashantel/ambersafe.git
cd ambersafe
```

### 2. Install JSON Server (if not already installed)

```bash
npm install -g json-server
```

### 3. Start the JSON Server

```bash
json-server --watch db.json --port 3000
```

This serves your contacts database at `http://localhost:3000/contacts`

## 💻 Run the App

Just open `index.html` in your browser using **Live Server** in VS Code or any static file server.

> Make sure the JSON Server is running in the background.

## 📁 Project Structure

```
ambersafe/
│
├── index.html         # Main HTML file
├── style.css          # Custom styles
├── script.js          # App logic
├── db.json            # Local JSON database (for contacts)
└── README.md          # You're reading it!
```

## 🧪 Sample `db.json`

```json
{
  "contacts": [
    {
      "id": 1,
      "name": "Martha Shantel",
      "phone": "+254113055627"
    }
  ]
}
```

## 🔐 Permissions

> The app uses your browser's **Geolocation API**. You will be prompted to allow location access when sending alerts.


## 📌 Future Improvements

- Add SMS/WhatsApp integration
- Save alert history
- Login/authentication
- PWA support for offline alerts

## 🧑‍💻 Author

**[Martha Shantel]** – [@marthashantel](https://github.com/marthashantel)