# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.




//const [searchParams, setSearchParams] = useSearchParams();

Reads URL query params (page, limit)

Updates page when user paginates

If removed:

Pagination system breaks.

URL will not update when switching pages.

// const page = Number(searchParams.get("page")) || 1;
const limit = Number(searchParams.get("limit")) || 10;

What it does:

Reads page number from URL.

Defaults to 1 and 10 if missing.

❌ If removed:

Pagination will always reset to page 1.

Moving between pages breaks.



//const [search, setSearch] = useState("");
const [statusFilter, setStatusFilter] = useState("");

Stores search input and status filter selection values.

❌ If removed:

Search bar won’t work.

Filter dropdown won’t work.

//const debouncedSearch = useDebounce(search, 500);

What it does:

Creates a delay before triggering search API calls.

Prevents spamming backend.

❌ If removed:

Every keystroke calls API.

Performance drops badly.

//const fetchTasks = useCallback(async () => {
What it does:

Fetches tasks from backend.

Memoized to prevent recreation every render → performance boost.

❌ If removed:

Component still works, but inefficient.

Causes unnecessary re-renders.

//const res = await axios.get(`${API}/task/getTasks?...`)
Sends API request with pagination, search, and filter parameters.


//useQuery({
  queryKey: ["task", page, limit, debouncedSearch, statusFilter],
  queryFn: fetchTasks,
})

What it does:

Automatically fetches data.

Detects changes in page/search/filter and refetches.

Caches data.

❌ If removed:

No table data will load.

Entire component becomes useless.


//const columns = useMemo(() => [...], [page, limit, navigate])
Defines table layout.

Memoized → prevents unnecessary re-renders.


//const handlePageChange = (newPage) => {
  setSearchParams({ page: newPage, limit });
};

What it does:

Updates URL.

Triggers React Query refetch.

❌ If removed:

Pagination breaks.

User stays stuck on the same page.









