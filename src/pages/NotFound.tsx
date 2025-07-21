import { Link } from "react-router-dom"
import MobileWarning from "../components/MobileWarning";
const NotFound = () => {
    return (
        <div>
            <MobileWarning />
            <h1>Not Found</h1>
            <Link to="/">Back to home</Link>
        </div>
    )
}

export default NotFound