# 🧠 AI Knowledge Tutor

Une plateforme intelligente qui transforme vos documents de cours (PDF, DOCX, Markdown) en matériel d'apprentissage interactif en utilisant l'intelligence artificielle.

## 📋 Fonctionnalités

- **📄 Ingestion de documents** : Supporte PDF, DOCX, et Markdown
- **📝 Résumés automatiques** : Génère des résumés clairs et structurés
- **🎯 Quiz interactifs** : Crée des questions à choix multiples avec explications
- **🃏 Flashcards** : Système de cartes mémo avec répétition espacée (style Anki)
- **💬 Chatbot intelligent** : Répondez à vos questions sur le contenu

## 🏗️ Architecture

- **Backend** : Python avec FastAPI
- **Frontend** : React avec TypeScript
- **Base de données** : SQLite avec SQLAlchemy
- **IA** : Intégration OpenAI GPT ou Anthropic Claude
- **Traitement de documents** : PyPDF2, python-docx, markdown

## 🚀 Installation

### Prérequis

- Python 3.8+
- Node.js 16+
- npm ou yarn

### Backend

1. Installer les dépendances Python :
```bash
cd backend
pip install -r requirements.txt
```

2. Configurer les variables d'environnement :
   - Modifiez le fichier `.env` avec votre clé API OpenAI
   - Remplacez `your_openai_api_key_here` par votre vraie clé

3. Initialiser la base de données :
```bash
python init_database.py
```

4. Lancer le serveur :
   - **Méthode simple** : Double-cliquez sur `start_backend.bat`
   - **Méthode manuelle** :
   ```bash
   python app/main.py
   ```

Le backend sera accessible sur `http://localhost:8000`
Documentation API : `http://localhost:8000/docs`

### Frontend

1. Installer les dépendances :
```bash
cd frontend
npm install
```

2. Lancer l'application :
```bash
npm start
```

L'application sera accessible sur `http://localhost:3000`

## 📁 Structure du projet

```
ai-knowledge-tutor/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── api_v1/
│   │   │       ├── endpoints/
│   │   │       │   ├── documents.py
│   │   │       │   ├── learning_materials.py
│   │   │       │   └── chat.py
│   │   │       └── api.py
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   ├── database.py
│   │   │   └── init_db.py
│   │   ├── models/
│   │   │   ├── document.py
│   │   │   └── learning_material.py
│   │   ├── services/
│   │   │   ├── document_processor.py
│   │   │   └── llm_service.py
│   │   └── main.py
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── types/
│   └── package.json
├── uploads/
└── README.md
```

## ⚙️ Configuration

### Variables d'environnement (.env)

```bash
# Clés API pour les services IA
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Sécurité
SECRET_KEY=your-super-secret-key-change-in-production

# Upload de fichiers
MAX_FILE_SIZE=10485760  # 10MB

# Base de données
DATABASE_URL=sqlite:///./knowledge_tutor.db
```

## 📝 Utilisation

1. **Upload de documents** : Glissez-déposez vos fichiers PDF, DOCX ou Markdown
2. **Génération automatique** : L'IA traite vos documents et extrait le contenu
3. **Apprentissage interactif** :
   - Consultez les résumés générés
   - Testez vos connaissances avec les quiz
   - Utilisez les flashcards pour mémoriser
   - Posez des questions via le chatbot

## 🔧 API Endpoints

### Documents
- `POST /api/v1/documents/upload` - Upload d'un document
- `GET /api/v1/documents/` - Liste des documents
- `GET /api/v1/documents/{id}` - Détails d'un document
- `DELETE /api/v1/documents/{id}` - Suppression d'un document

### Matériel d'apprentissage
- `POST /api/v1/learning-materials/summaries/{document_id}` - Générer un résumé
- `POST /api/v1/learning-materials/quizzes/{document_id}` - Générer un quiz
- `POST /api/v1/learning-materials/flashcards/{document_id}` - Générer des flashcards

### Chat
- `POST /api/v1/chat/ask` - Poser une question sur un document

## 🧪 Tests

```bash
# Backend
cd backend
pytest

# Frontend
cd frontend
npm test
```

## 🚀 Déploiement

### Backend (Production)

```bash
# Installer gunicorn
pip install gunicorn

# Lancer avec gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker
```

### Frontend (Production)

```bash
# Build de production
npm run build

# Servir les fichiers statiques avec nginx ou autre serveur web
```

## 🤝 Contribution

1. Fork le projet
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commitez vos changements (`git commit -am 'Ajout d'une nouvelle fonctionnalité'`)
4. Poussez la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

Pour toute question ou problème :
- Ouvrez une issue sur GitHub
- Consultez la documentation de l'API sur `http://localhost:8000/docs`

## 🎯 Roadmap

- [ ] Authentification utilisateur
- [ ] Collaboration multi-utilisateurs
- [ ] Export des matériaux d'apprentissage
- [ ] Intégration avec d'autres services IA
- [ ] Application mobile
- [ ] Analyses et statistiques d'apprentissage