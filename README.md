# Startup Buddy 🚀

An AI-powered platform that helps aspiring founders analyze and validate their startup ideas using real-time market research, cultural alignment insights, competitive benchmarking, and strategy generation.

## Features

### 🧠 AI-Powered Analysis
- **Market Research**: Real-time analysis using Tavily's search capabilities
- **TAM/SAM/SOM Calculation**: Comprehensive market sizing
- **Cultural Alignment**: Qloo AI integration for consumer preference analysis
- **Competition Analysis**: Identify competitors and market gaps
- **Feasibility Assessment**: Technical and financial viability evaluation
- **Strategy Recommendations**: Personalized go-to-market strategies

### 🎨 Modern Frontend
- Built with React, TypeScript, and Vite
- Tailwind CSS for styling
- Framer Motion for animations
- Dark mode support
- Responsive design
- 5-tab results dashboard
- PDF/Markdown report export

### ⚡ Intelligent Backend
- Node.js + Express server
- LangChain + LangGraph orchestration
- 8 specialized AI agents working in sequence
- MongoDB for data persistence
- Real-time analysis status updates

## Tech Stack

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **AI/ML**: LangChain, LangGraph
- **Database**: MongoDB + Mongoose
- **APIs**: Gemini Flash 2.0, Tavily, Qloo

## Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB (local or cloud)
- API Keys:
  - Google Gemini API key
  - Tavily API key (optional)
  - Qloo API key (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd FoundrIQ
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install --legacy-peer-deps
   cp .env.example .env
   # Edit .env with your API keys and database URL
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Configure Environment**
   Edit `backend/.env`:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/startup-buddy
   GEMINI_API_KEY=your_gemini_api_key_here
   TAVILY_API_KEY=your_tavily_api_key_here
   QLOO_API_KEY=your_qloo_api_key_here
   ```

5. **Start Development Servers**
   
   Backend:
   ```bash
   cd backend
   npm run dev
   ```
   
   Frontend (in new terminal):
   ```bash
   cd frontend
   npm run dev
   ```

6. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Health Check: http://localhost:5000/health

## API Endpoints

### Core Routes
- `POST /api/analyze-idea` - Submit startup idea for analysis
- `GET /api/analysis/:analysisId` - Get analysis results
- `GET /api/analysis/:analysisId/status` - Check analysis status
- `GET /api/report/:analysisId` - Get full report
- `GET /api/report/:analysisId/pdf` - Download PDF report
- `GET /api/report/:analysisId/markdown` - Download Markdown report

### Example Request
```bash
curl -X POST http://localhost:5000/api/analyze-idea \\
  -H "Content-Type: application/json" \\
  -d '{
    "description": "A mobile app that connects dog owners with local dog walkers",
    "category": "Marketplace",
    "targetAudience": "Busy urban professionals with dogs",
    "problemSolved": "Dog owners often struggle to find reliable, trustworthy dog walking services"
  }'
```

## AI Agent Pipeline

The system uses 8 specialized AI agents working in sequence:

1. **IdeaInterpreterAgent** - Extracts structured metadata
2. **MarketResearchAgent** - Real-time market analysis
3. **TAMSamAgent** - Market sizing calculations
4. **QlooTasteAgent** - Cultural alignment assessment
5. **CompetitionScanAgent** - Competitive landscape analysis
6. **FeasibilityEvaluatorAgent** - Technical and financial feasibility
7. **StrategyRecommenderAgent** - Go-to-market strategy
8. **ReportGeneratorAgent** - Final report compilation

## Project Structure

```
FoundrIQ/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React contexts
│   │   └── main.tsx        # App entry point
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                 # Node.js backend
│   ├── src/
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   │   └── agents/     # AI agents
│   │   └── index.js        # Server entry point
│   ├── package.json
│   └── .env.example
│
└── README.md
```

## Deployment

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy dist/ folder
```

### Backend (Railway/Render/Fly.io)
```bash
cd backend
# Set environment variables in deployment platform
npm start
```

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your_production_mongodb_url
GEMINI_API_KEY=your_gemini_api_key
TAVILY_API_KEY=your_tavily_api_key
QLOO_API_KEY=your_qloo_api_key
CORS_ORIGIN=https://your-frontend-domain.com
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For questions and support:
- Create an issue on GitHub
- Email: support@startupbuddy.com (placeholder)

---

**Built with ❤️ using AI-powered technology**
