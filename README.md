📦 GLOBAL LOGISTICS SHIPPING AGENCY

This is a full-stack shipment tracking system built with HTML, CSS, Javascript and Node.js.

This app allows an admin to create and manage shipment records and enables clients to track their shipments easily using a unique tracking number.

🚀 FEATURES

🧭 Admin (Backend)
Login to the Admin Dashboard.

Create a new shipment records by filling in client information.

Automatically generates a unique tracking number for each shipment.

Edit and update existing shipment and client details.

Shipment data is stored and can be fetched via API endpoints.

🌍 Client (Frontend)

Simple and responsive interface for tracking shipments.

Users can paste their tracking number into the search input(tracking number input) to instantly view their shipment details.

Real-time data fetched from the backend API.

🧰 TECH STACK

Category Technology Used

Frontend: HTML, CSS, Javascript
Backend: Node.js, Express.js
Deployment: Render(Backend and Frontend)
Email Service: SendGrid API
Version Control: Git & Github
Global-Logistics-Shipping-Agency/
│
├── ClientSide/ # Frontend
│ ├── Images/
│ ├── index.html
│ ├── homepage.css
│ ├── homepage.js
│ ├── about-us.html
│ ├── about-us.css
│ ├── about-us.js
│ ├── Contact-us.html
│ ├── Contact-us.css
│ ├── Contact-us.js
│ ├── service.html
│ ├── service.css
│ └── service.js
│
├── server/ # Backend (Node.js + Express)
│ ├── AdminLogin/ # Admin interface
│ │ ├── admin.html
│ │ ├── admin.css
│ │ └── admin.js
│ ├── Middleware/
│ │ └── auth.js
│ ├── route/
│ │ └── auth.js
│ ├── .env # Environment variables
│ ├── server.js # Main backend server
│ └── shipment.json # Stores shipment data
│
├── Screenshots/
├── .gitignore
├── package.json
└── README.md

## Screenshots

### Admin Dashboard (backend)

![Admin Dashboard](./Screenshots/Admin%20Login.png)
![Admin Dashboard](./Screenshots/Admin%20dashboard.png)

### Tracking Page (frontend)

![Tracking Page](./Screenshots/frontend%20homepage.png)
![Tracking Page](./Screenshots/project%20frontend%20screenshot.png)

⚙️ How It Works

1. Admin fills in shipment and client details on the Admin Dashboard.
2. A tracking number is generated and saved.
3. The client visits the tracking page and enters their tracking number.
4. The system fetches the shipment details from backend and displays them instantly.

🌐 Live Demo

Frontend(ClientSide) - https://client-side-94ot.onrender.com
Backend(Admin) - https://backend-server-km7h.onrender.com

### Test Tracking Numbers

Try tracking these sample shipments on the client side:
UPS249525824280
USPS048961956402

🧑‍💻 Author
Telly Bobo
Full Stack Developer | Cameroon

🔗 GitHub: [@tellybobo](https://github.com/tellybobo)

- 💼 _Available for freelance projects and remote work_
- 📧 [duncantravis374@gmail.com]
- 💻 Skills: HTML, CSS, JavaScript, Node.js, Express, React

### 🤝 Interested in working together?

I'm open to:

- Freelance web development projects
- Remote full-time/part-time positions
- Contract work
- Collaborative projects

Feel free to reach out!
