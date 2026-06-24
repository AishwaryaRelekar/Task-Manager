import { useMutation } from "@tanstack/react-query";
import { Button, Form, Input } from "antd";
import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginVaidate } from "../../validation/validation";


function ForgotPassword() {
  const navigate = useNavigate();
  const [form] = Form.useForm()
  const forgetPwd = useMutation({
    mutationFn: async (data) => {
      const res = await axios.post(`http://localhost:5050/api/forgotPwd`, data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("password updated successfully");
      navigate("/login");
    },
    onError: () => toast.error("email id not registered"),
  });

 const onFinish = async (values) => {
     const result = loginVaidate.safeParse(values);
 
     if (!result.success) {
       const fieldErrors = result.error.flatten().fieldErrors;
       Object.keys(fieldErrors).forEach((field) => {
         form.setFields([
           {
             name: field,
             errors: [fieldErrors[field][0]],
           },
         ]);
       });
       return;
     }
     forgetPwd.mutate(result.data);
   };

  return (
    <div className="container my-5 w-75">
      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8 col-sm-12">
          <div className="p-4 border rounded bg-white shadow-sm">
            <Form layout="vertical" onFinish={onFinish} form={form}>
              <Form.Item
                label="Enter your Mail"
                name="email"
                rules={[{ required: true, message: "enter ur mail" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Enter new Password"
                name="password"
                rules={[{ required: true, message: "enter ur mail" }]}
              >
                <Input.Password />
              </Form.Item>
              <Button type="primary" block htmlType="submit">
                Submit
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
