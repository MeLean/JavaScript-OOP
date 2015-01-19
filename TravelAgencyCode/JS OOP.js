function processTravelAgencyCommands(commands) {
   'use strict';

    var Models = (function() {          
		// extends function
        Object.prototype.extends = function (parent) {
            if (!Object.create) {
                Object.prototype.create = function(proto) {
                    function Func() { }

                    Func.prototype = new proto;
                    return new Func;
                }
            }

            this.prototype = Object.create(parent.prototype);
            this.prototype.constructor = this;
        }   

        var Destination = (function() {
            function Destination(location, landmark) {
                this.setLocation(location);
                this.setLandmark(landmark);
            }

            Destination.prototype.getLocation = function() {
                return this._location;
            }

            Destination.prototype.setLocation = function(location) {
                  this._location = Validator.isStringNullOrEnpty(location);
            }

            Destination.prototype.getLandmark = function() {
                return this._landmark;
            }

            Destination.prototype.setLandmark = function(landmark) {
               this._landmark = Validator.isStringNullOrEnpty(landmark);
            }

            Destination.prototype.toString = function() {
                return this.constructor.name + ": " +
                    "location=" + this.getLocation() +
                    ",landmark=" + this.getLandmark();
            }

            return Destination;
        }());


        var Travel = (function() {
            function Travel(name, startDate, endDate, price) {
				// abstract class declaration	
			   if (this.constructor === Travel) {
                    throw new Error("Can not instantiate abstract class" + this.constructor.name + "!");
                }

                this.setName(name);                
                this.setStartDate(startDate);
                this.setEndDate(endDate);
                this.setPrice(price);

            } 

            Travel.prototype.getName = function() {
                return this._name;
            }

            Travel.prototype.setName = function(name) {
                this._name = Validator.isStringNullOrEnpty(name);
            }

            Travel.prototype.getStartDate = function() {
                return this._startDate; 
            }

            Travel.prototype.setStartDate = function(startDate) {
                this._startDate = Validator.DateValidation(startDate); 
            }

            Travel.prototype.getEndDate = function() {
                return this._endDate; 
            }

            Travel.prototype.setEndDate = function(endDate) {
                this._endDate = Validator.DateValidation(endDate);// TODO validation
            }
            
            Travel.prototype.getPrice = function() {
                return this._price;
            }

            Travel.prototype.setPrice = function(price) {
                this._price = validator.isNumberNonNegative(price); 
            }
            

            Travel.prototype.toString = function() {
                return '* ' + this.constructor.name +
                    ' name=' + this.getName() + 
                    ',start-date=' + this.getStartDate() + 
                    ',end-date=' + this.getEndDate() + 
                    ',price=' + this.getPrice();
            }

            return Travel;
        }());


        var Excursion = (function(){
            function Excursion(name, startDate, endDate, price, transport) {
                // calling the parent class constructor
				Travel.call(this, name, startDate, endDate, price);   
                this.setTransport(transport);
                this._destination = {};                
            } 

            Excursion.extends(Travel);

            Excursion.prototype.getTransport = function() {
                return this._transport;
            }

            Excursion.prototype.setTransport = function(transport) {
                this._transport = Validator.isStringNullOrEnpty(transport);
            }

            Excursion.prototype.getDestination = function() {
                return this._destination;
            }

            Excursion.prototype.addDestination = function(destination) {
                this._destination = destination; 
            }

            Excursion.prototype.removeDestination = function() {
                this._destination = {}; 
            }
            
            Excursion.prototype.toString = function(){
                var DestinationStr = this.getDestination() ? this.getDestination().toString() : '-';
                
				
                return Travel.prototype.toString.call(this) + //calling parent toString method
                ',transport=' + this.getTransport() + '\r\n'
                '** Destination' + DestinationStr;
            }           

            return Excursion;            
        }());

		//static class validator 
		// to get type of some value use typeof(value)
        var Vacation = (function(){
             function Vacation(name, startDate, endDate, price, location, accommodation) {
                Travel.call(this, name, startDate, endDate, price); 

                this.setLocation(location);
                this.setAccommodation(accommodation);             
            } 

            Vacation.extends(Travel);

            Vacation.prototype.getLocation = function() {
                return this._location;
            }

            Vacation.prototype.setLocation = function(location) {
                this._location = Validator.isStringNullOrEnpty(location);
            }
            
            Vacation.prototype.getAccommodation = function() {
                return this._accommodation;
            }

            Vacation.prototype.setAccommodation = function(accommodation) {
                if(accommodation !== undefined){
                   Validator.isStringNullOrEnpty(accommodation);
                }
                this._accommodation = accommodation; 
            }

            Vacation.prototype.toString = function(){
                return Travel.prototype.toString.call(this) +
                ',location=' + this.getLocation() + 
                ',accommodation=' + this.getAccommodation();
            }

            return Vacation;            
        }());

        var Cruise = (function() {
            function Cruise(name, startDate, endDate, price, transport, startDock) {
                Travel.call(this, name, startDate, endDate, price, transport);   
                this.setStartDock(startDock);                
            } 

            Cruise.extends(Excursion);

            Cruise.prototype.getStartDock = function() {
                return this._startDock;
            }

            Cruise.prototype.setStartDock = function(startDock) {
                if(startDock !== undefined){
                   Validator.isStringNullOrEnpty(startDock);
                }

                this._startDock = startDock; 
            }
            
            Cruise.prototype.toString = function(){
                return Travel.prototype.toString.call(this) +
                ',start-dock=' + this.getStartDock();
            } 
            
            return Cruise;
        }());

        var Validator = (function() {
            var isStringNullOrEnpty = function(value) {
                if (!value) {
                    throw new Error('String value can not be emprty!');
                }

                return value;
            }
            
            var isNumberNonNegative = function(number) {
                if (number < 0) {
                    throw new Error('Number should be non-negative!');
                }
                
                return number;
            }
            
            var DateValidation = function(date){
               if(!(parseDate(date))){
                   throw new Error(date + 'is not valid!');
               }

               return date;
            }

           return {                
                isStringNullOrEnpty: isStringNullOrEnpty,
                isNumberNonNegative : isNumberNonNegative,
                DateValidation: DateValidation 
           }
        })();

        return {
            Destination: Destination,
            Vacation: Vacation,
            Excursion: Excursion,            
            Cruise: Cruise
        }
    }());

    var TravellingManager = (function(){
        var _travels;
        var _destinations;

        function init() {
            _travels = [];
            _destinations = [];
        }

        var CommandProcessor = (function() {

            function processInsertCommand(command) {
                var object;

                switch (command["type"]) {
                    case "excursion":
                        object = new Models.Excursion(command["name"], parseDate(command["start-date"]), parseDate(command["end-date"]),
                            parseFloat(command["price"]), command["transport"]);
                        _travels.push(object);
                        break;
                    case "vacation":
                        object = new Models.Vacation(command["name"], parseDate(command["start-date"]), parseDate(command["end-date"]),
                            parseFloat(command["price"]), command["location"], command["accommodation"]);
                        _travels.push(object);
                        break;
                    case "cruise":
                        object = new Models.Cruise(command["name"], parseDate(command["start-date"]), parseDate(command["end-date"]),
                            parseFloat(command["price"]), command["start-dock"]);
                        _travels.push(object);
                        break;
                    case "destination":
                        object = new Models.Destination(command["location"], command["landmark"]);
                        _destinations.push(object);
                        break;
                    default:
                        throw new Error("Invalid type.");
                }

                return object.constructor.name + " created.";
            }

            function processDeleteCommand(command) {
                var object,
                    index,
                    destinations;

                switch (command["type"]) {
                    case "destination":
                        object = getDestinationByLocationAndLandmark(command["location"], command["landmark"]);
                        _travels.forEach(function(t) {
                            if (t instanceof Models.Excursion && t.getDestinations().indexOf(object) !== -1) {
                                t.removeDestination(object);
                            }
                        });
                        index = _destinations.indexOf(object);
                        _destinations.splice(index, 1);
                        break;
                    case "excursion":
                    case "vacation":
                    case "cruise":
                        object = getTravelByName(command["name"]);
                        index = _travels.indexOf(object);
                        _travels.splice(index, 1);
                        break;
                    default:
                        throw new Error("Unknown type.");
                }

                return object.constructor.name + " deleted.";
            }

            function processListCommand(command) {
                return formatTravelsQuery(_travels);
            }

            function processAddDestinationCommand(command) {
                var destination = getDestinationByLocationAndLandmark(command["location"], command["landmark"]),
                    travel = getTravelByName(command["name"]);

                if (!(travel instanceof Models.Excursion)) {
                    throw new Error("Travel does not have destinations.");
                }
                travel.addDestination(destination);

                return "Added destination to " + travel.getName() + ".";
            }

            function processRemoveDestinationCommand(command) {
                var destination = getDestinationByLocationAndLandmark(command["location"], command["landmark"]),
                    travel = getTravelByName(command["name"]);

                if (!(travel instanceof Models.Excursion)) {
                    throw new Error("Travel does not have destinations.");
                }
                travel.removeDestination(destination);

                return "Removed destination from " + travel.getName() + ".";
            }

            function getTravelByName(name) {
                var i;

                for (i = 0; i < _travels.length; i++) {
                    if (_travels[i].getName() === name) {
                        return _travels[i];
                    }
                }
                throw new Error("No travel with such name exists.");
            }

            function getDestinationByLocationAndLandmark(location, landmark) {
                var i;

                for (i = 0; i < _destinations.length; i++) {
                    if (_destinations[i].getLocation() === location
                        && _destinations[i].getLandmark() === landmark) {
                        return _destinations[i];
                    }
                }
                throw new Error("No destination with such location and landmark exists.");
            }

            function formatTravelsQuery(travelsQuery) {
                var queryString = "";

                if (travelsQuery.length > 0) {
                    queryString += travelsQuery.join("\n");
                } else {
                    queryString = "No results.";
                }

                return queryString;
            }

            return {
                processInsertCommand: processInsertCommand,
                processDeleteCommand: processDeleteCommand,
                processListCommand: processListCommand,
                processAddDestinationCommand: processAddDestinationCommand,
                processRemoveDestinationCommand: processRemoveDestinationCommand
            }
        }());

        var Command = (function() {
            function Command(cmdLine) {
                this._cmdArgs = processCommand(cmdLine);
            }

            function processCommand(cmdLine) {
                var parameters = [],
                    matches = [],
                    pattern = /(.+?)=(.+?)[;)]/g,
                    key,
                    value,
                    split;

                split = cmdLine.split("(");
                parameters["command"] = split[0];
                while ((matches = pattern.exec(split[1])) !== null) {
                    key = matches[1];
                    value = matches[2];
                    parameters[key] = value;
                }

                return parameters;
            }

            return Command;
        }());

        function executeCommands(cmds) {
            var commandArgs = new Command(cmds)._cmdArgs,
                action = commandArgs["command"],
                output;

            switch (action) {
                case "insert":
                    output = CommandProcessor.processInsertCommand(commandArgs);
                    break;
                case "delete":
                    output = CommandProcessor.processDeleteCommand(commandArgs);
                    break;
                case "add-destination":
                    output = CommandProcessor.processAddDestinationCommand(commandArgs);
                    break;
                case "remove-destination":
                    output = CommandProcessor.processRemoveDestinationCommand(commandArgs);
                    break;
                case "list":
                    output = CommandProcessor.processListCommand(commandArgs);
                    break;
                case "filter":
                    output = CommandProcessor.processFilterTravelsCommand(commandArgs);
                    break;
                default:
                    throw new Error("Unsupported command.");
            }

            return output;
        }

        return {
            init: init,
            executeCommands: executeCommands
        }
    }());

    var parseDate = function (dateStr) {
        if (!dateStr) {
            return undefined;
        }
        var date = new Date(Date.parse(dateStr.replace(/-/g, ' ')));
        var dateFormatted = formatDate(date);
        if (dateStr != dateFormatted) {
            throw new Error("Invalid date: " + dateStr);
        }
        return date;
    }

    var formatDate = function (date) {
        var day = date.getDate();
        var monthName = date.toString().split(' ')[1];
        var year = date.getFullYear();
        return day + '-' + monthName + '-' + year;
    }

    var output = "";
    TravellingManager.init();

    commands.forEach(function(cmd) {
        var result;
        if (cmd != "") {
            try {
                result = TravellingManager.executeCommands(cmd) + "\n";
            } catch (e) {
                //console.log(e.stack);//TODO delete this
                result = "Invalid command." + "\n";
            }
            output += result;
        }
    });

    return output;
}