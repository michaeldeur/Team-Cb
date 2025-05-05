import React, { useEffect, useState } from "react"
import axios from "axios"
import "../../../client/dist/css/estimation.css"
import { UserStoryQueue, UserStory } from "./UserStory"
import { NavLink, useNavigate } from "react-router-dom"
import { Card, Cards } from "./Cards"
import Popup from "reactjs-popup"
import 'reactjs-popup/dist/index.css'
let storyQueue: UserStoryQueue = new UserStoryQueue();
let estimations: UserStoryQueue = new UserStoryQueue();
let cards: Cards = new Cards();
let currentStory: UserStory | undefined;
const URL = window.location.protocol + "//" + window.location.host + "/api/"; // base url for http requests

const fetch = axios.create({
    baseURL: URL,
    headers: {
        "Content-type": "application/json"
    },
    timeout: 30000 // timeout in ms for http requests
});
const Estimation = (props: { sendMessage: any }) => { // returns Estimation page
    let navigate = useNavigate();
    let sendMessage = props.sendMessage;

    return (<>
        <header>
            <h1>Got Scrum?</h1>
            <h5><strong>Got Scrum?<br />{localStorage.getItem("name")}</strong></h5>
            <button onClick={() => {
                let UID = localStorage.getItem("UID");
                sendMessage(`close_${UID}`)
                navigate("/");
            }}>Leave</button>
        </header>
        <CurrentQueue sendMessage={sendMessage} storyQueue={storyQueue} cards={cards} />
        <StQueue storyQueue={storyQueue} />
        <Estimations estimations={estimations} />
        <div id="bottomLine"></div>
    </>)
}
const Player = (props: { name: string, id: string, points: string}) => {
    if(props.name == "") {
        return (
            <div className="player emptyPlayer" id={props.id}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
=======

const Player = (props: { name: string, id: string, points: string }) => {
    if (props.name == undefined) {
        return (
            <div className="player emptyPlayer" id={props.id}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                </svg>
            </div>
        )
    } else {
        return (
            <div className="player" id={props.id}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                    <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                </svg>
                {props.name}:<br />
                {props.points}
            </div>
        )
    }
}
const Table = () => {
    let average;
    let players: string[][];
    players = [[localStorage.getItem("user0")?.split("_").at(1)!, localStorage.getItem("user0")?.split("_").at(2)!], [localStorage.getItem("user1")?.split("_").at(1)!, localStorage.getItem("user1")?.split("_").at(2)!], [localStorage.getItem("user2")?.split("_").at(1)!, localStorage.getItem("user2")?.split("_").at(2)!], [localStorage.getItem("user3")?.split("_").at(1)!, localStorage.getItem("user3")?.split("_").at(2)!], [localStorage.getItem("user4")?.split("_").at(1)!, localStorage.getItem("user4")?.split("_").at(2)!], [localStorage.getItem("user5")?.split("_").at(1)!, localStorage.getItem("user5")?.split("_").at(2)!]]

    let numPoints = 0;
    let totalPoints = 0;
    players.forEach((player, i) => {
        let playerName = localStorage.getItem("user" + i)?.split("_")[1]
        let playerPoints = localStorage.getItem("user" + i)?.split("_")[2]
        if (playerName) {
            player[0] = playerName
            if (playerPoints && parseInt(playerPoints) >= 0) {
                player[1] = playerPoints
                totalPoints += parseInt(playerPoints);
                numPoints++;
            }
        }
    })
    if (numPoints > 0) {
        average = totalPoints / numPoints
        localStorage.setItem("average", average.toString())

    }
    let UID = localStorage.getItem("UID");
    let players: string[][];
    if(UID != null){
        players = [[UID, ""], ["",""], ["",""], ["",""], ["",""], ["",""]]
    } else {
        players = [["", ""], ["",""], ["",""], ["",""], ["",""], ["",""]]

    }
    return (
        <>
            <h4 id="avg">{average ? average : "AVG"}</h4>
            <div id="players">
                <Player name={players[0][0]} points={players[0][1] == "-1" ? "" : players[0][1]} id="player1" />
                <Player name={players[1][0]} points={players[1][1]} id="player2" />
                <Player name={players[2][0]} points={players[2][1]} id="player3" />
                <Player name={players[3][0]} points={players[3][1]} id="player4" />
                <Player name={players[4][0]} points={players[4][1]} id="player5" />
                <Player name={players[5][0]} points={players[5][1]} id="player6" />
            </div>

        </>
    )
}
const CurrentQueue = (props: { sendMessage: any, storyQueue: UserStoryQueue; cards: Cards }) => { // returns middle section of Estimation page
    const [currentCards, setCards] = React.useState(props.cards);
    useEffect(() => { // gets estimated stories
        fetch.get("cards").then((response) => {
            setCards(response.data);
            response.data.forEach((card: any) => {
                cards.addCard(new Card(card.cardValue))
            }
            )
        })
    }, [])
    currentStory = storyQueue.findAt(0);
    let cardsList = cards.getCards();
    let sendMessage = props.sendMessage;
    cardsList.sort(function (a: any, b: any) { return a.cardValue - b.cardValue })
    const ListCards = () => { // returns Estimation card buttons
        return (
            <>
                {cardsList.map((card, i) => (

                    <EstimationButton sendMessage={sendMessage} key={i} card={card} />
                ))}
            </>
        );
    }
    return (
        <section id="currentQueue">
            <div>
                <h3>Now estimating:</h3>
                <h4 className="deleteParent"><Story story={currentStory} list={false} /></h4>
            </div>
            <Table />
            <ul>
                <ListCards />
            </ul>
        </section>
    )

}
const StoryDialogBox = () => {
    let name = "";
    let description = "";
    return (
        <Popup trigger={<button id="storyButton">Add Story</button>} modal nested>
            <form className="modal" autoComplete="off" onSubmit={() => {
                let story = new UserStory(name);
                story.setDescription(description);
                fetch.post("storyQueue", story)
            }}>
                <input autoComplete="off" placeholder="Enter Story Name Here" name="storyName" id="storyName" onChange={event => { name = event.target.value }} required></input>
                <textarea placeholder="Enter Story Description Here" name="description" id="storyDesc" onChange={event => { description = event.target.value }}></textarea>
                <button type="submit" id="finishedButton">Submit</button>
            </form>
        </Popup>
    )
}
const StQueue = (props: { storyQueue: UserStoryQueue }) => { // returns the storyqueue section
    const [currentQueue, setQueue] = React.useState(props.storyQueue);
    useEffect(() => { // gets estimated stories
        fetch.get("storyQueue").then((response) => {
            setQueue(response.data);
            response.data.forEach((story: any) => {
                storyQueue.addStory(new UserStory(story.name, story.description, story.id))
            })
            storyQueue.getStories().sort((a, b) => parseInt(a.id!) - parseInt(b.id!));
        })
    }, [])
    const List = () => { // returns a list of stories for storyqueue
        let stories = []
        for (let index = 1; index < storyQueue.getLength() - 1; index++) {
            stories.push(<Story key={index} story={storyQueue.findAt(index)} list={true} />)
        }
        stories.push(<StoryDialogBox key={0} />)
        return stories
    }
    return (
        <aside id="storyQueue">
            <h2>Story Queue</h2>
            <h6><i>Up next:</i></h6>
            <div></div>
            <ol>
                <List />
            </ol>
            <div></div>
        </aside>
    )
}
let storyID = "";
const Story = (props: { story: UserStory | undefined; list: boolean }) => { // returns a single story to be listed on the storyQueue
    let story: UserStory;
    if (props.story != undefined) {
        story = new UserStory(props.story.toString(), props.story.description, props.story.id!);
        storyQueue.addStory(story)
        const deleteStory = () => {
            fetch.post("deleteStory", story)
        }
        if (props.list) {
            return (
                <li className="deleteParent" onDragOver={(e) => {
                    e.preventDefault();
                }}>
                    <div className="draggable" draggable id={"" + story.storyNum} onDragStart={(e) => {
                        storyID = e.currentTarget.id
                    }} onDrop={(e) => {
                        fetch.post("setStoryID", [storyID, e.currentTarget.id])
                    }}>
                        {story.toString()}
                        <button className="liStory" onClick={deleteStory}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                        </svg></button>
                    </div>
                </li>
            )
        } else {
            return (<>
                {story.toString()}
                <button id="currentDelete" onClick={deleteStory}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                </svg></button>
            </>)
        }
    }

}

const Estimations = (props: { estimations: UserStoryQueue }) => { // returns already estimated stories section
    let story: UserStory;
    const getStyleClass = (value: number) => {
        if (value <= 3) return "story-small";
        if (value <= 5) return "story-medium";
        return "story-large";
    }
    const [currentEstimations, setEstimations] = React.useState(props.estimations);
    useEffect(() => { // gets estimated stories
        fetch.get("estimations").then((response) => {
            setEstimations(response.data);
            response.data.forEach((story: any) => {
                estimations.addStory(new UserStory(story.name, story.description, story.id, story.storyValues))
            }
            )
            estimations.getStories().sort((a, b) => parseInt(a.id!) - parseInt(b.id!))
        })
    }, [])
    const Estimation = (props: { userStory: UserStory | undefined }) => { // returns an already estimated story
        if (props.userStory !== undefined && props.userStory.getStoryValues() !== undefined) {
            story = new UserStory(props.userStory.toString(), props.userStory.description, props.userStory.id!, props.userStory.getStoryValues());
            estimations.addStory(story)
            return (
                <li className={getStyleClass(props.userStory.getStoryValues()!)}>{props.userStory.toString()}: <br />{props.userStory.getStoryValues()}</li>
            )
        }
    }
    const List = () => { // returns already estimated stories as a list
        let estimatedStories = [];

        for (let index = 0; index < estimations.getLength(); index++) {
            estimatedStories.push(<Estimation key={index} userStory={estimations.findAt(index)} />)
        }
        return estimatedStories;
    }
    return (
        <aside id="estimations">
            <h2>Estimations</h2>
            <ul>
                <List />
            </ul>
        </aside>
    )
}
const EstimationButton = (props: { sendMessage: any, card: Card }) => { // returns a single estimation card button
    let sendMessage = props.sendMessage;
    const submit = () => {
        // change to websocket send message
        sendMessage(`voted_${localStorage.getItem("UID")}_${props.card.getValue()}`);
    }
    if (props.card.getValue() >= 0) {
        return (
            <li><button className="estButton" onClick={submit} value={props.card.getValue()}>{props.card.getValue()}</button></li>
        )
    }
    if (props.card.getValue() == -1) { // acquiesce button
        return(
            <li><button onClick={submit} value={props.card.getValue()}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="black" viewBox="0 0 16 16">
            <path d="M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464-.003.001-.006.003-.023.009a12 12 0 0 1-.397.15c-.264.095-.631.223-1.047.35-.816.252-1.879.523-2.71.523-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A20 20 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a20 20 0 0 0 1.349-.476l.019-.007.004-.002h.001M14 1.221c-.22.078-.48.167-.766.255-.81.252-1.872.523-2.734.523-.886 0-1.592-.286-2.203-.534l-.008-.003C7.662 1.21 7.139 1 6.5 1c-.669 0-1.606.229-2.415.478A21 21 0 0 0 3 1.845v6.433c.22-.078.48-.167.766-.255C4.576 7.77 5.638 7.5 6.5 7.5c.847 0 1.548.28 2.158.525l.028.01C9.32 8.29 9.86 8.5 10.5 8.5c.668 0 1.606-.229 2.415-.478A21 21 0 0 0 14 7.655V1.222z"/>
          </svg></button></li>
        )
    }
    return (
        <li><button className="estButton" onClick={submit} value={props.card.getValue()}><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="black" viewBox="0 0 16 16">
            <path d="M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464-.003.001-.006.003-.023.009a12 12 0 0 1-.397.15c-.264.095-.631.223-1.047.35-.816.252-1.879.523-2.71.523-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A20 20 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a20 20 0 0 0 1.349-.476l.019-.007.004-.002h.001M14 1.221c-.22.078-.48.167-.766.255-.81.252-1.872.523-2.734.523-.886 0-1.592-.286-2.203-.534l-.008-.003C7.662 1.21 7.139 1 6.5 1c-.669 0-1.606.229-2.415.478A21 21 0 0 0 3 1.845v6.433c.22-.078.48-.167.766-.255C4.576 7.77 5.638 7.5 6.5 7.5c.847 0 1.548.28 2.158.525l.028.01C9.32 8.29 9.86 8.5 10.5 8.5c.668 0 1.606-.229 2.415-.478A21 21 0 0 0 14 7.655V1.222z" />
        </svg></button></li>

    )
}
export default Estimation;