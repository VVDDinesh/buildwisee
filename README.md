# BuildWise - AI-Powered Construction Planning Platform

BuildWise is an intelligent construction management platform that leverages AI to streamline project planning, provide real-time assistance, and visualize 3D house plans.

## 🚀 Features

- **AI Project Planner**: Automated construction project planning using Groq LLM and Granite via Ollama
- **Intelligent Chatbot**: Real-time assistance for construction queries and project guidance
- **3D Animated House Plans**: Interactive 3D visualization using Three.js for immersive project previews
- **Developer Publishing**: Platform for developers to publish and share construction projects
- **Project Management**: Comprehensive dashboard for tracking construction projects
- **Authentication**: Secure user authentication with Supabase

## 🛠️ Tech Stack

### Frontend
- **React** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **shadcn-ui** for UI components
- **Three.js** for 3D visualization

### Backend
- **FastAPI** for REST API
- **PostgreSQL** with Supabase
- **Groq LLM** for AI planning
- **Granite via Ollama** for advanced AI features

### Infrastructure
- **Docker** for containerization
- **AWS ECR** for container registry
- **AWS ECS/Kubernetes** for deployment
- **GitHub Actions** for CI/CD

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Git

### Local Development

```bash
# Clone the repository
git clone https://github.com/VVDDinesh/buildwisee.git
cd buildwisee

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
```

## 🚢 Deployment

### Using GitHub Actions (Automated)

Push to main branch triggers automatic deployment:

```bash
./push_buildwise.sh "Your commit message"
```

### Manual Deployment

```bash
# Build Docker image
docker build -t buildwise .

# Tag and push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <ECR_URI>
docker tag buildwise:latest <ECR_URI>/buildwise:latest
docker push <ECR_URI>/buildwise:latest

# Deploy to ECS
aws ecs update-service --cluster buildwise-cluster --service buildwise-service --force-new-deployment
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run linting
npm run lint
```

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `./push_buildwise.sh "message"` - Automated Git push

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contribution Guidelines

- Follow TypeScript and React best practices
- Write tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR
- Follow the existing code style

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- VVDDinesh - [GitHub](https://github.com/VVDDinesh)

## 🙏 Acknowledgments

- Groq for LLM capabilities
- Ollama for Granite model integration
- Supabase for backend infrastructure
- Three.js community for 3D visualization tools
