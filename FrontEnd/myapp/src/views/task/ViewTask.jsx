import React, { useCallback, useEffect, useState } from "react";
import { Card, Table, Button, Select, Tag, Input, Row, Col } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../api";

function ViewTask() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [view, setView] = useState("table");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebounce] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page") || 1;
  const limit = searchParams.get("limit") || 5;

  useEffect(() => {
    const id = setTimeout(() => setDebounce(search), 500);
    return () => clearTimeout(id);
  }, [search]);

  const fetchTask = useCallback(async () => {
    const res = await axios.get(
      `${API_BASE_URL}/task/getTasks?page=${page}&limit=${limit}&search=${debouncedSearch}&status=${statusFilter}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );
    return res.data;
  }, [page, limit, debouncedSearch, statusFilter]);

  let { data } = useQuery({
    queryKey: ["task", page, limit, debouncedSearch, statusFilter],
    queryFn: fetchTask,
  });

  //   console.log(data);

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await axios.delete(`${API_BASE_URL}/task/deleteTask/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    },
    onSuccess: () => {
      toast.success("task deleted successfully");
      queryClient.invalidateQueries(["task"]);
    },
    onError: () => {
      toast.error("failed to delete task");
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => {
      return axios.put(
        `${API_BASE_URL}/task/updateStatus/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["task"]);
    },
  });

  const columns = [
    {
      title: "SI.No",
      dataIndex: "si_num",
      key: "si_num",
      render: (_, record, index) => (page - 1) * limit + index + 1,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "desc",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        {
          text: "Completed",
          value: "completed",
        },
        { text: "Pending", value: "pending" },
      ],

      onFilter: (value, record) => record.status === value,
      render: (status) =>
        status === "completed" ? (
          <Tag color="green">Completed</Tag>
        ) : (
          <Tag color="red">Pending</Tag>
        ),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_, record) => (
        // console.log({ "record.id": record.id });

        <>
          <Button
            type="primary"
            onClick={() => navigate(`/edit-task/${record.id}`)}
            disabled={record.status === "completed"}
          >
            Edit
          </Button>
          <Button
            color="cyan"
            variant="solid"
            className="ms-2 text-dark  "
            onClick={() =>
              statusMutation.mutate({ id: record.id, status: "completed" })
            }
            disabled={record.status === "completed"}
          >
            Completed
          </Button>
          <Button
            className="ms-2 bg-danger text-light"
            danger
            onClick={() => deleteMutation.mutate(record.id)}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  const handlePagechange = (newpage) => {
    setSearchParams({ page: newpage, limit });
  };
  return (
    <>
      <div className="container mt-5">
        <div className="mt-5">
          <Button
            type={view === "table" ? "primary" : "default"}
            onClick={() => setView("table")}
          >
            Table View
          </Button>

          <Button
            type={view === "card" ? "primary" : "default"}
            onClick={() => setView("card")}
            className="ms-3"
          >
            Card View
          </Button>
        </div>
        <Row gutter={16} className="mt-5 mb-1">
          <Col xs={22} sm={12} md={8} lg={6} span={6}>
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

        <div className="border shadow-sm">
          {view === "table" && (
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
            ></Table>
          )}
        </div>

        {view === "card" && (
          <Row gutter={[16, 16]} justify="center" className="mt-5">
            {(data?.tasks || []).map((task) => (
              <Col xs={22} sm={12} md={8} lg={6} key={task.id}>
                <Card
                  title={task.title}
                  hoverable
                  className="w-100 border"
                  extra={
                    <Tag color={task.status === "completed" ? "green" : "red"}>
                      {task.status}
                    </Tag>
                  }
                >
                  <p>{task.description}</p>

                  <div className="mt-2 d-flex gap-3">
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
                        statusMutation.mutate({
                          id: task.id,
                          status: "completed",
                        })
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
      </div>
    </>
  );
}

export default ViewTask;
