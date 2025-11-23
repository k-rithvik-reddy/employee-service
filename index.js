const express = require("express");
const app = express();
app.use(express.json());

// In-memory "database"
let employees = [];

// CREATE employee
app.post("/employees", (req, res) => {
  const { id, employeeName, salary } = req.body;

  if (!id || !employeeName || !salary) {
    return res.status(400).json({ message: "id, employeeName, salary required" });
  }

  if (employees.find(e => e.id === id)) {
    return res.status(409).json({ message: "Employee with this id already exists" });
  }

  const emp = { id, employeeName, salary };
  employees.push(emp);
  res.status(201).json(emp);
});

// READ all employees
app.get("/employees", (req, res) => {
  res.json(employees);
});

// READ employee by id
app.get("/employees/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const emp = employees.find(e => e.id === id);
  if (!emp) return res.status(404).json({ message: "Not found" });
  res.json(emp);
});

// UPDATE employee
app.put("/employees/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { employeeName, salary } = req.body;
  const emp = employees.find(e => e.id === id);

  if (!emp) return res.status(404).json({ message: "Not found" });

  if (employeeName !== undefined) emp.employeeName = employeeName;
  if (salary !== undefined) emp.salary = salary;

  res.json(emp);
});

// DELETE employee
app.delete("/employees/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = employees.findIndex(e => e.id === id);
  if (index === -1) return res.status(404).json({ message: "Not found" });

  employees.splice(index, 1);
  res.status(204).send();
});

// Health check (useful in K8s)
app.get("/", (req, res) => {
  res.send("Employee service is running");
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Employee service listening on port ${PORT}`);
});
