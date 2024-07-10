import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import "./App.css";

function Invitations() {
  const containerRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const [containerHeight, setContainerHeight] = useState("100vh");
  const [people, setPeople] = useState([{ id: Date.now(), name: "" }]);
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
    setPeople((prevPeople) =>
      prevPeople.map((person) =>
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
        setPeople([{ id: Date.now(), name: "" }]);
        if (phoneRef.current) phoneRef.current.value = "";
        if (nameRef.current) nameRef.current.value = "";
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

  return (
    <div
      className="container"
      ref={containerRef}
      style={{ height: containerHeight }}
    >
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-content-first">
          <div className="input-bck">
            <input
              type="text"
              name="Phone"
              placeholder="Broj mobitela"
              required
              ref={phoneRef}
            />
          </div>
          <div className="input-bck">
            <input
              type="text"
              name="Name"
              placeholder="Ime i prezime"
              required
              ref={nameRef}
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
}

export default Invitations;
