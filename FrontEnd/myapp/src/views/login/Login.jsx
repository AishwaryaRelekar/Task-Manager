import React from "react";
import { Form, Input, Button } from "antd";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { loginVaidate } from "../../validation/validation";

function Login() {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const loginMutation = useMutation({
    mutationFn: async (loginData) => {
      const res = await axios.post(
        "http://localhost:5050/api/login",
        loginData
      );
      return res.data;
    },
    onSuccess: (data) => {
      console.log(data, "login data");
      toast.success(data.message || "Login Successful");
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      navigate("/dashboard");
    },
    onError: (error) => {
      const message = error.response?.data?.message;
      if (message === "User not found") {
        toast.error("email not fond");
      } else if (message === "Wrong password") toast.error("Wrong password");
      else toast.error("Login failed");
    },
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
    loginMutation.mutate(result.data);
  };
  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8 col-sm-12">
          <div className="p-4 border rounded bg-white shadow-sm">
            <h2 className="text-center mb-4">Login Form</h2>

            <Form layout="vertical" onFinish={onFinish} form={form}>
              {/* Email */}
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please input your email!" },
                  { type: "email", message: "Please enter a valid email!" },
                ]}
              >
                <Input placeholder="example@email.com" />
              </Form.Item>

              {/* Password */}
              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}
              >
                <Input.Password placeholder="Enter your password" />
              </Form.Item>

              {/* Submit Button */}
              <Form.Item>
                <Button type="primary" htmlType="submit" className="w-100">
                  Login
                </Button>
              </Form.Item>

              <div className="d-flex">
                <p>Don't have an account?</p>
                <Link to="/" className="ms-2">
                  Register
                </Link>
                <Link className="ms-5" to="/forgetPassword">
                  <p>Forgot password</p>
                </Link>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
