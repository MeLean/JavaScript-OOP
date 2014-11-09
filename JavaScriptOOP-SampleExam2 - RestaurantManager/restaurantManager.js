function processRestaurantManagerCommands(commands) {
    'use strict';
    
    Object.prototype.extends = function (parent) {
        this.prototype = Object.create(parent.prototype);
        this.prototype.constructor = this;
    }
    
    var RestaurantEngine = (function () {
        var _restaurants, _recipes;
        
        function initialize() {
            _restaurants = [];
            _recipes = [];
        }
        
        var Restaurant = (function () {
            
            function Restaurant(name, location) {
                this.setName(name);
                this.setLocation(location);
                this._recipes = [];
            }
            
            Restaurant.prototype.setName = function (name) {
                // TODO : Validation
                this._name = name;
            }
            
            Restaurant.prototype.setLocation = function (location) {
                // TODO : Validation
                this._location = location;
            }
            
            Restaurant.prototype.addRecipe = function (recipe) {
                this._recipes.push(recipe);
            }
            
            Restaurant.prototype.removeRecipe = function (recipe) {
                var index = this._recipes.indexOf(recipe);
                this._recipes.splice(index, 1);
            }
            
            Restaurant.prototype.getName = function () {
                return this._name;
            }
            
            Restaurant.prototype.getLocation = function () {
                return this._location;
            }
            
            Restaurant.prototype.printRestaurantMenu = function () {
                var nameStr = "***** " + this.getName() + " - " + this.getLocation() + " *****\n";
                var result = nameStr;
                
                if (this._recipes.length == 0) {
                    var noRecipesStr = "No recipes... yet\n";
                    return nameStr + noRecipesStr;
                }
                
                var drinks = this._recipes.filter(function (recipe) {
                    return recipe instanceof Drink;
                }).sort(function (a, b) {
                    return a.getName().localeCompare(b.getName());
                });
                
                var salads = this._recipes.filter(function (recipe) {
                    return recipe instanceof Salad;
                }).sort(function (a, b) {
                    return a.getName().localeCompare(b.getName());
                });
                
                var mainCourses = this._recipes.filter(function (recipe) {
                    return recipe instanceof MainCourse;
                }).sort(function (a, b) {
                    return a.getName().localeCompare(b.getName());
                });
                
                var desserts = this._recipes.filter(function (recipe) {
                    return recipe instanceof Dessert;
                }).sort(function (a, b) {
                    return a.getName().localeCompare(b.getName());
                });
                
                if (drinks.length > 0) {
                    var drinksStr = "~~~~~ " + "DRINKS" + " ~~~~~\n";
                    result += drinksStr;
                    
                    drinks.forEach(function (drink) {
                        result += drink.toString();
                    });
                }
                
                if (salads.length > 0) {
                    var saladsStr = "~~~~~ " + "SALADS" + " ~~~~~\n";
                    result += saladsStr;
                    
                    salads.forEach(function (salad) {
                        result += salad.toString();
                    });
                }
                
                if (mainCourses.length > 0) {
                    var mainCoursesStr = "~~~~~ " + "MAIN COURSES" + " ~~~~~\n";
                    result += mainCoursesStr;
                    
                    mainCourses.forEach(function (mainCourse) {
                        result += mainCourse.toString();
                    });
                }
                
                if (desserts.length > 0) {
                    var dessertsStr = "~~~~~ " + "DESSERTS" + " ~~~~~\n";
                    result += dessertsStr;
                    
                    desserts.forEach(function (dessert) {
                        result += dessert.toString();
                    });
                }
                return result;
            }
            
            return Restaurant;
        }());
        
        
        var Recipe = (function () {
            function Recipe(name, price, calories, quantity, timeToPrepare) {
                if (this.constructor === Recipe) {
                    throw new Error("Can't instantiate abstract class Recipe.");
                }
                this.setName(name);
                this.setPrice(price);
                this.setCalories(calories);
                this.setQuantity(quantity);
                this.setTimeToPrepare(timeToPrepare);
            }
            
            Recipe.prototype.setName = function (name) {
                // TODO : Validation
                this._name = name;
            }
            
            Recipe.prototype.setPrice = function (price) {
                // TODO : Validation
                this._price = price;
            }
            
            Recipe.prototype.setCalories = function (calories) {
                // TODO : Validation
                this._calories = calories;
            }
            
            Recipe.prototype.setQuantity = function (quantity) {
                // TODO : Validation
                this._quantity = quantity;
            }
            
            Recipe.prototype.setTimeToPrepare = function (timeToPrepare) {
                // TODO : Validation
                this._timeToPrepare = timeToPrepare;
            }
            
            Recipe.prototype.getName = function () {
                return this._name;
            }
            
            Recipe.prototype.getPrice = function () {
                return this._price;
            }
            
            Recipe.prototype.getCalories = function () {
                return this._calories;
            }
            
            Recipe.prototype.getQuantity = function () {
                return this._quantity;
            }
            
            Recipe.prototype.getTimeToPrepare = function () {
                return this._timeToPrepare;
            }
            
            Recipe.prototype.toString = function () {
                var unit;
                if (this instanceof Drink) {
                    unit = "ml";
                }else if (this instanceof Meal) {
                    unit = "g";
                }
                
                return "==  " + this.getName() + " == $" + this.getPrice().toFixed(2) + "\n" +
                       "Per serving: " + this.getQuantity() + " " + unit + ", " + this.getCalories() + " kcal" + "\n" +
                       "Ready in " + this.getTimeToPrepare() + " minutes";
            }

            return Recipe;
        }());
        
        var Drink = (function () {
            function Drink(name, price, calories, quantity, timeToPrepare, isCarbonated) {
                Recipe.call(this, name, price, calories, quantity, timeToPrepare);
                this.setIsCarbonated(isCarbonated);
            }
            
            Drink.extends(Recipe);
            
            Drink.prototype.setIsCarbonated = function (isCarbonated) {
                // TODO : Validation
                this._isCarbonated = isCarbonated;
            }
            
            Drink.prototype.getIsCarbonated = function () {
                return this._isCarbonated;
            }
            
            Drink.prototype.toString = function () {
                var carbonated = this.getIsCarbonated() ? "yes" : "no";
                
                return Recipe.prototype.toString.call(this) + "\n" +
                    "Carbonated: " + carbonated + "\n";
            }
            
            return Drink;
        }());
        
        var Meal = (function () {
            function Meal(name, price, calories, quantity, timeToPrepare, isVegan) {
                if (this.constructor === Meal) {
                    throw new Error("Can't instantiate abstract class Meal.");
                }
                Recipe.call(this, name, price, calories, quantity, timeToPrepare);
                this.setIsVegan(isVegan);
            }
            
            Meal.extends(Recipe);
            
            Meal.prototype.setIsVegan = function (isVegan) {
                // TODO : Validation
                this._isVegan = isVegan;
            }
            
            Meal.prototype.getIsVegan = function () {
                return this._isVegan;
            }
            
            Meal.prototype.toggleVegan = function () {
                this._isVegan = !this._isVegan;
            }
          
            Meal.prototype.toString = function () {
                var vegan = this.getIsVegan() ? "[VEGAN] " : "";
                
                return vegan + Recipe.prototype.toString.call(this);
            }
            
            return Meal;
        }());
        
        
        var Dessert = (function () {
            function Dessert(name, price, calories, quantity, timeToPrepare, isVegan) {
                Meal.call(this, name, price, calories, quantity, timeToPrepare, isVegan);
                this._withSugar = true;
            }
            
            Dessert.extends(Meal);
            
            Dessert.prototype.toggleSugar = function () {
                this._withSugar = !this._withSugar;
            }
           
            Dessert.prototype.toString = function () {
                var sugar = this._withSugar ? "" : "[NO SUGAR] ";
                
                return sugar + Meal.prototype.toString.call(this) + "\n";
            }
            
            return Dessert;
        }());
        
        var MainCourse = (function () {
            function MainCourse(name, price, calories, quantity, timeToPrepare, isVegan, type) {
                Meal.call(this, name, price, calories, quantity, timeToPrepare, isVegan);
                this.setType(type);
            }
            
            MainCourse.extends(Meal);
            
            MainCourse.prototype.setType = function (type) {
                // TODO : Validation
                this._type = type;
            }
            
            MainCourse.prototype.getType = function () {
                return this._type;
            }
            
            MainCourse.prototype.toString = function () {
                return Meal.prototype.toString.call(this) + "\n" +
                    "Type: " + this.getType() + "\n";
            }
            
            return MainCourse;
        }());
        
        var Salad = (function () {
            function Salad(name, price, calories, quantity, timeToPrepare, containsPasta) {
                Meal.call(this, name, price, calories, quantity, timeToPrepare, true);
                this.setContainsPasta(containsPasta);
            }
            
            Salad.extends(Meal);
            
            Salad.prototype.setContainsPasta = function (containsPasta) {
                this._containsPasta = containsPasta;
            }
            
            Salad.prototype.getContainsPasta = function () {
                return this._containsPasta;
            }
            
            Salad.prototype.toString = function () {
                var pasta = this.getContainsPasta() ? "yes" : "no";
                
                return Meal.prototype.toString.call(this) + "\n" +
                    "Contains pasta: " + pasta + "\n";
            }
            
            return Salad;
        }());
        
        
        var Command = (function () {
            function Command(commandLine) {
                this._params = new Array();
                this.translateCommand(commandLine);
            }
            
            Command.prototype.translateCommand = function (commandLine) {
                var self, paramsBeginning, name, parametersKeysAndValues;
                self = this;
                paramsBeginning = commandLine.indexOf("(");
                
                this._name = commandLine.substring(0, paramsBeginning);
                name = commandLine.substring(0, paramsBeginning);
                parametersKeysAndValues = commandLine.substring(paramsBeginning + 1, commandLine.length - 1).split(";").filter(function (e) {
                    return true;
                });
                
                parametersKeysAndValues.forEach(function (p) {
                    var split = p.split("=").filter(function (e) {
                        return true;
                    });
                    self._params[split[0]] = split[1];
                });
            };
            
            return Command;
        }());
        
        function createRestaurant(name, location) {
            _restaurants[name] = new Restaurant(name, location);
            return "Restaurant " + name + " created\n";
        }
        
        function createDrink(name, price, calories, quantity, timeToPrepare, isCarbonated) {
            _recipes[name] = new Drink(name, price, calories, quantity, timeToPrepare, isCarbonated);
            return "Recipe " + name + " created\n";
        }
        
        function createSalad(name, price, calories, quantity, timeToPrepare, containsPasta) {
            _recipes[name] = new Salad(name, price, calories, quantity, timeToPrepare, containsPasta);
            return "Recipe " + name + " created\n";
        }
        
        function createMainCourse(name, price, calories, quantity, timeToPrepare, isVegan, type) {
            _recipes[name] = new MainCourse(name, price, calories, quantity, timeToPrepare, isVegan, type);
            return "Recipe " + name + " created\n";
        }
        
        function createDessert(name, price, calories, quantity, timeToPrepare, isVegan) {
            _recipes[name] = new Dessert(name, price, calories, quantity, timeToPrepare, isVegan);
            return "Recipe " + name + " created\n";
        }
        
        function toggleSugar(name) {
            var recipe;
            
            if (!_recipes.hasOwnProperty(name)) {
                throw new Error("The recipe " + name + " does not exist");
            }
            recipe = _recipes[name];
            
            if (recipe instanceof Dessert) {
                recipe.toggleSugar();
                return "Command ToggleSugar executed successfully. New value: " + recipe._withSugar.toString().toLowerCase() + "\n";
            } else {
                return "The command ToggleSugar is not applicable to recipe " + name + "\n";
            }
        }
        
        function toggleVegan(name) {
            var recipe;
            
            if (!_recipes.hasOwnProperty(name)) {
                throw new Error("The recipe " + name + " does not exist");
            }
            
            recipe = _recipes[name];
            if (recipe instanceof Meal) {
                recipe.toggleVegan();
                return "Command ToggleVegan executed successfully. New value: " + recipe._isVegan.toString().toLowerCase() + "\n";
            } else {
                return "The command ToggleVegan is not applicable to recipe " + name + "\n";
            }
        }
        
        function printRestaurantMenu(name) {
            var restaurant;
            
            if (!_restaurants.hasOwnProperty(name)) {
                throw new Error("The restaurant " + name + " does not exist");
            }
            
            restaurant = _restaurants[name];
            return restaurant.printRestaurantMenu();
        }
        
        function addRecipeToRestaurant(restaurantName, recipeName) {
            var restaurant, recipe;
            
            if (!_restaurants.hasOwnProperty(restaurantName)) {
                throw new Error("The restaurant " + restaurantName + " does not exist");
            }
            if (!_recipes.hasOwnProperty(recipeName)) {
                throw new Error("The recipe " + recipeName + " does not exist");
            }
            
            restaurant = _restaurants[restaurantName];
            recipe = _recipes[recipeName];
            restaurant.addRecipe(recipe);
            return "Recipe " + recipeName + " successfully added to restaurant " + restaurantName + "\n";
        }
        
        function removeRecipeFromRestaurant(restaurantName, recipeName) {
            var restaurant, recipe;
            
            if (!_recipes.hasOwnProperty(recipeName)) {
                throw new Error("The recipe " + recipeName + " does not exist");
            }
            if (!_restaurants.hasOwnProperty(restaurantName)) {
                throw new Error("The restaurant " + restaurantName + " does not exist");
            }
            
            restaurant = _restaurants[restaurantName];
            recipe = _recipes[recipeName];
            restaurant.removeRecipe(recipe);
            return "Recipe " + recipeName + " successfully removed from restaurant " + restaurantName + "\n";
        }
        
        function executeCommand(commandLine) {
            var cmd, params, result;
            cmd = new Command(commandLine);
            params = cmd._params;
            
            switch (cmd._name) {
                case 'CreateRestaurant':
                    result = createRestaurant(params["name"], params["location"]);
                    break;
                case 'CreateDrink':
                    result = createDrink(params["name"], parseFloat(params["price"]), parseInt(params["calories"]), parseInt(params["quantity"]), params["time"], parseBoolean(params["carbonated"]));
                    break;
                case 'CreateSalad':
                    result = createSalad(params["name"], parseFloat(params["price"]), parseInt(params["calories"]), parseInt(params["quantity"]), params["time"], parseBoolean(params["pasta"]));
                    break;
                case "CreateMainCourse":
                    result = createMainCourse(params["name"], parseFloat(params["price"]), parseInt(params["calories"]), parseInt(params["quantity"]), params["time"], parseBoolean(params["vegan"]), params["type"]);
                    break;
                case "CreateDessert":
                    result = createDessert(params["name"], parseFloat(params["price"]), parseInt(params["calories"]), parseInt(params["quantity"]), params["time"], parseBoolean(params["vegan"]));
                    break;
                case "ToggleSugar":
                    result = toggleSugar(params["name"]);
                    break;
                case "ToggleVegan":
                    result = toggleVegan(params["name"]);
                    break;
                case "AddRecipeToRestaurant":
                    result = addRecipeToRestaurant(params["restaurant"], params["recipe"]);
                    break;
                case "RemoveRecipeFromRestaurant":
                    result = removeRecipeFromRestaurant(params["restaurant"], params["recipe"]);
                    break;
                case "PrintRestaurantMenu":
                    result = printRestaurantMenu(params["name"]);
                    break;
                default:
                    throw new Error('Invalid command name: ' + cmdName);
            }
            
            return result;
        }
        
        function parseBoolean(value) {
            switch (value) {
                case "yes":
                    return true;
                case "no":
                    return false;
                default:
                    throw new Error("Invalid boolean value: " + value);
            }
        }
        
        return {
            initialize: initialize,
            executeCommand: executeCommand
        };
    }());
    
    // Process the input commands and return the results
    var results = '';
    RestaurantEngine.initialize();
    commands.forEach(function (cmd) {
        if (cmd != "") {
            try {
                var cmdResult = RestaurantEngine.executeCommand(cmd);
                results += cmdResult;
            } catch (err) {
                results += err.message + "\n";
            }
        }
    });
    
    return results.trim();
}

// ------------------------------------------------------------
// Read the input from the console as array and process it
// Remove all below code before submitting to the judge system!
// ------------------------------------------------------------
(function () {
    var arr = [];
    if (typeof (require) == 'function') {
        // We are in node.js --> read the console input and process it
        require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        }).on('line', function (line) {
            arr.push(line);
        }).on('close', function () {
            console.log(processRestaurantManagerCommands(arr));
        });
    }
})();
//# sourceMappingURL=app.js.map