// zod validation error handling
1. if (!result.success) {

result comes from your Zod validation:

const result = addTask.safeParse(values);


result.success will be:

true → validation passed

false → validation failed (invalid input)

➡️ This if block only runs when the form input is INVALID.

2. const fieldErrors = result.error.flatten().fieldErrors;

result.error contains all Zod validation errors.

.flatten() converts Zod’s complex error tree into a simple structure.

.fieldErrors gives an object like:

{
  title: ["Title is required"],
  description: ["Description must be at least 10 chars"]
}


➡️ This gives you each field name + its validation message(s).

3. Object.keys(fieldErrors).forEach((field) => {

Object.keys(fieldErrors) returns an array of field names with errors:

["title", "description"]


.forEach((field) => { ... }) loops through each invalid field.

➡️ We are about to assign each error to the matching form field.

4. form.setFields([{ name: field, errors: [fieldErrors[field][0]] }]);

Ant Design’s form API allows setting errors manually.

name: field → which input field should show the error

errors: [fieldErrors[field][0]] → the first error message for that field

Example produced:

form.setFields([
  {
    name: "title",
    errors: ["Title is required"]
  }
]);


➡️ This displays the error message under the corresponding input field in the U



















import React, { useState, useMemo, useCallback } from "react";
import { Table, Button } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useDebounce } from "./useDebounce"; // import debounce hook

const API = "http://localhost:5050/api";

function ViewTask() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;

  // 👉 NEW: Search + Filter
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const debouncedSearch = useDebounce(search, 500);

  // 👉 API Fetch
  const fetchTasks = useCallback(async () => {
    const res = await axios.get(
      `${API}/task/getTasks?page=${page}&limit=${limit}&search=${debouncedSearch}&status=${statusFilter}`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    return res.data;
  }, [page, limit, debouncedSearch, statusFilter]);

  const { data } = useQuery({
    queryKey: ["task", page, limit, debouncedSearch, statusFilter],
    queryFn: fetchTasks,
    staleTime: 60000,
    refetchOnWindowFocus: false,
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id) =>
      axios.delete(`${API}/task/deleteTask/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }),

    onSuccess: (_, id) => {
      toast.success("Task deleted");
      queryClient.invalidateQueries(["task"]);
    },
  });

  // Status Mutation
  const statusMutation = useMutation({
    mutationFn: ({ id, status }) =>
      axios.put(
        `${API}/task/updateStatus/${id}`,
        { status },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      ),

    onSuccess: () => {
      queryClient.invalidateQueries(["task"]);
    },
  });

  // const columns = useMemo(
  //   () => [
  //     {
  //       title: "SI.No",
  //       render: (_, __, index) => (page - 1) * limit + index + 1,
  //     },
  //     { title: "Title", dataIndex: "title" },
  //     { title: "Description", dataIndex: "description" },
  //     { title: "Status", dataIndex: "status" },

  //     {
  //       title: "Action",
  //       render: (_, record) => (
  //         <>
  //           <Button
  //             type="primary"
  //             onClick={() => navigate(`/edit-task/${record.id}`)}
  //             disabled={record.status === "completed"}
  //           >
  //             Edit
  //           </Button>

  //           <Button
  //             className="ms-2"
  //             onClick={() =>
  //               statusMutation.mutate({
  //                 id: record.id,
  //                 status: "completed",
  //               })
  //             }
  //             disabled={record.status === "completed"}
  //           >
  //             Completed
  //           </Button>

  //           <Button
  //             className="ms-2"
  //             danger
  //             onClick={() => deleteMutation.mutate(record.id)}
  //           >
  //             Delete
  //           </Button>
  //         </>
  //       ),
  //     },
  //   ],
  //   [page, limit, navigate]
  // );

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage, limit });
  };

  return (
    <div className="container mt-5">
      {/* 🔍 Search + Filter Inputs */}
      <div className="d-flex gap-3 mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: "300px" }}
        />

        <select
          className="form-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ width: "200px" }}
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <Table
        columns={columns}
        dataSource={data?.tasks || []}
        rowKey="id"
        pagination={{
          current: page,
          pageSize: limit,
          total: data?.total || 0,
          onChange: handlePageChange,
        }}
      />
    </div>
  );
}

export default ViewTask;




const { getTasksSchema } = require("../validators/taskValidators");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getTasks = async (req, res) => {
  try {
    // 1👉 Validate input using Zod
    const { query } = getTasksSchema.parse(req);

    let { page, limit, search, status } = query;

    page = Number(page);
    limit = Number(limit);

    const userId = req.user.user;

    // 2👉 Build Prisma filters
    const where = { user_id: userId };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (status) {
      where.status = status;
    }

    // 3👉 Fetch paginated tasks
    const tasks = await prisma.task.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    // 4👉 Total count (for pagination)
    const total = await prisma.task.count({ where });

    // 5👉 Response
    res.json({
      success: true,
      tasks,
      total,
      page,
      limit,
    });
  } catch (err) {
    console.error(err);

    if (err instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: "Invalid query parameters",
        errors: err.errors,
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const schema = z.object({
  page: z.string().optional().default("1"),
  limit: z.string().optional().default("10"),
  search: z.string().optional().default(""),
  status: z.string().optional().default(""),
});

const query = schema.parse(req.query);


  // useEffect(() => {
  //   setSearchParams((prev) => {
  //     const p = new URLSearchParams(prev.toString())
  //     p.set("page", "1");
  //     p.set("limit",String(limit))
  //     return p
  //   })
  // },[debouncedSearch,statusFilter])




<Row
        gutter={[16, 16]}
        justify="center"
        style={{ marginTop: "20px", marginBottom: "20px" }}
      >
        <Col xs={22} sm={12} md={8} lg={6}>
          <Input
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="large"
          />
        </Col>
        <Col xs={22} sm={12} md={8} lg={6}>
          <Select
            placeholder="Filter by status"
            value={statusFilter || null}
            onChange={(value) => setStatusFilter(value || "")}
            options={[
              { label: "Completed", value: "completed" },
              { label: "Pending", value: "pending" },
              { label: "All", value: "" },
            ]}
            size="large"
            style={{ width: "100%" }}
          />
        </Col>
      </Row>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            width: "90%",
            maxWidth: "1200px",
            background: "#fff",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          <Table
            columns={columns}
            dataSource={data?.tasks || []}
            rowKey="id"
            pagination={{
              current: page,
              pageSize: limit,
              total: data?.total || 0,
              onChange: handlePagechange,
            }}
          />
        </div>
      </div>



{/* View Toggle Buttons */}
<div style={{ display: "flex", justifyContent: "center", marginBottom: "20px", gap: "10px" }}>
  <Button 
    type={viewMode === "table" ? "primary" : "default"} 
    onClick={() => setViewMode("table")}
  >
    Table View
  </Button>

  <Button 
    type={viewMode === "card" ? "primary" : "default"} 
    onClick={() => setViewMode("card")}
  >
    Card View
  </Button>
</div>

{/* TABLE VIEW */}
{viewMode === "table" && (
  <Table
    columns={columns}
    dataSource={data?.tasks || []}
    rowKey="id"
    pagination={{
      current: page,
      pageSize: limit,
      total: data?.total || 0,
      onChange: handlePagechange,
    }}
  />
)}

{/* CARD VIEW */}
{viewMode === "card" && (
  <div 
    style={{ 
      display: "flex", 
      flexWrap: "wrap", 
      gap: "20px",
      justifyContent: "center",
      padding: "20px"
    }}
  >
    {(data?.tasks || []).map((task) => (
      <div
        key={task.id}
        style={{
          width: "280px",
          borderRadius: "10px",
          padding: "20px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          background: "#fff",
        }}
      >
        <h3>{task.title}</h3>
        <p>{task.description}</p>

        <Tag color={task.status === "completed" ? "green" : "red"}>
          {task.status}
        </Tag>

        <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
          <Button
            type="primary"
            onClick={() => navigate(`/edit-task/${task.id}`)}
            disabled={task.status === "completed"}
          >
            Edit
          </Button>

          <Button
            className="bg-success text-light"
            onClick={() =>
              statusMutation.mutate({ id: task.id, status: "completed" })
            }
            disabled={task.status === "completed"}
          >
            Done
          </Button>

          <Button
            danger
            className="bg-danger text-light"
            onClick={() => deleteMutation.mutate(task.id)}
          >
            Delete
          </Button>
        </div>
      </div>
    ))}
  </div>
)}


{viewMode === "card" && (
  <Row gutter={[16, 16]} justify="center">
    {(data?.tasks || []).map((task) => (
      <Col xs={22} sm={12} md={8} lg={6} key={task.id}>
        <Card
          title={task.title}
          bordered={true}
          hoverable
          style={{
            width: "100%",
            borderRadius: "10px",
          }}
          extra={
            <Tag color={task.status === "completed" ? "green" : "red"}>
              {task.status}
            </Tag>
          }
        >
          <p>{task.description}</p>

          <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
            <Button
              type="primary"
              onClick={() => navigate(`/edit-task/${task.id}`)}
              disabled={task.status === "completed"}
            >
              Edit
            </Button>

            <Button
              className="bg-success text-light"
              onClick={() =>
                statusMutation.mutate({ id: task.id, status: "completed" })
              }
              disabled={task.status === "completed"}
            >
              Done
            </Button>

            <Button
              danger
              className="bg-danger text-light"
              onClick={() => deleteMutation.mutate(task.id)}
            >
              Delete
            </Button>
          </div>
        </Card>
      </Col>
    ))}
  </Row>
)}
