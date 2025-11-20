import { parse } from "cookie";
import { verifyToken } from "../lib/auth";

export default function Home() {
  return null;
}

export function getServerSideProps({ req }) {
  const cookies = req.headers.cookie ? parse(req.headers.cookie || "") : {};
  const token = cookies.token;
  const user = token ? verifyToken(token) : null;
  if (!user) {
    return { redirect: { destination: "/login", permanent: false } };
  }
  if (user.role === "admin") {
    return { redirect: { destination: "/admin", permanent: false } };
  }
  return { redirect: { destination: "/calendar", permanent: false } };
}


