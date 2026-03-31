import React, { useState, useEffect, useRef } from 'react';
import { Github, ExternalLink, Code, TrendingUp, Zap, Database, Layout, ChevronDown, Briefcase, GraduationCap, Award } from 'lucide-react';

// Warp Background Component
const WarpBackground = ({ children }) => {
  const canvasRef = useRef(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', updateDimensions);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let time = 0;

    const points = [];
    const pointCount = 80;

    for (let i = 0; i < pointCount; i++) {
      points.push({
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        originalX: Math.random() * dimensions.width,
        originalY: Math.random() * dimensions.height
      });
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(2, 6, 23, 0.05)';
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);

      time += 0.005;

      points.forEach((point, i) => {
        point.x += point.vx;
        point.y += point.vy;

        const dx = mousePos.current.x - point.x;
        const dy = mousePos.current.y - point.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 150) {
          point.x -= dx * 0.02;
          point.y -= dy * 0.02;
        }

        const returnForceX = (point.originalX - point.x) * 0.001;
        const returnForceY = (point.originalY - point.y) * 0.001;
        point.vx += returnForceX;
        point.vy += returnForceY;

        point.vx *= 0.98;
        point.vy *= 0.98;

        if (point.x < 0 || point.x > dimensions.width) point.vx *= -1;
        if (point.y < 0 || point.y > dimensions.height) point.vy *= -1;

        points.forEach((otherPoint, j) => {
          if (i === j) return;
          const dx = otherPoint.x - point.x;
          const dy = otherPoint.y - point.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            const opacity = (1 - distance / 120) * 0.3;
            ctx.strokeStyle = `rgba(139, 92, 246, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(otherPoint.x, otherPoint.y);
            ctx.stroke();
          }
        });

        const gradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, 3);
        gradient.addColorStop(0, 'rgba(168, 85, 247, 0.8)');
        gradient.addColorStop(1, 'rgba(139, 92, 246, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [dimensions]);

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-slate-950">
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="absolute inset-0"
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

const App = () => {
  const [perspective, setPerspective] = useState('engineering');
  const [expandedProject, setExpandedProject] = useState(null);
  const [hoveredSkill, setHoveredSkill] = useState(null);

  const isEngineering = perspective === 'engineering';

  const projects = [
    {
      id: 'voice-assistant',
      title: 'AI Voice Assistant',
      company: 'Betty24 GmbH',
      role: 'Software Development Intern',
      category: 'Full-Stack',
      problem: 'Restaurant order processing was manual and error-prone, requiring staff to handle complex phone orders while managing in-person customers.',
      techStack: ['Firebase', 'GPT-5', 'Retell AI', 'Google Sheets API', 'JSON Schemas'],
      architecture: 'Built a real-time voice assistant using Firebase for sub-second data synchronization, integrated GPT-5 with custom JSON schemas for structured communication, and implemented Google Sheets API for order management.',
      engineeringHighlights: [
        'Designed JSON-based schemas for GPT-5 backend communication',
        'Achieved 95%+ conversational accuracy through iterative prompt engineering',
        'Implemented sub-second Firebase real-time sync for order processing',
        'Built scalable REST API integration with Google Sheets'
      ],
      productMetrics: {
        efficiency: '40-60% reduction in manual order handling',
        scale: '100+ orders/day processing capacity',
        compliance: '100% specification compliance',
        satisfaction: '20% increase in customer satisfaction'
      },
      tradeoffs: 'Chose Firebase over traditional databases for real-time requirements in high-concurrency restaurant environments. The serverless architecture reduced infrastructure overhead but required careful schema design for offline resilience.',
      github: '#',
      impact: 'high'
    },
    {
      id: 'seo-agent',
      title: 'AI SEO Audit Agent',
      company: 'AI Student Collective',
      role: 'Developer',
      category: 'AI/Backend',
      problem: 'Traditional SEO audits cost $100+ and took days to complete, making them inaccessible for small businesses.',
      techStack: ['Gemini 1.5', 'RAG Pipeline', 'Cheerio', 'Node.js', 'REST APIs', 'Vector Databases (Clouflare Vectorize)','KV Storage','Tensorflow'],
      architecture: 'Architected a serverless RAG pipeline on Cloudflare Workers using Gemini 1.5 and Vectorize; implemented CORS security and leaky-bucket rate limiting for global, low-latency SEO audits.',
      engineeringHighlights: [
        'Architected a serverless RAG pipeline using Cloudflare Workers and Gemini 1.5 for high-precision semantic SEO analysis.',
        'Engineered a distributed scraping engine with Cheerio and CORS-secured middleware to handle complex cross-origin data ingestion.',
        'Designed "leaky-bucket" rate-limiting and API protection layers to ensure global service availability and infrastructure security.',
        'Optimized async task orchestration, leveraging edge-concurrency to achieve sub-20s audit completion for 100+ metrics.'
      ],
      productMetrics: {
        cost: '99% cost reduction ($0.01 vs $100+)',
        speed: 'Sub-20 second audit completion',
        precision: 'High-precision keyword and meta analysis',
        accessibility: 'Democratized SEO for small businesses'
      },
      tradeoffs: 'Selected Gemini 1.5 over GPT-4 for better cost-to-performance ratio on bulk text analysis. RAG approach over fine-tuning provided flexibility for evolving SEO standards without model retraining.',
      github: 'https://github.com/manya2004uw/cf_ai_seo-agent',
      impact: 'high'
    },
    {
      id: 'school-analytics',
      title: 'Educational Policy Dashboard',
      company: 'Edmonds School District',
      role: 'Data Analyst',
      category: 'Data/PM',
      problem: 'District administrators lacked visibility into student sentiment and program effectiveness across 1,000+ survey responses.',
      techStack: ['Tableau', 'Excel', 'Data Visualization', 'Statistical Analysis'],
      architecture: 'Designed end-to-end data pipeline: cleaned and normalized 1,000+ survey responses with 100% accuracy, created 5+ interactive Tableau dashboards, and presented actionable insights to Board Members.',
      engineeringHighlights: [
        'Cleaned 1,000+ survey responses with 100% accuracy',
        'Built 5+ interactive Tableau dashboards',
        'Implemented statistical analysis for trend identification',
        'Created automated data validation workflows'
      ],
      productMetrics: {
        visibility: '70% increase in data insight visibility',
        adoption: '3 policy recommendations adopted by Board',
        stakeholders: 'Presented findings to Board Members',
        scale: '1,000+ survey responses analyzed'
      },
      tradeoffs: 'Chose Tableau over custom web dashboards for faster deployment and better stakeholder familiarity. This reduced development time by 80% while maintaining professional quality.',
      impact: 'medium'
    },
    {
      id: 'dais-research',
      title: 'Molecular Analysis Optimization',
      company: 'UW DAIS Group',
      role: 'Research Assistant',
      category: 'Research',
      problem: 'Backend data processing for atom prediction software was bottlenecking molecular analysis workflows in large-scale research.',
      techStack: ['Python', 'Data Optimization', 'Backend Systems'],
      architecture: 'Optimized backend data handling pipelines for molecular prediction software, collaborating across 400-500 researchers to improve analysis throughput.',
      engineeringHighlights: [
        'Optimized backend data pipelines for 20% speed improvement',
        'Refactored data structures for molecular analysis',
        'Implemented caching strategies for prediction queries',
        'Collaborated on cross-functional research platform'
      ],
      productMetrics: {
        performance: '20% increase in analysis speed',
        collaboration: 'Coordinated across 400-500 students/researchers',
        scale: 'Supported large-scale molecular machine research',
        impact: 'Accelerated scientific discovery workflows'
      },
      tradeoffs: 'Prioritized read optimization over write performance based on analysis workload patterns. This improved query times at the cost of slightly slower data ingestion.',
      impact: 'medium'
    }
  ];

  const skills = {
    languages: ['Java', 'Python', 'JavaScript', 'TypeScript', 'SQL'],
    backend: ['Firebase', 'AWS', 'Node.js', 'REST APIs', 'RAG Pipelines', 'GPT-5 Integration'],
    product: ['Figma', 'Tableau', 'Stakeholder Management', 'Data-Driven Strategy', 'A/B Testing']
  };

  const experience = [
        {
      title: 'Director of Projects',
      company: 'AI Student Collective (AISC) @ UW',
      period: '2025 – Present',
      icon: <Briefcase size={20} />,
      highlights: [
        'Co-hosted "Hack to the Future" hackathon with 100+ participants and industry judges',
        'Spearheading Spring 2026 Project Cohort - 6-week intensive AI build cycle',
        'Leading team of Team Leads mentoring students through full-stack AI development'
      ]
    },
    {
      title: 'Software Development Intern',
      company: 'Betty24 GmbH',
      period: '2024',
      icon: <Briefcase size={20} />,
      highlights: [
        '100% specification compliance on voice assistant project',
        '30% scalability improvement through schema optimization',
        '20% customer satisfaction increase'
      ]
    },
    {
      title: 'Research Assistant',
      company: 'UW DAIS Group',
      period: '2024',
      icon: <GraduationCap size={20} />,
      highlights: [
        'Collaborated across 400-500 person research team',
        '20% analysis speed improvement',
        'Contributed to molecular machine research'
      ]
    },
    {
      title: 'Campus Partner',
      company: 'Perplexity AI',
      period: '2024',
      icon: <Award size={20} />,
      highlights: [
        'Coordinated with 10+ student organizations',
        '30% boost in event attendance',
        'Strategic partnership development'
      ]
    }
  ];

  return (
    <WarpBackground>
      <div className="min-h-screen">
        {/* Floating Header */}
        <header className="sticky top-4 z-50 mx-auto max-w-6xl px-6 pt-4">
          <div className="backdrop-blur-xl bg-slate-950/60 border border-purple-500/20 rounded-2xl shadow-2xl shadow-purple-500/10">
            <div className="px-6 py-5">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent">
                    Manya Chugh
                  </h1>
                  <p className="text-gray-400 text-sm mt-1">Informatics @ University of Washington</p>
                </div>
                
                {/* Interactive Toggle */}
                <div className="relative flex items-center gap-2 bg-slate-900/80 rounded-full p-1.5 border border-purple-500/30 shadow-lg">
                  <div 
                    className={`absolute top-1.5 h-[calc(100%-12px)] bg-gradient-to-r from-purple-600 to-pink-600 rounded-full transition-all duration-500 ease-out shadow-lg ${
                      isEngineering ? 'left-1.5 w-[140px]' : 'left-[152px] w-[130px]'
                    }`}
                  />
                  <button
                    onClick={() => setPerspective('engineering')}
                    className={`relative z-10 px-5 py-2.5 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 ${
                      isEngineering ? 'text-white' : 'text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    <Code size={18} />
                    Engineering
                  </button>
                  <button
                    onClick={() => setPerspective('product')}
                    className={`relative z-10 px-5 py-2.5 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 ${
                      !isEngineering ? 'text-white' : 'text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    <TrendingUp size={18} />
                    Product
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Card */}
        <section className="max-w-6xl mx-auto px-6 py-12">
          <div className="backdrop-blur-xl bg-gradient-to-br from-slate-950/80 via-purple-950/40 to-slate-950/80 border border-purple-500/30 rounded-3xl p-8 md:p-12 shadow-2xl shadow-purple-500/20 hover:shadow-purple-500/30 transition-all duration-500">
            <div className="max-w-3xl">
              <div className="inline-block mb-6">
                <span className="px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full text-sm text-purple-300 font-medium">
                  {isEngineering ? '🚀 Full-Stack Developer' : '📊 Technical Product Manager'}
                </span>
              </div>
              <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-white">
                {isEngineering ? (
                  <>Building Scalable AI Systems</>
                ) : (
                  <>Driving Impact Through Data & Strategy</>
                )}
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed">
                {isEngineering
                  ? 'Passionate about architecting intelligent systems that scale. From real-time voice assistants processing 100+ orders daily to RAG pipelines achieving 99% cost reduction, I build solutions that matter.'
                  : 'Transforming technical complexity into measurable business value. Proven track record of driving 70% increases in stakeholder visibility and delivering features that boost customer satisfaction by 20%.'}
              </p>
            </div>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="max-w-6xl mx-auto px-6 py-8">
          <h3 className="text-3xl font-bold mb-8 text-white flex items-center gap-3">
            <div className="h-1 w-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
            Featured Projects
          </h3>
          <div className="grid gap-6">
            {projects.map((project, idx) => (
              <ProjectCard
                key={project.id}
                project={project}
                isEngineering={isEngineering}
                isExpanded={expandedProject === project.id}
                onToggle={() => setExpandedProject(expandedProject === project.id ? null : project.id)}
                index={idx}
              />
            ))}
          </div>
        </section>

        {/* Interactive Skills Cloud */}
        <section className="max-w-6xl mx-auto px-6 py-12">
          <h3 className="text-3xl font-bold mb-8 text-white flex items-center gap-3">
            <div className="h-1 w-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
            Technical Arsenal
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <SkillCategory 
              title="Languages" 
              skills={skills.languages} 
              icon={<Code />} 
              isEngineering={isEngineering}
              hoveredSkill={hoveredSkill}
              setHoveredSkill={setHoveredSkill}
            />
            <SkillCategory 
              title="Backend & AI" 
              skills={skills.backend} 
              icon={<Database />} 
              isEngineering={isEngineering}
              hoveredSkill={hoveredSkill}
              setHoveredSkill={setHoveredSkill}
            />
            <SkillCategory 
              title="Product & Design" 
              skills={skills.product} 
              icon={<Layout />} 
              isEngineering={isEngineering}
              hoveredSkill={hoveredSkill}
              setHoveredSkill={setHoveredSkill}
            />
          </div>
        </section>

        {/* Experience Timeline */}
        <section className="max-w-6xl mx-auto px-6 py-12 mb-20">
          <h3 className="text-3xl font-bold mb-8 text-white flex items-center gap-3">
            <div className="h-1 w-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
            Professional Journey
          </h3>
          <div className="relative space-y-6">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-pink-500 to-purple-500 opacity-30" />
            
            {experience.map((exp, idx) => (
              <div
                key={idx}
                className="relative pl-20 group"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                {/* Timeline dot */}
                <div className="absolute left-6 top-6 w-5 h-5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full border-4 border-slate-950 group-hover:scale-125 transition-transform duration-300" />
                
                <div className="backdrop-blur-xl bg-slate-950/60 border border-purple-500/20 rounded-2xl p-6 hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300">
                  <div className="flex justify-between items-start mb-4 flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                        {exp.icon}
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-white">{exp.title}</h4>
                        <p className="text-purple-400">{exp.company}</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/30 rounded-full text-sm text-purple-300">
                      {exp.period}
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {exp.highlights.map((highlight, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-300 group/item hover:text-white transition-colors">
                        <span className="text-purple-400 mt-1 group-hover/item:scale-125 transition-transform">▹</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </WarpBackground>
  );
};

const ProjectCard = ({ project, isEngineering, isExpanded, onToggle, index }) => {
  const badges = {
    'Full-Stack': 'bg-blue-500/10 text-blue-300 border-blue-500/30',
    'AI/Backend': 'bg-purple-500/10 text-purple-300 border-purple-500/30',
    'Data/PM': 'bg-pink-500/10 text-pink-300 border-pink-500/30',
    'Research': 'bg-green-500/10 text-green-300 border-green-500/30'
  };

  return (
    <div 
      className={`backdrop-blur-xl bg-slate-950/60 border rounded-2xl transition-all duration-500 hover:scale-[1.01] ${
        isExpanded 
          ? 'border-purple-500/50 shadow-2xl shadow-purple-500/30' 
          : 'border-purple-500/20 hover:border-purple-500/40 hover:shadow-xl hover:shadow-purple-500/20'
      }`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <h4 className="text-2xl font-bold text-white">{project.title}</h4>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${badges[project.category]}`}>
                {project.category}
              </span>
            </div>
            <p className="text-gray-400 flex items-center gap-2">
              <span>{project.company}</span>
              <span className="text-purple-400">•</span>
              <span>{project.role}</span>
            </p>
          </div>
          <button
            onClick={onToggle}
            className="p-3 hover:bg-slate-800/50 rounded-xl transition-all duration-300 group border border-transparent hover:border-purple-500/30"
          >
            <ChevronDown 
              className={`transform transition-all duration-500 text-purple-400 group-hover:text-purple-300 ${
                isExpanded ? 'rotate-180' : ''
              }`} 
              size={24} 
            />
          </button>
        </div>

        {/* Animated Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {Object.entries(project.productMetrics).map(([key, value], idx) => (
            <div
              key={key}
              className={`relative p-4 rounded-xl border transition-all duration-500 hover:scale-105 cursor-pointer group overflow-hidden ${
                isEngineering
                  ? 'bg-slate-900/30 border-slate-700/50 hover:border-purple-500/30'
                  : 'bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-500/40 hover:border-purple-400/60 shadow-lg shadow-purple-500/10'
              }`}
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/10 group-hover:to-pink-500/10 transition-all duration-500`} />
              <div className="relative z-10">
                <div className={`text-2xl font-bold mb-1 ${!isEngineering ? 'text-purple-300' : 'text-gray-300'}`}>
                  {typeof value === 'string' && value.includes('%') ? value.split(' ')[0] : '✓'}
                </div>
                <div className="text-xs text-gray-400 uppercase tracking-wide font-semibold">{key}</div>
                <div className="text-sm text-gray-300 mt-1">{typeof value === 'string' ? value.split(' ').slice(1).join(' ') || value : value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tech Stack with Hover Effects */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.techStack.map((tech, idx) => (
            <span
              key={tech}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer hover:scale-110 ${
                isEngineering
                  ? 'bg-purple-500/20 text-purple-200 border border-purple-400/50 hover:bg-purple-500/30 hover:shadow-lg hover:shadow-purple-500/30'
                  : 'bg-slate-800/50 text-gray-400 border border-slate-700/50 hover:bg-slate-700/50'
              }`}
              style={{ animationDelay: `${idx * 30}ms` }}
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <a
            href={project.github}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl transition-all duration-300 group border ${
              isEngineering
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white border-transparent shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105'
                : 'bg-slate-800/80 hover:bg-slate-700/80 text-gray-300 border-slate-700/50 hover:border-slate-600/50'
            }`}
          >
            <Github size={18} className="group-hover:rotate-12 transition-transform duration-300" />
            <span className="font-semibold">View Code</span>
          </a>
          <button
            onClick={onToggle}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 text-gray-300 border border-slate-700/50 hover:border-purple-500/30 transition-all duration-300 font-semibold"
          >
            {isExpanded ? 'Show Less' : 'Learn More'}
          </button>
        </div>

        {/* Expanded Content with Smooth Animation */}
        {isExpanded && (
          <div className="mt-8 pt-8 border-t border-purple-500/20 space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
            {/* Problem Statement */}
            <div className="group">
              <h5 className="text-lg font-semibold mb-3 flex items-center gap-3 text-white">
                <div className="p-2 bg-yellow-500/10 rounded-lg">
                  <Zap className="text-yellow-400" size={20} />
                </div>
                Problem Statement
              </h5>
              <p className="text-gray-300 leading-relaxed pl-11">{project.problem}</p>
            </div>

            {/* Technical Deep-Dive */}
            {isEngineering && (
              <div className="group">
                <h5 className="text-lg font-semibold mb-3 flex items-center gap-3 text-white">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <Code className="text-purple-400" size={20} />
                  </div>
                  Technical Architecture
                </h5>
                <p className="text-gray-300 mb-4 pl-11">{project.architecture}</p>
                <ul className="space-y-3 pl-11">
                  {project.engineeringHighlights.map((highlight, idx) => (
                    <li 
                      key={idx} 
                      className="flex items-start gap-3 text-gray-300 hover:text-white transition-colors group/item"
                    >
                      <span className="text-purple-400 mt-1 group-hover/item:scale-125 transition-transform">▸</span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Trade-offs */}
            <div className="group">
              <h5 className="text-lg font-semibold mb-3 flex items-center gap-3 text-white">
                <div className="p-2 bg-pink-500/10 rounded-lg">
                  <TrendingUp className="text-pink-400" size={20} />
                </div>
                Technical Trade-offs & Decisions
              </h5>
              <div className="pl-11 bg-gradient-to-br from-slate-900/50 to-purple-900/20 p-5 rounded-xl border border-purple-500/20">
                <p className="text-gray-300 leading-relaxed">{project.tradeoffs}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const SkillCategory = ({ title, skills, icon, isEngineering, hoveredSkill, setHoveredSkill }) => {
  const isProductCategory = title === 'Product & Design';
  const shouldHighlight = isProductCategory ? !isEngineering : isEngineering;

  return (
    <div className={`backdrop-blur-xl p-6 rounded-2xl border transition-all duration-500 hover:scale-105 ${
      shouldHighlight
        ? 'bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-purple-500/40 shadow-xl shadow-purple-500/20'
        : 'bg-slate-950/60 border-purple-500/20 hover:border-purple-500/30'
    }`}>
      <div className="flex items-center gap-3 mb-5">
        <div className={`p-3 rounded-xl transition-all duration-300 ${
          shouldHighlight 
            ? 'bg-purple-500/20 text-purple-300 shadow-lg shadow-purple-500/20' 
            : 'bg-slate-800/50 text-gray-400'
        }`}>
          {icon}
        </div>
        <h4 className="font-bold text-lg text-white">{title}</h4>
      </div>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, idx) => (
          <button
            key={skill}
            onMouseEnter={() => setHoveredSkill(skill)}
            onMouseLeave={() => setHoveredSkill(null)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer border ${
              shouldHighlight
                ? 'bg-purple-500/20 text-purple-200 border-purple-400/50 hover:bg-purple-500/30 hover:scale-110 hover:shadow-lg hover:shadow-purple-500/30'
                : 'bg-slate-800/50 text-gray-400 border-slate-700/50 hover:bg-slate-700/50 hover:text-gray-200 hover:scale-105'
            } ${hoveredSkill === skill ? 'scale-110 shadow-lg' : ''}`}
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            {skill}
          </button>
        ))}
      </div>
    </div>
  );
};

export default App;