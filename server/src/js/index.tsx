import ReactDOM from "react-dom/client";
import Estimation from "./estimation";
import "../../../client/dist/css/common.css"
import { BrowserRouter, Route, Routes } from "react-router-dom";
// import { CreateRoom } from "./home";
import { useEffect, useState } from "react";
import User from "./User";
import JoinRoom from "./home";
const App = () => { // displays page based on functions and url
	const [uid, setUid] = useState("");
	const [Name, setName] = useState("");
	const [clickUid, setClickUid] = useState("");
	const [allClick, setallClick] = useState("");
	const users: User[] = [];
	for (let i = 0; i < 6; i++) {
		localStorage.removeItem("uid" + i);

	}
	let connection: WebSocket;
	if (window.location.protocol == "https:") {
		connection = new WebSocket(`wss://${window.location.host.split(":")[0]}:3030`);
	} else {
		connection = new WebSocket(`ws://${window.location.host.split(":")[0]}:3030`);
	}
	useEffect(() => {
		connection.onopen = () => {
			console.log("connection opened to the server...");
		};
		// Handle error
		connection.onerror = () => {
			console.error("WS error");
		};
		// Handle server message
		connection.onmessage = (inMessage: any) => {
			// Split message into underscores
			const messageParts: string[] = inMessage.data.split("_");
			// index 0 is message type
			const messageType = messageParts[0];
			switch (messageType) {
				case "ping":
					sendMessage(`pong`)
					break;
				case "connected":
					let storedUID = localStorage.getItem("UID")

					if (storedUID == null || storedUID == "null") {
						localStorage.setItem("UID", messageParts[1]);
						storedUID = localStorage.getItem("UID");
					}
					sendMessage(`connected_${storedUID}_${(localStorage.getItem("name") === null) ? "" : localStorage.getItem("name")}`)
					break;
				case "update":
					setClickUid(messageParts[1]);
					break;
				case "estimated":
					setallClick(messageParts[1]);
					break;
				case "name":
					const storedName = localStorage.getItem("name")
					if (storedName == null) {
						setName("Unspecified");
					} else {
						setName(storedName);
					}
					break;
				case "refresh":
					window.location.reload();
					break;
				case "add-user":

					if (messageParts[1] == localStorage.getItem("UID")) {
						if (users.at(0) && users.at(0)!.getUID() == messageParts[1]) {
							users.shift();
						}
						users.unshift(new User(messageParts[1], messageParts[2]));
					}
					else {
						let need = true;
						users.forEach(user => {
							if (messageParts[2] == "" || user.getUID() == messageParts[1]) {
								need = false;
							}
						})
						if (need) {
							users.push(new User(messageParts[1], messageParts[2]));
						}
					}

					users.forEach((user, i) => {
						if (i < 6) {
							localStorage.setItem(`user${i}`, `${user.getUID()}_${user.getName()}_`)
						}
					})
					break;
				case "remove":
					users.forEach((user, i) => {
						localStorage.removeItem(`user${i}`)
						if (user.getUID() == messageParts[1]) {
							users.splice(i, 1);
						}
					})
					users.forEach((user, i) => {
						if (i < 6) {
							localStorage.setItem(`user${i}`, `${user.getUID()}_${user.getName()}_`)
						}
					})
					window.location.reload();
					break;
				case "voted":					
					users.forEach((user, i) => {
						if (i < 6) {
							if (messageParts[1] == user.getUID()) {
								user.setPoints(parseInt(messageParts[2]))
								localStorage.setItem(`user${i}`, `${user.getUID()}_${user.getName()}_${messageParts[2]}`)
							}
						}
					})
					break;
				default:
					
					break;
			}
		};
	}, []);

	const sendMessage = (message: string) => {
		console.log(`WS message sent: ${message}`);
		connection.send(message);
	};

	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<JoinRoom sendMessage={sendMessage} />} />
				{/* <Route path="/create-room" element={<CreateRoom sendMessage={sendMessage} />} /> */}
				<Route path="/estimate" element={<Estimation sendMessage={sendMessage} />} />
			</Routes>
		</BrowserRouter>
	)
};
const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<App />);
