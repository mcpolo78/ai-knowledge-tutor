# 🚀 Instructions de démarrage - AI Knowledge Tutor

## ✅ État actuel

Votre plateforme AI Knowledge Tutor est **FONCTIONNELLE** !

### 🔄 Serveurs en cours d'exécution :
- **Backend** : http://localhost:8000 ✅
- **Frontend** : http://localhost:3001 ✅

## 📋 Instructions de démarrage

### 1. Démarrer le Backend (DÉJÀ EN COURS)
```bash
cd backend
python app/main.py
```
Ou double-cliquez sur `start_backend.bat`

### 2. Démarrer le Frontend (DÉJÀ EN COURS)
```bash
cd frontend
npm start
```
Ou double-cliquez sur `start_frontend.bat`

## ⚙️ Configuration OpenAI

1. Obtenez votre clé API OpenAI sur : https://platform.openai.com/api-keys
2. Modifiez le fichier `backend/.env`
3. Remplacez `your_openai_api_key_here` par votre vraie clé

## 🌐 Accès à l'application

- **Interface utilisateur** : http://localhost:3001
- **API Backend** : http://localhost:8000
- **Documentation API** : http://localhost:8000/docs

## 🎯 Fonctionnalités disponibles

1. **📄 Upload de documents** : PDF, DOCX, Markdown
2. **📝 Résumés automatiques** : Générés par IA
3. **🎯 Quiz interactifs** : Questions à choix multiples
4. **🃏 Flashcards** : Système de répétition espacée
5. **💬 Chatbot** : Questions-réponses sur vos documents

## 🔧 Dépannage

### Si le frontend ne démarre pas :
```bash
cd frontend
npm install
npm start
```

### Si le backend ne démarre pas :
```bash
cd backend
pip install -r requirements.txt
python init_database.py
python app/main.py
```

### Erreurs d'API :
- Vérifiez que votre clé OpenAI est configurée dans `backend/.env`
- Vérifiez que les deux serveurs sont en cours d'exécution

## 📁 Structure des fichiers

```
C:\AI Knowledge Tutor\
├── backend/
│   ├── app/           # Code de l'API
│   ├── .env           # Configuration (clé OpenAI)
│   └── knowledge_tutor.db  # Base de données SQLite
├── frontend/
│   ├── src/           # Code React
│   └── .env           # Configuration frontend
├── uploads/           # Documents uploadés
├── start_backend.bat  # Démarrage backend
└── start_frontend.bat # Démarrage frontend
```

## 🎓 Comment utiliser

1. **Accédez** à http://localhost:3001
2. **Uploadez** un document (PDF, DOCX, ou Markdown)
3. **Générez** automatiquement :
   - Un résumé
   - Un quiz
   - Des flashcards
4. **Chattez** avec votre document
5. **Étudiez** avec les outils créés

## 🎉 Votre plateforme est prête !

L'application fonctionne déjà et vous pouvez commencer à transformer vos documents en matériel d'apprentissage interactif !