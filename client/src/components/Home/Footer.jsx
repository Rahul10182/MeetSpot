import React from "react";
import { Box, Typography, Link, Container, Divider } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        background: "linear-gradient(90deg, #3f51b5, #1a237e)",
        color: "#ffffff",
        py: 6, // Increased height
        mt: "auto",
      }}
    >
      <Container maxWidth="lg">
        {/* Top Section: Logo, Navigation, and Social Media */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            alignItems: "flex-start",
            gap: 3,
          }}
        >
          {/* Logo and Name */}
          <Box>
            <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
              MeetSpot
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.7, maxWidth: 300 }}>
              Bringing people together, meet people. Simplify your
              scheduling process with us.
            </Typography>
          </Box>

          {/* Navigation Links */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <Typography variant="h6" sx={{ mb: 1 }}>
              Quick Links
            </Typography>
            <Link href="/about" underline="hover" sx={{ color: "#ffffff" }}>
              About Us
            </Link>
            <Link href="/features" underline="hover" sx={{ color: "#ffffff" }}>
              Features
            </Link>
            <Link href="/contact" underline="hover" sx={{ color: "#ffffff" }}>
              Contact
            </Link>
            <Link href="/faq" underline="hover" sx={{ color: "#ffffff" }}>
              FAQs
            </Link>
          </Box>

          {/* Social Media */}
          <Box>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Follow Us
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: 2,
              }}
            >
              <Link
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                sx={{ color: "#ffffff", fontSize: "24px" }}
              >
                <i className="fab fa-facebook"></i>
              </Link>
              <Link
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                sx={{ color: "#ffffff", fontSize: "24px" }}
              >
                <i className="fab fa-twitter"></i>
              </Link>
              <Link
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                sx={{ color: "#ffffff", fontSize: "24px" }}
              >
                <i className="fab fa-linkedin"></i>
              </Link>
              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                sx={{ color: "#ffffff", fontSize: "24px" }}
              >
                <i className="fab fa-instagram"></i>
              </Link>
            </Box>
          </Box>
        </Box>

        {/* Divider */}
        <Divider sx={{ my: 4, borderColor: "rgba(255, 255, 255, 0.2)" }} />

        {/* Bottom Section: Contact Information */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: 1,
          }}
        >
          <Typography variant="h6">Get in Touch</Typography>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            Email: <Link href="mailto:support@meetspot.com" sx={{ color: "#ffffff" }}>support@meetspot.com</Link>
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            Instagram:{" "}
            <Link
              href="https://instagram.com/meetspot"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: "#ffffff" }}
            >
              @meetspot
            </Link>
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            Address: 123 Meeting Lane, Collaboration City, 56789
          </Typography>
        </Box>

        {/* Copyright */}
        <Box sx={{ textAlign: "center", mt: 3 }}>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            &copy; {new Date().getFullYear()} MeetSpot. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
