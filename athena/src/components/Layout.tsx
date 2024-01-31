import { Container } from "@mui/material";
import React from "react";
import Navbar from "./Navbar";
import SnackBar from "./SnackBar";
/**
 * A layout that contains a navbar, a container that pads the content to from the sides of the web page, and a snack bar for displaying feedback.
 * If the width of the screen is less than 700 pixels the navbar will be removed. As this version of the page is used in an Embedded web view in Aphrodite when sending VC to the mobile app.
 * @param children The components to be displayed inside the layout component.
 */
const Layout = ({ children }: { children?: React.ReactNode }) => {
  const [width, setWidth] = React.useState(-1);
  const breakpoint = 700;
  React.useEffect(() => {
    setWidth(window.innerWidth)
    const handleResizeWindow = () => setWidth(window.innerWidth);
    // subscribe to window resize event "onComponentDidMount"
    window.addEventListener("resize", handleResizeWindow);
    return () => {
      // unsubscribe "onComponentDestroy"
      window.removeEventListener("resize", handleResizeWindow);
    };
  }, []);
  if(width < 0) return <></>
  if (width < breakpoint) {
    return (
    <>
      <Container maxWidth="xl">{children}</Container>
      <SnackBar />
    </>
    );
  }
  return (
  <>
    <Navbar />
    <Container maxWidth="xl">{children}</Container>
    <SnackBar />
  </>
  );
};
export default Layout;