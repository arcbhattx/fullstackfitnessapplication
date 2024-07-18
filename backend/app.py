
#--------------Imports----------------

from flask import request, jsonify,send_from_directory
from config import app, db, bcrypt
from models import Exercise, User, Nutrition, ExerciseData, Item, StatGraphs
import datetime

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import io
import base64

from flask_jwt_extended import create_access_token,get_jwt,get_jwt_identity,unset_jwt_cookies, jwt_required, JWTManager
import os



frontend_folder = os.path.join(os.getcwd(), "..", "frontend")
dist_folder = os.path.join(frontend_folder, "dist")

@app.route("/", defaults={"filename": ""})
@app.route("/<path:filename>")
def index(filename):
    if not filename:
        filename = "index.html"
    return send_from_directory(dist_folder, filename)


@app.route("/favicon.ico")
def favicon():
    return "", 200
#-----------------User specific database requests---------------------


@app.route("/exercises", methods=["GET"])
@jwt_required()  # Ensure the user is authenticated
def get_exercises():
    user_id = get_jwt_identity()  # Get the user ID from the token
    user = User.query.get(user_id)
    exercises = Exercise.query.filter_by(user_id=user_id).all()  # Query exercises for the user
    json_exercises = [exercise.to_json() for exercise in exercises]  # Convert exercises to JSON

    response = {
        "username": user.username,
        "exercises": json_exercises
    }

    return jsonify(response), 200  # Return the exercises in JSON format


@app.route("/nutrition", methods=["GET"])
@jwt_required()  # Ensure the user is authenticated
def get_nutrition_data():
    user_id = get_jwt_identity()  # Get the user ID from the token
    user = User.query.get(user_id)
    nutrition_data = Nutrition.query.filter_by(user_id=user_id).all()  # Query exercises for the user
    json_nutrition_data = [nutrition.to_json() for nutrition in nutrition_data]  # Convert exercises to JSON

    response = {
        "username": user.username,
        "nutritions": json_nutrition_data
    }

    return jsonify(response), 200  # Return the exercises in JSON format



