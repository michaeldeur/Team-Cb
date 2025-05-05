import { NavLink, useNavigate } from "react-router-dom";
import "../../../client/dist/css/index.css";
const JoinRoom = (props: { sendMessage: any }) => { // index.html
    let uid = localStorage.getItem("UID");
    localStorage.clear();
    localStorage.setItem("UID", uid!);
    let sendMessage = props.sendMessage;
    return (<>
        <div className="index">
            <h1>Got Scrum?</h1>
            <Form sendMessage={sendMessage} type="join" />
            <footer>
                {/* <p>Create your own room for free here: <NavLink to={"/create-room"}>Create New Room</NavLink></p>  */}
            </footer>

        </div>
    </>);
}
// const CreateRoom = (props: { sendMessage: any }) => { // create room page
//     let sendMessage = props.sendMessage;
//     return (<>
//         <div className="index">
//             <h1>Create Room</h1>
//             <Form sendMessage={sendMessage} type="create" />
//             <footer>
//                 <p>Join a room for free here: <NavLink to={"/"}>Join Room</NavLink></p>
//             </footer>
//         </div>
//     </>)
// }
const Form = (props: { sendMessage: any, type: string; }) => { // type is either create or join
    let navigate = useNavigate();
    let action: string;
    let nameField: string;
    let name: string;
    let buttonText: string;
    let sendMessage = props.sendMessage;

    if (props.type == "join") {
        action = "/estimate";
        nameField = "Name:"
        buttonText = "Estimate!"
    } else if (props.type == "create") {
        action = "/";
        nameField = "Room Name:"
        buttonText = "Submit!"
    } else {
        return null;
    }
    return (
        <form onSubmit={() => {
            localStorage.setItem("name", name);
            sendMessage(`addUser_${localStorage.getItem("UID")}_${name}`)
            navigate(action);
        }}>
            <label htmlFor="name">{nameField}</label>
            <input type="text" id="name" onChange={event => {name = event.target.value}}required/><br /><br />
            {/* <label htmlFor="roomnum">Room ID:</label>
            <input type="text" id="roomnum" required /><br /><br /> */}
            <button type="submit">{buttonText}</button>
        </form>
    );
}
export default JoinRoom;
// export { CreateRoom }