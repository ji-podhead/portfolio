export interface PortfolioItem {
  name: string;
  codeScore?: string;
  docsScore?: string;
  volume?: string;
  tech: string;
  highlight: string;
  url?: string;
  tier?: number;
  category?: string;
}

export interface ArticleItem {
  title: string;
  docsScore?: string;
  volume?: string;
  tech: string;
  description: string;
  url: string;
}

export interface CVProfile {
  name: string;
  role: string;
  location: string;
  education: {
    institution: string;
    degree: string;
  };
  currentCompany: string;
  summary: string;
  highlights: string[];
}

export const cvData: CVProfile = {
  name: "ji-podhead",
  role: "Head of MLOps / Lead AI & Security Architect",
  location: "Berlin, Germany",
  education: {
    institution: "TU Berlin",
    degree: "Computer Science & Engineering Studies"
  },
  currentCompany: "DeepSafety GmbH",
  summary: "Specialized in AI Engineering, SecOps, Network Automation, Infrastructure-as-Code, and High-Performance Web Architecture. Creator of neurosymbolic reasoning frameworks, model guardrails, and custom WebGL particle engines.",
  highlights: [
    "NeurIPS 2024 Paper Code author for neurosymbolic reasoning with Z3 SMT Solver & OpenAI API.",
    "Head of MLOps leading AI safety, model moderation, and enterprise SecOps automation.",
    "Creator of kooljs, ji-GPU-Particles (150k+ GPU particles at 60 FPS), and clean-agent-harness.",
    "Author of enterprise guides for DNS, Kea DHCP, DRBD HA, RHEL 9 Foreman, and Agentic Protocols."
  ]
};

