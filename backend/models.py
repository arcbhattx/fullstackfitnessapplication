from config import db
from sqlalchemy.dialects.postgresql import BYTEA
# User database Model
class User(db.Model):
    __tablename__ = 'Users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(150), nullable=False)
    user_age = db.Column(db.Integer, unique=False, nullable=False)
    user_body_weight = db.Column(db.Integer, unique=False, nullable=False)

    exercises = db.relationship('Exercise', back_populates='user', cascade="all, delete-orphan")
    nutritions = db.relationship('Nutrition', back_populates='user', cascade="all, delete-orphan")
    graphs = db.relationship('StatGraphs', back_populates='user', cascade="all, delete-orphan")

    def to_json(self):
        return {
            "id": self.id,
            "username": self.username,
            # Note: Do not include the password in the JSON representation for security reasons
            "user_age": self.user_age,
            "user_body_weight": self.user_body_weight,
            "exercises": [exercise.to_json() for exercise in self.exercises],
            "nutritions": [nutrition.to_json() for nutrition in self.nutritions],
            "graphs": [graph.to_json() for graph in self.graphs]
        }

# Exercise database Model
class Exercise(db.Model):
    __tablename__ = 'exerciseset'
    id = db.Column(db.Integer, primary_key=True)
    exercise_type = db.Column(db.String(50), nullable=False)  # 'bench', 'squat', or 'deadlift'
    user_id = db.Column(db.Integer, db.ForeignKey('Users.id'), nullable=False)

    user = db.relationship('User', back_populates='exercises')
    exercise_data = db.relationship('ExerciseData', back_populates='exercise', cascade="all, delete-orphan")

    def to_json(self):
        return {
            "id": self.id,
            "exercise_type": self.exercise_type,
            "user_id": self.user_id,
            "exercise_data": [data.to_json() for data in self.exercise_data]
        }

# Reps for Exercise database model
class ExerciseData(db.Model):
    __tablename__ = 'exercise_data'
    id = db.Column(db.Integer, primary_key=True)
    reps = db.Column(db.Integer, unique=False, nullable=False)
    date = db.Column(db.String(80), unique=False, nullable=False)
    exercise_weight = db.Column(db.Integer, unique=False, nullable=False)
    user_bodyweight = db.Column(db.Integer, unique=False, nullable=False)
    exercise_id = db.Column(db.Integer, db.ForeignKey('exerciseset.id'), nullable=False)
    one_rep_max = db.Column(db.Float, unique=False, nullable=True)
    exercise_strength = db.Column(db.Float,unique = False, nullable  = True)

    exercise = db.relationship('Exercise', back_populates='exercise_data')

    def to_json(self):
        return {
            "id": self.id,
            "reps": self.reps,
            "date": self.date,
            "exercise_weight": self.exercise_weight,
            "user_bodyweight": self.user_bodyweight,
            "exercise_id": self.exercise_id,
            "one_rep_max": self.one_rep_max,
            "exercise_strength": self.exercise_strength
        }

# Nutrition database Model
class Nutrition(db.Model):
    __tablename__ = 'nutrition'
    id = db.Column(db.Integer, primary_key=True)
    calorie_goal = db.Column(db.Integer, nullable=False)
    complete = db.Column(db.String, nullable=True)
    total = db.Column(db.Integer, nullable = True)
    date = db.Column(db.String(50), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('Users.id'), nullable=False)

    user = db.relationship('User', back_populates='nutritions')
    item_data = db.relationship('Item', back_populates='nutrition', cascade="all, delete-orphan")

    def to_json(self):
        return {
            'id': self.id,
            'calorie_goal': self.calorie_goal,
            'complete': self.complete,
            'total':self.total, 
            'date': self.date,
            'user_id': self.user_id,
            "item_data": [data.to_json() for data in self.item_data]
        }

class Item(db.Model):
    __tablename__ = 'item_data'
    id = db.Column(db.Integer, primary_key=True)
    food = db.Column(db.String(250), nullable=True)
    calories = db.Column(db.Integer, nullable=True)
    quantity = db.Column(db.Integer, nullable=True) 
    nutrition_id = db.Column(db.Integer, db.ForeignKey('nutrition.id'), nullable=False)
    nutrition = db.relationship('Nutrition', back_populates='item_data')

    def to_json(self):
        return {
            'id': self.id,
            'food': self.food,
            'calories': self.calories,
            'quantity': self.quantity,
        }
    

class StatGraphs(db.Model):
    __tablename__ = 'graphs'
    id = db.Column(db.Integer, primary_key=True)
    graph_exercise = db.Column(BYTEA, nullable=True)
    graph_exercise_strength = db.Column(BYTEA, nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('Users.id'), nullable=False)

    user = db.relationship('User', back_populates='graphs')

    def to_json(self):
        return {
            'id': self.id,
            'graph_exercise': self.graph_exercise,
            'graph_exercise_strength': self.graph_exercise_strength,
            'user_id': self.user_id
        }
