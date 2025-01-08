import React from "react";
import { Container, Grid, Box, Typography, IconButton } from "@mui/material";
import { LinkedIn, Facebook, Instagram, Twitter } from "@mui/icons-material";

const Footer = () => {
  return (
    <Box
      component="footer"
      className="bg-purple-900 text-white py-6 mt-10"
      sx={{
        position: "relative", // Ensures it stays within the content flow
        bottom: 0, // Stick it to the bottom if content doesn't fill the screen
        width: "100%", // Ensure full width
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-between">
          {/* Column 1 - Copyright */}
          <Grid item xs={12} md={4}>
            <Typography variant="body1" align="center" className="text-gray-300">
              &copy; {new Date().getFullYear()} MeetSpot. All rights reserved.
            </Typography>
          </Grid>

          {/* Column 2 - Social Media Icons */}
          <Grid item xs={12} md={4} className="flex justify-center">
            <IconButton
              component="a"
              href="https://www.facebook.com"
              target="_blank"
              color="inherit"
              aria-label="Facebook"
            >
              <Facebook />
            </IconButton>
            <IconButton
              component="a"
              href="https://www.twitter.com"
              target="_blank"
              color="inherit"
              aria-label="Twitter"
            >
              <Twitter />
            </IconButton>
            <IconButton
              component="a"
              href="https://www.instagram.com"
              target="_blank"
              color="inherit"
              aria-label="Instagram"
            >
              <Instagram />
            </IconButton>
            <IconButton
              component="a"
              href="https://www.linkedin.com"
              target="_blank"
              color="inherit"
              aria-label="LinkedIn"
            >
              <LinkedIn />
            </IconButton>
          </Grid>

          {/* Column 3 - Additional Links (optional) */}
          <Grid item xs={12} md={4}>
            <Grid container direction="column" spacing={1} alignItems="center">
              <Typography variant="body2" className="text-gray-300">
                <a href="/about" className="text-white hover:text-gray-300">
                  About Us
                </a>
              </Typography>
              <Typography variant="body2" className="text-gray-300">
                <a href="/contact" className="text-white hover:text-gray-300">
                  Contact
                </a>
              </Typography>
              <Typography variant="body2" className="text-gray-300">
                <a href="/privacy-policy" className="text-white hover:text-gray-300">
                  Privacy Policy
                </a>
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Container>
      {/* <Header className="absolute top-0 left-0 w-full z-10" />
                    <div className="relative flex items-center h-screen">
                        <div className="flex-1 text-left p-8 pt-20">
                            <motion.h1 initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1 }} className="text-5xl font-bold text-white mb-4">
                                Connect, Collaborate, and Meet Anywhere
                            </motion.h1>
                            <motion.p initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1.2 }} className="text-white text-lg mb-6">
                                Easy location-based meeting spot suggestions for seamless connections.
                            </motion.p>
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }}>
                                <Link to="/meeting-point">
                                    <button className="bg-pink-600 hover:bg-pink-700 text-white py-2 px-6 rounded-lg transition duration-300">
                                        Get Started
                                    </button>
                                </Link>
                            </motion.div>
                        </div>
                        <div className="flex-1 h-full flex justify-center items-center">
                            <motion.img
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 1 }}
                                src={homepageImage}
                                alt="MeetSpot Map Illustration"
                                className="object-contain max-h-full"
                            />
                        </div>
                    </div> */}
    </Box>
    
  );
};

export default Footer;