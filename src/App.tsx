import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import NotFoundPage from "./404";

function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState("100vh");
  const [people, setPeople] = useState([{ id: Date.now(), name: "" }]);
  const [formKey, setFormKey] = useState(Date.now());
  const [isLoading, setIsLoading] = useState(false);

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

  const addPerson = () => {
    setPeople([...people, { id: Date.now(), name: "" }]);
  };

  const removePerson = (id: number) => {
    setPeople(people.filter((person) => person.id !== id));
  };

  const handleNameChange = (id: number, newName: string) => {
    setPeople(
      people.map((person) =>
        person.id === id ? { ...person, name: newName } : person
      )
    );
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const peopleNames = people.map((person) => person.name).join(", ");
    formData.append("People", peopleNames);
    formData.append("Count", people.length.toString());

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
        setPeople([{ id: Date.now(), name: "" }]);
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
  };

  const InvitationsForm = () => (
    <div
      className="container"
      ref={containerRef}
      style={{ height: containerHeight }}
    >
      <form className="form" onSubmit={handleSubmit} key={formKey}>
        <div className="form-content-first">
          <div className="input-bck">
            <input
              type="text"
              name="Phone"
              placeholder="Broj mobitela"
              required
            />
          </div>
          <div className="input-bck">
            <input
              type="text"
              name="Name"
              placeholder="Ime i prezime"
              required
            />
          </div>
          <div className="people-section">
            {people.map((person) => (
              <div key={person.id} className="input-bck person-input">
                <input
                  type="text"
                  placeholder="Ime i prezime"
                  value={person.name}
                  onChange={(e) => handleNameChange(person.id, e.target.value)}
                />
                <button
                  type="button"
                  className="delete-button"
                  onClick={() => removePerson(person.id)}
                >
                  <img src="/trash.svg" alt="Delete" />
                </button>
              </div>
            ))}
          </div>
          <div className="btn-bck">
            <button type="button" className="add-button" onClick={addPerson}>
              + Dodaj osobu
            </button>
          </div>
          <p>* dodati i djecu</p>
        </div>
        <button
          type="submit"
          className={`submit-button ${isLoading ? "loading" : ""}`}
          disabled={isLoading}
        >
          {isLoading ? <div className="spinner"></div> : "POTVRDI DOLAZAK"}
        </button>
      </form>
    </div>
  );

  const InvitationForm = () => (
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

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/404" />} />
        <Route path="/pozivnice" element={<InvitationsForm />} />
        <Route path="/pozivnica" element={<InvitationForm />} />
        <Route path="/404" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
