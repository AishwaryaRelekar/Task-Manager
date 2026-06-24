import React, { useState } from "react";
import { Form, Input, Button, Select } from "antd";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { Country, State, City } from "country-state-city";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { reg } from "../../validation/validation";
import { API_BASE_URL } from "../../api";

const countries = Country.getAllCountries();

function Register() {
  const [form] = Form.useForm();
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");

  const navigate = useNavigate();

  // console.log(countries, states, cities);
  // console.log(selectedCountry);

  const sendOtp = async () => {
    const email = form.getFieldValue("email");
    if (!email) return toast.error("Enter email first!");

    try {
      await axios.post(`${API_BASE_URL}/api/send-otp`, { email });
      toast.success("OTP sent!");
      setIsOtpSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send otp");
    }
  };

  const verifyOtp = async (value) => {
    setOtp(value);
    if (value.length != 6) return;
    try {
      await axios.post(`${API_BASE_URL}/api/verify-otp`, {
        email: form.getFieldValue("email"),
        otp: value,
      });
      toast.success("Email verified!");
      setIsOtpVerified(true);
    } catch (err) {
      setIsOtpVerified(false);
      toast.error(err.response?.data?.message || "Invalid otp");
    }
  };
  const registerMutation = useMutation({
    mutationFn: async (formData) => {
      return await axios.post(`${API_BASE_URL}/api/register`, formData);
    },
    onSuccess: (res) => {
      const { token, role } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      toast.success(res.message || "registration successgfull");

      navigate("/dashboard");
    },
    onError: (error) => {
      if (error.response?.data?.errors) {
        const b = error.response.data.errors;

        Object.keys(b).forEach((f) => {
          form.setFields([
            {
              name: f,
              errors: b[f],
            },
          ]);
        });
      } else {
        toast.error("user already exist");
        navigate("/login");
      }
    },
  });

  const handleCountryChange = (countryCode) => {
    setSelectedCountry(countryCode);
    const statesData = State.getStatesOfCountry(countryCode);
    setStates(statesData);
    setCities([]);
  };

  const handleStateChange = (stateCode) => {
    const citiesData = City.getCitiesOfState(selectedCountry, stateCode);
    setCities(citiesData);
  };

  const onFinish = (values) => {
    // console.log(values);
    if (!isOtpVerified) return toast.error("Verify OTP before registering.");

    if (values.password !== values.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const rs = reg.safeParse(values);
    if (!rs.success) {
      const fieldErrors = rs.error.flatten().fieldErrors;
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
    console.log(rs.data, "va");

    registerMutation.mutate(rs.data);
  };

  return (
    <>
      <div className="container my-5 ">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8 col-sm-12">
            <div className="p-4 border rounded bg-white shadow-sm shadow w-100">
              <h2 className="text-center mb-4">Registration Form</h2>
              <Form onFinish={onFinish} layout="vertical" form={form}>
                {/* Name  */}
                <Form.Item
                  label="Name"
                  name="name"
                  rules={[
                    { required: true, message: "enter name" },

                    {
                      pattern: /^[A-Za-z]+$/,
                      message: "name must only alphabets",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                {/* Email  */}
                {/* <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: "enter eamil" },
                    {
                      type: "email",
                      message: "invalid email",
                    },
                  ]}
                >
                  <Input />
                </Form.Item> */}
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[{ required: true }]}
                >
                  <div style={{ display: "flex", gap: "10px" }}>
                    <Input disabled={isOtpSent || isOtpVerified} />
                    <Button
                      type="primary"
                      onClick={sendOtp}
                      disabled={isOtpSent}
                    >
                      Send OTP
                    </Button>
                  </div>
                </Form.Item>

                {isOtpSent && (
                  <Form.Item label="Enter OTP">
                    <Input
                      value={otp}
                      onChange={(e) => verifyOtp(e.target.value)}
                      disabled={isOtpVerified}
                    />
                  </Form.Item>
                )}

                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    { required: true, message: "enter password" },
                    { min: 6, message: "password must be atleast 6 character" },
                  ]}
                >
                  <Input.Password />
                </Form.Item>
                <Form.Item
                  label="Confirm Password"
                  name="confirmPassword"
                  rules={[{ required: true, message: "confirm password" }]}
                >
                  <Input.Password />
                </Form.Item>
                <Form.Item
                  label="Country"
                  name="country"
                  rules={[{ required: true }]}
                >
                  <Select
                    showSearch
                    placeholder="Select Country"
                    onChange={handleCountryChange}
                  >
                    {countries.map((c) => (
                      <Select.Option key={c.isoCode} value={c.isoCode}>
                        {c.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  label="State"
                  name="state"
                  rules={[{ required: true }]}
                >
                  <Select
                    disabled={!states.length}
                    placeholder="Select State"
                    onChange={(value) => handleStateChange(value)}
                    showSearch
                  >
                    {states.map((state) => (
                      <Select.Option key={state.isoCode} value={state.isoCode}>
                        {state.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  label="City"
                  name="city"
                  rules={[{ required: true }]}
                >
                  <Select disabled={!cities.length} placeholder="Select City">
                    {cities.map((city) => (
                      <Select.Option key={city.name} value={city.name}>
                        {city.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Button type="primary" htmlType="submit" block>
                  Register
                </Button>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
