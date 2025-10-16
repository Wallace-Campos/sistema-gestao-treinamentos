# 🎯 Sistema de Gestão de Treinamentos - Full-Stack

> Sistema profissional para gestão de treinamentos de clientes, desenvolvido para profissionais de **Customer Success (CS)** e **Customer Experience (CX)**.

![React](https://img.shields.io/badge/React-19-blue)
![Flask](https://img.shields.io/badge/Flask-3.x-green)
![Python](https://img.shields.io/badge/Python-3.11-yellow)
![License](https://img.shields.io/badge/License-MIT-red)

---

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Screenshots](#screenshots)
- [Instalação](#instalação)
- [Como Usar](#como-usar)
- [Deploy](#deploy)
- [Documentação](#documentação)
- [Roadmap](#roadmap)
- [Contribuindo](#contribuindo)
- [Licença](#licença)

---

## 🚀 Sobre o Projeto

O **Sistema de Gestão de Treinamentos** é uma aplicação Full-Stack completa que permite:

- ✅ **Cadastro de Clientes** com perfil detalhado, controle de licenças e status
- ✅ **Registro de Treinamentos** com data, duração, tipo e resumo
- ✅ **Visualização em Calendário** com FullCalendar integrado
- ✅ **Dashboard Profissional** com métricas e gráficos em tempo real
- ✅ **Lembretes Configuráveis** (mensal, semanal, personalizado)
- ✅ **Histórico Completo** por cliente
- ✅ **Acesso Individualizado** por usuário com autenticação JWT
- ✅ **Design Profissional** nível CustomerX.cx
- ✅ **Preparado para Integração** com Google Calendar e Calendly

---

## ⚡ Funcionalidades

### 🎨 Interface Profissional
- Design moderno e responsivo
- 6 cards de métricas coloridos
- Gráficos interativos (Recharts)
- Visualização de calendário (FullCalendar)
- Navegação por tabs intuitiva

### 👥 Gestão de Clientes
- Cadastro completo com perfil, empresa e licenças
- Edição e exclusão com confirmação
- Badges de status (Crédito, Showroom)
- Campo para dados de acesso (login, link)
- Materiais personalizados

### 📚 Gestão de Treinamentos
- Registro com data/hora e duração
- Tipos: Onboarding, Acompanhamento, Suporte
- Campo para sugestões do **tl;dv**
- Status: Agendado, Ongoing, Concluído
- Histórico completo por cliente

### 🔔 Lembretes
- Configuráveis (Mensal, Semanal, Personalizado)
- Associados a clientes
- Data do próximo lembrete

### 📊 Dashboard
- Total de treinamentos
- Treinamentos em andamento (Ongoing)
- Total de licenças
- Clientes ativos
- Clientes com crédito
- Clientes somente showroom
- Gráfico de treinamentos por tipo
- Taxa de conclusão
- Média de licenças por cliente

### 🔐 Autenticação
- Login simplificado (sem senha)
- JWT com expiração de 30 dias
- Isolamento de dados por usuário

---

## 🛠️ Tecnologias

### Backend
- **Python 3.11**
- **Flask 3.x** - Framework web
- **SQLAlchemy** - ORM
- **Flask-JWT-Extended** - Autenticação JWT
- **Flask-CORS** - CORS
- **SQLite** (dev) / **PostgreSQL** (prod)

### Frontend
- **React 19** - Framework UI
- **Vite** - Build tool
- **Tailwind CSS** - Estilização
- **shadcn/ui** - Componentes
- **FullCalendar** - Visualização de calendário
- **Recharts** - Gráficos
- **Axios** - HTTP client
- **Lucide Icons** - Ícones

---

## 📸 Screenshots

### Tela de Login
![Login](screenshots/login.png)

### Dashboard
![Dashboard](screenshots/dashboard.png)

### Calendário
![Calendário](screenshots/calendario.png)

### Gestão de Clientes
![Clientes](screenshots/clientes.png)

---

## 📦 Instalação

### Pré-requisitos
- Python 3.11+
- Node.js 22+
- pnpm

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/sistema-treinamentos.git
cd sistema-treinamentos
```

### 2. Configure o Backend

```bash
cd sistema_treinamentos_backend
python3 -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate  # Windows

pip install -r requirements.txt
```

### 3. Configure o Frontend

```bash
cd ../sistema-treinamentos-pro
pnpm install
```

### 4. Build e Integração

```bash
# Build do frontend
pnpm run build

# Copiar para backend
cp -r dist/* ../sistema_treinamentos_backend/src/static/
```

### 5. Rodar o Sistema

```bash
cd ../sistema_treinamentos_backend
source venv/bin/activate
python src/main.py
```

Acesse: **http://localhost:5000**

---

## 📖 Como Usar

### 1. **Login**
- Digite seu nome de usuário
- Clique em "Entrar"
- Usuário é criado automaticamente

### 2. **Cadastrar Cliente**
- Vá na aba "Clientes"
- Preencha os dados
- Configure licenças e status
- Marque "Possui Crédito" ou "Somente Showroom" se necessário

### 3. **Registrar Treinamento**
- Vá na aba "Treinamentos"
- Selecione o cliente
- Defina data/hora, tipo e duração
- Adicione resumo e conteúdo do próximo (sugestões do tl;dv)

### 4. **Visualizar no Calendário**
- Vá na aba "Calendário"
- Alterne entre visões: Mês, Semana, Dia
- Clique em eventos para detalhes

### 5. **Criar Lembretes**
- Vá na aba "Lembretes"
- Selecione cliente e tipo
- Escreva a mensagem
- Defina a data do próximo lembrete

---

## 🚀 Deploy

### Opções Recomendadas

#### 1. **Railway.app** (Mais Fácil)
- $5 de crédito gratuito/mês
- Deploy automático via GitHub
- [Ver guia completo](guia_deploy_hospedagem.md)

#### 2. **Render.com** (Melhor Custo-Benefício)
- Plano gratuito disponível
- SSL automático
- [Ver guia completo](guia_deploy_hospedagem.md)

#### 3. **DigitalOcean** (Mais Controle)
- $200 de crédito gratuito (60 dias)
- Infraestrutura robusta
- [Ver guia completo](guia_deploy_hospedagem.md)

### Deploy Rápido (Railway)

```bash
# 1. Criar conta em railway.app
# 2. Conectar repositório GitHub
# 3. Adicionar variáveis de ambiente:
SECRET_KEY=asdf#FGSgvasgf$5$WGT-sistema-treinamentos-2025
JWT_SECRET_KEY=jwt-secret-key-sistema-treinamentos-2025

# 4. Deploy automático!
```

---

## 📚 Documentação

- [Documentação Técnica Completa](documentacao_tecnica_fullstack.md)
- [Guia de Deploy e Hospedagem](guia_deploy_hospedagem.md)
- [Resumo de APIs de Integração](resumo_api_integracao.md)

---

## 🗺️ Roadmap

### Versão 1.0 (Atual) ✅
- [x] Sistema Full-Stack funcional
- [x] Autenticação JWT
- [x] CRUD de Clientes, Treinamentos e Lembretes
- [x] Dashboard com métricas
- [x] Visualização de calendário
- [x] Design profissional

### Versão 1.1 (Próxima) 🚧
- [ ] Integração completa com Google Calendar (OAuth)
- [ ] Integração com Calendly
- [ ] Notificações por email
- [ ] Exportação de relatórios (PDF, Excel)

### Versão 2.0 (Futuro) 🔮
- [ ] Dashboard com IA (análise de NPS, insights)
- [ ] Aplicativo mobile (React Native)
- [ ] Webhook para automações
- [ ] API pública para integrações

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 Autor

Desenvolvido com ❤️ para profissionais de **Customer Success** e **Customer Experience**.

---

## 📞 Suporte

- 📧 Email: suporte@sistema-treinamentos.com
- 📖 Documentação: [Ver docs](documentacao_tecnica_fullstack.md)
- 🐛 Issues: [GitHub Issues](https://github.com/seu-usuario/sistema-treinamentos/issues)

---

## ⭐ Mostre seu apoio

Se este projeto foi útil para você, considere dar uma ⭐ no repositório!

---

**Sistema de Gestão de Treinamentos** - Transformando a gestão de CS/CX