export const projectsData: PortfolioItem[] = [
  // Tier 1: Flagship Core Projects
  {
    name: "proofofthought",
    tier: 1,
    codeScore: "10/10",
    docsScore: "9.5/10",
    volume: "High (NeurIPS)",
    tech: "Python, Z3 SMT Solver, OpenAI API",
    highlight: "NeurIPS 2024 Paper Code: Neurosymbolisches Reasoning mit Z3 Formal Logik zur Vermeidung von LLM Halluzinationen.",
    url: "https://github.com/ji-podhead/proofofthought"
  },
  {
    name: "clean-agent-harness",
    tier: 1,
    codeScore: "9.5/10",
    docsScore: "9.5/10",
    volume: "High",
    tech: "Python, DAP Protocol, Claude Code Arch",
    highlight: "Modell-agnostisches Agent Harness ohne Sabotage-Features mit dynamischer DAP Tool Discovery.",
    url: "https://github.com/ji-podhead/clean-agent-harness"
  },
  {
    name: "SharkGuard",
    tier: 1,
    codeScore: "9.5/10",
    docsScore: "9.0/10",
    volume: "High",
    tech: "Python, ONNX, DistilBERT, FastAPI",
    highlight: "Lokale LLM Guardrail & Moderation Sandbox (<1ms Regex Sanitizer + CPU DistilBERT ONNX).",
    url: "https://github.com/ji-podhead/SharkGuard"
  },
  {
    name: "S-ANFIS-PyTorch",
    tier: 1,
    codeScore: "9.5/10",
    docsScore: "9.0/10",
    volume: "Core Package",
    tech: "PyTorch, Python, Neuro-Fuzzy",
    highlight: "PyTorch-Package Implementierung von State-Adaptive Neuro-Fuzzy Inference Systems (IEEE Paper).",
    url: "https://github.com/ji-podhead/S-ANFIS-PyTorch"
  },
  {
    name: "opnsense-helper",
    tier: 1,
    codeScore: "9.0/10",
    docsScore: "9.5/10",
    volume: "High (114+ Py)",
    tech: "Python, OPNsense REST, Kea DHCP",
    highlight: "Production Backend API & Automation Engine für OPNsense Firewalling & Networking.",
    url: "https://github.com/ji-podhead/opnsense-helper"
  },
  {
    name: "opnsense-scripts-autodocs",
    tier: 1,
    codeScore: "9.0/10",
    docsScore: "9.0/10",
    volume: "High (158+ Py)",
    tech: "Python, AST Parser, Sphinx",
    highlight: "Automatisches Docstring & Dokugenerierungs-System via Abstract Syntax Trees (AST).",
    url: "https://github.com/ji-podhead/opnsense-scripts-autodocs"
  },
  {
    name: "dap-docs",
    tier: 1,
    codeScore: "8.5/10",
    docsScore: "10/10",
    volume: "Spec Specification",
    tech: "Markdown, PRD, Protocol Architecture",
    highlight: "Referenz-Spezifikation des Dynamic Agent Protocol (DAP v1.0) zur Prompt-Entkopplung.",
    url: "https://github.com/ji-podhead/dap-docs"
  },

  // Tier 2: Production Tools & Core Utilities
  {
    name: "ovs-bridge-collection",
    tier: 2,
    codeScore: "8.5/10",
    docsScore: "9.0/10",
    volume: "Ansible Collection",
    tech: "Open vSwitch, Ansible, Libvirt",
    highlight: "Ansible Collection für OVS Bridges, Tagged VLANs, Libvirt Virtual Networks & Docker.",
    url: "https://github.com/ji-podhead/ovs-bridge-collection"
  },
  {
    name: "DevOps",
    tier: 2,
    codeScore: "8.0/10",
    docsScore: "9.0/10",
    volume: "Multiple Playbooks",
    tech: "Terraform, Vault, Proxmox, CI/CD",
    highlight: "DevOps Playground & Research Notebook mit Vault AppRole IaC & Static Scanners.",
    url: "https://github.com/ji-podhead/DevOps"
  },
  {
    name: "ji_ui & ji_ui_react_example",
    tier: 2,
    codeScore: "8.5/10",
    docsScore: "8.0/10",
    volume: "Core Framework",
    tech: "gRPC-Web, Protobuf, React, Go",
    highlight: "Cross-Platform UI-Framework mit gRPC Binary Streams statt JSON Overhead.",
    url: "https://github.com/ji-podhead/ji_ui"
  },
  {
    name: "kooljs & kooljs-website",
    tier: 2,
    codeScore: "8.5/10",
    docsScore: "8.5/10",
    volume: "Core NPM Package",
    tech: "Web Workers, SharedArrayBuffer, JS",
    highlight: "Multithreaded Off-Main-Thread Animations-Engine für React & HTML.",
    url: "https://github.com/ji-podhead/kooljs"
  },
  {
    name: "ji-GPU-Particles",
    tier: 2,
    codeScore: "8.5/10",
    docsScore: "8.0/10",
    volume: "High Graphics Code",
    tech: "WebGL, Three.js, GLSL Vertex Shader",
    highlight: "Instanced GPU Particle System (150k+ Partikel bei 60 FPS) inspiriert von Unity Shuriken.",
    url: "https://github.com/ji-podhead/ji-GPU-Particles"
  },
  {
    name: "protobuffctl",
    tier: 2,
    codeScore: "8.5/10",
    docsScore: "8.5/10",
    volume: "CLI / Dashboard Engine",
    tech: "Node.js, Protobuf.js, gRPC",
    highlight: "CLI, API Server & Dashboard zum dynamischen Testen und Versionieren von Protobuf-Contracts.",
    url: "https://github.com/ji-podhead/protobuffctl"
  },
  {
    name: "onpremctl",
    tier: 2,
    codeScore: "8.0/10",
    docsScore: "8.5/10",
    volume: "Edge Controller",
    tech: "Docker Compose, Tailscale, Vault",
    highlight: "Remote Edge Controller für Tailscale Mesh VPN, Vault Secrets & OpenWrt Router.",
    url: "https://github.com/ji-podhead/onpremctl"
  },
  {
    name: "ilohelper-collection",
    tier: 2,
    codeScore: "8.0/10",
    docsScore: "8.5/10",
    volume: "Ansible / Python API",
    tech: "Python, Redfish API, Ansible",
    highlight: "Out-of-band HPE iLO Hardware-Steuerung & Server Status Automation via Redfish.",
    url: "https://github.com/ji-podhead/ilohelper-collection"
  },
  {
    name: "Grafana-11.5-with-Prometheus",
    tier: 2,
    codeScore: "7.5/10",
    docsScore: "9.0/10",
    volume: "Docker Stack",
    tech: "Grafana 11.5, Prometheus, Compose",
    highlight: "Single-Command Zero-Touch Provisioning Stack für Grafana, Prometheus & Exporters.",
    url: "https://github.com/ji-podhead/Grafana-11.5-with-Prometheus"
  },
  {
    name: "CropPulse-Hackathon1",
    tier: 2,
    codeScore: "8.0/10",
    docsScore: "8.0/10",
    volume: "Hackathon Engine",
    tech: "Sentinel-2, LightGBM, Earth Engine",
    highlight: "Precision Agriculture Satelliten-Remote-Sensing & LightGBM Ernteausfall-Prognose.",
    url: "https://github.com/ji-podhead/CropPulse-Hackathon1"
  },
  {
    name: "ad1",
    tier: 2,
    codeScore: "8.0/10",
    docsScore: "7.5/10",
    volume: "Production System",
    tech: "Python, EU Compliance, Email Parsing",
    highlight: "Sicheres, modulares System für automatisierte E-Mail- und Dokumentenverarbeitung.",
    url: "https://github.com/ji-podhead/ad1"
  },

  // Tier 3: Integrations & Ecosystem Servers
  {
    name: "Gmail-MCP-Server",
    tier: 3,
    codeScore: "7.5/10",
    docsScore: "8.0/10",
    tech: "MCP Standard, OAuth2, Gmail API",
    highlight: "Model Context Protocol Server mit automatischer OAuth2 Refresh Auth für KI-Agenten.",
    url: "https://github.com/ji-podhead/Gmail-MCP-Server"
  },
  {
    name: "pinecone-bridged-mcp",
    tier: 3,
    codeScore: "7.5/10",
    docsScore: "8.0/10",
    tech: "MCP, SSE, Docker, Pinecone",
    highlight: "Dockerisierter MCP Server mit SSE Transport-Bridge für Pinecone Vector Search.",
    url: "https://github.com/ji-podhead/pinecone-bridged-mcp"
  },
  {
    name: "ollama-mcp-client",
    tier: 3,
    codeScore: "7.0/10",
    docsScore: "8.0/10",
    tech: "Python, Ollama, MCP Standard",
    highlight: "Async MCP Client zur Anbindung lokaler Ollama-Modelle an MCP Tooling.",
    url: "https://github.com/ji-podhead/ollama-mcp-client"
  },
  {
    name: "netbox_docker_podman_collection",
    tier: 3,
    codeScore: "7.5/10",
    docsScore: "8.0/10",
    tech: "Podman Quadlet, NetBox, Ansible",
    highlight: "Automatisierte NetBox IPAM Deployment Collection via Podman Quadlets & Ansible.",
    url: "https://github.com/ji-podhead/netbox_docker_podman_collection"
  },
  {
    name: "lil_bind",
    tier: 3,
    codeScore: "7.5/10",
    docsScore: "8.0/10",
    tech: "Podman, Quadlet, Bind9",
    highlight: "Containerisiertes Rootless Bind9 DNS Deployment über Podman Quadlets.",
    url: "https://github.com/ji-podhead/lil_bind"
  },
  {
    name: "kubyplexer",
    tier: 3,
    codeScore: "7.5/10",
    docsScore: "7.5/10",
    tech: "Rust, VS Code Extension API",
    highlight: "In-IDE VS Code Extension für mausgesteuertes Kubernetes-Cluster-Management.",
    url: "https://github.com/ji-podhead/kubyplexer"
  },
  {
    name: "openai-cti-summarizer",
    tier: 3,
    codeScore: "7.0/10",
    docsScore: "7.5/10",
    tech: "FastAPI, OpenAI GPT-4",
    highlight: "CTI Report Analysis Engine mit strukturierter IoC-Extraktion (IPs, Domains, MD5).",
    url: "https://github.com/ji-podhead/openai-cti-summarizer"
  },

  // Tier 4: Supporting Utilities & Experiments
  {
    name: "claude-code / claude-code-1",
    tier: 4,
    tech: "TypeScript, Shell, Reverse Engineering",
    highlight: "Dekompiliertes Claude Code CLI TS/Shell Repository zur Quellcode-Exploration.",
    url: "https://github.com/ji-podhead/claude-code"
  },
  {
    name: "fire-terminal",
    tier: 4,
    tech: "X11, C/C++, Linux Graphics",
    highlight: "Render-Overlay von Firefox im Linux-Terminal via Xlib.",
    url: "https://github.com/ji-podhead/fire-terminal"
  },
  {
    name: "tracedig",
    tier: 4,
    tech: "Bash, PostgreSQL, Network Routing",
    highlight: "Bash-Skript zur Diagnose von Node-Hops bei DB Failovers.",
    url: "https://github.com/ji-podhead/tracedig"
  }
];

