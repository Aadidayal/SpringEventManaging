# 🎉 Spring Event Management System

*Ever struggled with organizing events and keeping track of who's doing what? I've been there too!* 

This full-stack web application was born out of the need for a simple, yet powerful event management solution. Built with love using Spring Boot and React, it helps teams organize events without the usual headaches.

## 🤔 Why I Built This

After countless experiences with clunky event management tools and scattered spreadsheets, I decided to create something that actually makes sense. This system gives you clean separation between regular users (who just want to see what's happening) and admins (who need to manage everything), without overwhelming anyone.

## ✨ What Makes It Special

### 🔐 **Smart Authentication**
- No complex role assignments - just use an email with "admin" in it or set your name as "admin" and you're golden!
- Secure login that remembers you (until you decide to log out)
- Built-in protection so only the right people can access admin features

### 👥 **User Management That Actually Works**
*For the admins who need to stay in control:*
- Add new team members with a few clicks
- See everyone at a glance with real-time updates
- Edit or remove users when needed (we've all been there!)
- Form validation that catches mistakes before they happen

### 📅 **Event Creation Made Simple**
*Because organizing events shouldn't feel like rocket science:*
- Create events with all the important details (title, description, when, where, how many people)
- Smart date picker that won't let you accidentally schedule something in the past (you're welcome!)
- Set capacity limits so you don't end up with 500 people in a room meant for 50
- Only admins can create events (keeping things organized!)

### 🎨 **A UI That Doesn't Hurt Your Eyes**
- Beautiful dark theme because who needs more bright screens in their life?
- Works perfectly on your phone, tablet, or computer
- Loading animations and smooth transitions (the little things matter!)
- Error messages that actually tell you what went wrong

### 📱 **Two Dashboards, Two Experiences**
**For Regular Users:** Clean, simple view of all events. No clutter, no confusion.  
**For Admins:** Full control panel with tabs for managing both events and users.

## 🛠️ The Tech Behind the Magic

I chose these technologies because they work well together and make development enjoyable:

### **Backend (The Brain)**
- **Spring Boot 3.x** - Reliable, mature, and gets out of your way
- **H2 Database** - Perfect for development (no setup headaches!)
- **Spring Security** - Keeping your data safe without overthinking it
- **Maven** - Because dependency management should be boring

### **Frontend (The Face)**
- **React 18** - Modern, fast, and a joy to work with
- **React Router** - Smooth navigation between pages
- **CSS3 with Custom Properties** - Consistent theming made easy
- **Axios** - API calls that just work

## 🚀 Getting It Running (Don't Worry, It's Easy!)

### **What You'll Need**
- Java 17+ (most developers already have this)
- Node.js 16+ (for the React frontend)
- A cup of coffee ☕ (optional but recommended)

### **Starting the Backend**
```bash
# Jump into the project
cd SpringEventSystem

# Fire up the Spring Boot server
./mvnw spring-boot:run

# That's it! Backend is running on http://localhost:8080
```

### **Getting the Frontend Going**
```bash
# Move to the frontend folder
cd user-frontend

# Get all the dependencies
npm install

# Start the React dev server
npm start

# Your app will open at http://localhost:3000
```

### **Want to Peek at the Database?**
Visit http://localhost:8080/h2-console and use:
- **URL**: `jdbc:h2:mem:testdb`
- **Username**: `sa`
- **Password**: (just leave it empty)

## 🔑 Becoming an Admin (The Secret Sauce)

Here's how you unlock admin powers:

**The Email Trick:** Sign up with any email containing "admin" (like `admin@yourcompany.com` or `john.admin@work.com`)

**The Name Game:** Use "admin" as your first name when signing up

**Direct Access:** If you're already logged in, try visiting http://localhost:3000/admin

*Pro tip: The system automatically detects admins, so no manual role assignments needed!*

## 📁 How It's Organized (For the Curious Developers)

I kept the structure simple and logical:

```
SpringEventSystem/
├── src/main/java/com/example/demo/    # The Java magic happens here
│   ├── controller/                    # API endpoints (where requests come in)
│   ├── model/                        # Data models (User, Event entities)
│   ├── repository/                   # Database access (the data layer)
│   ├── service/                      # Business logic (the brain)
│   └── util/                         # Helper utilities
├── user-frontend/                    # React frontend
│   ├── src/components/              # All the React components
│   ├── src/services/                # API communication
│   └── src/App.js                   # Main app entry point
└── target/                          # Build artifacts (ignore this)
```

## 🔒 Security (I've Got Your Back)

Security isn't an afterthought here:

- **Smart Input Validation**: The app checks everything before it hits the database
- **Role Protection**: Admins can't accidentally give everyone admin access
- **Time Travel Prevention**: Can't create events in the past (trust me, I tried!)
- **SQL Injection Shield**: Using JPA means the database is protected
- **CORS Configured**: Your browser and server play nice together

## 🎯 API Reference (For the Technical Folks)

If you're integrating with other systems or just curious:

### **User Stuff**
- `POST /api/users/signup` - Join the party
- `POST /api/users/login` - Get back in
- `GET /api/users` - See everyone (admins only)
- `DELETE /api/users/{id}` - Remove someone (admins only)

### **Event Stuff**
- `GET /api/events` - See all events
- `POST /api/events` - Create new event (admins only)
- `GET /api/events/{id}` - Get specific event
- `GET /api/events/organizer/{organizerId}` - Filter by organizer

## 🚦 The Rules (So Things Don't Break)

### **Creating Events**
- Events must be in the future (no time machines here!)
- Capacity between 1-10,000 people (be reasonable!)
- Only admins can create them (keeping order)
- Everything except description is required

### **User Accounts**
- Email needs to look like an actual email
- Passwords have minimum requirements (security first!)
- One email per person (no duplicates)

## 🎨 Why It Looks Good

I spent time on the little things:

- **Dark Theme**: Your eyes will thank you during late-night event planning
- **Mobile-First**: Works great on phones (because who's always at a computer?)
- **Loading Feedback**: You always know when something's happening
- **Clear Errors**: When things go wrong, you'll know exactly what and why
- **Smooth Interactions**: Buttons feel responsive, transitions are smooth

## 🔄 My Development Process

Here's how I built this (in case you're curious):

1. **Started with Spring Boot**: Got the backend working first with H2 database
2. **Built the React frontend**: Created components one by one, testing as I went
3. **Added the dark theme**: Because it looks professional and is easier on the eyes
4. **Implemented security**: Made sure only admins can admin
5. **Polished the UX**: Added loading states, error handling, and animations

## 🧪 Testing with Postman (Complete API Guide)

Want to test the API directly? Here are all the endpoints with example requests:

## 🚦 Validation Rules

### **Event Creation**
- Date must be in the future
- Capacity: 1-10,000 participants
- Only admin users can create events
- All fields required except description

### **User Registration**
- Valid email format required
- Password minimum requirements
- Unique email addresses

## 🎨 UI/UX Features

- **Dark Theme**: Modern, eye-friendly design
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Loading States**: Visual feedback during operations
- **Error Handling**: Clear error messages and validation
- **Smooth Animations**: Enhanced user experience
- **Intuitive Navigation**: Easy-to-use interface

## 🔄 Development Workflow

1. **Backend Development**: Spring Boot with auto-reload
2. **Frontend Development**: React with hot reload
3. **Database**: H2 in-memory for development
4. **Testing**: Manual testing with Postman/browser
5. **Version Control**: Git with feature branches

## 📝 Future Enhancements

- Event registration system for users
- Email notifications
- Event categories and filtering
- File upload for event images
- Advanced reporting and analytics
- Calendar integration
- Mobile app development

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---
