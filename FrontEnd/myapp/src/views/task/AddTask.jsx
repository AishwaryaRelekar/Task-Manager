import { Button, Form, Input } from "antd";
import React from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { addTask } from "../validation/validation";

function AddTask() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const taskMutation = useMutation({
    mutationFn: async (taskData) => {
      const res = await axios.post(
        "http://localhost:5050/api/task/addTask",
        taskData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("task added successfully");
      navigate("/view-task");
    },
    onError: () => {
    
        toast.error("failed to add");
      
    },
  });

  const onFinish = async (values) => {
    const result = addTask.safeParse(values);
    if (!result.success) {
      const e = result.error.flatten().fieldErrors;
      Object.keys(e).forEach((f) => {
        form.setFields([
          {
            name: f,
            errors: [e[f][0]],
          },
        ]);
      });
      return;
    }
    taskMutation.mutate(result.data);
  };
  return (
    <>
      <div className="container mt-5">
        <div className="row justify-content-center ">
          <div className="col-lg-6 col-md-8 col-sm-12">
            <div className="p-4 border rounded shadow-sm">
              <Form layout="vertical" onFinish={onFinish} form={form}>
                <Form.Item
                  label="Title"
                  name="title"
                  rules={[{ required: true, message: "Please input title" }]}
                >
                  <Input placeholder="Enter Tilte"></Input>
                </Form.Item>
                <Form.Item
                  label="Description"
                  name="description"
                  rules={[{ required: true, message: "Please input text" }]}
                >
                  <Input placeholder="Enter description"></Input>
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" block>
                    Submit
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddTask;
