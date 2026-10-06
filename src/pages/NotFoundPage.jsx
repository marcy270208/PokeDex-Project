import { Link } from "react-router-dom";
import { playUiSound } from "../sounds.js";

function NotFoundPage() {
  return (
    <div className="notfound">
      <span className="pokeball" aria-hidden="true" />
      <p>There's nothing here.</p>
      <Link to="/" className="back-link" onClick={() => playUiSound("back")}>
        ← Back to list
      </Link>
    </div>
  );
}

export default NotFoundPage;
