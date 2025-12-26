# Let's Cook 🍳

A modern, full-stack recipe management application with AI-powered recipe generation, built with React, Node.js, Express, and MongoDB.

## ✨ Features

### 🤖 AI Recipe Generator
- **AI-Powered Creation**: Generate unique recipes using Google Gemini AI
- **Smart Customization**: Customize recipes by ingredients, cuisine type, cooking time, and difficulty level
- **Private Recipes**: AI-generated recipes are kept private and only visible to the creator
- **Auto-Save**: Automatically saves generated recipes to your collection

### 👥 User Features
- **User Authentication**: Secure login and registration system
- **Recipe Management**: Create, edit, and delete your own recipes
- **Save Recipes**: Bookmark recipes from other users for future reference
- **My Recipes**: View and manage all your created recipes
- **Saved Recipes**: Access all your bookmarked recipes in one place
- **Recipe Search**: Search recipes by name or description
- **Detailed View**: View complete recipe details including ingredients and instructions

### 🛡️ Admin Dashboard
- **Recipe Moderation**: Review and approve/reject user-submitted recipes
- **Real-time Stats**: Monitor pending submissions and system status
- **Persistent Access**: Admin link available in navbar for authorized users
- **Clean Interface**: Modern, intuitive dashboard design

### 🎨 User Interface
- **Modern Design**: Sleek dark theme with vibrant accent colors
- **Responsive Layout**: Works seamlessly on desktop, tablet, and mobile
- **Smooth Animations**: Enhanced user experience with micro-interactions
- **Intuitive Navigation**: Easy-to-use navbar with role-based links

## 🚀 Tech Stack

### Frontend
- **React** - UI library for building user interfaces
- **Vite** - Fast build tool and development server
- **Ant Design** - React UI component library
- **Redux** - State management
- **React Router** - Client-side routing
- **Axios** - HTTP client for API requests

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Google Gemini AI** - AI-powered recipe generation
- **bcryptjs** - Password hashing
- **JWT** - Authentication tokens
- **dotenv** - Environment variable management

## 📸 Screenshots

![Home Page](https://i.postimg.cc/ZKVZ0031/Untitled-design.png)
![Recipe Details](https://i.postimg.cc/x16KsGmt/Untitled-design-1.png)
![Create Recipe](https://i.postimg.cc/QtT1xRyy/Untitled-design-2.png)
![Saved Recipes](https://i.postimg.cc/wT34cBnK/Untitled-design-3.png)

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Google Gemini API key

### Environment Variables

Create a `.env` file in the `server` directory:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=3002
ACCESS_TOKEN_SECRET=your_jwt_secret_key
ACCESS_TOKEN_EXPIRY=1h
GEMINI_API_KEY=your_gemini_api_key
```

### Client Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. The client will be available at `http://localhost:5173`

### Server Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. The server will be available at `http://localhost:3002`

## 🔑 API Endpoints

### Authentication
- `POST /api/v1/users/register` - Register a new user
- `POST /api/v1/users/login` - User login

### Recipes
- `GET /api/v1/recipe` - Get all approved recipes
- `POST /api/v1/recipe/create` - Create a new recipe
- `GET /api/v1/recipe/:id` - Get recipe by ID
- `PUT /api/v1/recipe/update/:recipeId` - Update recipe
- `DELETE /api/v1/recipe/delete/:recipeId` - Delete recipe
- `PUT /api/v1/recipe/save` - Save a recipe to user's collection
- `GET /api/v1/recipe/savedRecipes/:userId` - Get user's saved recipes
- `GET /api/v1/recipe/userRecipes/:userId` - Get user's created recipes

### AI Recipe Generation
- `POST /api/v1/ai/generate-recipe` - Generate recipe with AI

### Admin (Protected Routes)
- `GET /api/v1/recipe/admin/pending` - Get pending recipes
- `PUT /api/v1/recipe/admin/status/:recipeId` - Update recipe status

## 🎯 User Roles

### Regular User
- Create and manage personal recipes
- Generate AI recipes
- Save and bookmark recipes
- Search and browse approved recipes

### Admin
- All regular user permissions
- Access to admin dashboard
- Review and moderate recipe submissions
- Approve or reject pending recipes

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the Repository**
   ```bash
   git clone https://github.com/Hamdayrabby/Let-s-Cook.git
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Your Changes**
   - Write clean, well-documented code
   - Follow existing code style
   - Test your changes thoroughly

4. **Commit Your Changes**
   ```bash
   git commit -m "feat: add your feature description"
   ```

5. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request**
   - Provide a clear description of your changes
   - Reference any related issues

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Google Gemini AI for powering recipe generation
- Ant Design for the beautiful UI components
- MongoDB for the robust database solution
- All contributors who help improve this project

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Made with ❤️ by the Let's Cook Team**