export const openSourceData: PortfolioItem[] = projectsData.filter(
  p => p.tier === 1 || p.tier === 2 || p.tier === 3
);

export const articlesData: ArticleItem[] = [
  {
    title: "Network-Guides",
    docsScore: "10/10",
    volume: "19 Markdown Guides",
    tech: "BIND9, Kea, DRBD, TSIG, DNSSEC",
    description: "Umfassendes Handbuch für Enterprise DNS, Dynamic Updates, Kea DHCP & DRBD High-Availability Clusters.",
    url: "https://github.com/ji-podhead/articles/tree/main"
  },
  {
    title: "RHEL_9_Foreman_Guide",
    docsScore: "10/10",
    volume: "10 Detailed Guides",
    tech: "RHEL 9, Puppet, Katello, PXE",
    description: "Production Guide für Bare-Metal-Discovery, PXE-Boot, TFTP/DHCP & Katello Lifecycle Management.",
    url: "https://github.com/ji-podhead/articles/tree/main"
  },
  {
    title: "dap-docs",
    docsScore: "10/10",
    volume: "Spec Specification",
    tech: "Markdown, PRD, Protocol Architecture",
    description: "Referenz-Spezifikation des Dynamic Agent Protocol (DAP v1.0) zur Prompt-Entkopplung.",
    url: "https://github.com/ji-podhead/dap-docs"
  },
  {
    title: "Web-And-CloudSecurity",
    docsScore: "9.0/10",
    volume: "Research Guides",
    tech: "Suricata IDS, OpenSearch, SIEM",
    description: "Enterprise Security Research zu Web Attack Vectors, Suricata IDS & SIEM Monitoring.",
    url: "https://github.com/ji-podhead/articles/tree/main"
  },
  {
    title: "agentic-knowledge",
    docsScore: "9.0/10",
    volume: "Research Notes",
    tech: "Agent Protocols, A2A Architecture, LLM Tooling",
    description: "Forschungsnotizen und Wissensbasis zu Agent-to-Agent Protokollen, Multi-Agent Coordination & Safety.",
    url: "https://github.com/ji-podhead/agentic-knowledge"
  },
  {
    title: "ml-knowledge-base",
    docsScore: "8.5/10",
    volume: "Educational Tutorials",
    tech: "Linear Algebra, Vector Calculus, PyTorch",
    description: "Grundlagen-Tutorials zu Vektoralgebra (Cross-Product, Dot-Product) und Mathematical ML Foundations.",
    url: "https://github.com/ji-podhead/articles/tree/main"
  }
];
