import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
import joblib
import json
import os

class CareerChatbotModel:
    def __init__(self):
        self.model = Pipeline([
            ('tfidf', TfidfVectorizer(ngram_range=(1, 2))),
            ('clf', MultinomialNB())
        ])
        
        # Career guidance dataset
        self.dataset = {
            'intents': [
                {
                    'tag': 'greeting',
                    'patterns': [
                        'hello', 'hi', 'hey', 'good morning', 'good evening',
                        'hi there', 'hello there', 'greetings'
                    ],
                    'responses': [
                        "Hello! I'm your AI Career Advisor. How can I help you today?",
                        "Hi there! Ready to explore career opportunities?",
                        "Welcome! Let's discuss your career goals."
                    ]
                },
                {
                    'tag': 'technical_careers',
                    'patterns': [
                        'tell me about tech jobs', 'technology careers', 'IT jobs',
                        'software development', 'programming careers', 'tech industry',
                        'computer science jobs', 'coding careers', 'developer roles'
                    ],
                    'responses': [
                        "Here are some popular technical careers:\n\n"
                        "1. Software Developer 💻\n"
                        "   - Salary: $70,000 - $150,000\n"
                        "   - Skills: Programming, Problem Solving\n\n"
                        "2. Data Scientist 📊\n"
                        "   - Salary: $80,000 - $160,000\n"
                        "   - Skills: Python, ML, Statistics\n\n"
                        "3. Cloud Architect ☁️\n"
                        "   - Salary: $100,000 - $180,000\n"
                        "   - Skills: AWS/Azure, Security\n\n"
                        "Which role interests you?"
                    ]
                },
                {
                    'tag': 'business_careers',
                    'patterns': [
                        'business jobs', 'management careers', 'business administration',
                        'consulting jobs', 'business analyst roles', 'project management',
                        'marketing careers', 'finance jobs'
                    ],
                    'responses': [
                        "Here are promising business careers:\n\n"
                        "1. Business Analyst 📈\n"
                        "   - Salary: $60,000 - $120,000\n"
                        "   - Skills: Analysis, SQL\n\n"
                        "2. Project Manager 📋\n"
                        "   - Salary: $70,000 - $140,000\n"
                        "   - Skills: Leadership, Agile\n\n"
                        "3. Marketing Manager 📱\n"
                        "   - Salary: $65,000 - $130,000\n"
                        "   - Skills: Digital Marketing, Analytics\n\n"
                        "Would you like more details about any of these roles?"
                    ]
                },
                {
                    'tag': 'skills_assessment',
                    'patterns': [
                        'assess my skills', 'skill evaluation', 'what skills do I need',
                        'skill requirements', 'technical skills', 'soft skills',
                        'required skills', 'skill assessment'
                    ],
                    'responses': [
                        "Let's assess your skills! Here are key areas:\n\n"
                        "💻 Technical Skills:\n"
                        "• Programming Languages\n"
                        "• Software Tools\n"
                        "• Technical Frameworks\n\n"
                        "🤝 Soft Skills:\n"
                        "• Communication\n"
                        "• Leadership\n"
                        "• Problem Solving\n\n"
                        "Which area would you like to evaluate?"
                    ]
                },
                {
                    'tag': 'education',
                    'patterns': [
                        'education requirements', 'what degree do I need', 'study path',
                        'learning requirements', 'education path', 'degree needed',
                        'certification requirements', 'qualifications needed'
                    ],
                    'responses': [
                        "Educational pathways vary by career:\n\n"
                        "🎓 Traditional Education:\n"
                        "• Bachelor's Degree\n"
                        "• Master's Degree\n"
                        "• PhD Programs\n\n"
                        "📚 Alternative Education:\n"
                        "• Bootcamps\n"
                        "• Online Courses\n"
                        "• Certifications\n\n"
                        "Which path interests you?"
                    ]
                },
                {
                    'tag': 'salary',
                    'patterns': [
                        'salary information', 'how much can I earn', 'pay range',
                        'salary range', 'compensation', 'expected salary',
                        'salary expectations', 'payment details'
                    ],
                    'responses': [
                        "Salary ranges depend on several factors:\n\n"
                        "📍 Location:\n"
                        "• Major cities typically offer higher salaries\n"
                        "• Remote work opportunities available\n\n"
                        "⭐ Experience Level:\n"
                        "• Entry Level: $50,000 - $80,000\n"
                        "• Mid Level: $80,000 - $120,000\n"
                        "• Senior Level: $120,000+\n\n"
                        "Which specific role interests you?"
                    ]
                }
            ]
        }
        
        self.train_model()
    
    def train_model(self):
        X = []  # patterns
        y = []  # tags
        
        for intent in self.dataset['intents']:
            for pattern in intent['patterns']:
                X.append(pattern)
                y.append(intent['tag'])
        
        self.model.fit(X, y)
        
        # Save the trained model
        model_path = os.path.join(os.path.dirname(__file__), 'chatbot_model.pkl')
        joblib.dump(self.model, model_path)
    
    def get_response(self, user_input):
        try:
            # Predict the intent
            predicted_tag = self.model.predict([user_input])[0]
            
            # Find the matching intent
            for intent in self.dataset['intents']:
                if intent['tag'] == predicted_tag:
                    # Return a random response from the matched intent
                    return {
                        'response': np.random.choice(intent['responses']),
                        'tag': predicted_tag,
                        'confidence': float(self.model.predict_proba([user_input]).max())
                    }
            
            return {
                'response': "I'm not sure about that. Could you please rephrase your question?",
                'tag': 'unknown',
                'confidence': 0.0
            }
            
        except Exception as e:
            return {
                'response': "I apologize, but I encountered an error. Could you try asking in a different way?",
                'tag': 'error',
                'confidence': 0.0
            }

# Initialize the model
chatbot_model = CareerChatbotModel() 