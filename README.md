# AI-Powered Task Management System

A full-stack task management application with AI integration using Groq's LLM for intelligent task guidance.

## 🚀 Features

- **🤖 AI-Powered Task Guidance**: Automatic AI recommendations for tasks using Groq's Llama3 model
- **📊 Real-time Dashboard**: Beautiful statistics and task overview
- **🎯 Task Management**: Create, edit, delete, and track task status
- **👥 User Management**: Create and manage users with task assignment
- **🎨 Modern UI**: Built with Next.js, shadcn/ui, and Tailwind CSS
- **📱 Responsive Design**: Works perfectly on desktop and mobile
- **⚡ Fast Performance**: Groq's ultra-fast inference for instant AI responses

## 🏗️ Architecture

### Backend (Flask)
- **Framework**: Flask with Flask-RESTX
- **AI Integration**: Groq API with Llama3-8b-8192 model
- **Database**: JSON-based storage with local file persistence
- **API**: RESTful endpoints with automatic documentation
- **CORS**: Enabled for frontend communication

### Frontend (Next.js)
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Forms**: React Hook Form with Zod validation
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Notifications**: Sonner

## 📁 Project Structure

```
cursor-test/
├── app.py                 # Flask backend server
├── requirements.txt       # Python dependencies
├── local_db.json         # JSON database (auto-generated)
├── frontend/             # Next.js frontend
│   ├── src/
│   │   ├── app/          # Next.js app router
│   │   ├── components/   # React components
│   │   ├── lib/          # Utilities and API
│   │   └── types/        # TypeScript types
│   ├── package.json      # Node.js dependencies
│   └── README.md         # Frontend documentation
└── README.md             # This file
```

## 🛠️ Installation & Setup

### Prerequisites

- Python 3.8+
- Node.js 18+
- npm or yarn
- Groq API key

### Backend Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/DimonBel/vibe-coding.git
   cd vibe-coding
   ```

2. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up Groq API key**:
   - Get your API key from [Groq Console](https://console.groq.com/)
   - Update the API key in `app.py` (line with `api_key="your_key_here"`)

4. **Start the Flask server**:
   ```bash
   python app.py
   ```
   The server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install Node.js dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:3000`

## 🎯 Usage

### Creating Tasks
1. Open the frontend at `http://localhost:3000`
2. Click "New Task" button
3. Enter task title and description
4. Submit - AI will automatically generate guidance
5. View AI recommendations in the task card

### Managing Tasks
- **Edit**: Click the "Edit" button on any task
- **Delete**: Click the "Delete" button to remove tasks
- **Status Change**: Use the dropdown to update task status
- **AI Guidance**: View AI recommendations for each task

### User Management
- **Create Users**: Click "New User" to add team members
- **View Users**: Switch to the "Users" tab to see all users
- **Task Assignment**: Users can be assigned to tasks (backend integration)

## 🔌 API Endpoints

### Tasks
- `GET /tasks` - Get all tasks
- `POST /tasks` - Create new task
- `GET /tasks/:id` - Get specific task
- `PUT /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task

### Users
- `GET /users` - Get all users
- `POST /users` - Create new user

### AI Integration
- Automatic AI guidance generation on task creation/update
- Uses Groq's Llama3-8b-8192 model for fast inference
- Context-aware recommendations based on task details

## 🎨 UI Features

- **Dashboard**: Real-time statistics and task overview
- **Responsive Design**: Mobile-first approach
- **Dark/Light Mode**: Automatic theme detection
- **Toast Notifications**: User feedback for all actions
- **Loading States**: Smooth user experience
- **Form Validation**: Client-side validation with Zod

## 🚀 Deployment

### Backend Deployment
- **Heroku**: Add `Procfile` and configure environment variables
- **Railway**: Connect GitHub repository for automatic deployment
- **Docker**: Use the provided Dockerfile

### Frontend Deployment
- **Vercel**: Connect GitHub repository for automatic deployment
- **Netlify**: Build and deploy from the `frontend` directory
- **Railway**: Deploy as a static site

### Environment Variables
- `GROQ_API_KEY`: Your Groq API key
- `FLASK_ENV`: Set to `production` for production deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Groq](https://groq.com/) for ultra-fast AI inference
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Next.js](https://nextjs.org/) for the amazing React framework
- [Flask](https://flask.palletsprojects.com/) for the Python web framework

## 📞 Support

If you have any questions or need help, please open an issue on GitHub or contact the maintainers.

---

**Made with ❤️ using AI-powered development tools**
