# My-Cookbook-V1.0

A comprehensive recipe management application with AI-powered parsing capabilities. Upload recipes from PDFs, URLs, or text, and manage your personal cookbook with full CRUD operations and recipe editing features.

## Features

🤖 AI-powered recipe parsing: Extract structured recipes from PDFs, URLs, and plain text using OpenAI.

📝 Full CRUD operations: Create, view, update, and delete stored recipes.

✏️ Recipe editing: Update title, description, ingredients, and instructions inline.
​
💾 Local database: Persist recipes in a local SQLite database via Drizzle ORM.
​
🎨 Modern UI: Responsive interface built with React and Next.js.
​
📤 File upload: Import PDF recipes directly through the upload flow.

## Tech Stack

Framework: Next.js 15.5.9 with React 19
​
Language: JavaScript with some TypeScript files
​
Database: SQLite with Drizzle ORM
​
AI: OpenAI API (GPT-4o-mini)
​
PDF processing: Tesseract-based OCR for PDF text extraction
​
Forms / UI: Custom components and shared styles (no Formidable in current UI)
​
Linting: ESLint with Next.js configuration

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher recommended)
- npm (v9 or higher)
- An OpenAI API key (get one at https://platform.openai.com/api-keys)

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rwilliamspbg-ops/My-Cookbook-V1.0.git
   cd My-Cookbook-V1.0
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```bash
   touch .env.local
   ```
   
   Add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Initialize the database**
   
   The SQLite database will be automatically created when you first run the application. The database file (`sqlite.db`) will be created in the root directory.

## Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | Your OpenAI API key for recipe parsing | Yes |

### Database Configuration

The application uses SQLite with Drizzle ORM. Configuration is in `drizzle.config.ts`:
- Database file: `sqlite.db` (created automatically)
- Schema location: `./lib/db/schema.js`
- Migrations output: `./drizzle`

## Usage

### Development Mode

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm start
   ```

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint to check code quality

## How It Works

### Adding Recipes

1. **From PDF**: Upload a PDF file containing a recipe. The AI will extract:
   - Recipe title
   - Description
   - Ingredients list
   - Cooking instructions
   - Preparation time

2. **From URL**: Paste a URL to a recipe webpage. The AI will fetch and parse the content.

3. **From Text**: Paste recipe text directly. The AI will structure it into proper fields.

### Managing Recipes

- **View**: Browse all your recipes in the main interface
- **Edit**: Click on any recipe to edit its details
- **Delete**: Remove recipes you no longer need
- **Search**: Find recipes quickly (if search feature is implemented)

## Project Structure

```
My-Cookbook-V1.0/
├── pages/
│   ├── api/
│   │   ├── parse-recipe.js    # AI recipe parsing endpoint
│   │   └── recipes.js          # CRUD operations for recipes
│   ├── recipe/                 # Recipe pages
│   ├── index.js               # Home page
│   └── upload.js              # Upload page
├── lib/
│   ├── db/
│   │   ├── index.ts           # Database connection
│   │   └── schema.js          # Database schema
├── drizzle.config.ts          # Drizzle ORM configuration
├── next.config.js             # Next.js configuration
├── package.json               # Dependencies and scripts
└── sqlite.db                  # SQLite database (created at runtime)
```

## Database Schema

The application uses a simple schema for storing recipes. Check `lib/db/schema.js` for the complete schema definition.

## Troubleshooting

### Common Issues

1. **OpenAI API Key Error**
   - Make sure your `.env.local` file exists and contains a valid `OPENAI_API_KEY`
   - Restart the development server after adding environment variables

2. **Database Errors**
   - Delete `sqlite.db` and restart the application to recreate the database
   - Check file permissions in the project directory

3. **PDF Parsing Issues**
   - Ensure PDFs contain selectable text (not just images)
   - Try with a different PDF if parsing fails

4. **Build Errors**
   - Clear the `.next` folder: `rm -rf .next`
   - Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is private and not licensed for public use.

## Author

rwilliamspbg-ops

## Support

For issues, questions, or suggestions, please open an issue on GitHub.
