let mysql = require("mysql");
let inquirer = require("inquirer")

let count = 0
//Create the mySQL connection
let connection = mysql.createConnection({
    hose: "localhost",
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
    //Call my starting function under this
    managerChoice()
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
        managerChoice()
      }
    )}

      //Function to display any items less than 5 in inventory
    function displayLowQuantity() {
        let lowQuant = 5
        let query = "SELECT * FROM products WHERE stock_quantity <" + lowQuant
        connection.query(query, function (err, res) {
            if (err) throw err
            //Grab all the low items
            for (let i = 0; i < res.length; i++) {
                console.log("LOW QUANTITY WARNING: " + "Product Name: " + res[i].product_name + " || Quantity: " + res[i].stock_quantity)
            }
        })
        managerChoice()
    }
    //Find out what the Manager wants to do
    function managerChoice() {
        inquirer.prompt([
            {
                type: "rawlist",
                name: "choice",
                message: "What would you like to do?",
                choices: ["View Products for Sale", "View Low Inventory", "Add new Product", "Add Quantity to existing item"]
            }
        ]).then(function (answers) {
            switch (answers.choice) {
                case "View Products for Sale" :
                    start()
                    break;
                case "View Low Inventory" :
                displayLowQuantity()
                    break;
                case "Add new Product" :
                    addProduct()
                    break;
                case "Add Quantity to existing item" :
                    updateItem()
                    break;
            }
        })
    }
//Function to update item
function updateItem() {
    inquirer.prompt([
        {
            type: "input",
            name: "product",
            message: "What is the name of the product"
        }
    ]).then(function(answer) {
        let query = "SELECT product_name FROM products"
        let product = answer.product
        connection.query(query, function (err, res) {
            if (err) throw err
            //Checks product name
            for (let i = 0; i < res.length; i++) {
                if (res[i].product_name === answer.product) {
                    count++
                }
            }
            if (count > 1) {
                //Reset
                count = 0
                //Get quantity from user
                inquirer.prompt([
                    {
                        type: "input",
                        name: "quantity",
                        message: "How many would you like to add?"
                    }
                ]).then(function (answer) {
                    let query = "SELECT * FROM products WHERE ?"
                    let stockQuant = 0
                    let quantity = parseInt(answer.quantity)
                    connection.query(query, [
                    {
                        product_name: product
                    }
                    ], function (err, res) {
                        if (err) throw err
                        stockQuant = parseInt(res[0].stock_quantity)
                        //Check updates
                        console.log("Stock Quantity: ", stockQuant)
                        console.log("Quantity: ", quantity)
                        console.log("Stock Quantity: ", product)
                        let query = "UPDATE products SET ? WHERE ?"
                        connection.query(query, [
                        {
                            stock_quantity: stockQuant + quantity
                        },{
                            product_name: product
                        }


                        ], function (err, res) {
                            if (err) throw err
                            console.log("QUANTITY ADDED!!!")
                            start()
                        })
                    })
                })
            }
            else {
                console.log("That Item does Not Exist")
                //Restart the process
                updateItem()
            }
        })
    })
    // managerChoice()
}

function addProduct() {
    inquirer.prompt([
        {
            type: "input",
            name: "product",
            message: "What is the product name?"
        },{
            type: "input",
            name: "department",
            message: "What is the department name?"
        },{
            type: "input",
            name: "price",
            message: "How much does it cost?"
        },{
            type: "input",
            name: "sockQuant",
            message: "How many do you want to add?"
        }
    ]).then(function (answer) {
        let product = answer.product
        let department = answer.department
        let price = answer.price
        let quantity = answer.stockQuant
        let post = {
            product_name: product,
            department_name: department,
            price: price,
            stock_quantity: quantity
        }
        let query = "INSERT INTO products SET ?"
        connection.query(query, post, function (err, res) {
            start()
        })
    })
    // managerChoice()
}


