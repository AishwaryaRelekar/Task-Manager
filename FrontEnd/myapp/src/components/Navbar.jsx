import { Layout, Row, Col, Button, Menu } from "antd";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <>
      <Layout className="navbar-expand bg-light shadow">
        <Row
          align="middle"
          style={{
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            padding: "10px",
          }}
        >
          <Col span={1} className="ms-2">
            <h4 className="logo-text">TaskManager</h4>
          </Col>

          {role === "user" && (
            <>
              <Col className="ms-auto me-2">
                <Link to="/create-task">
                  <Button type="primary" className="nav-btn">
                    Create Task
                  </Button>
                </Link>
              </Col>
              <Col>
                <Link to="/view-task">
                  <Button type="primary" className="nav-btn">
                    View Task
                  </Button>
                </Link>
              </Col>
              <Col className="ms-auto">
                <Button
                  type="default"
                  className="nav-btn"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </Col>
            </>
          )}
          {!role && (
            <>
              <Col span={2} className="ms-auto">
                <Link to="/login">
                  <Button type="primary" className="nav-btn">
                    Login
                  </Button>
                </Link>
              </Col>
            </>
          )}
        </Row>
      </Layout>
    </>
  );
};

export default Navbar;
