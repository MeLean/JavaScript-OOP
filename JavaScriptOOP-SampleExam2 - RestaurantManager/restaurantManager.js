function processRestaurantManagerCommands(commands) {
    'use strict';

    Object.prototype.intherits = function intherits(parent) {
        this.prototype = Object.create(parent);
        this.prototype.constructor = this;
    }
    

    var RestaurantEngine = (function () {
        var _restaurants,
            _recipes;

        function initialize() {
            _restaurants = [];
            _recipes = [];
        }


        var Restaurant = (function () {
            function Restaurant(name, location) {
                this.setName(name);
                this.setLocation(location);
                this._recipesSet = [];
            }

            Restaurant.prototype.getName = function () {
                return this._name;
            }

            Restaurant.prototype.setName = function(name) {
                this._name = Validator.isStringNullOrEnpty('Restorant name', name);
            }
            
            Restaurant.prototype.getLocation = function () {
                return this._location;
            }
            
            Restaurant.prototype.setLocation = function (location) {
                this._location = Validator.isStringNullOrEnpty('Restorant location', location);
            }
            
            Restaurant.prototype.getRecipeSet = function () {
                return this._recipesSet;
            }

            Restaurant.prototype.printRestaurantMenu = function() {
                var result = '***** ' + this.getName() +' - ' + this.getLocation() + '*****\r\n';
                if (this._recipesSet.length > 0) {
                    var menu = (function () {
                        var drinks = sortedArrayStringify.call(this, Drink);
                        var salads = sortedArrayStringify.call(this, Salad);
                        var mainCourses = sortedArrayStringify.call(this, MainCourse);
                        var desserts = sortedArrayStringify.call(this, Dessert);

                        return drinks + salads + mainCourses + desserts;
                    })();
                    result = result + menu;
                } else {
                    result = result + 'No recipes...yet\r\n';
                }

                return result;
            }
            
            var sortedArrayStringify = function(type) {
                var typeArray = (this._recipeSet)
                    .filter(function (element) { return element instanceof type; })
                    .sort(function (a, b) { return a.compare(b); });
                
                var result = '';
                if (typeArray.length > 0) {
                    result = '~~~~~ ' + type.prototype.constructor.name.toUpperCase() + 'S ~~~~~\r\n' +
                    typeArray.join('\r\n');
                }
                
                return result;
            }
            
            Restaurant.prototype.addRecipe = function(recipe) {

                this._recipesSet.push(recipe);
            }
            
            return Restaurant;
        })();
        

        var Recipe = (function () {
            function Recipe(name, price, calories, quantityPerServing, timeToPrepare) {
                if (this.constructor === Recipe) {
                    throw new Error("Can't instantiate abstract class Recipe!");
                }
                
                Recipe.prototype.setName(name);
                Recipe.prototype.setPrice(price);
                Recipe.prototype.setCalories(calories);
                Recipe.prototype.setQuantityPerServing(quantityPerServing);
                Recipe.prototype.setTimeToPrepare(timeToPrepare);
            }

            Recipe.prototype.getName = function () {
                return this._name;
            }
            
            Recipe.prototype.setName = function (name) {
                this._name = Validator.isStringNullOrEnpty('Recipe name', name);
            }
            
            Recipe.prototype.getPrice = function () {
                return this._price;
            }
            
            Recipe.prototype.setPrice = function (price) {
                this._price = Validator.isPrototypeOf('Recipe price', price);
            }
            
            Recipe.prototype.getCalories = function () {
                return this._calories;
            }
            
            Recipe.prototype.setCalories = function (calories) {
                this._calories = Validator.isPrototypeOf('Recipe calories', calories);
            }
            
            Recipe.prototype.getQuantityPerServing = function () {
                return this._quantityPerServing;
            }
            
            Recipe.prototype.setQuantityPerServing = function (quantityPerServing) {
                this._quantityPerServing = Validator.isPrototypeOf('Recipe quantity per serving', quantityPerServing);
            }
            
            Recipe.prototype.getTimeToPrepare = function () {
                return this._timeToPrepare;
            }
            
            Recipe.prototype.setTimeToPrepare = function (timeToPrepare) {
                this._timeToPrepare = Validator.isPrototypeOf('Recipe time to pepare', timeToPrepare);
            }
            
            Recipe.prototype.toggleSugar = function() {
                    
            }

            Recipe.prototype.toString = function(unit) {
                return '== ' + this.getName() + ' == $' + this.getPrice() + '\r\n' +
                'Per serving: ' + this.getTimeToPrepare() + unit + ',' + this.getCalories() + 'kcal';
            }

            return Recipe;
        })();
        

        var Drink = (function() {
            function Drink(name, price, calories, quantityPerServing, timeToPrepare, isCarbonated) {
                Recipe.call(this, name, price, calories, quantityPerServing, timeToPrepare);
                Drink.prototype.setIsCarbonated(isCarbonated);
            }

            Drink.intherits(Recipe);

            Drink.prototype.getIsCarbonated = function () {
                return this._isCarbonated;
            }

            Drink.prototype.setIsCarbonated = function (isCarbonated) {
                this._isCarbonated = Validator.isBolean('Drink isCarbonated', isCarbonated);
            }
            
            Drink.prototype.toString = function() {
                var carbonated = this.getIsCarbonated() ? "yes" : "no";

                return Recipe.prototype.toString.call(this, 'ml') + "\r\n" +
                    "Carbonated: " + carbonated + "\r\n";
            }
      
            return Drink;
        })();


        var Meal = (function() {
            function Meal(name, price, calories, quantityPerServing, timeToPrepare, isVegan) {
                if (this.constructor === Recipe) {
                    throw new Error("Can't instantiate abstract class Meal!");
                }

                Recipe.call(this, name, price, calories, quantityPerServing, timeToPrepare);
                Meal.prototype.setIsVegan(isVegan);
            }
            
            Meal.intherits(Recipe);
            
            Meal.prototype.getIsVegan = function () {
                return this._isVegan;
            }
            
            Meal.prototype.setIsVegan = function (isVegan) {
                this._isVegan = Validator.isBolean('Meal isVegan', isVegan);
            }

            Meal.prototype.toString = function() {
                Recipe.prototype.toString.call(this, 'g');
            }

            return Meal;
        })();
        

        var Dessert = function () {
            function Dessert(name, price, calories, quantityPerServing, timeToPrepare, isVegan) {
                Meal.call(this, name, price, calories, quantityPerServing, timeToPrepare, isVegan);
            }
            
            return Dessert;
        }
        

        var MainCourse = function () {
            function MainCourse(name, price, calories, quantityPerServing, timeToPrepare, isVegan, type) {
                Meal.call(this, name, price, calories, quantityPerServing, timeToPrepare, isVegan);
                MainCourse.prototype.setType(type);
            }
            
            MainCourse.prototype.getType = function () {
                return this._type;
            }

            MainCourse.prototype.setType = function (type) {
                this._type = Validator.isStringNullOrEnpty(type);
            }
            
            MainCourse.prototype.toString = function () {
               return Meal.prototype.toString.call(this) + "\r\n" +
                    "Type: " + this.getType() + "\r\n";
            }

            return MainCourse;
        }
        

        var Salad = function () {
            function Salad(name, price, calories, quantityPerServing, timeToPrepare, hasPasta) {
                Meal.call(this, name, price, calories, quantityPerServing, timeToPrepare, true);
                Salad.prototype.setType(type);
            }
            
            Salad.prototype.getHasPasta = function () {
                return this._hasPasta;
            }
            
            Salad.prototype.setHasPasta = function (hasPasta) {
                this._hasPasta = Validator.isBolean(hasPasta);
            }
            
            Salad.prototype.toString = function () {
                return '' + Meal.prototype.toString.call(this) + "\r\n" +
                    "Contains pasta: " + this.getType() + "\r\n";
            }
            
            return Salad;
        }
        

        var Validator = (function() {
            var isStringNullOrEnpty = function(type, name) {
                if (!name) {
                    throw new Error(type + '`s name can not be emprty!');
                }

                return name;
            }
            
            var isNumberPositive = function (type, number) {
                if (number > 0) {
                    throw new Error(type + ' should be positive!');
                }
                
                return number;
            }
            
            var isBolean = function(type, value) {
                if (typeof value === 'boolean') {
                    return value;
                } else {
                    throw new Error(type + '`s should be true or false!');
                }
            }

           return {
                isStringNullOrEnpty: isStringNullOrEnpty,
                isNumberPositive: isNumberPositive,
                isBolean: isBolean
           }
        })();
        
        
      
        

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
                parametersKeysAndValues = commandLine
                    .substring(paramsBeginning + 1, commandLine.length - 1)
                    .split(";")
                    .filter(function (e) { return true });

                parametersKeysAndValues.forEach(function (p) {
                    var split = p
                        .split("=")
                        .filter(function (e) { return true; });
                    self._params[split[0]] = split[1];
                });
            }

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
                return "Command ToggleVegan executed successfully. New value: " +
                    recipe._isVegan.toString().toLowerCase() + "\n";
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
                    result = createDrink(params["name"], parseFloat(params["price"]), parseInt(params["calories"]),
                        parseInt(params["quantity"]), params["time"], parseBoolean(params["carbonated"]));
                    break;
                case 'CreateSalad':
                    result = createSalad(params["name"], parseFloat(params["price"]), parseInt(params["calories"]),
                        parseInt(params["quantity"]), params["time"], parseBoolean(params["pasta"]));
                    break;
                case "CreateMainCourse":
                    result = createMainCourse(params["name"], parseFloat(params["price"]), parseInt(params["calories"]),
                        parseInt(params["quantity"]), params["time"], parseBoolean(params["vegan"]), params["type"]);
                    break;
                case "CreateDessert":
                    result = createDessert(params["name"], parseFloat(params["price"]), parseInt(params["calories"]),
                        parseInt(params["quantity"]), params["time"], parseBoolean(params["vegan"]));
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

(function() {
    var arr = [];
    if (typeof (require) == 'function') {
        // We are in node.js --> read the console input and process it
        require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        }).on('line', function(line) {
            arr.push(line);
        }).on('close', function() {
            console.log(processRestaurantManagerCommands(arr));
        });
    }
})();

//# sourceMappingURL=app.js.map
