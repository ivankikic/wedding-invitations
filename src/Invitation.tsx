import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import emailjs from "emailjs-com";
import "./App.css";

function Invitation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState("100vh");
  const [formKey, setFormKey] = useState(Date.now());
  const [isLoading, setIsLoading] = useState(false);

  emailjs.init("uuPVBUyllUYPK4QH2");

  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        const image = new Image();
        image.src = "/Frame.svg";
        image.onload = () => {
          const aspectRatio = image.height / image.width;
          const newHeight = window.innerWidth * aspectRatio;
          setContainerHeight(`${newHeight}px`);
        };
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);

    return () => {
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    formData.append("Count", "1");
    const phone = formData.get("Phone");
    const name = formData.get("Name");

    fetch(
      "https://script.google.com/macros/s/AKfycbz4muYmzdeXd0nJAt32DKQsDv6TAgL0xYmSOR9iY7V-r273SwcyZqTCwMDs-M8aeb7G/exec",
      {
        method: "POST",
        body: formData,
      }
    )
      .then(() => {
        toast.success("Hvala Vam što ste potvrdili svoj dolazak! :)", {
          duration: 3000,
          position: "top-center",
        });
        setFormKey(Date.now());
        window.scrollTo(0, 0);
      })
      .catch((error) => {
        console.error("Error submitting form:", error);
        toast.error("Form submission failed.", {
          duration: 3000,
          position: "top-center",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });

    await emailjs.send("service_gol57vs", "template_n8gx0il", {
      from_name: "Website",
      message: `Phone: ${phone}, Name: ${name}`,
    });
    setIsLoading(false);
  };

  return (
    <div
      className="container"
      ref={containerRef}
      style={{ height: containerHeight }}
    >
      <form
        className="form"
        onSubmit={handleSubmit}
        key={formKey}
        style={{ top: "73%" }}
      >
        <div className="input-bck">
          <input
            type="text"
            name="Phone"
            placeholder="Broj mobitela"
            required
          />
        </div>
        <div className="input-bck">
          <input type="text" name="Name" placeholder="Ime i prezime" required />
        </div>
        <button
          type="submit"
          className={`submit-button ${isLoading ? "loading" : ""}`}
          style={{ marginTop: "50px" }}
          disabled={isLoading}
        >
          {isLoading ? <div className="spinner"></div> : "POTVRDI DOLAZAK"}
        </button>
      </form>
    </div>
  );
}

export default Invitation;
