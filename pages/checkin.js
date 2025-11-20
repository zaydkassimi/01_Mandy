import { useEffect, useRef, useState } from "react";
import { parse } from "cookie";
import { verifyToken } from "../lib/auth";

export default function CheckInPage({ user }) {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [stream, setStream] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    let mounted = true;
    async function start() {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: false });
        if (!mounted) {
          s.getTracks().forEach((t) => t.stop());
          return;
        }
        setStream(s);
        if (videoRef.current) videoRef.current.srcObject = s;
      } catch (e) {
        setStatus("Camera access denied or unavailable: " + e.message);
      }
    }
    start();
    return () => {
      mounted = false;
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  function capturePhoto() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return null;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.8);
  }

  function getGeo() {
    return new Promise((resolve) => {
      if (!navigator.geolocation) return resolve({ lat: null, lng: null });
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => resolve({ lat: null, lng: null }),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    });
  }

  async function submit(action) {
    setStatus("Preparing...");
    const photo = capturePhoto();
    if (!photo) {
      setStatus("Unable to capture photo. Make sure camera is allowed and visible.");
      return;
    }
    const geo = await getGeo();
    const now = new Date();
    const isLate = now.getHours() > 9 || (now.getHours() === 9 && now.getMinutes() > 15);
    let lateRequested = false;
    if (isLate) {
      lateRequested = confirm("It looks like you are late. Do you want to request admin approval?");
    }
    setStatus("Uploading...");
    const res = await fetch("/api/attendance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action,
        photo,
        lat: geo.lat,
        lng: geo.lng,
        clientTimestamp: now.toISOString(),
        lateRequested
      })
    });
    const data = await res.json();
    if (data.ok) {
      setStatus(`Success: ${action} recorded at ${new Date(data.attendance.timestamp).toLocaleString()}`);
    } else {
      setStatus("Error: " + (data.message || "Upload failed"));
    }
  }

  return (
    <main>
      <h1>Check In / Check Out</h1>
      <div className="card">
        <p>Signed in as <strong>{user.email}</strong></p>
        <div>
          <video ref={videoRef} autoPlay playsInline style={{ width: "100%", maxWidth: 480, borderRadius: 8, background: "#000" }} />
          <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>
        <div style={{ marginTop: 12 }}>
          <button className="btn" onClick={() => submit("checkin")}>Check In</button>
          <button className="btn secondary" onClick={() => submit("checkout")} style={{ marginLeft: 8 }}>Check Out</button>
        </div>
        <div style={{ marginTop: 12 }}>{status}</div>
      </div>
    </main>
  );
}

export function getServerSideProps({ req }) {
  const cookies = req.headers.cookie ? parse(req.headers.cookie || "") : {};
  const token = cookies.token;
  const user = token ? verifyToken(token) : null;
  if (!user) {
    return { redirect: { destination: "/login", permanent: false } };
  }
  return { props: { user } };
}