@app.route("/create_exercise", methods=["POST"])
@jwt_required()
def create_exercise():
    user_id = get_jwt_identity()  # Get the user ID from the token
    exercise_type = request.json.get("exercise_type")
    exercise_weight = request.json.get("exercise_weight")
    reps = request.json.get("reps")
    date = request.json.get("date")  # Fetch date as string
    user_bodyweight = request.json.get("user_bodyweight")  # Assuming user_bodyweight is sent in the request

    # Ensure all required fields are present
    if not user_id or not exercise_type or not exercise_weight or not reps or not date or not user_bodyweight:
        missing_fields = [field for field in ["user_id", "exercise_type", "exercise_weight", "reps", "date", "user_bodyweight"] if not locals()[field]]
        print(f"Missing fields: {missing_fields}")
        return jsonify({"message": "You must include all required fields", "missing_fields": missing_fields}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    # Check if the exercise type is valid for the user
    valid_exercise_types = ['bench', 'squat', 'deadlift']  # Example valid exercise types
    if exercise_type not in valid_exercise_types:
        return jsonify({"message": "Invalid exercise type. Must be one of: 'bench', 'squat', 'deadlift'"}), 400

    try:
        # Convert exercise_weight and reps to float (or int if appropriate)
        exercise_weight = float(exercise_weight)
        reps = int(reps)  # Assuming reps should be an integer

        # Calculate the One Rep Max (1RM)
        one_rep_max = round(exercise_weight * (1 + reps / 30.0),2)

        #Calculate Relative Strength.
        exercise_strength = round(one_rep_max/float(user_bodyweight),2)

        # Create Exercise
        new_exercise = Exercise(
            exercise_type=exercise_type,
            user_id=user.id
        )
        db.session.add(new_exercise)
        db.session.flush()  # Flush to get the exercise id

        # Create ExerciseData
        new_exercise_data = ExerciseData(
            reps=reps,
            date=date,  # Assign date string directly
            exercise_weight=exercise_weight,
            user_bodyweight=user_bodyweight,
            exercise_id=new_exercise.id,
            one_rep_max=one_rep_max,
            exercise_strength=exercise_strength
        )
        db.session.add(new_exercise_data)

        db.session.commit()
    except ValueError as ve:
        return jsonify({"message": f"Invalid input: {ve}"}), 400
    except Exception as e:
        db.session.rollback()
        print(f"Error occurred: {str(e)}")  # Log the error
        return jsonify({"message": str(e)}), 400

    return jsonify({
        "message": "Exercise and ExerciseData created successfully!",
        "one_rep_max": one_rep_max,
        "exercise_strength": exercise_strength
    }), 201




# Will create a nutrition set for the user

@app.route("/create_nutrition", methods=["POST"])
@jwt_required()
def create_nutrition():
    user_id = get_jwt_identity()  # Get the user ID from the token
    calorie_goal = request.json.get("calorie_goal")
    date = request.json.get("date")

    if not user_id or calorie_goal is None or date is None:
        return jsonify({"message": "You must include all fields: calorie_goal, complete"}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    try:
        new_nutrition = Nutrition(
            calorie_goal=calorie_goal,
            date=date,
            user_id=user_id
        )

        db.session.add(new_nutrition)
        db.session.commit()

        return jsonify({"message": "Nutrition created!"}), 201
    except Exception as e:
        db.session.rollback()  # Rollback in case of an exception to avoid inconsistent state
        return jsonify({"message": str(e)}), 400
    
@app.route("/create_item", methods=["POST"])
@jwt_required()
def create_item():
    user_id = get_jwt_identity()  # Get the user ID from the token
    nutrition_id = request.json.get("nutrition_id")
    food = request.json.get("food")
    calories = request.json.get("calories")
    quantity = request.json.get("quantity")

    if not user_id or not nutrition_id or not food or calories is None or quantity is None:
        return jsonify({"message": "You must include all fields: nutrition_id, food, calories, date, quantity"}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    nutrition = Nutrition.query.get(nutrition_id)
    if not nutrition or nutrition.user_id != user_id:
        return jsonify({"message": "Nutrition not found or not authorized"}), 404

    try:
        new_item = Item(
            food=food,
            calories=calories,
            quantity=quantity,
            nutrition_id=nutrition_id
        )

        db.session.add(new_item)
        db.session.commit()

        # Update the total calories for the nutrition entry
        total_calories = sum(item.calories * item.quantity for item in nutrition.item_data)
        nutrition.total = total_calories

        db.session.commit()

        return jsonify({"message": "Item created!", "item": new_item.to_json()}), 201
    except Exception as e:
        db.session.rollback()  # Rollback in case of an exception to avoid inconsistent state
        return jsonify({"message": str(e)}), 400




#-------------------------------------Authentication-------------------------------------------------#


@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    user_age = data.get('user_age')
    user_body_weight = data.get('user_body_weight')
    
    if not username or not password or user_age is None or user_body_weight is None:
        return jsonify(message="Missing required fields"), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(
        username=username, 
        password=hashed_password, 
        user_age=user_age, 
        user_body_weight=user_body_weight
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify(message="User registered successfully!"), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()

    if user and bcrypt.check_password_hash(user.password, password):
        access_token = create_access_token(identity=user.id)
        
        # Convert each exercise to JSON
        exercise_data = [exercise.to_json() for exercise in user.exercises]

        #Convert each nutrition to JSON
        nutrition_data = [nutrition.to_json() for nutrition in user.nutritions]

        return jsonify({
            'token': access_token,
            'exercise_data': exercise_data,
            'nutrition_data':nutrition_data
        }), 200
    else:
        return jsonify({'message': 'Invalid username or password'}), 401

@app.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    # JWTs are stateless; to "logout", client should simply delete the token on the frontend
    return jsonify(message="Logout successful"), 200

@app.route('/profile', methods = ['GET'])
@jwt_required()
def profile():
    user_id = get_jwt_identity()  # Get the user ID from the token
    user = User.query.get(user_id)
    
    if user:
        response = {
            "user_id": user_id,
            "username": user.username,
            "user_age": user.user_age,
            "user_body_weight": user.user_body_weight
        }
        return jsonify(response), 200  # Return the user details in JSON format
    else:
        return jsonify(message="User not found"), 404


#-------------------------------------------Updates and Deletes------------------------------------

@app.route("/update_complete/<int:nutrition_id>", methods=["PATCH"])
@jwt_required()
def update_complete(nutrition_id):
    # Get the user_id from the JWT token
    user_id = get_jwt_identity()

    # Fetch the nutrition record by its ID
    nutrition = Nutrition.query.filter_by(id=nutrition_id, user_id=user_id).first()

    if not nutrition:
        return jsonify({"message": "Nutrition not found"}), 404

    data = request.json
    nutrition.complete = data.get("complete", nutrition.complete)

    db.session.commit()

    return jsonify({"message": "Nutrition updated."}), 200


@app.route("/update_profile/<int:user_id>", methods=["PATCH"])
@jwt_required()
def update_profile(user_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"message": "User not found"}), 404

    data = request.json
    user.username = data.get("username", user.username)
    user.user_age = data.get("user_age", user.user_age)
    user.user_body_weight = data.get("user_body_weight", user.user_body_weight)

    db.session.commit()

    return jsonify({"message": "User updated."}), 200


@app.route("/delete_exercise/<int:user_id>", methods=["DELETE"])
@jwt_required()
def delete_exercise(user_id):
    exercise = Exercise.query.get(user_id)

    if not exercise:
        return jsonify({"message": "User not found"}), 404

    db.session.delete(exercise)
    db.session.commit()

    return jsonify({"message": "User deleted!"}), 200

@app.route("/delete_item/<int:item_id>", methods=["DELETE"])
@jwt_required()
def delete_item(item_id):
    user_id = get_jwt_identity()  # Get the user ID from the token
    item = Item.query.get(item_id)  # Find the item by its ID

    if not item:
        return jsonify({"message": "Item not found"}), 404

    nutrition = Nutrition.query.get(item.nutrition_id)

    if not nutrition or nutrition.user_id != user_id:
        return jsonify({"message": "Nutrition not found or you do not have permission to delete this item"}), 404

    db.session.delete(item)  # Delete the item from the database
    db.session.commit()

    return jsonify({"message": "Item deleted successfully."}), 200

#----------------------------------------------Graph Endpoint---------------------------------------

@app.route('/generate_update_exercise_graphs', methods=['POST'])
@jwt_required()
def generate_update_exercise_graphs():
    try:
        current_user_id = get_jwt_identity()

        # Define exercise types and their respective colors
        exercise_colors = {'bench': 'blue', 'squat': 'orange', 'deadlift': 'green'}

        # Create a dictionary to store one-rep maxes and dates for each exercise
        exercise_data = {exercise: {'dates': [], 'one_rep_maxes': [], 'relative_strengths': []} for exercise in exercise_colors.keys()}

        # Query exercises and their one-rep maxes for the current user
        for exercise_type in exercise_colors.keys():
            exercises = Exercise.query.filter_by(user_id=current_user_id, exercise_type=exercise_type).all()
            for exercise in exercises:
                for data in exercise.exercise_data:
                    exercise_data[exercise_type]['one_rep_maxes'].append(data.one_rep_max)
                    exercise_data[exercise_type]['dates'].append(data.date)
                    exercise_data[exercise_type]['relative_strengths'].append(data.exercise_strength)

        def create_plot(title, ylabel, ydata_key):
            fig, ax = plt.subplots(figsize=(10, 6))
            fig.patch.set_facecolor('black')  # Set background color of the figure
            ax.set_facecolor('black')  # Set background color of the axes

            data_exists = False

            for exercise_type, color in exercise_colors.items():
                if exercise_data[exercise_type]['dates']:  # Ensure there's data to plot
                    data_exists = True
                    ax.plot(exercise_data[exercise_type]['dates'], exercise_data[exercise_type][ydata_key],
                            label=f'{exercise_type.capitalize()} {ylabel}', color=color)

            if not data_exists:
                ax.text(0.5, 0.5, 'No Data Yet', horizontalalignment='center', verticalalignment='center', 
                        transform=ax.transAxes, color='white', fontsize=20)
                ax.set_xticks([])
                ax.set_yticks([])

            ax.set_title(title, color='white')  # Set title color
            ax.set_xlabel('Date', color='white')  # Set x-axis label color
            ax.set_ylabel(ylabel, color='white')  # Set y-axis label color

            if data_exists:
                ax.legend(facecolor='black', edgecolor='white')  # Set legend properties
                ax.legend(facecolor='black', edgecolor='white', labelcolor='white')

            # Set color of ticks and tick labels to white
            ax.tick_params(axis='x', colors='white')
            ax.tick_params(axis='y', colors='white')

            # Convert plot to PNG image
            img = io.BytesIO()
            plt.savefig(img, format='png', facecolor='black')  # Set facecolor for saving
            img.seek(0)
            plot_url = base64.b64encode(img.getvalue()).decode()
            plt.close()

            return plot_url, img.getvalue()

        plot_url_one_rep_max, img_one_rep_max = create_plot(
            'One Rep Maxes for Bench, Squat, and Deadlift',
            '1RM',
            'one_rep_maxes'
        )

        plot_url_relative_strength, img_relative_strength = create_plot(
            'Relative Strengths for Bench, Squat, and Deadlift',
            'Relative Strength',
            'relative_strengths'
        )

        # Decode base64 images to bytes
        img_one_rep_max = base64.b64decode(img_one_rep_max)
        img_relative_strength = base64.b64decode(img_relative_strength)

        # Save or update graphs in the database
        existing_graph = StatGraphs.query.filter_by(user_id=current_user_id).first()
        if existing_graph:
            existing_graph.graph_exercise = img_one_rep_max
            existing_graph.graph_exercise_strength = img_relative_strength
        else:
            new_graph = StatGraphs(
                user_id=current_user_id,
                graph_exercise=img_one_rep_max,
                graph_exercise_strength=img_relative_strength
            )
            db.session.add(new_graph)
        db.session.commit()

        # Return the images as JSON response
        return jsonify({
            'plot_one_rep_max': plot_url_one_rep_max,
            'plot_relative_strength': plot_url_relative_strength
        })
    except Exception as e:
        # Log the error for debugging
        app.logger.error(f"Error generating exercise graphs: {e}")
        return jsonify({'error': 'Failed to generate graphs'}), 500




with app.app_context():
        db.create_all()

if __name__ == "__main__":
    

    app.run(debug=True)

