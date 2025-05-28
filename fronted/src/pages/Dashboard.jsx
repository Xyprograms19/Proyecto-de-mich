import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import Header from "../components/ui/Header";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Box,
  Container,
  IconButton,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import authService from "../services/authService";

const Dashboard = () => {
  const navigate = useNavigate();
  const { isLightTheme } = useTheme();
  const isMobile = useMediaQuery("(max-width:600px)");

  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    authService.logout();
    navigate("/");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: isLightTheme ? "#f3f4f6" : "#121212",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header />

      {/* Sección de Bienvenida */}
      <Box
        sx={{
          backgroundColor: isLightTheme ? "#ffffff" : "#1e1e1e",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          padding: isMobile ? "1.5rem 0.5rem" : "2rem 1rem",
          position: "relative",
        }}
      >
        <Container maxWidth="lg">
          <Tooltip title="Cerrar sesión">
            <IconButton
              onClick={handleLogout}
              aria-label="cerrar sesión"
              sx={{
                backgroundColor: isLightTheme
                  ? "rgba(255, 255, 255, 0.9)"
                  : "rgba(50, 50, 50, 0.9)",
                color: isLightTheme ? "#d32f2f" : "#f44336",
                boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                "&:hover": {
                  backgroundColor: isLightTheme ? "#f5f5f5" : "#424242",
                },
                position: "absolute",
                top: isMobile ? "0.5rem" : "1rem",
                right: isMobile ? "0.5rem" : "2rem",
                zIndex: 10,
                width: isMobile ? 36 : 48,
                height: isMobile ? 36 : 48,
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={isMobile ? "20" : "24"}
                height={isMobile ? "20" : "24"}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </IconButton>
          </Tooltip>

          <Typography
            variant={isMobile ? "h5" : "h4"}
            sx={{
              fontWeight: "bold",
              color: isLightTheme ? "#333333" : "#ffffff",
              textAlign: "center",
              paddingTop: isMobile ? "0.5rem" : 0,
              paddingRight: isMobile ? "2rem" : 0,
            }}
          >
            {currentUser
              ? `¡Bienvenido, ${currentUser.firstName || currentUser.username}!`
              : "¡Bienvenido al Panel de Gestión!"}
          </Typography>

          <Typography
            variant={isMobile ? "body2" : "subtitle1"}
            sx={{
              color: isLightTheme ? "#666666" : "#aaaaaa",
              textAlign: "center",
              marginTop: "0.5rem",
              paddingRight: isMobile ? "2rem" : 0,
            }}
          >
            Organiza tus tareas y revisa tus horas extras de manera eficiente.
          </Typography>
        </Container>
      </Box>

      {/* Contenedor principal de tarjetas */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          padding: isMobile ? "1rem" : "2rem",
        }}
      >
        <Container maxWidth="lg">
          <Grid
            container
            spacing={isMobile ? 2 : 3}
            justifyContent="center"
            sx={{
              marginTop: isMobile ? "0.5rem" : "1rem",
            }}
          >
            {/* Tarjeta Horas Extras */}
            <Grid item xs={12} sm={6} md={4} sx={{ display: "flex" }}>
              <Card
                sx={{
                  borderRadius: 2,
                  boxShadow: "0 6px 15px rgba(0, 0, 0, 0.1)",
                  textAlign: "center",
                  transition: "transform 0.3s",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  "&:hover": { transform: isMobile ? "none" : "scale(1.05)" },
                  backgroundColor: isLightTheme ? "#ffffff" : "#333333",
                  width: "100%",
                }}
              >
                <CardContent
                  sx={{
                    padding: isMobile ? "1rem" : "2rem",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <img
                    src="/utils/imgRegistro.jpg"
                    alt="Registrar Horas"
                    style={{
                      width: isMobile ? "90%" : "80%",
                      maxWidth: "250px",
                      borderRadius: "8px",
                      display: "block",
                      margin: "0 auto",
                    }}
                  />
                  <Typography
                    variant={isMobile ? "subtitle1" : "h6"}
                    sx={{
                      fontWeight: "medium",
                      color: isLightTheme ? "#333333" : "#ffffff",
                      marginTop: "1rem",
                    }}
                  >
                    Registrar Horas Extras
                  </Typography>
                  <Typography
                    variant={isMobile ? "caption" : "body2"}
                    sx={{
                      color: isLightTheme ? "#777777" : "#bbbbbb",
                      mt: 1,
                    }}
                  >
                    Mantén un registro claro y rápido de tus horas adicionales.
                  </Typography>
                  <Button
                    onClick={() => navigate("/registro-horas")}
                    variant="contained"
                    sx={{
                      marginTop: "1rem",
                      background: isLightTheme
                        ? "linear-gradient(45deg, #32a852, #4caf50)"
                        : "linear-gradient(45deg, #2a8a44, #3d9142)",
                      color: "#ffffff",
                      "&:hover": {
                        background: isLightTheme
                          ? "linear-gradient(45deg, #28a745, #3e9e4a)"
                          : "linear-gradient(45deg, #217a38, #2d8136)",
                      },
                      fontSize: isMobile ? "0.75rem" : "0.875rem",
                      padding: isMobile ? "6px 16px" : "8px 22px",
                    }}
                    fullWidth
                  >
                    Ir a Registro
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            {/* Tarjeta Reportes */}
            <Grid item xs={12} sm={6} md={4} sx={{ display: "flex" }}>
              <Card
                sx={{
                  borderRadius: 2,
                  boxShadow: "0 6px 15px rgba(0, 0, 0, 0.1)",
                  textAlign: "center",
                  transition: "transform 0.3s",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  "&:hover": { transform: isMobile ? "none" : "scale(1.05)" },
                  backgroundColor: isLightTheme ? "#ffffff" : "#333333",
                  width: "100%",
                }}
              >
                <CardContent
                  sx={{
                    padding: isMobile ? "1rem" : "2rem",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <img
                    src="/utils/img2.jpg"
                    alt="Reportes"
                    style={{
                      width: isMobile ? "90%" : "80%",
                      maxWidth: "350px",
                      borderRadius: "8px",
                      display: "block",
                      margin: "0 auto",
                    }}
                  />
                  <Typography
                    variant={isMobile ? "subtitle1" : "h6"}
                    sx={{
                      fontWeight: "medium",
                      color: isLightTheme ? "#333333" : "#ffffff",
                      marginTop: "1rem",
                    }}
                  >
                    Ver Reportes
                  </Typography>
                  <Typography
                    variant={isMobile ? "caption" : "body2"}
                    sx={{
                      color: isLightTheme ? "#777777" : "#bbbbbb",
                      mt: 1,
                    }}
                  >
                    Consulta y analiza tus reportes de manera clara y eficaz.
                  </Typography>
                  <Button
                    onClick={() => navigate("/reportes")}
                    variant="contained"
                    sx={{
                      marginTop: "1rem",
                      background: isLightTheme
                        ? "linear-gradient(45deg, #2196f3, #42a5f5)"
                        : "linear-gradient(45deg, #1a78c2, #3485c6)",
                      color: "#ffffff",
                      "&:hover": {
                        background: isLightTheme
                          ? "linear-gradient(45deg, #1976d2, #3185de)"
                          : "linear-gradient(45deg, #156cb4, #2775cb)",
                      },
                      fontSize: isMobile ? "0.75rem" : "0.875rem",
                      padding: isMobile ? "6px 16px" : "8px 22px",
                    }}
                    fullWidth
                  >
                    Ver Reportes
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            {/* Tarjeta Historial */}
            <Grid item xs={12} sm={6} md={4} sx={{ display: "flex" }}>
              <Card
                sx={{
                  borderRadius: 2,
                  boxShadow: "0 6px 15px rgba(0, 0, 0, 0.1)",
                  textAlign: "center",
                  transition: "transform 0.3s",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  "&:hover": { transform: isMobile ? "none" : "scale(1.05)" },
                  backgroundColor: isLightTheme ? "#ffffff" : "#333333",
                  width: "100%",
                }}
              >
                <CardContent
                  sx={{
                    padding: isMobile ? "1rem" : "2rem",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <img
                    src="/utils/img3.jpg"
                    alt="Historial"
                    style={{
                      width: isMobile ? "90%" : "80%",
                      maxWidth: "250px",
                      borderRadius: "8px",
                      display: "block",
                      margin: "0 auto",
                    }}
                  />
                  <Typography
                    variant={isMobile ? "subtitle1" : "h6"}
                    sx={{
                      fontWeight: "medium",
                      color: isLightTheme ? "#333333" : "#ffffff",
                      marginTop: "1rem",
                    }}
                  >
                    Ver Historial
                  </Typography>
                  <Typography
                    variant={isMobile ? "caption" : "body2"}
                    sx={{
                      color: isLightTheme ? "#777777" : "#bbbbbb",
                      mt: 1,
                    }}
                  >
                    Revisa el historial completo de tus actividades.
                  </Typography>
                  <Button
                    onClick={() => navigate("/historial")}
                    variant="contained"
                    sx={{
                      marginTop: "1rem",
                      background: isLightTheme
                        ? "linear-gradient(45deg, #9c27b0, #ba68c8)"
                        : "linear-gradient(45deg, #7b1fa2, #9954b9)",
                      color: "#ffffff",
                      "&:hover": {
                        background: isLightTheme
                          ? "linear-gradient(45deg, #7b1fa2, #9f54c3)"
                          : "linear-gradient(45deg, #6a1b8a, #8a47a8)",
                      },
                      fontSize: isMobile ? "0.75rem" : "0.875rem",
                      padding: isMobile ? "6px 16px" : "8px 22px",
                    }}
                    fullWidth
                  >
                    Ver Historial
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard;
