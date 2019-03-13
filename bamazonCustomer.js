let mysql = require("mysql");
let inquirer = require("inquirer")

//Create the mySQL connection
let connection = mysql.createConnection({
    host: "localhost",
    //Port
    port: 3306,
    //username
    user: "root",
    //Password
    password: "root",
    //DB Name
    database: "bamazon_db"
});
//Connect to mySql Server and SQL DB
connection.connect(function (err) {
    if(err) throw err
    console.log("Working")
    //Call my starting function under this
    //HERE
})
//Display Products function
function start() {
    var query = "SELECT * FROM products";
      connection.query(query, function(err, res) {
          if (err) throw err;

        //for loop to log each item in stock    
        for (let i = 0; i < res.length; i++) {
            //Iterates through each and concatinates each column with a label 
            console.log("======================================================================================================")
            console.log("Item ID: " + res[i].item_id + " || Product Name: " + res[i].product_name + " || Department Name: " + res[i].department_name + " || Price: " + res[i].price + " || Quantity: " + res[i].stock_quantity)
        }
        askCustomer()
      }
    )}

start();

//Ask for ID input
function askCustomer() {
    //Inquirer Statement to get item
    inquirer.prompt([
        {
            type: 'input',
            name: "id",
            message: "What is the ID of the product you would like to purchase?",
            validate: function(value) {
                let valid = !isNaN(parseFloat(value))
                return valid || 'Please enter a number'
            }
        },{
            type: "input",
            name: "quantity",
            message: "How many would you like to purchase?",
            validate: function(value) {
                let valid = !isNaN(parseFloat(value))
                return valid || 'Please enter a number'
            }
        }
    ]).then(function(answer) {
        checkQuantity(answer.id, answer.quantity)
    })
}

//Function to compare users ask for product with our inventory
function checkQuantity(id, quantity) {
    var query = "SELECT stock_quantity FROM products WHERE ?"

    connection.query(query, {item_id: id}, function (err, res) {
        if (err) throw err
        let stockQuantity = res[0].stock_quantity

        if (stockQuantity >= quantity) {
            let query = "UPDATE products SET ? WHERE ?"
            //Update the DB
            connection.query(query,[
                {
                //Subtract the purchased items
                stock_quantity: stockQuantity - quantity
                },{
                    //product id
                    item_id: id
                }], function (err, res) {
                    promptBool = false
                    start();
                })
        }
        else {
            console.log("Insufficient Quantity!")
            console.log("Try Again")
            start();
        }
    })
}