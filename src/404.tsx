import { Helmet } from "react-helmet";
import "./404.css";

const NotFoundPage = () => {
  return (
    <div className="not-found-container">
      <Helmet>
        <title>404 - Stranica nije pronađena</title>
      </Helmet>
    </div>
  );
};

export default NotFoundPage;
