export const tutorialData = {
  html: {
    name: "HTML",
    icon: "html5",
    topics: {
      "Structure & Semantic": {
        description: "Modern HTML5 relies on semantic tags to define the structure and meaning of web content, improving accessibility and SEO.",
        exercise: "Create a simple accessible blog page using semantic HTML: header, nav, main with an article and an aside, and a footer. Ensure all links have meaningful text.",
        quiz: {
          question: "Which semantic element is the best choice to wrap the main content of a document?",
          options: ["<main>", "<section>", "<div>", "<article>"],
          correctIndex: 0
        },
        code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Semantic Layout</title>
</head>
<body>
    <header style="background:#333; color:pink; padding:10px;">
        <nav>
            <a href="#">Home</a> | <a href="#">About</a>
        </nav>
        <h1>My Accessible Website</h1>
    </header>
    
    <main style="padding:20px;">
        <article>
            <h2>Blog Post Title</h2>
            <p>This is the main content area using the &lt;main&gt; tag.</p>
        </article>
        
        <aside style="background:#f4f4f4; padding:10px; margin-top:10px;">
            <h3>Related Links</h3>
            <ul>
                <li><a href="#">Link 1</a></li>
                <li><a href="#">Link 2</a></li>
            </ul>
        </aside>
    </main>

    <footer style="background:#222; color:white; padding:10px; text-align:center;">
        <p>&copy; 2024 TechioLaza Inc.</p>
    </footer>
</body>
</html>`
      },
      "Advanced Forms": {
        description: "HTML5 added powerful new input types and attributes for data validation without JavaScript.",
        exercise: "Build a registration form that validates email and requires age between 18 and 99. Add a submit button and show a brief success message when submitted (can be a placeholder).",
        code: `<form style="max-width:400px; margin:20px auto; display:flex; flex-direction:column; gap:10px;">
    <h2>Register</h2>
    
    <label>Email (Required):
        <input type="email" name="user_email" required placeholder="you@example.com" />
    </label>
    
    <label>Age (18-99):
        <input type="number" name="age" min="18" max="99" />
    </label>
    
    <label>Birthday:
        <input type="date" name="bday" />
    </label>
    
    <label>Favorite Color:
        <input type="color" name="fav_color" value="#ff0000" />
    </label>
    
    <label>Profile URL:
        <input type="url" name="website" placeholder="https://" />
    </label>

    <button type="submit" style="padding:10px; background:blue; color:white;">Sign Up</button>
</form>`
      },
      "Media & Graphics": {
        description: "Embed rich media directly into your web pages using standard HTML5 elements.",
        exercise: "Embed a video with poster image and an accessible caption; add an inline SVG graphic and an audio player with controls.",
        code: `<!-- Video Embedding -->
<video width="320" height="240" controls poster="https://via.placeholder.com/320x240">
  <source src="https://www.w3schools.com/html/movie.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

<!-- SVG Graphics -->
<svg width="100" height="100" style="background:#eee; display:block; margin:20px 0;">
  <circle cx="50" cy="50" r="40" stroke="green" stroke-width="4" fill="yellow" />
</svg>

<!-- Audio -->
<audio controls>
  <source src="https://www.w3schools.com/html/horse.ogg" type="audio/ogg">
  Your browser does not support the audio element.
</audio>`
      },
      "Tables & Data": {
        description: "Present complex datasets clearly with full table markup including captions, headers, and footers.",
        exercise: "Construct a table showing monthly savings with caption, header row, footer total, and at least two data rows. Mark up semantically.",
        code: `<table border="1" cellpadding="10" style="border-collapse:collapse; width:100%;">
    <caption>Monthly Savings</caption>
    <thead>
        <tr style="background:#eee;">
            <th>Month</th>
            <th>Savings</th>
            <th>Outcome</th>
        </tr>
    </thead>
    <tfoot>
        <tr style="background:#eee;">
            <td>Total</td>
            <td>$250</td>
            <td>Good</td>
        </tr>
    </tfoot>
    <tbody>
        <tr>
            <td>January</td>
            <td>$100</td>
            <td>Started well</td>
        </tr>
        <tr>
            <td>February</td>
            <td>$150</td>
            <td>Improving</td>
        </tr>
    </tbody>
</table>`
      }
    }
  },
  css: {
    name: "CSS",
    icon: "css3-alt",
    topics: {
      "Flexbox Masterclass": {
        description: "Master layouts with Flexbox. Control alignment, spacing, and wrapping with ease.",
        exercise: "Create a responsive row of boxes using Flexbox that wraps on small screens and centers items horizontally and vertically.",
        code: `.container {
    display: flex;
    flex-wrap: wrap; /* Allow items to wrap */
    justify-content: center; /* Center horizontally */
    gap: 20px;
    padding: 20px;
    background: #f0f0f0;
}

.box {
    width: 100px;
    height: 100px;
    background: linear-gradient(45deg, #FF512F, #DD2476);
    color: white;
    display: flex;
    align-items: center; /* Center text vertically */
    justify-content: center; /* Center text horizontally */
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    transition: transform 0.3s;
}

.box:hover {
    transform: scale(1.1);
}`
      },
      "CSS Grid": {
        description: "Creating two-dimensional layouts. Define rows and columns explicitly.",
        exercise: "Build a 3-column grid with a header row that spans all columns and at least three content items placed in the grid.",
        code: `.grid-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr); /* 3 Equal columns */
    grid-template-rows: 100px 200px;
    gap: 15px;
    padding: 20px;
}

.item {
    background: #4facfe;
    color: white;
    padding: 20px;
    border-radius: 8px;
    font-family: sans-serif;
}

.item:first-child {
    grid-column: 1 / -1; /* Span all columns */
    background: #00f260;
}`
      },
      "Animations & Transitions": {
        description: "Create smooth interactions and complex keyframe animations.",
        exercise: "Add a button with a hover transition and a small keyframe bounce animation that triggers on hover.",
        code: `@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.btn {
  padding: 12px 24px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.btn:hover {
  background: #764ba2;
  animation: bounce 0.6s infinite;
}

.loader {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`
      },
      "Responsive Design": {
        description: "Use Media Queries to adapt your layout for mobile, tablet, and desktop screens.",
        exercise: "Create a card component that changes background and padding across three breakpoints: desktop, tablet, and mobile.",
        code: `.card {
    width: 80%;
    margin: 0 auto;
    padding: 20px;
    background: white;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

/* Tablet styles */
@media (max-width: 768px) {
    .card {
        width: 100%;
        background: #fafafa;
    }
    body {
        background-color: lightyellow;
    }
}

/* Mobile styles */
@media (max-width: 480px) {
    .card {
        padding: 10px;
        font-size: 14px;
    }
}`
      }
    }
  },
  js: {
    name: "JavaScript",
    icon: "js",
    topics: {
      "ES6+ Features": {
        description: "Modern JavaScript syntax: Arrow functions, Destructuring, and Template Literals.",
        exercise: "Write a small function using arrow syntax that takes an object with `name` and `role` and returns a greeting string using template literals.",
        code: `// Arrow Functions
const add = (a, b) => a + b;

// Destructuring
const user = { id: 1, name: "Alice", role: "Dev" };
const { name, role } = user;

// Template Literals
console.log(\`User \${name} is a \${role}\`);

// Spread Operator
const numbers = [1, 2, 3];
const newNumbers = [...numbers, 4, 5];
console.log("Combined:", newNumbers);`
      },
      "Async/Await & Fetch": {
        description: "The modern way to handle asynchronous data requests in JavaScript.",
        exercise: "Fetch a JSON placeholder todo and display its title and completion status inside an element with id `app`.",
        code: `async function loadData() {
    const list = document.getElementById('app');
    
    try {
        list.innerHTML = "Loading...";
        
        // Simulate API call
        const response = await fetch('https://jsonplaceholder.typicode.com/todos/1');
        const data = await response.json();
        
        list.innerHTML = \`
            <h3>\${data.title}</h3>
            <p>Status: \${data.completed ? 'Done ✅' : 'Pending ⏳'}</p>
        \`;
    } catch (err) {
        console.error(err);
        list.innerHTML = "Error loading data";
    }
}

loadData();`
      },
      "DOM Manipulation": {
        description: "Interact with the web page dynamically.",
        exercise: "Create and append a card element with a heading and a button; the button should show an alert when clicked.",
        code: `// Create Element
const div = document.createElement('div');
div.style.padding = "20px";
div.style.background = "#fff";
div.style.border = "1px solid #ccc";

// Add Content
const h2 = document.createElement('h2');
h2.innerText = "Dynamic Content";
div.appendChild(h2);

const btn = document.createElement('button');
btn.innerText = "Click Me";
btn.onclick = () => alert("Hello from JS!");

div.appendChild(btn);

// Append to Body
document.body.appendChild(div);`
      },
      "Classes & Modules": {
        description: "Object-oriented patterns in modern JavaScript.",
        exercise: "Create a `Rectangle` class with `height` and `width`, and a getter `area` that returns the computed area.",
        code: `class Rectangle {
  constructor(height, width) {
    this.height = height;
    this.width = width;
  }
  
  get area() {
    return this.calcArea();
  }
  
  calcArea() {
    return this.height * this.width;
  }
}

const square = new Rectangle(10, 10);
console.log("Area:", square.area);`
      }
    }
  },
  python: {
    name: "Python",
    icon: "python",
    topics: {
      "Data Analysis (Pandas Style)": {
        description: "Simulating data frame operations often used in Data Science.",
        exercise: "Given a list of person dictionaries, filter those earning more than 55,000 and compute average age.",
        code: `dataset = [
    {"name": "Alice", "age": 25, "salary": 50000},
    {"name": "Bob", "age": 30, "salary": 60000},
    {"name": "Charlie", "age": 35, "salary": 70000}
]

# Filtering
high_earners = [p for p in dataset if p["salary"] > 55000]

# Aggregation
total_salary = sum(p["salary"] for p in dataset)
avg_age = sum(p["age"] for p in dataset) / len(dataset)

print(f"High Earners: {high_earners}")
print(f"Total Payroll: $\${total_salary}")
print(f"Average Age: {avg_age:.1f}")`
      },
      "File Handling": {
        description: "Reading and writing files safely using context managers.",
        exercise: "Write lines to a file named `example.txt` then read and print each line. Use context managers.",
        code: `# Writing to a file
with open("example.txt", "w") as f:
    f.write("Line 1: Hello World\\n")
    f.write("Line 2: Python is great\\n")

# Reading from a file
print("--- Reading File ---")
with open("example.txt", "r") as f:
    for line in f:
        print(line.strip())`
      },
      "Web Scraping (Simulation)": {
        description: "Using libraries like requests and BeautifulSoup (simulated) to extract data from strings.",
        exercise: "From a given HTML string extract the text inside the first `<h1>` tag and print it.",
        code: `html_content = """
<html>
  <body>
    <h1>News Title</h1>
    <p class="summary">This is a summary of the news.</p>
  </body>
</html>
"""

# Simple String Parsing
start_tag = "<h1>"
end_tag = "</h1>"
start_index = html_content.find(start_tag) + len(start_tag)
end_index = html_content.find(end_tag)

title = html_content[start_index:end_index]
print(f"Extracted Title: {title}")`
      },
      "Decorators": {
        description: "Modifying function behavior with the @decorator syntax.",
        exercise: "Create a simple `@log_execution` decorator that prints when a wrapped function starts and ends, then apply it to a small `add` function.",
        code: `def log_execution(func):
    def wrapper(*args, **kwargs):
        print(f"Executing {func.__name__}...")
        result = func(*args, **kwargs)
        print("Done!")
        return result
    return wrapper

@log_execution
def add(a, b):
    return a + b

print(f"Result: {add(5, 7)}")`
      }
    }
  },
  java: {
    name: "Java",
    icon: "java",
    topics: {
      "OOP: Inheritance": {
        description: "Extending classes to share behavior and override methods.",
        exercise: "Create an abstract `Shape` with `area()` and implement `Circle` and `Square`. Print areas for each.",
        code: `abstract class Shape {
    abstract double area();
}

class Circle extends Shape {
    double radius;
    Circle(double r) { radius = r; }
    
    @Override
    double area() { return Math.PI * radius * radius; }
}

class Square extends Shape {
    double side;
    Square(double s) { side = s; }
    
    @Override
    double area() { return side * side; }
}

public class Main {
    public static void main(String[] args) {
        Shape c = new Circle(5);
        System.out.println("Circle Area: " + c.area());
    }
}
`
      },
      "Collections Framework": {
        description: "Using Lists, Sets, and Maps to store data efficiently.",
        exercise: "Use an `ArrayList` of fruits and a `HashMap` to store inventory counts; print a count for one fruit.",
        code: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        // List
        List<String> fruits = new ArrayList<>();
        fruits.add("Apple");
        fruits.add("Banana");
        
        // Map
        Map<String, Integer> inventory = new HashMap<>();
        inventory.put("Apple", 50);
        inventory.put("Banana", 30);
        
        System.out.println("We have " + inventory.get("Apple") + " apples.");
        
        // Iteration
        for(String f : fruits) {
            System.out.println(f);
        }
    }
}`
      },
      "Multithreading": {
        description: "Running tasks concurrently using the Runnable interface.",
        exercise: "Start two threads which each print a message three times with small sleeps; observe interleaving.",
        code: `class Task implements Runnable {
    String name;
    Task(String n) { name = n; }
    
    public void run() {
        for(int i=0; i<3; i++) {
            System.out.println(name + " - Count: " + i);
            try { Thread.sleep(100); } catch(Exception e){}
        }
    }
}

public class Main {
    public static void main(String[] args) {
        Thread t1 = new Thread(new Task("Thread A"));
        Thread t2 = new Thread(new Task("Thread B"));
        
        t1.start();
        t2.start();
    }
}`
      }
    }
  },
  cpp: {
    name: "C++",
    icon: "cplusplus",
    topics: {
      "Pointers & References": {
        description: "Direct memory manipulation is essentially C++.",
        exercise: "Implement a `swap` function using references to exchange two integers and print values before and after.",
        code: `#include <iostream>
using namespace std;

void swap(int &a, int &b) {
    int temp = a;
    a = b;
    b = temp;
}

int main() {
    int x = 10, y = 20;
    cout << "Before: " << x << ", " << y << endl;
    
    swap(x, y); // Pass by reference
    
    cout << "After: " << x << ", " << y << endl;
    
    int* ptr = &x;
    cout << "Pointer Address: " << ptr << ", Value: " << *ptr << endl;
    return 0;
}`
      },
      "Classes & Objects": {
        description: "Object-Oriented Programming in C++.",
        exercise: "Implement a `Car` class with a brand member and `honk()` method; instantiate and call `honk()`.",
        code: `#include <iostream>
using namespace std;

class Car {
private:
    string brand;
public:
    Car(string b) : brand(b) {}
    
    void honk() {
        cout << brand << " says Beep!" << endl;
    }
};

int main() {
    Car myCar("Toyota");
    myCar.honk();
    return 0;
}`
      },
      "STL Map": {
        description: "Using the Standard Template Library Map container.",
        exercise: "Create a `std::map` of names to ages, insert entries and iterate to print each name and age.",
        code: `#include <iostream>
#include <map>
using namespace std;

int main() {
    map<string, int> ages;
    ages["Alice"] = 25;
    ages["Bob"] = 30;

    for(auto const& [key, val] : ages) {
        cout << key << " is " << val << " years old." << endl;
    }
    
    if(ages.find("Alice") != ages.end()) {
        cout << "Alice is in the map." << endl;
    }
    return 0;
}`
      }
    }
  },
  csharp: {
    name: "C#",
    icon: "csharp",
    topics: {
      "Generics": {
        description: "Writing flexible, reusable code with type parameters.",
        exercise: "Implement a generic `Box<T>` class and demonstrate with `int` and `string` boxes.",
        code: `using System;

public class Box<T> {
    private T content;
    
    public void Add(T item) {
        content = item;
    }
    
    public T GetContent() {
        return content;
    }
}

public class Program {
    public static void Main() {
        Box<int> intBox = new Box<int>();
        intBox.Add(123);
        Console.WriteLine(intBox.GetContent());

        Box<string> strBox = new Box<string>();
        strBox.Add("Hello Generic");
        Console.WriteLine(strBox.GetContent());
    }
}`
      },
      "LINQ Advanced": {
        description: "Querying collections with SQL-like syntax.",
        exercise: "Given a list of students, use LINQ to select those with `Grade >= 90` and print their names.",
        code: `using System;
using System.Linq;
using System.Collections.Generic;

class Student {
    public string Name { get; set; }
    public int Grade { get; set; }
}

public class Program {
    public static void Main() {
        var students = new List<Student> {
            new Student { Name="Alice", Grade=90 },
            new Student { Name="Bob", Grade=80 },
            new Student { Name="Charlie", Grade=95 }
        };
        
        var topStudents = from s in students
                          where s.Grade >= 90
                          orderby s.Name
                          select s;
                          
        foreach(var s in topStudents) {
            Console.WriteLine(s.Name + ": " + s.Grade);
        }
    }
}`
      }
    }
  },
  go: {
    name: "Go",
    icon: "go",
    topics: {
      "Structs & Interfaces": {
        description: "Go's approach to polymorphism and data structures.",
        exercise: "Define a `Shape` interface and two types that implement `Area()`; print areas for both.",
        code: `package main
import "fmt"
import "math"

type Shape interface {
    Area() float64
}

type Circle struct {
    Radius float64
}

func (c Circle) Area() float64 {
    return math.Pi * c.Radius * c.Radius
}

type Rect struct {
    ReqWidth, ReqHeight float64
}

func (r Rect) Area() float64 {
    return r.ReqWidth * r.ReqHeight
}

func printArea(s Shape) {
    fmt.Printf("Area: %.2f\\n", s.Area())
}

func main() {
    c := Circle{Radius: 5}
    r := Rect{ReqWidth: 4, ReqHeight: 3}
    
    printArea(c)
    printArea(r)
}`
      },
      "Concurrency (Channels)": {
        description: "Communicating sequentially processing.",
        exercise: "Build a simple worker pool that receives jobs over a channel and sends results back over another channel.",
        code: `package main
import (
    "fmt"
    "time"
)

func worker(id int, jobs <-chan int, results chan<- int) {
    for j := range jobs {
        fmt.Println("worker", id, "started  job", j)
        time.Sleep(time.Second)
        fmt.Println("worker", id, "finished job", j)
        results <- j * 2
    }
}

func main() {
    const numJobs = 5
    jobs := make(chan int, numJobs)
    results := make(chan int, numJobs)

    for w := 1; w <= 3; w++ {
        go worker(w, jobs, results)
    }

    for j := 1; j <= numJobs; j++ {
        jobs <- j
    }
    close(jobs)

    for a := 1; a <= numJobs; a++ {
        <-results
    }
}`
      }
    }
  },
  rust: {
    name: "Rust",
    icon: "rust",
    topics: {
      "Traits": {
        description: "Defining shared behavior (similar to interfaces).",
        exercise: "Define a `Summary` trait and implement it for a `NewsArticle` struct that returns a short summary string.",
        code: `trait Summary {
    fn summarize(&self) -> String;
}

struct NewsArticle {
    headline: String,
    author: String,
}

impl Summary for NewsArticle {
    fn summarize(&self) -> String {
        format!("{}, by {}", self.headline, self.author)
    }
}

fn main() {
    let article = NewsArticle {
        headline: String::from("Rust is fast!"),
        author: String::from("Jane Doe"),
    };
    
    println!("New article: {}", article.summarize());
}`
      },
      "Error Handling": {
        description: "Using Result and Option enums instead of exceptions.",
        exercise: "Write a `divide` function that returns `Result` and handle division by zero with an error variant.",
        code: `fn divide(a: f64, b: f64) -> Result<f64, String> {
    if b == 0.0 {
        Err(String::from("Cannot divide by zero"))
    } else {
        Ok(a / b)
    }
}

fn main() {
    match divide(10.0, 2.0) {
        Ok(val) => println!("Result: {}", val),
        Err(e) => println!("Error: {}", e),
    }
    
    match divide(5.0, 0.0) {
        Ok(val) => println!("Result: {}", val),
        Err(e) => println!("Error: {}", e),
    }
}`
      }
    }
  },
  sql: {
    name: "SQL",
    icon: "sql",
    topics: {
      "Aggregation": {
        description: "Grouping data to calculate sums, averages, and counts.",
        exercise: "Write a query that groups employees by department and returns count and average salary per group where average salary > 50000.",
        code: `SELECT Department, COUNT(*) as EmployeeCount, AVG(Salary) as AvgSalary
FROM Employees
GROUP BY Department
HAVING AVG(Salary) > 50000;`
      },
      "Subqueries": {
        description: "Nesting queries for complex data retrieval.",
        exercise: "Write a query that selects employees whose salary is greater than the average salary across all employees.",
        code: `SELECT Name, Salary
FROM Employees
WHERE Salary > (
    SELECT AVG(Salary) FROM Employees
);`
      }
    }
  },
  swift: {
    name: "Swift",
    icon: "swift",
    topics: {
      "Optionals": {
        description: "Handling the absence of a value safely.",
        exercise: "Use optionals to safely unwrap a nullable string and print a default message when nil.",
        code: `var originalString: String? = "Hello"
// originalString = nil

if let safeString = originalString {
    print("The string is: \(safeString)")
} else {
    print("The string was nil")
}

// Guard statement
func printName(_ name: String?) {
    guard let n = name else {
        print("No name provided")
        return
    }
    print("Hello, \(n)")
}
printName("John")
printName(nil)`
      }
    }
  },
  kotlin: {
    name: "Kotlin",
    icon: "kotlin",
    topics: {
      "Data Classes": {
        description: "Concise class declaration for holding data.",
        exercise: "Create a Kotlin `data class` for `User` and demonstrate using `copy()` to change the age.",
        code: `data class User(val name: String, val age: Int)

fun main() {
    val user1 = User("Alice", 25)
    val user2 = user1.copy(age = 26) // Copy with modification
    
    println(user1)
    println(user2)
    println("Are equal? \${user1 == user2}")
}`
      },
      "Extension Functions": {
        description: "Adding functions to existing classes without inheritance.",
        exercise: "Write an extension function on `String` that appends an exclamation mark and use it.",
        code: `fun String.addExclamation(): String {
    return this + "!"
}

fun main() {
    val str = "Hello"
    println(str.addExclamation()) // Output: Hello!
}`
      }
    }
  },
  php: {
    name: "PHP",
    icon: "php",
    topics: {
      "Class & Objects": {
        description: "PHP Object Oriented Programming.",
        exercise: "Create a `Fruit` class with `name` and `color`, instantiate it and echo the name.",
        code: `<?php
class Fruit {
  public $name;
  public $color;

  function __construct($name, $color) {
    $this->name = $name;
    $this->color = $color;
  }
  
  function get_name() {
    return $this->name;
  }
}

$apple = new Fruit("Apple", "Red");
echo $apple->get_name();
?>`
      },
      "Database (PDO)": {
        description: "Secure database access using Prepared Statements.",
        exercise: "Write a PDO prepared statement that selects rows and loops through the results (pseudocode ok for DB connection).",
        code: `<?php
$servername = "localhost";
$username = "username";
$password = "password";

try {
  $conn = new PDO("mysql:host=$servername;dbname=myDB", $username, $password);
  $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  
  $stmt = $conn->prepare("SELECT id, firstname, lastname FROM MyGuests");
  $stmt->execute();

  $result = $stmt->setFetchMode(PDO::FETCH_ASSOC);
  foreach($stmt->fetchAll() as $k=>$v) {
    echo $v;
  }
} catch(PDOException $e) {
  echo "Error: " . $e->getMessage();
}
?>`
      }
    }
  }
};
