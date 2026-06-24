import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Form, Input } from "antd";
import React from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { addTask } from "../../validation/validation";

function EditTask() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();

  const { data } = useQuery({
    queryKey: ["task", id],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:5050/api/task/getSingleTask/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(data);

      return res.data;
    },
  });

  if (data) {
    form.setFieldsValue(data);
  } else {
    navigate("/view-task");
  }
  // useEffect(() => {
  //   if (data) {
  //     let setData = data[0];
  //     form.setFieldsValue(setData);
  //   } else {
  //     navigate("/view-task");
  //   }
  // }, [data, form]);

  const updateMutation = useMutation({
    mutationFn: async (val) => {
      const res = await axios.put(
        `http://localhost:5050/api/task/updateTask/${id}`,
        val,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success(data.message || "Updated Successfuly");

      navigate("/view-task");
    },
    onError: (error) => {
      if (error.response?.data?.errors) {
        toast.error("Failed to update");
      }
    },
  });
  const onFinish = (values) => {
    console.log(values);
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
    updateMutation.mutate(values);
  };

  return (
    <>
      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8 col-sm-12">
            <div className="p-4 border rounded shadow-sm">
              <Form layout="vertical" onFinish={onFinish} form={form}>
                <Form.Item
                  label="title"
                  name="title"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="description"
                  name="description"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item>
                  <Button htmlType="submit" className="bg-primary text-light">
                    Update
                  </Button>
                  <Button
                    htmlType="button"
                    className="ms-5 bg-danger text-light"
                    onClick={() => navigate("/view-task")}
                  >
                    Cancel
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

export default EditTask;
