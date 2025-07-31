# Hero Threads - React Frontend

## Overview
This is the React frontend for the Hero Threads e-commerce application. It provides a modern, responsive interface for browsing products, managing shopping carts, and processing orders.

## Features Implemented

### 🔐 Authentication & Authorization
- **User Registration**: Complete registration form with all required fields from the backend model
- **Email Confirmation**: Registration confirmation emails (simulated)
- **Login System**: Secure authentication with role-based access
- **Route Protection**: Public, private, and admin-only routes

### 🛒 Shopping Cart & Checkout
- **Cart Management**: Add/remove items, update quantities
- **Guest Cart**: Users can add items without logging in
- **Login Required for Purchase**: Authentication required to complete checkout
- **Order Summary**: Detailed order review before payment

### 💳 Payment Methods
- **Credit Card**: Secure card payment processing
- **Bank Transfer**: Transfer details with receipt upload requirement
- **Cash Payment**: Pay on delivery option
- **Receipt Upload**: Image upload for bank transfer confirmations

### 🛡️ Route Protection System
- **Public Routes**: Home, products, about (accessible to everyone)
- **Private Routes**: Cart, checkout (require authentication)
- **Admin Routes**: Dashboard, reports, admin panel (require admin role)
- **Auth Routes**: Login/register (redirect authenticated users)

### 📧 Email Services
- **Registration Confirmation**: Welcome emails for new users
- **Order Confirmation**: Purchase confirmation emails
- **Email Templates**: Structured email content

## Project Structure

```
frontend/
├── src/
│   ├── components/           # React components
│   │   ├── ShopHeader.js     # Navigation and auth modals
│   │   ├── RegisterModal.js  # User registration form
│   │   ├── CartSection.js    # Shopping cart management
│   │   ├── CheckoutSection.js # Payment processing
│   │   └── ...               # Other components
│   ├── routes/               # Route protection components
│   │   ├── PublicRoute.js    # Public route wrapper
│   │   ├── PrivateRoute.js   # Private route wrapper
│   │   └── AuthRoute.js      # Auth route wrapper
│   ├── utils/                # Utility functions
│   │   └── emailService.js   # Email service utilities
│   ├── data/                 # Static data
│   │   └── products.js       # Default products
│   └── App.js               # Main application component
```

## Key Components

### Route Protection
- **PublicRoute**: Allows access to everyone
- **PrivateRoute**: Requires authentication, optionally specific roles
- **AuthRoute**: Redirects authenticated users away from auth pages

### Registration System
- **RegisterModal**: Comprehensive registration form with validation
- **Field Validation**: Real-time form validation
- **Email Confirmation**: Simulated email sending

### Payment Processing
- **CheckoutSection**: Multi-payment method support
- **Receipt Upload**: File upload for bank transfers
- **Order Confirmation**: Email notifications for purchases

## API Integration

### Backend Endpoints Used
- `POST /api/login` - User authentication
- `POST /api/clientes/register/public` - User registration
- `GET /api/productos` - Fetch products
- `POST /api/email/send-confirmation` - Send confirmation emails
- `POST /api/email/send-order-confirmation` - Send order confirmations

### Authentication Flow
1. User registers with email/password
2. Confirmation email sent (simulated)
3. User logs in with credentials
4. Role-based access granted
5. Protected routes become accessible

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Backend server running on port 3000

### Installation
```bash
cd frontend
npm install
```

### Development
```bash
npm start
```

The application will run on `http://localhost:3001` (proxy configured to backend on port 3000).

### Build for Production
```bash
npm run build
```

## Demo Credentials

### Admin Access
- Email: `admin@admin.com`
- Password: `admin123`

### Client Access
- Email: `cliente@cliente.com`
- Password: `cliente123`

## Features in Detail

### Shopping Cart Behavior
- ✅ Add products without login
- ✅ View cart contents
- ✅ Update quantities
- ✅ Remove items
- ❌ Complete purchase (requires login)

### Payment Method Options
- ✅ Credit Card: Full card details form
- ✅ Bank Transfer: Account details + receipt upload
- ✅ Cash: Pay on delivery confirmation

### User Registration
- ✅ Complete form with all backend fields
- ✅ Email validation
- ✅ Password confirmation
- ✅ Email confirmation (simulated)

### Route Protection
- ✅ Public: Home, products, about
- ✅ Private: Cart, checkout (client role)
- ✅ Admin: Dashboard, reports, admin panel (admin role)

## Technical Implementation

### State Management
- React hooks for local state
- Context could be added for global state if needed

### Form Validation
- Real-time validation
- Error messages
- Required field indicators

### File Upload
- Image file validation
- Preview functionality
- Error handling

### Email Integration
- Simulated email sending
- Ready for real email service integration
- Template-based email content

## Future Enhancements

### Email Service Integration
- Real email service (SendGrid, Mailgun, AWS SES)
- Email templates
- Confirmation tokens

### Enhanced Security
- JWT tokens
- Password reset functionality
- Email verification

### Additional Features
- User profiles
- Order history
- Wishlist functionality
- Product reviews
- Real-time notifications

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of the Hero Threads e-commerce platform. 